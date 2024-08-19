import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Link from '@mui/material/Link';
import Popup from './Popup';

const ManageProfile = () => {
  const [newPass, setNewPass] = useState('');
  const [oldPass, setOldPass] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openPopup, setOpenPopup] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://core.shadhin.ai/productivity-api/user/change_password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ old_password: oldPass, new_password: newPass }),
      });

      if (response.ok) {
        setNewPass('');
        setOldPass('');
        // Trigger notification
        setOpenSnackbar(true);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOpenPopup = () => {
    setOpenPopup(true);
  };

  return (
    <Box
      component="form"
      sx={{
        height: 500,
        width: 300,
        mt: 5,
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      {openPopup ? (
        <Popup />
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography
              variant="h6"
              component="div"
              gutterBottom
              sx={{ color: 'black', mb: 3, mt: 5 }} // margin-bottom: 24px
            >
              Change Password
            </Typography>
          </Box>
          <TextField
            id="oldPass"
            label="Old Password"
            variant="outlined"
            type="password"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
            sx={{ mb: 2, width: 300 }} // margin-bottom: 16px
          />
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            type="password"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
            required
            sx={{ mb: 3, width: 300 }} // margin-bottom: 24px
          />
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              sx={{ padding: '12px', backgroundColor: '#00aeef' }} // Optional padding
            >
              Submit
            </Button>
          </Box>
          <Box sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link
              href="#"
              onClick={handleOpenPopup}
              underline="hover"
              sx={{ color: '#00aeef', mt: 5 }}
            >
              Login
            </Link>
          </Box>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
            <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
              Submission successful!
            </Alert>
          </Snackbar>
        </>
      )}
    </Box>
  );
};

export default ManageProfile;
