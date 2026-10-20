# spass-decryptor

Converts a Samsung Pass export (`.spass`) into a CSV you can import into Chrome or another password manager.

https://fck-spass.kobel.click

## Usage

1. Export your data in the Samsung Pass settings and set a password.
2. Open the site, select the `.spass` file and enter the password.
3. Import the CSV into your password manager and delete it afterwards.

Only logins are exported. Everything runs in your browser, nothing is uploaded.

## Development

```bash
npm install
npm run dev
```

The decryption code is in `src/utils/spassDecryptor.ts`. See [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.

## Credits

Based on the format work in [0xdeb7ef/spass-manager](https://github.com/0xdeb7ef/spass-manager).

## License

MIT
