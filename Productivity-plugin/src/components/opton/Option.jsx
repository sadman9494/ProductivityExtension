/* eslint-disable no-undef */
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
const borderStyle = '1px solid #ddd';

function Option() {
  const [blockUrl, setBlockUrl] = useState('');
  const [redirectUrl, setRedirectUrl] = useState('');
  const [duration, setDuration] = useState(0);
  const [urlData, setUrlData] = useState([]);
  const [editId, setEditID] = useState();
  const [apiTrigger, setApiTrigger] = useState(false);

  useEffect(() => {
    const getAllUrls = async () => {
      try {
        const response = await fetch('https://core.shadhin.ai/productivity-api/urls/retrive_urls_list', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();

        if (responseData.data && responseData.data.urls) {
          setUrlData(responseData.data.urls);
          chrome.storage.local.set({ urlData: responseData.data.urls }, () => {
            console.log('URLs inserted to Chrome storage');
          });
        } else {
          console.error('No URLs found in response data.');
        }
      } catch (e) {
        console.error('Failed to fetch URLs:', e);
      }
    };

    getAllUrls();
  }, [apiTrigger]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://core.shadhin.ai/productivity-api/urls/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ block_urls: blockUrl, redirect_urls: redirectUrl, minutes_to_unblock: duration }),
      });

      if (response.ok) {
        alert('URLs Added Successfully');
        setBlockUrl('');
        setRedirectUrl('');
        setDuration(0);
        setApiTrigger((prev) => !prev);
      } else {
        Error(`HTTP error! status: ${response.status}`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleUpdate = async (id) => {
    try {
      const response = await fetch(`https://core.shadhin.ai/productivity-api/urls/update_url/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({ block_urls: blockUrl || ' ', redirect_urls: redirectUrl || ' ' }),
      });
      if (response.ok) {
        alert('URL updated successfully');
        setBlockUrl('');
        setRedirectUrl('');
        setEditID('');
        setApiTrigger((prev) => !prev);
      } else {
        throw new Error(`HTTP error !! status : ${response.status}`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleEdit = (id, blockUrl, redirectUrl, duration) => {
    setEditID(id);
    setBlockUrl(blockUrl);
    setRedirectUrl(redirectUrl);
    setDuration(duration);
  };

  /*const handleToggle = () => {
    // Your toggle logic here
  };*/

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`https://core.shadhin.ai/productivity-api/urls/delete_url/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
      });
      if (response.ok) {
        alert('URL deleted successfully');
        setApiTrigger((prev) => !prev);
      } else {
        throw new Error(`HTTP error !! status : ${response.status}`);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box sx={{ mx: 'auto', p: 2 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: '60%',
          mx: 'auto',
          backgroundColor: '#f9f9f9',
          borderRadius: 2,
          boxShadow: 3,
          p: 2,
          mb: 10,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h4" gutterBottom   >
          Welcome to the Productivity Extension
        </Typography>
        </Box>
        

        <TextField
          fullWidth
          label="Enter URL to block"
          variant="outlined"
          value={blockUrl}
          onChange={(e) => setBlockUrl(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="Enter URL to redirect"
          variant="outlined"
          value={redirectUrl}
          onChange={(e) => setRedirectUrl(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Duration to block (minutes)"
          variant="outlined"
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value, 10))}
          sx={{ mb: 2, width: '50%' }}
        />
        {!editId ? (
          <Button type="submit" variant="contained"  fullWidth sx={{ mt: 2,backgroundColor: '#00aeef' }}>
            Block URL
          </Button>
        ) : (
          <Button type="button" variant="contained"  fullWidth sx={{ mt: 2, backgroundColor: '#00aeef' }} onClick={() => handleUpdate(editId)}>
            Update URL
          </Button>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

<Box sx={{ width: '100%' }}>
  <Typography variant="h5" sx={{ mb: 3 }}>
    Blocked URLs
  </Typography>
  <TableContainer component={Paper} sx={{ border: borderStyle, borderRadius: 2, p: 2 }}>
    <Table sx={{ width: '100%', tableLayout: 'fixed' }}>
      <TableHead>
        <TableRow>
          <TableCell align="center" sx={{ border: borderStyle, p: 1 }}>Blocked URL</TableCell>
          <TableCell align="center" sx={{ border: borderStyle, p: 1 }}>Redirected URL</TableCell>
          <TableCell align="center" sx={{ border: borderStyle, p: 1 }}>Duration</TableCell>
          <TableCell align="center" sx={{ border: borderStyle, p: 1 }}>Delete</TableCell>
          <TableCell align="center" sx={{ border: borderStyle, p: 1 }}>Update</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {urlData.map((entry) => (
          <TableRow key={entry.id}>
            <TableCell align="center" sx={{ border: borderStyle, p: 1, wordWrap: 'break-word', maxWidth: '150px' }}>{entry.block_urls}</TableCell>
            <TableCell align="center" sx={{ border: borderStyle, p: 1 }}>{entry.redirect_urls}</TableCell>
            <TableCell align="center" sx={{ border: borderStyle, p: 1 }}>{entry.minutes_to_unblock}</TableCell>
            <TableCell align="center" sx={{ border: borderStyle, p: 1 }}>
              <Button variant="contained" color="error" onClick={() => handleDelete(entry.id)}>
                Delete
              </Button>
            </TableCell>
            <TableCell align="center" sx={{ border: borderStyle, p: 1 }}>
              <Button variant="contained" color="info" onClick={() => handleEdit(entry.id, entry.block_urls, entry.redirect_urls, entry.minutes_to_unblock)}>
                Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
</Box>
    </Box>
  );
  
  
}

export default Option;
