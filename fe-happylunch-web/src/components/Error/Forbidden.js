import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Forbidden() {
  return (
    <>
      <div
        className="w-[100vw] h-[100vh] flex justify-center items-center relative"
        style={{ backgroundColor: '#fea918' }}
      >
        <img
          className="z-1"
          src="https://www.onlinesolutionsgroup.de/wp-content/uploads/Statuscode-403-Forbidden-750x390-1-750x390.jpg"
        ></img>
      </div>
      <div className='absolute top-2 left-2'>
        <NavLink to="/Login" className="z-2">
          Back
        </NavLink>
      </div>
    </>
  );
}
