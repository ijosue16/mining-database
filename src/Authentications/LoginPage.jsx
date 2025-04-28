// import React, {useContext, useEffect, useState} from "react";
// import { PiEnvelopeBold, PiEyeFill, PiEyeSlashFill } from "react-icons/pi";
// import { useNavigate, useLocation } from "react-router-dom";
// import {useLoginMutation, useVerifyTokenMutation, useVerifyCodeMutation } from "../states/apislice";
// import { setAuthToken, setUserData, setPermissions } from "../states/slice";
// import {useDispatch, useSelector} from "react-redux";
// import { toast } from "react-toastify";
// import { ImSpinner2 } from "react-icons/im";
// import {SocketContext} from "../context files/socket";
// import {message, Modal} from "antd";
// import {hasPermission} from "../components/helperFunctions.js";
//
//
// const LoginPage = () => {
//   const [login, { data,  isLoading, isSuccess, isError, error }] = useLoginMutation();
//   const [show, setShow] = useState(false);
//   const [user, setUser] = useState({ email: "", password: "" });
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const socket = useContext(SocketContext);
//   const location = useLocation();
//   const [show2fa, setShow2fa] = useState(false);
//   const [twoFACode, setTwoFACode] = useState({ code: "", email: "" });
//   const from = location.state?.from?.pathname;
//   useEffect(() => {
//     if (isSuccess) {
//       if (data?.token) return message.success("Logged in Successfully");
//     } else if (isError) {
//       const { message: errorMessage } = error.data;
//       return message.error(errorMessage);
//     }
//   }, [isSuccess, isError, error]);
//
//   const { token } = useSelector(state => state.persistedReducer?.global);
//   const [verifyToken, {data: verifyTokenData, isSuccess: verifyTokenSuccess, isError: isTokenError, error: tokenError}] = useVerifyTokenMutation();
//   const [verifyCode, {isSuccess: isVerifyCodeSuccess, isError: isVerifyCodeError, error: verifyCodeError}] = useVerifyCodeMutation();
//
//   useEffect(() => {
//     if (verifyTokenSuccess) {
//       return navigate('/dashboard' || "/coltan");
//     } else if (isTokenError) {
//       // const { message: errorMessage } = tokenError.data;
//       dispatch(setUserData(null));
//       dispatch(setPermissions(null));
//       dispatch(setAuthToken(null));
//       message.error(`Your session has ended. please log in again!`);
//       return navigate('/login');
//     }
//   }, [isTokenError, verifyTokenSuccess]);
//
//   useEffect(() => {
//     if (isVerifyCodeSuccess) {
//       return message.success("Logged in Successfully");
//     } else if (isVerifyCodeError) {
//       const { message: errorMessage } = verifyCodeError.data;
//       return message.error(errorMessage);
//     }
//   }, [isVerifyCodeSuccess, isVerifyCodeError, verifyCodeError]);
//
//
//
//   useEffect(() => {
//     const verifyLoginToken = async () => {
//       if (token) {
//         const response = await verifyToken({ token });
//         if (response.data?.data) {
//           const { userId: currentUserId } = response.data.data;
//           if (!currentUserId) {
//             dispatch(setUserData(null));
//             dispatch(setPermissions(null));
//             dispatch(setAuthToken(null));
//             message.error("Your session has ended. Please login again");
//             return navigate("/login");
//           }
//         }
//       }
//     };
//
//     verifyLoginToken();
//
//     const intervalId = setInterval(() => {
//       verifyLoginToken();
//     }, 20000);
//
//     return () => clearInterval(intervalId);
//   }, [token]);
//
//
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const response = await login({ body: user });
//     if (response.data) {
//       if (response.data?.token) {
//         const { token } = response.data;
//         const { user } = response.data.data;
//         dispatch(setAuthToken(token));
//         dispatch(setUserData(user));
//         dispatch(setPermissions(user.permissions));
//         // localStorage.setItem("profile", JSON.stringify(user));
//         // localStorage.setItem("role", user.role);
//         // localStorage.setItem("permissions", JSON.stringify(user.permissions));
//         socket.emit("new-user-add", {_id: user._id, username: user.username, role: user.role, permissions: user.permissions});
//         if (from) navigate(from, {replace: true});
//         if (hasPermission(user.permissions, "dashboard:view")) {
//           navigate("/dashboard");
//         } else {
//           navigate("/company")
//         }
//       } else {
//         const { user } = response.data.data;
//         setTwoFACode(prevState => ({ ...prevState, email: user.email }));
//         setShow2fa(true);
//       }
//     }
//   };
//
//   const handle2faSubmit = async () => {
//     if (!twoFACode.code) return message.error("Please enter the code from your device");
//     const response = await verifyCode({ body: { code: twoFACode.code, email: twoFACode.email }});
//     if (response.data) {
//       if (response.data?.token) {
//         const { token } = response.data;
//         const { user } = response.data.data;
//         dispatch(setAuthToken(token));
//         dispatch(setUserData(user));
//         dispatch(setPermissions(user.permissions));
//         // localStorage.setItem("profile", JSON.stringify(user));
//         // localStorage.setItem("role", user.role);
//         // localStorage.setItem("permissions", JSON.stringify(user.permissions));
//         socket.emit("new-user-add", {_id: user._id, username: user.username, role: user.role, permissions: user.permissions});
//         setShow2fa(false);
//         navigate(from, {replace: true});
//       }
//     }
//   }
//
//   const handleChange = (e) => {
//     setUser({ ...user, [e.target.name]: e.target.value });
//   };
//
//   const populateDemoCredentials = async (e) => {
//     setUser({email: "demouser@gmail.com", password: "moonlover35"})
//     await handleSubmit(e);
//   }
//   return (
//     <>
//       <div className="grid grid-cols-6 h-screen">
//         <div className="col-span-6 sm:col-span-3 lg:col-span-2 h-full gap-3 flex flex-col bg-white p-3 lg:pt-16">
//           <h2 className=" text-xl font-bold">SOEMC staff sign in</h2>
//           <p>Please login to your account</p>
//           <form
//             action=""
//             className="flex flex-col justify-center gap-3"
//             onSubmit={handleSubmit}
//           >
//             <button
//                 type="button"
//                 className="p-2 rounded bg-blue-100"
//                 onClick={populateDemoCredentials}
//             >Demo Credentials</button>
//             <span>
//               <p className="mb-2">Email</p>
//               <span className="flex items-center w-full p-2 rounded border justify-between">
//                 <input
//                   type="email"
//                   required
//                   name="email"
//                   id="email"
//                   autoComplete="off"
//                   className=" focus:outline-none w-full"
//                   placeholder="Enter your Email"
//                   onChange={handleChange}
//                 />
//                 <PiEnvelopeBold className="text-[#a0aaba]" />
//               </span>
//             </span>
//             <span>
//               <p className="mb-2">Password</p>
//               <span className="flex items-center w-full p-2 rounded border justify-between">
//                 <input
//                   type={show ? "text" : "password"}
//                   required
//                   name="password"
//                   id="password"
//                   className=" focus:outline-none w-full"
//                   placeholder="Enter your Password"
//                   onChange={handleChange}
//                 />
//                 {show ? (
//                   <PiEyeSlashFill
//                     className="text-[#a0aaba]"
//                     onClick={() => setShow(!show)}
//                   />
//                 ) : (
//                   <PiEyeFill
//                     className="text-[#a0aaba]"
//                     onClick={() => setShow(!show)}
//                   />
//                 )}
//               </span>
//               {/* <p className=" mt-2 hover:underline hover:text-blue-600" onClick={()=>navigate("/login/supplier")}>login as supplier</p> */}
//             </span>
//             {/*<p*/}
//             {/*  className="mb-2 hover:underline "*/}
//             {/*  onClick={() => navigate("/password/forgot")}*/}
//             {/*>*/}
//             {/*  Forgot password ?*/}
//             {/*</p>*/}
//             {isLoading ? (
//              <button
//              className="px-2 flex gap-1 items-center justify-center py-3 bg-blue-200 rounded-md text-gray-500"
//              type="submit"
//            >
//              <ImSpinner2 className="h-[20px] w-[20px] animate-spin text-gray-500" />
//              Logging in
//            </button>
//             ) : (
//                 <button
//                 type="submit"
//                 className="w-full px-2 py-3 bg-blue-400 rounded"
//               >
//                 Login
//               </button>
//             )}
//               {/*<p className=" mt-8 hover:underline border bg-custom_blue-100 border-custom_blue-500 p-2 w-fit rounded shadow-sm cursor-pointer text-md text-custom_blue-600" onClick={()=>navigate("/login/supplier")}>Login as SOEMC LTD supplier</p>*/}
//             {/*<span className="flex items-center justify-center gap-2">*/}
//             {/*  <p>Don’t have an account?</p>*/}
//             {/*  <p*/}
//             {/*    className=" hover:underline"*/}
//             {/*    onClick={() => navigate("/register")}*/}
//             {/*  >*/}
//             {/*    Sign Up*/}
//             {/*  </p>*/}
//             {/*</span>*/}
//           </form>
//         </div>
//
//         <div className=" col-span-3 sm:col-span-3 lg:col-span-4 hidden sm:block h-full bg-origin-border bg-center bg-no-repeat bg-cover bg-[url('https://img.freepik.com/free-vector/landscape-coal-mining-scene-with-crane-trucks_1308-55217.jpg?w=2000')]" />
//         <Modal
//             open={show2fa}
//             destroyOnClose
//             onOk={() => handle2faSubmit()}
//             onCancel={() => setShow2fa(!show2fa)}
//             okButtonProps={{className: "bg-blue-500"}}
//             cancelButtonProps={{className: "bg-red-500 text-white"}}
//         >
//           <div>
//             <p className="text-center text-xl font-bold">Enter 2FA code</p>
//             <input
//                 type="number"
//                 name="code"
//                 id="code"
//                 placeholder="Enter the 6 digit code from the app"
//                 className="w-full border p-2 rounded mt-2 focus:outline-none"
//                 onChange={(e) => setTwoFACode(prevState => ({...prevState, code: e.target.value}))}
//                 onWheelCapture={(e) => e.target.blur()}
//             />
//           </div>
//         </Modal>
//       </div>
//     </>
//   );
// };
// export default LoginPage;


import React, { useContext, useEffect, useState } from "react";
import { PiEnvelopeBold, PiEyeFill, PiEyeSlashFill } from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom";
import { useLoginMutation, useVerifyTokenMutation, useVerifyCodeMutation } from "../states/apislice";
import { setAuthToken, setUserData, setPermissions } from "../states/slice";
import { useDispatch, useSelector } from "react-redux";
import { ImSpinner2 } from "react-icons/im";
import { SocketContext } from "../context files/socket";
import { message, Modal } from "antd";
import { hasPermission } from "../components/helperFunctions.js";

const LoginPage = () => {
  const [login, { data, isLoading, isSuccess, isError, error }] = useLoginMutation();
  const [show, setShow] = useState(false);
  const [user, setUser] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socket = useContext(SocketContext);
  const location = useLocation();
  const [show2fa, setShow2fa] = useState(false);
  const [twoFACode, setTwoFACode] = useState({ code: "", email: "" });
  const from = location.state?.from?.pathname;

  useEffect(() => {
    if (isSuccess) {
      if (data?.token) return message.success("Logged in Successfully");
    } else if (isError) {
      const { message: errorMessage } = error.data;
      return message.error(errorMessage);
    }
  }, [isSuccess, isError, error]);

  const { token } = useSelector(state => state.persistedReducer?.global);
  const [verifyToken, { data: verifyTokenData, isSuccess: verifyTokenSuccess, isError: isTokenError, error: tokenError }] = useVerifyTokenMutation();
  const [verifyCode, { isSuccess: isVerifyCodeSuccess, isError: isVerifyCodeError, error: verifyCodeError }] = useVerifyCodeMutation();

  useEffect(() => {
    if (verifyTokenSuccess) {
      return navigate('/dashboard' || "/coltan");
    } else if (isTokenError) {
      dispatch(setUserData(null));
      dispatch(setPermissions(null));
      dispatch(setAuthToken(null));
      message.error(`Your session has ended. please log in again!`);
      return navigate('/login');
    }
  }, [isTokenError, verifyTokenSuccess]);

  useEffect(() => {
    if (isVerifyCodeSuccess) {
      return message.success("Logged in Successfully");
    } else if (isVerifyCodeError) {
      const { message: errorMessage } = verifyCodeError.data;
      return message.error(errorMessage);
    }
  }, [isVerifyCodeSuccess, isVerifyCodeError, verifyCodeError]);

  useEffect(() => {
    const verifyLoginToken = async () => {
      if (token) {
        const response = await verifyToken({ token });
        if (response.data?.data) {
          const { userId: currentUserId } = response.data.data;
          if (!currentUserId) {
            dispatch(setUserData(null));
            dispatch(setPermissions(null));
            dispatch(setAuthToken(null));
            message.error("Your session has ended. Please login again");
            return navigate("/login");
          }
        }
      }
    };

    verifyLoginToken();

    const intervalId = setInterval(() => {
      verifyLoginToken();
    }, 20000);

    return () => clearInterval(intervalId);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await login({ body: user });
    if (response.data) {
      if (response.data?.token) {
        const { token } = response.data;
        const { user } = response.data.data;
        dispatch(setAuthToken(token));
        dispatch(setUserData(user));
        dispatch(setPermissions(user.permissions));
        socket.emit("new-user-add", { _id: user._id, username: user.username, role: user.role, permissions: user.permissions });
        if (from) navigate(from, { replace: true });
        if (hasPermission(user.permissions, "dashboard:view")) {
          navigate("/dashboard");
        } else {
          navigate("/company")
        }
      } else {
        const { user } = response.data.data;
        setTwoFACode(prevState => ({ ...prevState, email: user.email }));
        setShow2fa(true);
      }
    }
  };

  const handle2faSubmit = async () => {
    if (!twoFACode.code) return message.error("Please enter the code from your device");
    const response = await verifyCode({ body: { code: twoFACode.code, email: twoFACode.email } });
    if (response.data) {
      if (response.data?.token) {
        const { token } = response.data;
        const { user } = response.data.data;
        dispatch(setAuthToken(token));
        dispatch(setUserData(user));
        dispatch(setPermissions(user.permissions));
        socket.emit("new-user-add", { _id: user._id, username: user.username, role: user.role, permissions: user.permissions });
        setShow2fa(false);
        navigate(from, { replace: true });
      }
    }
  }

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
      <>
        <div className="grid grid-cols-6 h-screen">
          <div className="col-span-6 sm:col-span-3 lg:col-span-2 h-full flex flex-col bg-white p-6 lg:pt-12">
            <div className="flex flex-col items-center mb-8">
              <img
                  src="/public/soemc-logo.png"
                  alt="SOEMC Logo"
                  className="h-20 mb-6"
              />
              <div className="h-px w-3/4 bg-gray-200"></div>
            </div>

            <div className="px-2">
              <h2 className="text-2xl font-bold text-gray-800">Staff Login</h2>
              <p className="text-gray-600 mb-6">Please sign in to access your account</p>

              <form className="flex flex-col justify-center gap-4" onSubmit={handleSubmit}>
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <div className="flex items-center w-full p-2 rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
                    <input
                        type="email"
                        required
                        name="email"
                        id="email"
                        autoComplete="off"
                        className="focus:outline-none w-full text-gray-800"
                        placeholder="Enter your email"
                        onChange={handleChange}
                    />
                    <PiEnvelopeBold className="text-gray-400 ml-2" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="flex items-center w-full p-2 rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all duration-200">
                    <input
                        type={show ? "text" : "password"}
                        required
                        name="password"
                        id="password"
                        className="focus:outline-none w-full text-gray-800"
                        placeholder="Enter your password"
                        onChange={handleChange}
                    />
                    {show ? (
                        <PiEyeSlashFill
                            className="text-gray-400 ml-2 cursor-pointer"
                            onClick={() => setShow(!show)}
                        />
                    ) : (
                        <PiEyeFill
                            className="text-gray-400 ml-2 cursor-pointer"
                            onClick={() => setShow(!show)}
                        />
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-1">
                  <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                      onClick={() => navigate("/password/forgot")}
                  >
                    Forgot password?
                  </button>
                </div>

                {isLoading ? (
                    <button
                        className="flex gap-2 items-center justify-center py-3 mt-4 bg-blue-400 bg-opacity-50 rounded-md text-white font-medium transition-all duration-200 cursor-not-allowed"
                        type="button"
                        disabled
                    >
                      <ImSpinner2 className="h-5 w-5 animate-spin" />
                      Logging in...
                    </button>
                ) : (
                    <button
                        type="submit"
                        className="w-full py-3 mt-4 bg-blue-500 hover:bg-blue-600 rounded-md text-white font-medium transition-all duration-200"
                    >
                      Sign In
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
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-center">
                Welcome to SOEMC
              </h1>
              <p className="text-xl text-white text-center max-w-2xl">
                Your trusted partner in mining operations management
              </p>
            </div>
          </div>

          <Modal
              open={show2fa}
              destroyOnClose
              onOk={() => handle2faSubmit()}
              onCancel={() => setShow2fa(!show2fa)}
              okButtonProps={{ className: "bg-blue-500" }}
              cancelButtonProps={{ className: "bg-red-500 text-white" }}
          >
            <div className="py-4">
              <p className="text-center text-xl font-bold mb-4">Two-Factor Authentication</p>
              <p className="text-gray-600 mb-4 text-center">
                Please enter the 6-digit code from your authentication app
              </p>
              <input
                  type="number"
                  name="code"
                  id="code"
                  placeholder="Enter your 6-digit code"
                  className="w-full border border-gray-300 p-3 rounded-md mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onChange={(e) => setTwoFACode(prevState => ({ ...prevState, code: e.target.value }))}
                  onWheelCapture={(e) => e.target.blur()}
              />
            </div>
          </Modal>
        </div>
      </>
  );
};

export default LoginPage;