import React, { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const LoginData = createContext();

export function useMyContext() {
  return useContext(LoginData);
};



export default function LoginDatacontextProvider() {
  const [loginData, setLoginData] = useState({accessibility:'josue'});
  const updateLoginData = (accessibility) => {
    setLoginData({accessibility});
  };

  return (
    <LoginData.Provider value={{loginData,updateLoginData}}>
      <Outlet />
    </LoginData.Provider>
  );
}