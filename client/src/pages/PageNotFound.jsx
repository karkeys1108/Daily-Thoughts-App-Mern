import React from 'react';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
      <div className='max-w-[1080px] w-full mx-auto flex justify-center items-center flex-col text-center'>
        <h1 className='text-3xl font-bold text-gray-900 mb-4'>Oops! Page not found</h1>
        <p className='text-black mb-8'>The page you're looking for might have been removed or doesn't exist.</p>
        <Link
          to='/'
          className='bg-violet-500 w-fit hover:bg-violet-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300'
        >
          Go to Home
        </Link>
      </div>
   
  );
}
