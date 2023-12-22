import React, { useState, useEffect } from 'react';


const StyleTestPage = () => {


  return (
    <div className=' bg-white w-full h-full flex flex-col items-center gap-3'>
      <p>weee</p>
    <button className='py-2 px-4 rounded text-white bg-custom_blue-500 w-fit '> Default</button>
    <button className='py-2 px-4 rounded text-custom_blue-600 bg-custom_blue-200 w-fit '> Disabled</button>
    <button className='py-2 px-4 rounded text-custom_blue-600 bg-gradient-to-r from-custom_blue-100 to-custom_blue-300 w-fit '> Disabled gradient</button>
      
    </div>
  );
};

export default StyleTestPage;
