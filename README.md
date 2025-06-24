# 🔓 SPASS Decryptor

A secure, client-side web application for converting Samsung Pass export files (`.spass`) to Chrome-compatible CSV format. All processing happens locally in your browser - no data is ever transmitted to servers.

## 🎯 Purpose

Samsung Pass exports are encrypted files that can't be directly imported into other password managers. This tool decrypts these files and converts them to a format that can be imported into Chrome, Firefox, or other password managers.

## ✨ Features

- **🔒 100% Client-Side Processing**: All decryption and conversion happens in your browser
- **🚫 Zero Data Transmission**: No files or passwords are sent to any servers
- **📱 Modern UI**: Clean, responsive interface built with React and Material-UI
- **🔐 Secure Decryption**: Uses Web Crypto API for AES-CBC decryption with PBKDF2 key derivation
- **📊 Chrome CSV Format**: Outputs standard CSV format compatible with Chrome password import
- **⚡ Fast Processing**: Efficient decryption and conversion algorithms
- **📱 Mobile Friendly**: Responsive design that works on all devices

## 🛡️ Security

### Privacy First
- **Offline Processing**: All data processing occurs exclusively in your browser
- **No Server Communication**: Zero network requests during conversion
- **Local Storage Only**: Files are never uploaded or stored on servers
- **Immediate Cleanup**: Decrypted data is not persisted after conversion

### Technical Security
- **Web Crypto API**: Uses modern browser cryptography standards
- **PBKDF2 Key Derivation**: 70,000 iterations for secure key generation
- **AES-CBC Decryption**: Industry-standard encryption algorithm
- **Secure Memory Handling**: Decrypted data is processed in memory only

## 🚀 Quick Start

### Online Version
Visit the live application at: [https://fck-spass.kobel.click/](https://fck-spass.kobel.click/)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArifKobel/spass-decryptor.git
   cd spass-decryptor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 Usage

1. **Export from Samsung Pass**
   - Open Samsung Pass on your device
   - Go to Settings → Export passwords
   - Choose a password for the export file
   - Save the `.spass` file

2. **Convert with SPASS Decryptor**
   - Open the web application
   - Click "Select Samsung Pass Export File" and choose your `.spass` file
   - Enter the password you used during export
   - Click "Convert Securely & Download"

3. **Import to Chrome**
   - Open Chrome and go to Settings → Passwords
   - Click the three dots → Import passwords
   - Select the downloaded CSV file
   - Your passwords will be imported

## 🛠️ Technical Details

### Architecture
- **Frontend**: React 19 with TypeScript
- **UI Framework**: Material-UI (MUI) with Tailwind CSS
- **Build Tool**: Vite
- **Cryptography**: Web Crypto API (PBKDF2 + AES-CBC)

### SPASS File Format
The application handles Samsung Pass export files with the following structure:
- **Encryption**: AES-CBC with PBKDF2 key derivation
- **Iterations**: 70,000 PBKDF2 iterations
- **Salt**: 20 bytes
- **IV**: 16 bytes
- **Data Format**: Base64 encoded with CSV-like structure

### Chrome CSV Format
Output CSV files contain the following columns:
- `name`: Website/service name
- `url`: Website URL
- `username`: Login username
- `password`: Login password
- `note`: Additional notes

## 🔧 Development

### Project Structure
```
spass-decryptor/
├── src/
│   ├── App.tsx                 # Main application component
│   ├── SpassFileConverter.tsx  # File conversion interface
│   ├── utils/
│   │   └── spassDecryptor.ts   # Core decryption logic
│   └── main.tsx               # Application entry point
├── public/                    # Static assets
├── package.json              # Dependencies and scripts
└── vite.config.ts           # Build configuration
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Key Functions
- `convertSpassToChromeCSV()` - Main conversion function
- `decryptSpassData()` - Decrypts SPASS file content
- `parseSpassData()` - Parses decrypted data into records
- `recordsToCSV()` - Converts records to Chrome CSV format

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Important Notes

### Security Warnings
- The downloaded CSV file contains passwords in plain text
- Keep the CSV file secure and delete it after importing
- Never share the CSV file with others
- Consider using a password manager's direct import feature when possible

### Browser Compatibility
- Requires a modern browser with Web Crypto API support
- Tested on Chrome, Firefox, Safari, and Edge
- Not compatible with Internet Explorer

### Limitations
- Only supports Samsung Pass export files (`.spass` format)
- Requires the correct password used during export
- Output is limited to Chrome CSV format

### Special Thanks
This project was inspired by the excellent work of [0xdeb7ef/spass-manager](https://github.com/0xdeb7ef/spass-manager), a Go-based command-line tool for decrypting .spass files. Their reverse engineering of the Samsung Pass format made this web application possible. Check out their project for a command-line alternative!

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the browser console for error messages
- Ensure your browser supports Web Crypto API

---

**Remember**: This tool processes sensitive password data. Always use it responsibly and ensure you're on a secure, private connection when handling password files. 