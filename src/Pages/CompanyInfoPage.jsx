import React from 'react';

const CompanyInfoPage = () => {
    return (
        <div className="h-screen w-full">
            <div className="relative w-full h-2/3 flex items-center justify-center bg-gray-200">
                <h1 className="text-6xl font-bold text-gray-800">SOEMC LTD</h1>
            </div>
            <div className="p-8 bg-white text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-4">Our Company</h1>
                <p className="text-gray-600 text-lg">
                    Welcome to SOEMC LTD! We are dedicated to providing exceptional
                    services and innovative solutions that meet your needs. Our mission is
                    to empower businesses and individuals with the tools and support they
                    need to succeed.
                </p>
            </div>
        </div>
    );
};

export default CompanyInfoPage;