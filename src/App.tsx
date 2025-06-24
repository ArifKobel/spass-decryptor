import SpassFileConverter from './SpassFileConverter'
import { AppBar, Toolbar, Typography, CssBaseline, Link } from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <CssBaseline />
      {/* Header */}
      <AppBar position="static" color="primary" elevation={1} sx={{ background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' }}>
        <Toolbar sx={{ minHeight: '48px' }}>
          <SecurityIcon sx={{ mr: 1.5, fontSize: 24 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600, letterSpacing: 0.5, fontSize: '1.1rem' }}>
            F*CK .SPASS
          </Typography>
        </Toolbar>
      </AppBar>
      {/* Local Processing Notice */}
      <div className="text-center bg-blue-50 py-2 border-b border-blue-200">
        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
          All data is processed <b>locally in the browser</b> only. <b>No files or passwords are transmitted</b>.
        </Typography>
      </div>
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-4">
        <div className="max-w-md w-full px-4">
          <SpassFileConverter />
        </div>
      </main>
      {/* Footer */}
      <footer className="py-2 text-center bg-blue-50 border-t border-blue-200">
        <div className="max-w-4xl mx-auto px-4 py-2">
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
            Developed by <Link href="https://arif.kobel.click" target="_blank" rel="noopener" underline="hover" sx={{ fontWeight: 500, color: '#1976d2' }}>arif.kobel.click</Link>
          </Typography>
        </div>
      </footer>
    </div>
  )
}