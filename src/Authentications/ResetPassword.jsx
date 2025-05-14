// import React, { useState } from "react";
// import {PiEyeFill,PiEyeSlashFill } from "react-icons/pi";
//
//
// const ResetPasswordPage=()=>{
//     const[show,setShow]=useState(false);
//     const [user, setUser] = useState({password: "",confirmPassword:"" })
//     const handleSubmit = (e) => {
//         e.preventDefault();
//     };
//     const handleChange = (e) => {
//         setUser({ ...user, [e.target.name]: e.target.value })
//     };
//     return(
//         <>
//         <div className="grid grid-cols-6 h-full">
//             <div className="col-span-6 sm:col-span-3 lg:col-span-2 h-full gap-3 flex flex-col bg-white p-3">
//                 <h2 className=" text-xl font-bold">Reset Password</h2>
//
//             <form action="" className="flex flex-col justify-center gap-3" onSubmit={handleSubmit}>
//                <span>
//                <p className="mb-2">Password</p>
//                <span className="flex items-center w-full p-2 rounded border justify-between">
//                 <input type={show?"text":"password" } required name="password" id="password" className=" focus:outline-none w-full" placeholder="Enter your Password" />
//                 {show?( <PiEyeSlashFill className="text-[#a0aaba]" onClick={()=>setShow(!show)}/>) :( <PiEyeFill className="text-[#a0aaba]" onClick={()=>setShow(!show)}/>)}
//                 </span>
//                </span>
//                <span>
//                <p className="mb-2">Confirm Password</p>
//                <span className="flex items-center w-full p-2 rounded border justify-between">
//                 <input type={show?"text":"password" } required name="confirmPassword" id="confirmPassword" className=" focus:outline-none w-full" placeholder="Enter your Password" />
//                 {show?( <PiEyeSlashFill className="text-[#a0aaba]" onClick={()=>setShow(!show)}/>) :( <PiEyeFill className="text-[#a0aaba]" onClick={()=>setShow(!show)}/>)}
//                 </span>
//                </span>
//                <button type="submit" className="w-full px-2 py-3 bg-amber-200 rounded">Reset Password</button>
//             </form>
//             </div>
//
//             <div className=" col-span-3 sm:col-span-3 lg:col-span-4 hidden sm:block h-full bg-origin-border bg-center bg-no-repeat bg-cover bg-[url('https://img.freepik.com/free-vector/landscape-coal-mining-scene-with-crane-trucks_1308-55217.jpg?w=2000')]"></div>
//             </div></>
//     )
// }
// export default ResetPasswordPage;



// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { ImSpinner2 } from "react-icons/im";
// import { PiEyeFill, PiEyeSlashFill, PiLockBold } from "react-icons/pi";
// import { message } from "antd";
// import { useResetPasswordMutation } from "../states/apislice";
// import { useDispatch } from "react-redux";
// import { setAuthToken, setUserData, setPermissions } from "../states/slice";
// import { hasPermission } from "../components/helperFunctions.js";
//
// const ResetPassword = () => {
//     const [resetPassword, { isLoading, isSuccess, isError, error }] = useResetPasswordMutation();
//     const navigate = useNavigate();
//     const location = useLocation();
//     const dispatch = useDispatch();
//
//     const [showCurrent, setShowCurrent] = useState(false);
//     const [showNew, setShowNew] = useState(false);
//     const [showConfirm, setShowConfirm] = useState(false);
//
//     const [passwordData, setPasswordData] = useState({
//         userId: location.state?.userId || "",
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: ""
//     });
//
//     // Validation states
//     const [validationErrors, setValidationErrors] = useState({
//         currentPassword: "",
//         newPassword: "",
//         confirmPassword: ""
//     });
//
//     // Redirect if no userId is provided
//     useEffect(() => {
//         if (!location.state?.userId) {
//             message.error("Invalid access. Please login first.");
//             navigate("/login");
//         }
//     }, [location.state, navigate]);
//
//     // Handle API response
//     useEffect(() => {
//         if (isSuccess) {
//             message.success("Password reset successfully");
//         } else if (isError) {
//             const { message: errorMessage } = error.data;
//             message.error(errorMessage);
//         }
//     }, [isSuccess, isError, error]);
//
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setPasswordData(prev => ({ ...prev, [name]: value }));
//
//         // Clear validation errors when user starts typing
//         setValidationErrors(prev => ({ ...prev, [name]: "" }));
//
//         // Validate confirm password match
//         if (name === "confirmPassword" || (name === "newPassword" && passwordData.confirmPassword)) {
//             const newPasswordValue = name === "newPassword" ? value : passwordData.newPassword;
//             const confirmValue = name === "confirmPassword" ? value : passwordData.confirmPassword;
//
//             if (confirmValue && newPasswordValue !== confirmValue) {
//                 setValidationErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
//             } else {
//                 setValidationErrors(prev => ({ ...prev, confirmPassword: "" }));
//             }
//         }
//
//         // Validate password strength
//         if (name === "newPassword") {
//             if (value.length < 8) {
//                 setValidationErrors(prev => ({ ...prev, newPassword: "Password must be at least 8 characters" }));
//             } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
//                 setValidationErrors(prev => ({
//                     ...prev,
//                     newPassword: "Password must contain at least one uppercase letter, one lowercase letter, and one number"
//                 }));
//             } else {
//                 setValidationErrors(prev => ({ ...prev, newPassword: "" }));
//             }
//         }
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//
//         // Final validation
//         let hasErrors = false;
//         const errors = {...validationErrors};
//
//         if (!passwordData.currentPassword) {
//             errors.currentPassword = "Current password is required";
//             hasErrors = true;
//         }
//
//         if (!passwordData.newPassword) {
//             errors.newPassword = "New password is required";
//             hasErrors = true;
//         }
//
//         if (!passwordData.confirmPassword) {
//             errors.confirmPassword = "Please confirm your new password";
//             hasErrors = true;
//         }
//
//         if (passwordData.newPassword !== passwordData.confirmPassword) {
//             errors.confirmPassword = "Passwords do not match";
//             hasErrors = true;
//         }
//
//         if (hasErrors) {
//             setValidationErrors(errors);
//             return;
//         }
//
//         const response = await resetPassword({ body: passwordData });
//
//         if (response.data) {
//             const { token } = response.data;
//             const { user } = response.data.data;
//
//             // Update auth state
//             dispatch(setAuthToken(token));
//             dispatch(setUserData(user));
//             dispatch(setPermissions(user.permissions));
//
//             // Navigate to appropriate dashboard based on permissions
//             if (hasPermission(user.permissions, "dashboard:view")) {
//                 navigate("/dashboard");
//             } else {
//                 navigate("/company");
//             }
//         }
//     };
//
//     return (
//         <div className="grid grid-cols-6 h-screen">
//             <div className="col-span-6 sm:col-span-3 lg:col-span-2 h-full flex flex-col bg-white p-6 lg:pt-12">
//                 <div className="flex flex-col items-center mb-8">
//                     <img
//                         src="/soemc-logo.png"
//                         alt="SOEMC Logo"
//                         className="h-20 mb-6"
//                     />
//                     <div className="h-px w-3/4 bg-gray-200"></div>
//                 </div>
//
//                 <div className="px-2">
//                     <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
//                     <p className="text-gray-600 mb-6">Please set a new password for your account</p>
//
//                     <form className="flex flex-col justify-center gap-4" onSubmit={handleSubmit}>
//                         <div className="space-y-1">
//                             <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
//                                 Current Password
//                             </label>
//                             <div className={`flex items-center w-full p-2 rounded-md border ${validationErrors.currentPassword ? 'border-red-500' : 'border-gray-300'} focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200`}>
//                                 <input
//                                     type={showCurrent ? "text" : "password"}
//                                     required
//                                     name="currentPassword"
//                                     id="currentPassword"
//                                     className="focus:outline-none w-full text-gray-800"
//                                     placeholder="Enter your current password"
//                                     onChange={handleChange}
//                                     value={passwordData.currentPassword}
//                                 />
//                                 {showCurrent ? (
//                                     <PiEyeSlashFill
//                                         className="text-gray-400 ml-2 cursor-pointer"
//                                         onClick={() => setShowCurrent(!showCurrent)}
//                                     />
//                                 ) : (
//                                     <PiEyeFill
//                                         className="text-gray-400 ml-2 cursor-pointer"
//                                         onClick={() => setShowCurrent(!showCurrent)}
//                                     />
//                                 )}
//                             </div>
//                             {validationErrors.currentPassword && (
//                                 <p className="text-red-500 text-xs mt-1">{validationErrors.currentPassword}</p>
//                             )}
//                         </div>
//
//                         <div className="space-y-1">
//                             <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
//                                 New Password
//                             </label>
//                             <div className={`flex items-center w-full p-2 rounded-md border ${validationErrors.newPassword ? 'border-red-500' : 'border-gray-300'} focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200`}>
//                                 <input
//                                     type={showNew ? "text" : "password"}
//                                     required
//                                     name="newPassword"
//                                     id="newPassword"
//                                     className="focus:outline-none w-full text-gray-800"
//                                     placeholder="Enter your new password"
//                                     onChange={handleChange}
//                                     value={passwordData.newPassword}
//                                 />
//                                 {showNew ? (
//                                     <PiEyeSlashFill
//                                         className="text-gray-400 ml-2 cursor-pointer"
//                                         onClick={() => setShowNew(!showNew)}
//                                     />
//                                 ) : (
//                                     <PiEyeFill
//                                         className="text-gray-400 ml-2 cursor-pointer"
//                                         onClick={() => setShowNew(!showNew)}
//                                     />
//                                 )}
//                             </div>
//                             {validationErrors.newPassword && (
//                                 <p className="text-red-500 text-xs mt-1">{validationErrors.newPassword}</p>
//                             )}
//                         </div>
//
//                         <div className="space-y-1">
//                             <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
//                                 Confirm New Password
//                             </label>
//                             <div className={`flex items-center w-full p-2 rounded-md border ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200`}>
//                                 <input
//                                     type={showConfirm ? "text" : "password"}
//                                     required
//                                     name="confirmPassword"
//                                     id="confirmPassword"
//                                     className="focus:outline-none w-full text-gray-800"
//                                     placeholder="Confirm your new password"
//                                     onChange={handleChange}
//                                     value={passwordData.confirmPassword}
//                                 />
//                                 {showConfirm ? (
//                                     <PiEyeSlashFill
//                                         className="text-gray-400 ml-2 cursor-pointer"
//                                         onClick={() => setShowConfirm(!showConfirm)}
//                                     />
//                                 ) : (
//                                     <PiEyeFill
//                                         className="text-gray-400 ml-2 cursor-pointer"
//                                         onClick={() => setShowConfirm(!showConfirm)}
//                                     />
//                                 )}
//                             </div>
//                             {validationErrors.confirmPassword && (
//                                 <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
//                             )}
//                         </div>
//
//                         <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
//                             <p className="text-sm text-blue-800">
//                                 <span className="font-semibold">Password requirements:</span>
//                                 <ul className="list-disc ml-5 mt-1">
//                                     <li>At least 8 characters long</li>
//                                     <li>Include at least one uppercase letter</li>
//                                     <li>Include at least one lowercase letter</li>
//                                     <li>Include at least one number</li>
//                                 </ul>
//                             </p>
//                         </div>
//
//                         {isLoading ? (
//                             <button
//                                 className="flex gap-2 items-center justify-center py-3 mt-4 bg-blue-400 bg-opacity-50 rounded-md text-white font-medium transition-all duration-200 cursor-not-allowed"
//                                 type="button"
//                                 disabled
//                             >
//                                 <ImSpinner2 className="h-5 w-5 animate-spin" />
//                                 Resetting password...
//                             </button>
//                         ) : (
//                             <button
//                                 type="submit"
//                                 className="w-full py-3 mt-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-medium transition-all duration-200"
//                             >
//                                 Reset Password
//                             </button>
//                         )}
//                     </form>
//
//                     <div className="mt-8 text-center">
//                         <p className="text-gray-600 text-sm">
//                             © {new Date().getFullYear()} SOEMC LTD. All rights reserved.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//
//             <div className="col-span-3 sm:col-span-3 lg:col-span-4 hidden sm:block h-full bg-origin-border bg-center bg-no-repeat bg-cover bg-[url('https://img.freepik.com/free-vector/landscape-coal-mining-scene-with-crane-trucks_1308-55217.jpg?w=2000')]">
//                 <div className="h-full w-full bg-black bg-opacity-40 flex flex-col justify-center items-center p-8">
//                     <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-sm max-w-2xl">
//                         <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
//                             Password Reset Required
//                         </h1>
//                         <p className="text-lg text-white text-center">
//                             For security reasons, you need to reset your password before accessing the system.
//                             Please create a strong password that you haven't used before.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default ResetPassword;



import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ImSpinner2 } from "react-icons/im";
import { PiEyeFill, PiEyeSlashFill, PiLockBold } from "react-icons/pi";
import { message } from "antd";
import { useResetPasswordMutation } from "../states/apislice";
import { useDispatch } from "react-redux";
import { setAuthToken, setUserData, setPermissions } from "../states/slice";
import { hasPermission } from "../components/helperFunctions.js";

const ResetPassword = () => {
    const [resetPassword, { isLoading, isSuccess, isError, error }] = useResetPasswordMutation();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [passwordData, setPasswordData] = useState({
        userId: location.state?.userId || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Validation states
    const [validationErrors, setValidationErrors] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Password criteria states
    const [passwordCriteria, setPasswordCriteria] = useState({
        length: false,
        hasUppercase: false,
        hasLowercase: false,
        hasNumber: false
    });

    // Redirect if no userId is provided
    useEffect(() => {
        if (!location.state?.userId) {
            message.error("Invalid access. Please login first.");
            navigate("/login");
        }
    }, [location.state, navigate]);

    // Handle API response
    useEffect(() => {
        if (isSuccess) {
            message.success("Password reset successfully");
        } else if (isError) {
            const { message: errorMessage } = error.data;
            message.error(errorMessage);
        }
    }, [isSuccess, isError, error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));

        // Clear validation errors when user starts typing
        setValidationErrors(prev => ({ ...prev, [name]: "" }));

        // Validate confirm password match
        if (name === "confirmPassword" || (name === "newPassword" && passwordData.confirmPassword)) {
            const newPasswordValue = name === "newPassword" ? value : passwordData.newPassword;
            const confirmValue = name === "confirmPassword" ? value : passwordData.confirmPassword;

            if (confirmValue && newPasswordValue !== confirmValue) {
                setValidationErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
            } else {
                setValidationErrors(prev => ({ ...prev, confirmPassword: "" }));
            }
        }

        // Validate password strength and update criteria
        if (name === "newPassword") {
            // Check individual criteria
            const criteria = {
                length: value.length >= 8,
                hasUppercase: /[A-Z]/.test(value),
                hasLowercase: /[a-z]/.test(value),
                hasNumber: /\d/.test(value)
            };

            setPasswordCriteria(criteria);

            // Set validation error if any criteria fails
            if (!criteria.length) {
                setValidationErrors(prev => ({ ...prev, newPassword: "Password must be at least 8 characters" }));
            } else if (!(criteria.hasUppercase && criteria.hasLowercase && criteria.hasNumber)) {
                setValidationErrors(prev => ({
                    ...prev,
                    newPassword: "Password must meet all the requirements below"
                }));
            } else {
                setValidationErrors(prev => ({ ...prev, newPassword: "" }));
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Final validation
        let hasErrors = false;
        const errors = {...validationErrors};

        if (!passwordData.currentPassword) {
            errors.currentPassword = "Current password is required";
            hasErrors = true;
        }

        if (!passwordData.newPassword) {
            errors.newPassword = "New password is required";
            hasErrors = true;
        }

        if (!passwordData.confirmPassword) {
            errors.confirmPassword = "Please confirm your new password";
            hasErrors = true;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
            hasErrors = true;
        }

        if (hasErrors) {
            setValidationErrors(errors);
            return;
        }

        const response = await resetPassword({ body: passwordData });

        if (response.data) {
            const { token } = response.data;
            const { user } = response.data.data;

            // Update auth state
            dispatch(setAuthToken(token));
            dispatch(setUserData(user));
            dispatch(setPermissions(user.permissions));

            // Navigate to appropriate dashboard based on permissions
            if (hasPermission(user.permissions, "dashboard:view")) {
                navigate("/dashboard");
            } else {
                navigate("/company");
            }
        }
    };

    return (
        <div className="grid grid-cols-6 h-screen">
            <div className="col-span-6 sm:col-span-3 lg:col-span-2 h-full flex flex-col bg-white p-6 lg:pt-12">
                <div className="flex flex-col items-center mb-8">
                    <img
                        src="/soemc-logo.png"
                        alt="SOEMC Logo"
                        className="h-20 mb-6"
                    />
                    <div className="h-px w-3/4 bg-gray-200"></div>
                </div>

                <div className="px-2">
                    <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
                    <p className="text-gray-600 mb-6">Please set a new password for your account</p>

                    <form className="flex flex-col justify-center gap-4" onSubmit={handleSubmit}>
                        <div className="space-y-1">
                            <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                                Current Password
                            </label>
                            <div className={`flex items-center w-full p-2 rounded-md border ${validationErrors.currentPassword ? 'border-red-500' : 'border-gray-300'} focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200`}>
                                <input
                                    type={showCurrent ? "text" : "password"}
                                    required
                                    name="currentPassword"
                                    id="currentPassword"
                                    className="focus:outline-none w-full text-gray-800"
                                    placeholder="Enter your current password"
                                    onChange={handleChange}
                                    value={passwordData.currentPassword}
                                />
                                {showCurrent ? (
                                    <PiEyeSlashFill
                                        className="text-gray-400 ml-2 cursor-pointer"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                    />
                                ) : (
                                    <PiEyeFill
                                        className="text-gray-400 ml-2 cursor-pointer"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                    />
                                )}
                            </div>
                            {validationErrors.currentPassword && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.currentPassword}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                                New Password
                            </label>
                            <div className={`flex items-center w-full p-2 rounded-md border ${validationErrors.newPassword ? 'border-red-500' : 'border-gray-300'} focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200`}>
                                <input
                                    type={showNew ? "text" : "password"}
                                    required
                                    name="newPassword"
                                    id="newPassword"
                                    className="focus:outline-none w-full text-gray-800"
                                    placeholder="Enter your new password"
                                    onChange={handleChange}
                                    value={passwordData.newPassword}
                                />
                                {showNew ? (
                                    <PiEyeSlashFill
                                        className="text-gray-400 ml-2 cursor-pointer"
                                        onClick={() => setShowNew(!showNew)}
                                    />
                                ) : (
                                    <PiEyeFill
                                        className="text-gray-400 ml-2 cursor-pointer"
                                        onClick={() => setShowNew(!showNew)}
                                    />
                                )}
                            </div>
                            {validationErrors.newPassword && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.newPassword}</p>
                            )}
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                                Confirm New Password
                            </label>
                            <div className={`flex items-center w-full p-2 rounded-md border ${validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200`}>
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    required
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    className="focus:outline-none w-full text-gray-800"
                                    placeholder="Confirm your new password"
                                    onChange={handleChange}
                                    value={passwordData.confirmPassword}
                                />
                                {showConfirm ? (
                                    <PiEyeSlashFill
                                        className="text-gray-400 ml-2 cursor-pointer"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                    />
                                ) : (
                                    <PiEyeFill
                                        className="text-gray-400 ml-2 cursor-pointer"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                    />
                                )}
                            </div>
                            {validationErrors.confirmPassword && (
                                <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
                            )}
                        </div>

                        <div className="mt-4 p-3 bg-blue-50 rounded-md border border-blue-100">
                            <p className="text-sm text-blue-800 font-semibold mb-2">Password requirements:</p>
                            <ul className="space-y-1">
                                <li className="flex items-center">
                                    {passwordCriteria.length ? (
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-gray-300 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    <span className={passwordCriteria.length ? "text-green-700" : "text-gray-600"}>At least 8 characters long</span>
                                </li>
                                <li className="flex items-center">
                                    {passwordCriteria.hasUppercase ? (
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-gray-300 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    <span className={passwordCriteria.hasUppercase ? "text-green-700" : "text-gray-600"}>Include at least one uppercase letter</span>
                                </li>
                                <li className="flex items-center">
                                    {passwordCriteria.hasLowercase ? (
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-gray-300 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    <span className={passwordCriteria.hasLowercase ? "text-green-700" : "text-gray-600"}>Include at least one lowercase letter</span>
                                </li>
                                <li className="flex items-center">
                                    {passwordCriteria.hasNumber ? (
                                        <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg className="h-5 w-5 text-gray-300 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    <span className={passwordCriteria.hasNumber ? "text-green-700" : "text-gray-600"}>Include at least one number</span>
                                </li>
                            </ul>
                        </div>

                        {isLoading ? (
                            <button
                                className="flex gap-2 items-center justify-center py-3 mt-4 bg-blue-400 bg-opacity-50 rounded-md text-white font-medium transition-all duration-200 cursor-not-allowed"
                                type="button"
                                disabled
                            >
                                <ImSpinner2 className="h-5 w-5 animate-spin" />
                                Resetting password...
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="w-full py-3 mt-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-medium transition-all duration-200"
                            >
                                Reset Password
                            </button>
                        )}
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-gray-600 text-sm">
                            © {new Date().getFullYear()} SOEMC LTD. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>

            <div className="col-span-3 sm:col-span-3 lg:col-span-4 hidden sm:block h-full bg-origin-border bg-center bg-no-repeat bg-cover bg-[url('https://img.freepik.com/free-vector/landscape-coal-mining-scene-with-crane-trucks_1308-55217.jpg?w=2000')]">
                <div className="h-full w-full bg-black bg-opacity-40 flex flex-col justify-center items-center p-8">
                    <div className="bg-white bg-opacity-10 p-8 rounded-lg backdrop-blur-sm max-w-2xl">
                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 text-center">
                            Password Reset Required
                        </h1>
                        <p className="text-lg text-white text-center">
                            For security reasons, you need to reset your password before accessing the system.
                            Please create a strong password that you haven't used before.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;