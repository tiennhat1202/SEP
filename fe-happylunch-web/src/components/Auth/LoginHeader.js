import React from 'react';
import logo from '../../assets/images/Logo2.svg';

export default function Header({ heading, paragraph }) {
  const styleIcon = {
    width: '160px',
    height: '160px'
  }
  return (
    <div className="mb-5">
      <div className="flex justify-center">
        <img className="header-logo" style={styleIcon} src={logo} alt="Logo brand here" />
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {heading}
      </h2>
      <p className="text-center text-sm text-gray-600 mt-5">{paragraph}</p>
    </div>
  );
}
