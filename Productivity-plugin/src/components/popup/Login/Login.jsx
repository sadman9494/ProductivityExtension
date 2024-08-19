/* eslint-disable no-unused-vars */


import useFetchLogin from './login'
import Popup from '../Popup'
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

function Login() {
  const [email, setEmail] = useState('');
  const [firstName, setfirstName] = useState('');
  const [lastName, setlastName] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(1);    // 1== login , 2 == signUp , 3 == verify
  const [isLoggedIn , setIsLoggedIn] = useState(false);
  const { data, token, fetchLoginData , fetchRegisterData,fetchForgotPassword } = useFetchLogin();
  

 

  const handleToggle = () => {
    isLogin ==1 ? setIsLogin(2)
    : setIsLogin(1);
  };

  const handleForgetPassword=()=>{
     setIsLogin(3);
  }

  
  
  const handleSubmit = async(e) => {
    e.preventDefault(); 
    if (isLogin == 1 ){
     const response = await fetchLoginData ('https://core.shadhin.ai/productivity-api/user/login',
        isLogin === 1 ? email : null,
        isLogin === 1 ? password : null)
        console.log(response)
        
        if (response && response.data && response.data.access_token) 
          {
            console.log("login here  ")
            console.log(data)
            setIsLoggedIn(true);
            localStorage.setItem('token' , response.data.access_token);
            localStorage.setItem('email' , email);
            
          }
        else{
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    }
    else if (isLogin == 2){
       const response = await fetchRegisterData ('https://core.shadhin.ai/productivity-api/user/register',
           firstName, lastName, email , password
        )

        if(response && response.data.success)
          {
            
            setIsLogin(1);
            
          }

          else{
            throw new Error(`HTTP error! status: ${response.status}`);
          }
    }

    else{
      const response = await fetchForgotPassword ('https://core.shadhin.ai/productivity-api/user/forget_password',email )
       
      if(response !== null)
      {
        setIsLogin(1);
      }
      else{
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }
    


  } 
    

  return (
    <Box
      sx={{
        padding: 2.5,
        margin: 0,
        height: 500,
        width: 300,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f4f4f4',
        fontFamily: 'Arial, sans-serif',
        gap: 2.5,
        textAlign: 'center',
      }}
    >
      {isLoggedIn ? (
        <Popup />
      ) : (
        <Box component="div">
          <Typography variant="h5" sx={{ color: 'black', marginBottom: 2 }}>
            {isLogin === 1 && 'Login'}
            {isLogin === 2 && 'Sign Up'}
            {isLogin === 3 && 'Verify'}
          </Typography>

          <form onSubmit={handleSubmit}>
            {isLogin === 2 && (
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  variant="outlined"
                  value={firstName}
                  onChange={(e) => setfirstName(e.target.value)}
                  placeholder="Enter your first name"
                  sx={{ marginBottom: 2,width: 280 }}
                  //InputLabelProps={{ style: { color: 'black' } }}
                  
                />
                <TextField
                  fullWidth
                  label="Last Name"
                  variant="outlined"
                  value={lastName}
                  onChange={(e) => setlastName(e.target.value)}
                  placeholder="Enter your last name"
                  sx={{ width: 280 }}
 
                />
              </Box>
            )}

            <Box sx={{ marginBottom: 2 }}>
              <TextField
                fullWidth
                label="Email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                sx={{ width: 280 }}
                
              />
            </Box>

            {(isLogin === 1 || isLogin === 2) && (
              <Box sx={{ marginBottom: 2 }}>
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  sx={{ width: 280 }}
                 
                />
              </Box>
            )}

            {isLogin === 1 && (
              <Box sx={{ marginBottom: 2 }}>
                <Link
                  href="#"
                  onClick={handleForgetPassword}
                  underline="hover"
                  sx={{
                    display: 'block',
                    textAlign: 'left',
                    marginBottom: 2,
                    color: '#00aeef',
                  }}
                >
                  Forget password
                </Link>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{
                    backgroundColor: '#00aeef',
                    color: '#000000',
                    '&:hover': { backgroundColor: '#008bbd ' },
                  }}
                >
                  Login
                </Button>
              </Box>
            )}

            {isLogin === 2 && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#00aeef',
                  color: '#000000',
                  '&:hover': { backgroundColor: '#008bbd' },
                }}
              >
                Sign Up
              </Button>
            )}

            {isLogin === 3 && (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#00aeef',
                  color: '#000000',
                  '&:hover': { backgroundColor: '#008bbd' },
                }}
              >
                Verify
              </Button>
            )}

            <Typography
              variant="body2"
              sx={{ marginTop: 2, color: 'black', textAlign: 'center' }}
            >
              {isLogin === 1 ? (
                <>
                  Don’t have an account?{' '}
                  <Link
                    href="#"
                    onClick={handleToggle}
                    underline="hover"
                    sx={{ color: '#00aeef' }}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link
                    href="#"
                    onClick={handleToggle}
                    underline="hover"
                    sx={{ color: '#00aeef' }}
                  >
                    Login
                  </Link>
                </>
              )}
            </Typography>
          </form>
        </Box>
      )}
    </Box>
  );
}


export default Login;