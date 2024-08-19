/* eslint-disable no-undef */
import  { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import ManageProfile from './ManageProfile';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const Popup = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2.5),
  margin: 0,
  height: 500,
  width: 300,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // Align items to the left
  backgroundColor: '#f4f4f4',
  fontFamily: 'Arial, sans-serif',
  gap: theme.spacing(2.5),
  textAlign: 'left', // Align text to the left
}));

const PopupComponent = () => {
  const [currentSite, setCurrentSite] = useState('');
  const [redirectSite, setRedirectSite] = useState('');
  const [unblockTime, setunblockTime] = useState('');
  const [isPopUp, setIsPopUp] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const getCurrentTabUrl = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100)); 
        const queryOptions = { active: true, lastFocusedWindow: true };
        const [tab] = await chrome.tabs.query(queryOptions);
        await new Promise((resolve) => setTimeout(resolve, 100));
        if (tab && tab?.url) {
          setCurrentSite(tab.url);
        } else {
          console.error("Tab information is not available.");
        }
      } catch (error) {
        console.error("Error retrieving tab information:", error);
      }
    };
    getCurrentTabUrl();
  }, []);

  const toggleIsPopup = () => {
    setIsPopUp(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://core.shadhin.ai/productivity-api/urls/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ block_urls: currentSite, redirect_urls: redirectSite, minutes_to_unblock: unblockTime }),
      });

      if (response.ok) {
        setRedirectSite('');
        setunblockTime(0);
          // Trigger notification
        setOpenSnackbar(true);
        //setApiTrigger((prev) => !prev);
      } else {
        Error(`HTTP error! status: ${response.status}`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Handle Snackbar close
const handleCloseSnackbar = () => {
  setOpenSnackbar(false);
};

  const optionPage = () => {
    const newURL = chrome.runtime.getURL('optionPage.html');
    window.open(newURL, '_blank');
  };

  return (
    <Popup>
      {isPopUp ? (
        <ManageProfile />
      ) : (
        <form onSubmit={handleSubmit}>
          <Box sx={{ width: '100%' }}>
            <Typography
              variant="h6"
              component="h2"
              sx={{ color: 'black', mb: 2, textAlign: 'center' }}
            >
              Productivity Plugin
            </Typography>
            <Typography
              variant="body2"
              component="label"
              sx={{
                display: 'block',
                mb: 1,
                color: 'black',
                textAlign: 'left',
              }}
            >
              Current site
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={currentSite}
              sx={{ mb: 2 }}
              InputProps={{
                style: { color: 'black',width: 280 },
                readOnly: true,  // This makes the input non-editable
              }}
            />
            <Typography
              variant="body2"
              component="label"
              sx={{ display: 'block', mb: 1, color: 'black', textAlign: 'left' }}
            >
              Site you want to redirect
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value={redirectSite}
              onChange={(e) => setRedirectSite(e.target.value)}
              placeholder="Enter the site you want to redirect"
              sx={{ mb: 2 }}
              InputProps={{ style: { color: 'black' , width: 280} }}
            />
            <Typography
              variant="body2"
              component="label"
              sx={{ display: 'block', mb: 1, color: 'black', textAlign: 'left' }}
            >
              Unblock time (minutes)
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              type="number"
              value={unblockTime}
              onChange={(e) => setunblockTime(e.target.value)}
              placeholder="Enter unblock time"
              sx={{ mb: 2 }}
              InputProps={{ style: { color: 'black',width: 280 ,mb:3} }}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: '#00aeef',
                color: '#fff',
                width: 280,
                '&:hover': { backgroundColor: '#008bbd' },
              }}
            >
              Block Now
            </Button>
          </Box>
          <Stack direction="row" spacing={2} sx={{ mt: 4, width: '100%'}}>
            <Button
              variant="contained"
              onClick={toggleIsPopup}
              sx={{
                backgroundColor: '#00aeef',
                color: '#fff',
                '&:hover': { backgroundColor: '#008bbd' },
                height: 40,
                width: '48%', // Make buttons the same size
              }}
            >
               profile
            </Button>
            <Button
              variant="contained"
              onClick={optionPage}
              sx={{
                backgroundColor: '#00aeef',
                color: '#fff',
                height: 40,
                width: '48%', // Make buttons the same size
                '&:hover': { backgroundColor: '#008bbd ' },
              }}
            >
               Blocklists
            </Button>
          </Stack>
        </form>
      )}
      <Snackbar
      open={openSnackbar}
      autoHideDuration={6000}
      onClose={handleCloseSnackbar}
    >
      <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
        Submission successful!
      </Alert>
    </Snackbar>
    </Popup>
  );
};

export default PopupComponent;
