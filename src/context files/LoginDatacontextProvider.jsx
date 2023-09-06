import React, { createContext, useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

const LoginData = createContext();

export function useMyContext() {
  return useContext(LoginData);
};



export default function LoginDatacontextProvider() {
  const profile =JSON.parse(localStorage.getItem('profile'));
  const role = localStorage.getItem('role');
  console.log(role)
  console.log(profile)
  const [loginData, setLoginData] = useState(role);
  useEffect(()=>{

  },[]);
 
  const updateLoginData = (accessibility) => {
    setLoginData({accessibility});
  };

  return (
    <LoginData.Provider value={{loginData,updateLoginData}}>
      <Outlet />
    </LoginData.Provider>
  );
}