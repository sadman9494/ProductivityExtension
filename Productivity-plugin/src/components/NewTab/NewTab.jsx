import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import bg from '../../assets/hills.png'
import { useState , useEffect } from 'react';

const NewTab = () => {

    const[quote, setQuote] = useState('');
    
    useEffect(()=>{
        
        const getQuote = async()=>{
            try{
                const response = await fetch('https://core.shadhin.ai/productivity-api/quote/random', {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': 'Bearer ' + localStorage.getItem('token'), 
                    }
            });

            if (!response.ok)
            {
                throw new Error(`HTTP error statuse: ${response.status}`)
            }
            
            const responseData = await response.json();
            if (responseData.data && responseData.data.quotes)
            {
                setQuote(responseData.data.quotes)
                console.log(responseData.data.quotes)
            }
            else {
                console.error('No URLs found in response data.');
            }
    
        }
        catch(e)
        {
                console.log(e);
        }
    }        
        getQuote();
    
},[])

        


  return (
    
    <Box
      sx={{
        position: 'absolute',     // Position the box absolutely
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage : `URL(${bg})`,
        backgroundSize: 'cover', // Ensures the image covers the entire background
        backgroundPosition: 'center', // Centers the image
        //backgroundColor: '#00aeef', // Using the specified color
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        //overflow: 'hidden',        // Hide any overflow that might cause scrollbars
      }}
    >
      <Box
        sx={{
            p: 3,
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Black color with 70% opacity
            borderRadius: 2,
            boxShadow: 3,
            textAlign: 'center',
            color: 'white'
          }}
      >
        <Typography 
         sx={{ 
            fontFamily: 'Playfair Display, serif', // Font family
            color: 'white' 
          }}
        variant="h4" component="div">
          {quote}
        </Typography>
      </Box>
    </Box>
  );
};

export default NewTab;
