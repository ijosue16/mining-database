import React, { createContext, useContext, useState } from 'react';
import { Outlet } from 'react-router-dom';

const MyContext = createContext();

export function useMyContext() {
  return useContext(MyContext);
};



export default function MyContextProvider() {
  const [sharedData, setSharedData] = useState('My nigga');
  const updateSharedData = (newValue) => {
    setSharedData(newValue);
  };

  return (
    <MyContext.Provider value={{sharedData,updateSharedData}}>
      <Outlet />
    </MyContext.Provider>
  );
}