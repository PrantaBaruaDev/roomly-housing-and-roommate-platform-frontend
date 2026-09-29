import Link from 'next/link';
import React from 'react';

const NotFound = () => {
    return (
        <div className="text-center h-vh align-middle">
            <h2 className="text-2xl font-bold">404 Not Found</h2>
            <p>Could not find the requested resource.</p>
            <Link href="/" className="hover:text-green-500">Return Home</Link>
        </div>
    );
};

export default NotFound;