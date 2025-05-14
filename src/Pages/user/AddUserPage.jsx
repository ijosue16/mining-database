// import {useEffect, useState} from "react";
// import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
// import AddComponent from "../../components/Actions components/AddComponent";
// import {PiEyeFill, PiEyeSlashFill} from "react-icons/pi";
// import {useSignupMutation} from "../../states/apislice";
// import {useNavigate} from "react-router-dom";
// import {message} from "antd";
//
//
// const AddUserPage = () => {
//     const navigate = useNavigate();
//     const [signup, {isLoading, isSuccess, isError, error}] = useSignupMutation();
//     const [formval, setFormval] = useState({
//         name: '',
//         phoneNumber: '',
//         username: '',
//         email: '',
//         role: "",
//         password: '',
//         passwordConfirm: ''
//     });
//     const [show, setShow] = useState(false);
//     const handleAddproduct = (e) => {
//         setFormval((prevState) => ({...prevState, [e.target.name]: e.target.value}));
//     }
//     useEffect(() => {
//         if (isSuccess) {
//             message.success("User created successfully");
//         } else if (isError) {
//             const {message: errorMessage} = error.data;
//             message.error(errorMessage);
//         }
//     }, [isSuccess, isError, error]);
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         await signup({body: formval});
//         handleCancel();
//         navigate(-1);
//
//     }
//     const handleCancel = (e) => {
//         setFormval({name: '', phoneNumber: '', username: '', email: '', role: "", password: '', passwordConfirm: ''})
//     }
//     return (
//         <>
//             <ActionsPagesContainer title={'Add User'}
//                                    subTitle={'Add/Update user'}
//                                    actionsContainer={<AddComponent component={
//                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//                                            <ul className="grid grid-cols-1 gap-4  list-none">
//                                                <li>
//                                                    <p className="mb-1 pl-1">Full Name</p>
//                                                    <input value={formval.name || ''} required autoComplete="name"
//                                                           type="text" name="name" id="fullName"
//                                                           className="focus:outline-none p-2 border rounded-md w-full"
//                                                           onChange={handleAddproduct}/>
//                                                </li>
//                                                {/* ******* */}
//
//                                                <li>
//                                                    <p className="mb-1 pl-1">Email</p>
//                                                    <input value={formval.email || ''} required autoComplete="off"
//                                                           type="email" name="email" id="email"
//                                                           className="focus:outline-none p-2 border rounded-md w-full"
//                                                           onChange={handleAddproduct}/>
//                                                </li>
//                                                {/* ******* */}
//                                                <li>
//                                                    <p className="mb-1 pl-1">Username</p>
//                                                    <input value={formval.username || ''} required autoComplete="off"
//                                                           type="username" name="username" id="username"
//                                                           className="focus:outline-none p-2 border rounded-md w-full"
//                                                           onChange={handleAddproduct}/>
//                                                </li>
//                                                {/* ******* */}
//                                                <li>
//                                                    <p className="mb-1 pl-1">Phone Number</p>
//
//                                                    <input value={formval.phoneNumber || ''} required autoComplete="off"
//                                                           type="text" name="phoneNumber" id="phoneNumber"
//                                                           className="focus:outline-none p-2 border rounded-md w-full"
//                                                           onChange={handleAddproduct}/>
//                                                </li>
//                                                {/* ******* */}
//
//                                            </ul>
//                                            <ul className="grid grid-cols-1 gap-4 h-fit">
//                                                <li>
//                                                    <p className="mb-1 pl-1">Role</p>
//                                                    <select value={formval.role || ''}
//                                                            required name="role" id="role"
//                                                            className="focus:outline-none p-2 border rounded-md w-full"
//                                                            onChange={handleAddproduct}>
//                                                        <option value="ceo">CEO</option>
//                                                        <option value="managingDirector">Managing director office
//                                                        </option>
//                                                        <option value="operationsManager">Operations manager office
//                                                        </option>
//                                                        <option value="accountant">Accountancy office</option>
//                                                        <option value="traceabilityOfficer">Traceability office</option>
//                                                        <option value={"laboratoryOfficer"}>Laboratory officer</option>
//                                                        <option value="storekeeper">Storekeeper</option>
//                                                    </select>
//                                                </li>
//                                                <li>
//                                                    <p className="mb-1 pl-1">Password</p>
//                                                    <span
//                                                        className=" flex items-center w-full border rounded-md p-2 justify-between">
//                                     <input value={formval.password || ''} required type={show ? "text" : "password"}
//                                            name="password" id="password" className=" focus:outline-none w-full"
//                                            onChange={handleAddproduct}/>
//                                                        {show ? <PiEyeSlashFill onClick={() => setShow(!show)}/> :
//                                                            <PiEyeFill className="" onClick={() => setShow(!show)}/>}
//                                 </span>
//
//                                                </li>
//                                                {/* ******* */}
//                                                <li>
//                                                    <p className="mb-1 pl-1">Confirm Password</p>
//                                                    <span
//                                                        className=" flex items-center w-full border rounded-md p-2 justify-between">
//                                     <input value={formval.passwordConfirm || ''} required
//                                            type={show ? "text" : "password"} name="passwordConfirm" id="passwordConfirm"
//                                            className=" focus:outline-none w-full" onChange={handleAddproduct}/>
//                                                        {show ? <PiEyeSlashFill onClick={() => setShow(!show)}/> :
//                                                            <PiEyeFill className="" onClick={() => setShow(!show)}/>}
//                                 </span>
//
//                                                </li>
//                                                {/* ******* */}
//
//                                            </ul>
//
//                                            {/*                   <span className="">*/}
//                                            {/*    <p className="mb-1 pl-1">User image</p>*/}
//                                            {/*    <input type="file" name="userImage" id="userImage"*/}
//                                            {/*           className=" p-2 border rounded-lg w-full h-fit md:h-52" value={""} onChange={handleAddproduct}/>*/}
//                                            {/*</span>*/}
//
//                                        </div>
//                                    }
//                                                                    Add={handleSubmit}
//                                                                    Cancel={handleCancel}
//                                                                    isloading={isLoading}/>}
//
//             />
//         </>
//     )
// }
// export default AddUserPage;


// import { useEffect, useState } from "react";
// import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
// import AddComponent from "../../components/Actions components/AddComponent";
// import { useSignupMutation } from "@/states/apislice.js";
// import { useNavigate } from "react-router-dom";
// import { message } from "antd";
//
// import {
//     Card,
//     CardContent,
// } from "@/components/ui/card";
// import {
//     Form,
//     FormControl,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import { Button } from "@/components/ui/button";
// import { EyeIcon, EyeOffIcon } from "lucide-react";
//
// const AddUserPage = () => {
//     const navigate = useNavigate();
//     const [signup, { isLoading, isSuccess, isError, error }] = useSignupMutation();
//     const [formval, setFormval] = useState({
//         name: "",
//         phoneNumber: "",
//         username: "",
//         email: "",
//         role: "",
//         password: "",
//         passwordConfirm: "",
//     });
//     const [show, setShow] = useState(false);
//
//     const handleAddproduct = (e) => {
//         setFormval((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
//     };
//
//     const handleRoleChange = (value) => {
//         setFormval((prevState) => ({ ...prevState, role: value }));
//     };
//
//     useEffect(() => {
//         if (isSuccess) {
//             message.success("User created successfully");
//         } else if (isError) {
//             const { message: errorMessage } = error.data;
//             message.error(errorMessage);
//         }
//     }, [isSuccess, isError, error]);
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         await signup({ body: formval });
//         handleCancel();
//         navigate(-1);
//     };
//
//     const handleCancel = () => {
//         setFormval({
//             name: "",
//             phoneNumber: "",
//             username: "",
//             email: "",
//             role: "",
//             password: "",
//             passwordConfirm: "",
//         });
//     };
//
//     return (
//         <ActionsPagesContainer
//             title={"Add User"}
//             subTitle={"Add/Update user"}
//             actionsContainer={
//                 <AddComponent
//                     component={
//                         <Card className="border-0 shadow-none">
//                             <CardContent className="p-0">
//                                 <Form>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div className="space-y-4">
//                                             <FormField>
//                                                 <FormItem>
//                                                     <FormLabel className="font-medium">Full Name</FormLabel>
//                                                     <FormControl>
//                                                         <Input
//                                                             value={formval.name || ""}
//                                                             required
//                                                             autoComplete="name"
//                                                             type="text"
//                                                             name="name"
//                                                             id="fullName"
//                                                             placeholder="Enter full name"
//                                                             onChange={handleAddproduct}
//                                                             className="focus-visible:ring-2 focus-visible:ring-offset-0"
//                                                         />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             </FormField>
//
//                                             <FormField>
//                                                 <FormItem>
//                                                     <FormLabel className="font-medium">Email</FormLabel>
//                                                     <FormControl>
//                                                         <Input
//                                                             value={formval.email || ""}
//                                                             required
//                                                             autoComplete="off"
//                                                             type="email"
//                                                             name="email"
//                                                             id="email"
//                                                             placeholder="Enter email address"
//                                                             onChange={handleAddproduct}
//                                                             className="focus-visible:ring-2 focus-visible:ring-offset-0"
//                                                         />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             </FormField>
//
//                                             <FormField>
//                                                 <FormItem>
//                                                     <FormLabel className="font-medium">Username</FormLabel>
//                                                     <FormControl>
//                                                         <Input
//                                                             value={formval.username || ""}
//                                                             required
//                                                             autoComplete="off"
//                                                             type="text"
//                                                             name="username"
//                                                             id="username"
//                                                             placeholder="Enter username"
//                                                             onChange={handleAddproduct}
//                                                             className="focus-visible:ring-2 focus-visible:ring-offset-0"
//                                                         />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             </FormField>
//
//                                             <FormField>
//                                                 <FormItem>
//                                                     <FormLabel className="font-medium">Phone Number</FormLabel>
//                                                     <FormControl>
//                                                         <Input
//                                                             value={formval.phoneNumber || ""}
//                                                             required
//                                                             autoComplete="off"
//                                                             type="text"
//                                                             name="phoneNumber"
//                                                             id="phoneNumber"
//                                                             placeholder="Enter phone number"
//                                                             onChange={handleAddproduct}
//                                                             className="focus-visible:ring-2 focus-visible:ring-offset-0"
//                                                         />
//                                                     </FormControl>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             </FormField>
//                                         </div>
//
//                                         <div className="space-y-4">
//                                             <FormField>
//                                                 <FormItem>
//                                                     <FormLabel className="font-medium">Role</FormLabel>
//                                                     <Select value={formval.role} onValueChange={handleRoleChange}>
//                                                         <FormControl>
//                                                             <SelectTrigger className="w-full">
//                                                                 <SelectValue placeholder="Select a role" />
//                                                             </SelectTrigger>
//                                                         </FormControl>
//                                                         <SelectContent>
//                                                             <SelectItem value="ceo">CEO</SelectItem>
//                                                             <SelectItem value="managingDirector">Managing director office</SelectItem>
//                                                             <SelectItem value="operationsManager">Operations manager office</SelectItem>
//                                                             <SelectItem value="accountant">Accountancy office</SelectItem>
//                                                             <SelectItem value="traceabilityOfficer">Traceability office</SelectItem>
//                                                             <SelectItem value="laboratoryOfficer">Laboratory officer</SelectItem>
//                                                             <SelectItem value="storekeeper">Storekeeper</SelectItem>
//                                                         </SelectContent>
//                                                     </Select>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             </FormField>
//
//                                             <FormField>
//                                                 <FormItem>
//                                                     <FormLabel className="font-medium">Password</FormLabel>
//                                                     <div className="relative">
//                                                         <FormControl>
//                                                             <Input
//                                                                 value={formval.password || ""}
//                                                                 required
//                                                                 type={show ? "text" : "password"}
//                                                                 name="password"
//                                                                 id="password"
//                                                                 placeholder="Enter password"
//                                                                 onChange={handleAddproduct}
//                                                                 className="pr-10 focus-visible:ring-2 focus-visible:ring-offset-0"
//                                                             />
//                                                         </FormControl>
//                                                         <Button
//                                                             type="button"
//                                                             variant="ghost"
//                                                             size="icon"
//                                                             className="absolute right-0 top-0 h-full px-3 py-2"
//                                                             onClick={() => setShow(!show)}
//                                                         >
//                                                             {show ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
//                                                         </Button>
//                                                     </div>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             </FormField>
//
//                                             <FormField>
//                                                 <FormItem>
//                                                     <FormLabel className="font-medium">Confirm Password</FormLabel>
//                                                     <div className="relative">
//                                                         <FormControl>
//                                                             <Input
//                                                                 value={formval.passwordConfirm || ""}
//                                                                 required
//                                                                 type={show ? "text" : "password"}
//                                                                 name="passwordConfirm"
//                                                                 id="passwordConfirm"
//                                                                 placeholder="Confirm password"
//                                                                 onChange={handleAddproduct}
//                                                                 className="pr-10 focus-visible:ring-2 focus-visible:ring-offset-0"
//                                                             />
//                                                         </FormControl>
//                                                         <Button
//                                                             type="button"
//                                                             variant="ghost"
//                                                             size="icon"
//                                                             className="absolute right-0 top-0 h-full px-3 py-2"
//                                                             onClick={() => setShow(!show)}
//                                                         >
//                                                             {show ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
//                                                         </Button>
//                                                     </div>
//                                                     <FormMessage />
//                                                 </FormItem>
//                                             </FormField>
//                                         </div>
//                                     </div>
//                                 </Form>
//                             </CardContent>
//                         </Card>
//                     }
//                     Add={handleSubmit}
//                     Cancel={handleCancel}
//                     isloading={isLoading}
//                 />
//             }
//         />
//     );
// };
//
// export default AddUserPage;


import { useEffect, useState } from "react";
import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../components/Actions components/AddComponent";
import { useSignupMutation } from "@/states/apislice.js";
import { useNavigate } from "react-router-dom";
import { message } from "antd";

import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const AddUserPage = () => {
    const navigate = useNavigate();
    const [signup, { isLoading, isSuccess, isError, error }] = useSignupMutation();
    const [formval, setFormval] = useState({
        name: "",
        phoneNumber: "",
        username: "",
        email: "",
        role: "",
        password: "",
        passwordConfirm: "",
    });
    const [show, setShow] = useState(false);

    const handleAddproduct = (e) => {
        setFormval((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
    };

    const handleRoleChange = (value) => {
        setFormval((prevState) => ({ ...prevState, role: value }));
    };

    useEffect(() => {
        if (isSuccess) {
            message.success("User created successfully");
        } else if (isError) {
            const { message: errorMessage } = error.data;
            message.error(errorMessage);
        }
    }, [isSuccess, isError, error]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await signup({ body: formval });
        handleCancel();
        navigate(-1);
    };

    const handleCancel = () => {
        setFormval({
            name: "",
            phoneNumber: "",
            username: "",
            email: "",
            role: "",
            password: "",
            passwordConfirm: "",
        });
    };

    return (
        <ActionsPagesContainer
            title={"Add User"}
            subTitle={"Add/Update user"}
            actionsContainer={
                <AddComponent
                    component={
                        <Card className="border-0 shadow-none">
                            <CardContent className="p-0">
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label htmlFor="fullName" className="text-sm font-medium">
                                                    Full Name
                                                </label>
                                                <Input
                                                    value={formval.name || ""}
                                                    required
                                                    autoComplete="name"
                                                    type="text"
                                                    name="name"
                                                    id="fullName"
                                                    placeholder="Enter full name"
                                                    onChange={handleAddproduct}
                                                    className="focus-visible:ring-2 focus-visible:ring-offset-0"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="email" className="text-sm font-medium">
                                                    Email
                                                </label>
                                                <Input
                                                    value={formval.email || ""}
                                                    required
                                                    autoComplete="off"
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    placeholder="Enter email address"
                                                    onChange={handleAddproduct}
                                                    className="focus-visible:ring-2 focus-visible:ring-offset-0"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="username" className="text-sm font-medium">
                                                    Username
                                                </label>
                                                <Input
                                                    value={formval.username || ""}
                                                    required
                                                    autoComplete="off"
                                                    type="text"
                                                    name="username"
                                                    id="username"
                                                    placeholder="Enter username"
                                                    onChange={handleAddproduct}
                                                    className="focus-visible:ring-2 focus-visible:ring-offset-0"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="phoneNumber" className="text-sm font-medium">
                                                    Phone Number
                                                </label>
                                                <Input
                                                    value={formval.phoneNumber || ""}
                                                    required
                                                    autoComplete="off"
                                                    type="text"
                                                    name="phoneNumber"
                                                    id="phoneNumber"
                                                    placeholder="Enter phone number"
                                                    onChange={handleAddproduct}
                                                    className="focus-visible:ring-2 focus-visible:ring-offset-0"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label htmlFor="role" className="text-sm font-medium">
                                                    Role
                                                </label>
                                                <Select value={formval.role} onValueChange={handleRoleChange}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select a role" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="ceo">CEO</SelectItem>
                                                        <SelectItem value="managingDirector">Managing Director</SelectItem>
                                                        <SelectItem value="operationsManager">Operations manager</SelectItem>
                                                        <SelectItem value="accountant">Accountancy office</SelectItem>
                                                        <SelectItem value="traceabilityOfficer">Traceability Officer</SelectItem>
                                                        <SelectItem value="dueDiligenceOfficer">Due Diligence Officer</SelectItem>
                                                        <SelectItem value="laboratoryOfficer">Laboratory Officer</SelectItem>
                                                        <SelectItem value="storekeeper">Storekeeper</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="password" className="text-sm font-medium">
                                                    Password
                                                </label>
                                                <div className="relative">
                                                    <Input
                                                        value={formval.password || ""}
                                                        required
                                                        type={show ? "text" : "password"}
                                                        name="password"
                                                        id="password"
                                                        placeholder="Enter password"
                                                        onChange={handleAddproduct}
                                                        className="pr-10 focus-visible:ring-2 focus-visible:ring-offset-0"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2"
                                                        onClick={() => setShow(!show)}
                                                    >
                                                        {show ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label htmlFor="passwordConfirm" className="text-sm font-medium">
                                                    Confirm Password
                                                </label>
                                                <div className="relative">
                                                    <Input
                                                        value={formval.passwordConfirm || ""}
                                                        required
                                                        type={show ? "text" : "password"}
                                                        name="passwordConfirm"
                                                        id="passwordConfirm"
                                                        placeholder="Confirm password"
                                                        onChange={handleAddproduct}
                                                        className="pr-10 focus-visible:ring-2 focus-visible:ring-offset-0"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="absolute right-0 top-0 h-full px-3 py-2"
                                                        onClick={() => setShow(!show)}
                                                    >
                                                        {show ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    }
                    Add={handleSubmit}
                    Cancel={handleCancel}
                    isloading={isLoading}
                />
            }
        />
    );
};

export default AddUserPage;