import { useState } from "react";

const useFetchLogin = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  //const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(null);

   
    const fetchLoginData = async (url,email, password ) => {
      //setLoading(true);
      try {
        setData(null);
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            
          },
          body: JSON.stringify({email:email ,password: password}),
        });

        if (!response.ok) {
          console.log(response)
          throw new Error(`HTTP error! status: ${response.status}`);
  
        }
        
        const responseData = await response.json();
        console.log(`DATA `)
        const { access_token } = responseData.data;

        setToken(`${access_token}`);
        setData(responseData);
        return responseData
      } catch (err) {
        setError(err.message);
      } 
    };


    const fetchRegisterData = async (url, firstName, lastName, email, password) => {
      try {
        setData(null);
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            
          },
          body: JSON.stringify({ first_name: firstName, last_name: lastName,email:email ,password: password }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const responseData = await response.json();
        setData(responseData);
        return responseData;
      } catch (err) {
        setError(err.message);
      }
    };
    
    const fetchForgotPassword = async( url , email)=>{
      try {
        setData(null);
        const response = await fetch(url , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const responseData = await response.json();
        setData(responseData);
        return responseData;
      } catch (err) {
        setError(err.message);
      }
    }
  return { data, token , fetchLoginData ,fetchRegisterData, fetchForgotPassword,error};
};

export default useFetchLogin;
