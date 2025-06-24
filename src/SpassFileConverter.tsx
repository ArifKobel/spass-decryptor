import React, { useState, useRef } from 'react';
import {
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Tooltip,
  Snackbar,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SecurityIcon from '@mui/icons-material/Security';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import convertSpassToChromeCSV from './utils/spassDecryptor';

const SpassFileConverter: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [securityDialogOpen, setSecurityDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!file) {
      setError('Please select a Samsung Pass export file (.spass).');
      return;
    }
    if (!password) {
      setError('Please enter the password.');
      return;
    }
    
    setLoading(true);
    try {
      const result = await convertSpassToChromeCSV(file, password, { autoDownload: true });
      if (!result.success) {
        setError('Conversion failed.');
      } else {
        setSuccess(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error during conversion.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => setSuccess(false);

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Card elevation={8} sx={{ minWidth: 380, maxWidth: 450, width: '100%', p: 1, borderRadius: 3 }}>
        <CardHeader
          avatar={<SecurityIcon color="primary" sx={{ fontSize: 40 }} />}
          title={
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Typography variant="h5" fontWeight={700} gutterBottom>
                .SPASS to <br />Chrome CSV
              </Typography>
              <Tooltip title="Security Information" arrow placement="top">
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<HelpOutlineIcon />}
                  onClick={() => setSecurityDialogOpen(true)}
                  sx={{ 
                    minWidth: 'auto', 
                    px: 1.5, 
                    py: 0.5,
                    fontSize: '0.75rem',
                    borderRadius: 2
                  }}
                >
                  Security
                </Button>
              </Tooltip>
            </Box>
          }
          subheader={
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Convert Samsung Pass export files (.spass) securely to Chrome format. 
              All data is processed locally and not transmitted to servers.
            </Typography>
          }
        />
        <Divider sx={{ mx: 2 }} />
        <CardContent sx={{ pt: 3 }}>
          <form onSubmit={handleSubmit} autoComplete="off">
            <Tooltip title="Only Samsung Pass export files (.spass) are accepted" arrow placement="top">
              <span>
                <Button
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                  onClick={() => fileInputRef.current?.click()}
                  fullWidth
                  sx={{ mb: 3, py: 1.5, borderRadius: 2 }}
                  tabIndex={-1}
                >
                  {file ? file.name : 'Select Samsung Pass Export File (.spass)'}
                </Button>
              </span>
            </Tooltip>
            <input
              ref={fileInputRef}
              type="file"
              accept=".spass"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <Tooltip title="Password to decrypt the file" arrow placement="top">
              <TextField
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
                autoComplete="current-password"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  )
                }}
              />
            </Tooltip>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
              size="large"
              sx={{ mb: 2, py: 1.5, borderRadius: 2, fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Convert Securely & Download'}
            </Button>
            {error && <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>{error}</Alert>}
          </form>
        </CardContent>
      </Card>
      
      <Snackbar
        open={success}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        message="✅ Download successful! File has been securely converted."
      />
      
      {/* Security Dialog */}
      <Dialog 
        open={securityDialogOpen} 
        onClose={() => setSecurityDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <SecurityIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Security Information
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <b>🔒 Offline Processing:</b>
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, pl: 2 }}>
            • All data is processed exclusively in your browser<br/>
            • No files or passwords are transmitted to servers<br/>
            • Processing is completely offline
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 2, mt: 3 }}>
            <b>⚠️ Important notice about the decrypted file:</b>
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, pl: 2 }}>
            • The downloaded CSV file contains your passwords in plain text<br/>
            • Keep this file secure and do not share it with others<br/>
            • Delete the file after importing it into your password manager<br/>
          </Typography>
          
          <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
            <Typography variant="body2">
              <b>Tip:</b> Import the passwords directly in your password manager and delete the CSV file afterwards.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={() => setSecurityDialogOpen(false)}
            variant="contained"
            sx={{ borderRadius: 2 }}
          >
            Understood
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SpassFileConverter; 