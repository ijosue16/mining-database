import React from 'react';
import {useNavigate} from "react-router-dom";


const PermissionDenied = () => {

    const navigate = useNavigate()

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-red-500 mb-4">Permission Denied</h1>
                <p className="text-gray-600 mb-6">
                    You do not have sufficient permissions to access this page.
                </p>
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default PermissionDenied;
