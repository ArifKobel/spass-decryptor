# SPASS Decryptor

A modern, web-based SPASS password file decryptor built with React and Material-UI. This application provides a clean, user-friendly interface to decrypt SPASS files and export the results in various formats.

## Features

- 🔐 **Secure Decryption**: Implements the same decryption algorithm as the original Go SPASS decryptor
- 📁 **File Upload**: Drag and drop or click to upload .spass files
- 👁️ **Password Visibility**: Toggle password visibility for individual entries
- 📋 **Copy to Clipboard**: Click on any field to copy its content
- 📊 **CSV Export**: Export decrypted passwords to CSV format
- 🎨 **Modern UI**: Clean Material-UI design with responsive layout
- 🔒 **Client-Side Processing**: All decryption happens in the browser - no data sent to servers

## How It Works

The SPASS Decryptor uses the same cryptographic algorithm as the original Go implementation:

1. **PBKDF2 Key Derivation**: Uses 70,000 iterations with HMAC-SHA256
2. **AES-CBC Decryption**: 256-bit key with PKCS7 padding
3. **Base64 Decoding**: Handles the encoded SPASS file format
4. **Chrome Format Parsing**: Extracts URL, username, password, name, and notes

## Usage

1. **Upload File**: Click "Select .spass File" to choose your encrypted SPASS file
2. **Enter Password**: Type the password used to encrypt the file
3. **Decrypt**: Click "Decrypt File" to process the file
4. **View Results**: Browse through the decrypted password entries
5. **Export**: Click "Export CSV" to download the results

## Security Features

- ✅ All processing happens locally in your browser
- ✅ No data is transmitted to external servers
- ✅ Passwords are hidden by default
- ✅ Secure clipboard operations
- ✅ Input validation and error handling

## Technical Details

### Dependencies

- **React 19**: Modern React with hooks
- **Material-UI**: Clean, accessible UI components
- **CryptoJS**: Cryptographic functions for decryption
- **TypeScript**: Type-safe development
- **Vite**: Fast build tool and development server

### File Structure

```
src/
├── App.tsx              # Main application component
├── utils/
│   └── spassDecryptor.ts # Decryption logic and utilities
├── App.css              # Custom styles
└── main.tsx             # Application entry point
```

### Supported Formats

Currently supports Chrome format export, which includes:
- URL
- Username
- Password
- Name/Title
- Notes

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd spass-decryptor

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Disclaimer

This tool is for legitimate password recovery purposes only. Users are responsible for ensuring they have the right to decrypt any files they process.
