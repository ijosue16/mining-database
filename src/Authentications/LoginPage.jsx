import React, {useEffect, useState} from "react";
import {PiEnvelopeBold,PiEyeFill,PiEyeSlashFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../states/apislice";
import { setAuthToken, setUserData } from "../states/slice";
import { useDispatch } from "react-redux";


const LoginPage=()=>{
    const [ login, { isLoading, isSuccess, isError, error } ] = useLoginMutation();
    const[show,setShow]=useState(false);
    const [user, setUser] = useState({ email: "", password: "" })
    const navigate=useNavigate();
    const dispatch = useDispatch();
    useEffect(() => {
        if (isSuccess) {
            console.log('Logged in successfully');
        } else if (isError) {
            console.log(error);
        }
    }, [isSuccess, isError, error]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await login({body: user});
        if (response) {
            const { token } = response.data;
            const { user } = response.data.data;
            dispatch(setAuthToken(token));
            dispatch(setUserData(user));
        }
    };
    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };
    return(
        <>
        <div className="grid grid-cols-6 h-full">
            <div className="col-span-6 sm:col-span-3 lg:col-span-2 h-full gap-3 flex flex-col bg-white p-3">
                <h2 className=" text-xl font-bold">Sign In</h2>
                <p>Please login to your account</p>
            <form action="" className="flex flex-col justify-center gap-3" onSubmit={handleSubmit}>
               <span>
               <p className="mb-2">Email</p>
               <span className="flex items-center w-full p-2 rounded border justify-between">
                <input type="email" required name="email" id="email" className=" focus:outline-none w-full" placeholder="Enter your Email" onChange={handleChange} />
                <PiEnvelopeBold className="text-[#a0aaba]"/>
                </span>
               </span>
               <span>
               <p className="mb-2">Password</p>
               <span className="flex items-center w-full p-2 rounded border justify-between">
                <input type={show?"text":"password" } required name="password" id="password" className=" focus:outline-none w-full" placeholder="Enter your Password" onChange={handleChange} />
                {show?( <PiEyeSlashFill className="text-[#a0aaba]" onClick={()=>setShow(!show)}/>) :( <PiEyeFill className="text-[#a0aaba]" onClick={()=>setShow(!show)}/>)}
                </span>
               </span>
               <p className="mb-2 hover:underline " onClick={()=>navigate('/password/forgot')}>Forgot password ?</p>
               <button type="submit" className="w-full px-2 py-3 bg-amber-200 rounded">Login</button>

              <span className="flex items-center justify-center gap-2">
              <p>Don’t have an account?</p>
              <p className=" hover:underline" onClick={()=>navigate('/register')}>Sign Up</p>
              </span>
            </form>
            </div>

            <div className=" col-span-3 sm:col-span-3 lg:col-span-4 hidden sm:block h-full bg-origin-border bg-center bg-no-repeat bg-cover bg-[url('https://media.istockphoto.com/id/527547684/vector/city-street-with-pharmacy-modern-architecture-in-line-style.jpg?s=612x612&w=0&k=20&c=nYzcHEQBkc0V44RIMv-aU1sWnysyWUH_pNzV7CNq3IM=')]"/>
            </div></>
    )
}
export default LoginPage;