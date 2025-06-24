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

export interface SpassRecord {
  name: string;
  url: string;
  username: string;
  password: string;
  note: string;
}

const SPASS_CONFIG = {
  ITERATION_COUNT: 70000,
  KEY_LENGTH: 32,
  SALT_BYTES: 20,
  BLOCK_SIZE: 16,
  MIN_FIELDS: 33,
  DATA_SEPARATOR: 'next_table',
} as const;

const CHROME_CSV_HEADERS = [
  'name',
  'url', 
  'username',
  'password',
  'note'
] as const;

const SPASS_COLUMN_MAP = {
  NAME: 17,
  URL: 1,
  USERNAME: 4,
  PASSWORD: 7,
  NOTE: 31,
} as const;

const DEFAULT_FILENAME = 'chrome_passwords.csv';

/**
 * Removes PKCS5 padding from decrypted data
 */
function removePKCS5Padding(data: Uint8Array): Uint8Array {
  const paddingLen = data[data.length - 1];
  return data.slice(0, data.length - paddingLen);
}

/**
 * Converts base64 string to Uint8Array
 */
function base64ToUint8Array(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Escapes CSV field values properly
 */
function escapeCSVField(field: string): string {
  const needsQuoting = field.includes(',') || field.includes('"') || 
                      field.includes('\n') || field.includes('\r');
  
  if (needsQuoting) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * Downloads CSV content as a file
 */
function downloadCSV(csvContent: string, filename: string): void {
  if (typeof window === 'undefined') {
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

/**
 * Safely decodes base64 string, returns original if decoding fails
 */
function safeBase64Decode(value: string): string {
  try {
    return atob(value);
  } catch {
    return value;
  }
}

/**
 * Decrypts SPASS file data using Web Crypto API
 */
async function decryptSpassData(dataB64: string, password: string): Promise<Uint8Array> {
  const data = base64ToUint8Array(dataB64);
  
  const salt = data.slice(0, SPASS_CONFIG.SALT_BYTES);
  const iv = data.slice(SPASS_CONFIG.SALT_BYTES, SPASS_CONFIG.SALT_BYTES + SPASS_CONFIG.BLOCK_SIZE);
  const encryptedData = data.slice(SPASS_CONFIG.SALT_BYTES + SPASS_CONFIG.BLOCK_SIZE);

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

/**
 * Parses decrypted SPASS data into records
 */
function parseSpassData(text: string, includeEmptyFields: boolean): SpassRecord[] {
  const parts = text.split(SPASS_CONFIG.DATA_SEPARATOR);
  if (parts.length < 2) {
    throw new Error('Invalid SPASS format: missing data section');
  }

  const csvData = parts[1].trim();
  const dataLines = csvData.split('\n');
  const records: SpassRecord[] = [];
  
  const dataRows = dataLines.slice(1);
  
  for (const line of dataRows) {
    if (!line.trim()) continue;
    
    const fields = line.split(';');
    if (fields.length < SPASS_CONFIG.MIN_FIELDS) continue;

    const record: SpassRecord = {
      name: safeBase64Decode(fields[SPASS_COLUMN_MAP.NAME] || ''),
      url: safeBase64Decode(fields[SPASS_COLUMN_MAP.URL] || ''),
      username: safeBase64Decode(fields[SPASS_COLUMN_MAP.USERNAME] || ''),
      password: safeBase64Decode(fields[SPASS_COLUMN_MAP.PASSWORD] || ''),
      note: safeBase64Decode(fields[SPASS_COLUMN_MAP.NOTE] || ''),
    };

    if (includeEmptyFields || Object.values(record).some(field => field.trim() !== '')) {
      records.push(record);
    }
  }

  return records;
}

/**
 * Converts records to Chrome CSV format
 */
function recordsToCSV(records: SpassRecord[]): string {
  const csvRows: string[] = [];
  
  csvRows.push(CHROME_CSV_HEADERS.map(header => escapeCSVField(header)).join(','));
  
  for (const record of records) {
    const values = [
      record.name,
      record.url,
      record.username,
      record.password,
      record.note
    ];
    const escapedRow = values.map(field => escapeCSVField(field || ''));
    csvRows.push(escapedRow.join(','));
  }

  return csvRows.join('\n');
}

/**
 * Main function to convert SPASS file to Chrome CSV format
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
    const fileContent = typeof spassFile === 'string' 
      ? spassFile 
      : await spassFile.text();

    const decryptedData = await decryptSpassData(fileContent, password);
    
    const text = new TextDecoder().decode(decryptedData);
    const lines = text.split('\n');
    
    if (lines.length < 3 || lines[2].trim() !== SPASS_CONFIG.DATA_SEPARATOR) {
      throw new Error('Invalid password or corrupted SPASS file');
    }

    const records = parseSpassData(text, includeEmptyFields);
    const csvContent = recordsToCSV(records);
    const filename = customFilename || DEFAULT_FILENAME;

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

/**
 * Convenience function to convert and download directly
 */
export async function convertAndDownload(
  spassFile: File | string,
  password: string,
  filename: string = DEFAULT_FILENAME
): Promise<number> {
  const result = await convertSpassToChromeCSV(spassFile, password, {
    autoDownload: true,
    customFilename: filename
  });
  return result.recordCount;
}

/**
 * Convenience function to get CSV string only
 */
export async function spassToCSV(
  spassFile: File | string,
  password: string
): Promise<string> {
  const result = await convertSpassToChromeCSV(spassFile, password);
  return result.csv;
}

/**
 * Checks if a file is a valid SPASS file
 */
export function isSpassFile(file: File): boolean {
  return file.name.toLowerCase().endsWith('.spass') || 
         file.type === '' || 
         file.type === 'application/octet-stream';
}

/**
 * Checks if Web Crypto API is supported
 */
export function isWebCryptoSupported(): boolean {
  return typeof crypto !== 'undefined' && 
         typeof crypto.subtle !== 'undefined';
}

export default convertSpassToChromeCSV; 