import React from 'react';
import { Link } from 'react-router-dom';

export default function LoginFooter({ linkName, linkUrl = '#', paragraph }) {
  return (
    <p className="text-center text-sm text-gray-600">
      {paragraph}
      <Link
        to={linkUrl}
        className="font-medium text-violet-600 hover:text-violet-500"
      >
        {linkName}
      </Link>
    </p>
  );
}
