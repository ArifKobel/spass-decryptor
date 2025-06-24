/**
 * SPASS to Chrome Password CSV Converter
 * Converts SPASS encrypted files to Chrome-compatible password CSV format
 */

// =============================================================================
// TYPES
// =============================================================================

export interface SpassToChromeResult {
  csv: string;
  filename: string;
  recordCount: number;
  success: boolean;
}

export interface SpassToChromeOptions {
  autoDownload?: boolean;
  customFilename?: string;
  includeEmptyFields?: boolean;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const SPASS_CONFIG = {
  ITERATION_COUNT: 70000,
  KEY_LENGTH: 32,
  SALT_BYTES: 20,
  BLOCK_SIZE: 16,
} as const;

// Chrome CSV headers as expected by Chrome password import
const CHROME_CSV_HEADERS = [
  'name',
  'url', 
  'username',
  'password',
  'note'
] as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function removePKCS5Padding(data: Uint8Array): Uint8Array {
  const paddingLen = data[data.length - 1];
  return data.slice(0, data.length - paddingLen);
}

function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function escapeCSVField(field: string): string {
  // If field contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
    return '"' + field.replace(/"/g, '""') + '"';
  }
  return field;
}

function downloadCSV(csvContent: string, filename: string): void {
  if (typeof window === 'undefined') {
    console.warn('Download not available in non-browser environment');
    return;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

// =============================================================================
// CORE DECRYPTION
// =============================================================================

async function decryptSpassData(dataB64: string, password: string): Promise<Uint8Array> {
  const data = base64ToUint8Array(dataB64);
  
  // Extract components
  const salt = data.slice(0, SPASS_CONFIG.SALT_BYTES);
  const iv = data.slice(SPASS_CONFIG.SALT_BYTES, SPASS_CONFIG.SALT_BYTES + SPASS_CONFIG.BLOCK_SIZE);
  const encryptedData = data.slice(SPASS_CONFIG.SALT_BYTES + SPASS_CONFIG.BLOCK_SIZE);

  // Generate key
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  const key = await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: SPASS_CONFIG.ITERATION_COUNT,
      hash: 'SHA-256'
    },
    keyMaterial,
    {
      name: 'AES-CBC',
      length: SPASS_CONFIG.KEY_LENGTH * 8
    },
    false,
    ['decrypt']
  );

  // Decrypt
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: 'AES-CBC',
      iv: iv
    },
    key,
    encryptedData
  );

  return removePKCS5Padding(new Uint8Array(decryptedBuffer));
}

// =============================================================================
// MAIN CONVERSION FUNCTION
// =============================================================================

/**
 * Converts a SPASS file to Chrome Password CSV format
 * 
 * @param spassFile - File object or base64 string content of SPASS file
 * @param password - Password to decrypt the SPASS file
 * @param options - Optional configuration
 * @returns Promise with CSV content and metadata
 * 
 * @example
 * ```typescript
 * // With File object
 * const result = await convertSpassToChromeCSV(file, 'mypassword');
 * console.log(result.csv); // CSV content
 * 
 * // With auto-download
 * await convertSpassToChromeCSV(file, 'mypassword', { 
 *   autoDownload: true 
 * });
 * 
 * // With file content string
 * const fileContent = await file.text();
 * const result = await convertSpassToChromeCSV(fileContent, 'mypassword');
 * ```
 */
export async function convertSpassToChromeCSV(
  spassFile: File | string,
  password: string,
  options: SpassToChromeOptions = {}
): Promise<SpassToChromeResult> {
  
  const {
    autoDownload = false,
    customFilename,
    includeEmptyFields = false
  } = options;

  try {
    // Read file content
    let fileContent: string;
    if (typeof spassFile === 'string') {
      fileContent = spassFile;
    } else {
      fileContent = await spassFile.text();
    }

    // Decrypt SPASS data
    const decryptedData = await decryptSpassData(fileContent, password);
    
    // Validate decrypted data
    const text = new TextDecoder().decode(decryptedData);
    const lines = text.split('\n');
    
    if (lines.length < 3 || lines[2].trim() !== 'next_table') {
      throw new Error('Invalid password or corrupted SPASS file');
    }

    // Parse SPASS data
    const parts = text.split('next_table');
    if (parts.length < 2) {
      throw new Error('Invalid SPASS format: missing data section');
    }

    const csvData = parts[1].trim();
    const dataLines = csvData.split('\n');
    
    // Skip header line and process data
    const records: string[][] = [];
    const dataRows = dataLines.slice(1);
    
    for (const line of dataRows) {
      if (!line.trim()) continue;
      
      const fields = line.split(';');
      if (fields.length < 33) continue;

      // Extract relevant fields for Chrome format
      // SPASS columns: [1]=URL, [4]=Username, [7]=Password, [17]=Name, [31]=Note
      const colsNeeded = [17, 1, 4, 7, 31]; // Reordered for Chrome: name, url, username, password, note
      const record: string[] = [];

      for (const colIndex of colsNeeded) {
        if (colIndex < fields.length && fields[colIndex]) {
          try {
            // Try to decode base64 content
            const decoded = atob(fields[colIndex]);
            record.push(decoded);
          } catch {
            // If base64 decode fails, use raw value
            record.push(fields[colIndex]);
          }
        } else {
          record.push('');
        }
      }

      // Filter out completely empty records unless includeEmptyFields is true
      if (includeEmptyFields || record.some(field => field.trim() !== '')) {
        records.push(record);
      }
    }

    // Convert to CSV format
    const csvRows: string[] = [];
    
    // Add header row
    csvRows.push(CHROME_CSV_HEADERS.map(header => escapeCSVField(header)).join(','));
    
    // Add data rows
    for (const record of records) {
      const escapedRecord = record.map(field => escapeCSVField(field || ''));
      csvRows.push(escapedRecord.join(','));
    }

    const csvContent = csvRows.join('\n');
    const filename = customFilename || 'chrome_passwords.csv';

    // Auto-download if requested
    if (autoDownload) {
      downloadCSV(csvContent, filename);
    }

    return {
      csv: csvContent,
      filename,
      recordCount: records.length,
      success: true
    };

  } catch (error) {
    throw new Error(`Conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// =============================================================================
// CONVENIENCE FUNCTIONS
// =============================================================================

/**
 * Quick convert and download - one-liner function
 */
export async function convertAndDownload(
  spassFile: File | string,
  password: string,
  filename: string = 'chrome_passwords.csv'
): Promise<number> {
  const result = await convertSpassToChromeCSV(spassFile, password, {
    autoDownload: true,
    customFilename: filename
  });
  return result.recordCount;
}

/**
 * Convert SPASS file and return only the CSV string
 */
export async function spassToCSV(
  spassFile: File | string,
  password: string
): Promise<string> {
  const result = await convertSpassToChromeCSV(spassFile, password);
  return result.csv;
}

/**
 * Validate if a file appears to be a SPASS file
 */
export function isSpassFile(file: File): boolean {
  return file.name.toLowerCase().endsWith('.spass') || 
         file.type === '' || 
         file.type === 'application/octet-stream';
}

/**
 * Check if Web Crypto API is available
 */
export function isWebCryptoSupported(): boolean {
  return typeof crypto !== 'undefined' && 
         typeof crypto.subtle !== 'undefined';
}

// =============================================================================
// USAGE EXAMPLES IN COMMENTS
// =============================================================================

/*
// USAGE EXAMPLES:

// 1. Basic conversion
const result = await convertSpassToChromeCSV(file, 'mypassword');
console.log(result.csv); // CSV content
console.log(`Converted ${result.recordCount} passwords`);

// 2. Convert and auto-download
await convertSpassToChromeCSV(file, 'mypassword', {
  autoDownload: true,
  customFilename: 'my_passwords.csv'
});

// 3. One-liner convert and download
const count = await convertAndDownload(file, 'mypassword');
alert(`Downloaded ${count} passwords to Chrome CSV`);

// 4. Just get CSV string
const csvString = await spassToCSV(file, 'mypassword');

// 5. With file content string
const fileContent = await file.text();
const result = await convertSpassToChromeCSV(fileContent, 'mypassword');

// 6. In React component
const handleConvert = async () => {
  try {
    const result = await convertSpassToChromeCSV(selectedFile, password, {
      autoDownload: true
    });
    setMessage(`Successfully converted ${result.recordCount} passwords`);
  } catch (error) {
    setError(`Conversion failed: ${error.message}`);
  }
};

// 7. Validation before conversion
if (isSpassFile(file) && isWebCryptoSupported()) {
  const csvData = await spassToCSV(file, password);
  // Use csvData...
}

*/

export default convertSpassToChromeCSV;