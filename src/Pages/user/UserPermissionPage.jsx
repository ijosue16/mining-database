// import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
// import AddComponent from "../../components/Actions components/AddComponent";
// import {
//   useGetOneUserQuery,
//   useUpdateUserMutation,
// } from "../../states/apislice";
// import { BiEditAlt } from "react-icons/bi";
// import { useSelector } from "react-redux";
// import { useNavigate, useParams } from "react-router-dom";
// import FetchingPage from "../FetchingPage";
// import { message } from "antd";
// import { toInitialCase } from "../../components/helperFunctions";
//
// const UserPermissionPage = () => {
//   const { userId } = useParams();
//   const navigate = useNavigate();
//   // const store = useSelector((state) => {
//   // });
//   const [isEdit, setIsEdit] = useState(false);
//   const [userData, setUserData] = useState({ name: "", role: "", active: null });
//   const [permissions, setPermissions] = useState({});
//
//   const { data, isLoading, isSuccess, isError, error } = useGetOneUserQuery(
//     userId,
//     {
//       refetchOnMountOrArgChange: true,
//       refetchOnReconnect: true,
//     }
//   );
//   const [
//     updateUser,
//     {
//       isLoading: isSending,
//       isSuccess: isDone,
//       isError: isProblem,
//       error: problem,
//     },
//   ] = useUpdateUserMutation();
//
//   useEffect(() => {
//     if (isDone) {
//       message.success("User updated successfully");
//       return navigate("/users");
//     } else if (isProblem) {
//       const { message: errorMessage } = problem.data;
//       return message.error(errorMessage);
//     }
//   }, [isDone, isProblem, problem]);
//
//   useEffect(() => {
//     if (isSuccess) {
//       const { user } = data.data;
//       const { permissions } = data.data.user;
//       setUserData(prevState => ({...prevState, name: user.name, role: user.role, active: user.active}));
//       setPermissions(permissions);
//     }
//   }, [isSuccess, data]);
//
//   const handlePermissionChange = (category, action) => {
//     setPermissions((prevPermissions) => {
//       const updatedPermissions = { ...prevPermissions };
//       updatedPermissions[category] = { ...updatedPermissions[category] };
//       updatedPermissions[category][action] =
//         !updatedPermissions[category][action];
//       return updatedPermissions;
//     });
//   };
//
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const body = { permissions, ...userData };
//     await updateUser({ body, userId });
//     setIsEdit(false);
//     navigate(-1);
//   };
//   const handleCancel = () => {
//     setUserData({});
//     navigate(-1);
//   };
//
//   const handleChange = (e) => {
//     if (e.target.type === "checkbox") {
//       setUserData((prevdata) => ({
//         ...prevdata,
//         active: !prevdata.active,
//       }));
//     } else {
//       setUserData((prevdata) => ({
//         ...prevdata,
//         [e.target.name]: e.target.value,
//       }));
//     }
//   };
//
//   return (
//     <>
//       {isLoading ? (
//         <FetchingPage />
//       ) : (
//         <ActionsPagesContainer
//           title={"Edit user permisions"}
//           subTitle={"Add new coltan entry"}
//           actionsContainer={
//             <AddComponent
//               component={
//                 <div className=" w-full grid grid-cols-1 gap-4">
//                   <div className="w-full grid gap-2 items-center grid-cols-1 sm:grid-cols-6">
//                     <div className="text center sm:col-span-1">
//                       <img
//                         src=""
//                         alt=""
//                         className=" text-3xl bg-origin-border rounded-full h-24 w-24 bg-center bg-no-repeat bg-cover bg-[url('https://img.freepik.com/free-vector/landscape-coal-mining-scene-with-crane-trucks_1308-55217.jpg?w=2000')]"
//                       />
//                     </div>
//                     <div className=" grid grid-cols-1 gap-1 items-end justify-start sm:col-span-5">
//                       {isEdit ? (
//                         <div className=" space-y-2 col-span-full flex flex-col">
//                           <label htmlFor="name" className=" font-semibold pl-2">
//                             Name
//                           </label>
//                           <input
//                             type="text"
//                             name="name"
//                             id="name"
//                             value={userData.name || ""}
//                             autoComplete="off"
//                             className=" p-2 border w-fit rounded-md focus:outline-none"
//                             onChange={handleChange}
//                           />
//                           <label htmlFor="role" className=" font-semibold pl-2">
//                             Role
//                           </label>
//                           <select
//                             value={userData.role || ""}
//                             required
//                             name="role"
//                             id="role"
//                             className="focus:outline-none p-2 border rounded-md w-fit"
//                             onChange={handleChange}
//                           >
//                             <option value="ceo">CEO</option>
//                             <option value="managingDirector">
//                               Managing director office
//                             </option>
//                             <option value="operationsManager">
//                               Operations manager office
//                             </option>
//                             <option value="accountant">
//                               Accountancy office
//                             </option>
//                             <option value="traceabilityOfficer">
//                               Traceability office
//                             </option>
//                             <option value="laboratoryOfficer">Laboratory Officer</option>
//                             <option value="storekeeper">Storekeeper</option>
//                           </select>
//                           <label
//                             htmlFor={`check${userData._id}`}
//                             className={`bg-gray-100 px-1 py-1 rounded-full flex flex-col justify-center w-12 ${
//                               userData.active === true
//                                 ? "items-end"
//                                 : "items-start"
//                             }`}
//                           >
//                             <input
//                               type="checkbox"
//                               name=""
//                               id={`check${userData._id}`}
//                               className=" sr-only peer"
//                               onChange={handleChange}
//                             />
//
//                             <motion.div
//                               className={`rounded-full p-[7.8px]  ${
//                                 userData.active === true
//                                   ? "bg-orange-400"
//                                   : " bg-slate-400"
//                               }`}
//                             ></motion.div>
//                           </label>
//                         </div>
//                       ) : (
//                         <span className="items-center">
//                           <p className="text-xl font-semibold ">
//                             {userData.name}
//                           </p>
//                           <p className="text-md">{userData.role}</p>
//                           <p className="">
//                             {userData.active ? "Active" : "Suspended"}
//                           </p>
//                         </span>
//                       )}
//                       <span
//                       className=" justify-self-end text-black text-2xl"
//                       onClick={() => {
//                         setIsEdit(!isEdit);
//                       }}
//                     >
//                       <BiEditAlt />
//                     </span>
//                     </div>
//                   </div>
//
//                   <div>
//                     {Object.keys(permissions).map((category, index) => (
//                       <div
//                         key={category}
//                         className="w-full grid grid-cols-1 lg:grid-cols-12 items-center"
//                       >
//                         <div
//                           className={` col-span-1 lg:col-span-4 sm:border-0 lg:border-b-0 p-2 lg:border lg:border-r-0 bg-slate-300 ${
//                             index === Object.keys(permissions).length - 1
//                               ? "lg:border-b"
//                               : "lg:border-b-0"
//                           }`}
//                         >
//                           <p className=" font-semibold b md:text-base md:font-normal">
//                             {toInitialCase(category)}
//                           </p>
//                         </div>
//                         <ul
//                           className={`col-span-1 lg:col-span-8 sm:flex sm:justify-between sm:items-center py-2 px-6 md:border-0 lg:border ${
//                             index === Object.keys(permissions).length - 1
//                               ? "lg:border-b"
//                               : "lg:border-b-0"
//                           }`}
//                         >
//                           {Object.keys(permissions[category]).map((action) => (
//                             <li
//                               key={action}
//                               className="flex items-center gap-2 justify-start "
//                             >
//                               <input
//                                 type="checkbox"
//                                 id={`${category}-${action}`}
//                                 name={`${category}-${action}`}
//                                 value={`${category}-${action}`}
//                                 className=""
//                                 checked={permissions[category][action]}
//                                 onChange={() =>
//                                   handlePermissionChange(category, action)
//                                 }
//                               />
//                               <label htmlFor={`${category}-${action}`}>
//                                 {action}
//                               </label>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               }
//               Add={handleSubmit}
//               Cancel={handleCancel}
//               isloading={isSending}
//             />
//           }
//         />
//       )}
//     </>
//   );
// };
// export default UserPermissionPage;


// import React, {useEffect, useState} from "react";
// import {motion} from "framer-motion";
// import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
// import AddComponent from "../../components/Actions components/AddComponent";
// import {useGetOneUserQuery, useUpdateUserMutation} from "@/states/apislice.js";
// import {BiEditAlt} from "react-icons/bi";
// import {useNavigate, useParams} from "react-router-dom";
// import FetchingPage from "../FetchingPage";
// import {toInitialCase} from "@/components/helperFunctions.js";
// import {Check, Plus, X} from "lucide-react";
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle
// } from "@/components/ui/card";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import {Button} from "@/components/ui/button";
// import {Badge} from "@/components/ui/badge";
// import {Switch} from "@/components/ui/switch";
// import {Label} from "@/components/ui/label";
// import {Input} from "@/components/ui/input";
// import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import {useToast} from "@/hooks/use-toast.js";
//
// const UserPermissionPage = () => {
//     const {userId} = useParams();
//     const navigate = useNavigate();
//     const {toast} = useToast();
//     const [isEdit, setIsEdit] = useState(false);
//     const [userData, setUserData] = useState({name: "", role: "", active: null});
//     const [permissions, setPermissions] = useState({});
//     const [editedPermissions, setEditedPermissions] = useState({});
//     const [selectedCategory, setSelectedCategory] = useState("");
//     const [selectedAction, setSelectedAction] = useState("");
//     const [isAddingPermission, setIsAddingPermission] = useState(false);
//     const [activeTab, setActiveTab] = useState("general");
//     const [permissionGroups, setPermissionGroups] = useState([]);
//
//     // Define roles for the dropdown
//     const roles = [
//         {value: "ceo", label: "CEO"},
//         {value: "managingDirector", label: "Managing Director Office"},
//         {value: "operationsManager", label: "Operations Manager Office"},
//         {value: "accountant", label: "Accountancy Office"},
//         {value: "traceabilityOfficer", label: "Traceability Office"},
//         {value: "laboratoryOfficer", label: "Laboratory Officer"},
//         {value: "storekeeper", label: "Storekeeper"},
//     ];
//
//     const {data, isLoading, isSuccess, isError, error} = useGetOneUserQuery(
//         userId,
//         {
//             refetchOnMountOrArgChange: true,
//             refetchOnReconnect: true,
//         }
//     );
//
//     const [
//         updateUser,
//         {
//             isLoading: isSending,
//             isSuccess: isDone,
//             isError: isProblem,
//             error: problem,
//         },
//     ] = useUpdateUserMutation();
//
//     useEffect(() => {
//         if (isDone) {
//             toast({
//                 title: "Success",
//                 description: "User updated successfully",
//                 variant: "default",
//             });
//             navigate("/users");
//         } else if (isProblem) {
//             const {message: errorMessage} = problem.data;
//             toast({
//                 title: "Error",
//                 description: errorMessage,
//                 variant: "destructive",
//             });
//         }
//     }, [isDone, isProblem, problem, toast, navigate]);
//
//     useEffect(() => {
//         if (isSuccess) {
//             const {user} = data.data;
//             const {permissions} = data.data.user;
//             setUserData(prevState => ({...prevState, name: user.name, role: user.role, active: user.active}));
//             setPermissions(permissions);
//             setEditedPermissions(permissions);
//
//             // Group permissions into categories for tabs
//             const groups = Object.keys(permissions).reduce((acc, key) => {
//                 // Group permissions into logical categories
//                 if (key.includes("Tags") || key.includes("tags")) {
//                     acc["tags"] = [...(acc["tags"] || []), key];
//                 } else if (key.includes("Price") || key.includes("price") || key.includes("USD") || key.includes("RWF") || key.includes("fees") || key.includes("Fee")) {
//                     acc["finance"] = [...(acc["finance"] || []), key];
//                 } else if (key.includes("shipment") || key.includes("entry") || key.includes("mineral") || key.includes("Grade") || key.includes("iron") || key.includes("tantal") || key.includes("niobium")) {
//                     acc["minerals"] = [...(acc["minerals"] || []), key];
//                 } else if (key.includes("user") || key.includes("settings") || key.includes("comment")) {
//                     acc["management"] = [...(acc["management"] || []), key];
//                 } else {
//                     acc["general"] = [...(acc["general"] || []), key];
//                 }
//                 return acc;
//             }, {});
//
//             setPermissionGroups(groups);
//
//             // Set initial tab to first available group
//             if (Object.keys(groups).length > 0) {
//                 setActiveTab(Object.keys(groups)[0]);
//             }
//         }
//     }, [isSuccess, data]);
//
//     const handlePermissionChange = (category, action) => {
//         setEditedPermissions((prevPermissions) => {
//             const updatedPermissions = {...prevPermissions};
//             updatedPermissions[category] = {...updatedPermissions[category]};
//             updatedPermissions[category][action] = !updatedPermissions[category][action];
//             return updatedPermissions;
//         });
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const body = {permissions: editedPermissions, ...userData};
//         await updateUser({body, userId});
//         setIsEdit(false);
//     };
//
//     const handleCancel = () => {
//         setEditedPermissions(permissions);
//         setIsEdit(false);
//         navigate(-1);
//     };
//
//     const handleChange = (field, value) => {
//         if (field === "active") {
//             setUserData((prevData) => ({
//                 ...prevData,
//                 active: value,
//             }));
//         } else {
//             setUserData((prevData) => ({
//                 ...prevData,
//                 [field]: value,
//             }));
//         }
//     };
//
//     const getAvailableActions = (category) => {
//         if (!editedPermissions[category]) return [];
//         return Object.keys(editedPermissions[category]);
//     };
//
//     const getAvailableCategories = () => {
//         return Object.keys(editedPermissions);
//     };
//
//     const handleAddPermission = () => {
//         if (!selectedCategory || !selectedAction) return;
//
//         setEditedPermissions((prev) => {
//             const updated = {...prev};
//             if (!updated[selectedCategory]) {
//                 updated[selectedCategory] = {};
//             }
//             updated[selectedCategory][selectedAction] = true;
//             return updated;
//         });
//
//         setSelectedAction("");
//         setIsAddingPermission(false);
//     };
//
//     if (isLoading) return <FetchingPage/>;
//
//     return (
//         <>
//             <ActionsPagesContainer
//                 title={"Edit User Permissions"}
//                 subTitle={"Manage user access rights"}
//                 actionsContainer={
//                     <AddComponent
//                         component={
//                             <div className="w-full grid grid-cols-1 gap-6">
//                                 {/* User Profile Card */}
//                                 <Card>
//                                     <CardHeader className="pb-2">
//                                         <CardTitle>User Profile</CardTitle>
//                                         <CardDescription>Edit user information and status</CardDescription>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <div className="flex flex-col md:flex-row gap-4 items-start">
//                                             <div className="text-center">
//                                                 <div className="rounded-full h-24 w-24 bg-center bg-no-repeat bg-cover bg-slate-200 mb-2"></div>
//                                                 <div className="flex items-center justify-center">
//                                                     <Label htmlFor="user-active" className="mr-2">Status</Label>
//                                                     <Switch
//                                                         id="user-active"
//                                                         checked={userData.active || false}
//                                                         onCheckedChange={(checked) => handleChange("active", checked)}
//                                                         disabled={!isEdit}
//                                                     />
//                                                     <span className="ml-2 text-sm text-muted-foreground">
//                           {userData.active ? "Active" : "Suspended"}
//                         </span>
//                                                 </div>
//                                             </div>
//
//                                             <div className="flex-1 space-y-4">
//                                                 <div className="flex justify-between items-center">
//                                                     {isEdit ? (
//                                                         <div className="space-y-4 w-full">
//                                                             <div>
//                                                                 <Label htmlFor="name">Name</Label>
//                                                                 <Input
//                                                                     id="name"
//                                                                     value={userData.name || ""}
//                                                                     onChange={(e) => handleChange("name", e.target.value)}
//                                                                     className="mt-1"
//                                                                 />
//                                                             </div>
//                                                             <div>
//                                                                 <Label htmlFor="role">Role</Label>
//                                                                 <Select
//                                                                     value={userData.role || ""}
//                                                                     onValueChange={(value) => handleChange("role", value)}
//                                                                 >
//                                                                     <SelectTrigger className="mt-1">
//                                                                         <SelectValue placeholder="Select a role" />
//                                                                     </SelectTrigger>
//                                                                     <SelectContent>
//                                                                         {roles.map((role) => (
//                                                                             <SelectItem key={role.value} value={role.value}>
//                                                                                 {role.label}
//                                                                             </SelectItem>
//                                                                         ))}
//                                                                     </SelectContent>
//                                                                 </Select>
//                                                             </div>
//                                                         </div>
//                                                     ) : (
//                                                         <div className="space-y-1">
//                                                             <h3 className="text-xl font-semibold">{userData.name}</h3>
//                                                             <p className="text-muted-foreground">{toInitialCase(userData.role || "")}</p>
//                                                         </div>
//                                                     )}
//                                                     <Button
//                                                         variant="ghost"
//                                                         size="icon"
//                                                         onClick={() => setIsEdit(!isEdit)}
//                                                         className="ml-auto"
//                                                     >
//                                                         <BiEditAlt className="h-5 w-5" />
//                                                     </Button>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </CardContent>
//                                 </Card>
//
//                                 {/* Permissions Section */}
//                                 <Card>
//                                     <CardHeader className="pb-2">
//                                         <div className="flex justify-between items-center">
//                                             <div>
//                                                 <CardTitle>Permissions</CardTitle>
//                                                 <CardDescription>Manage user access permissions</CardDescription>
//                                             </div>
//                                             {isEdit && (
//                                                 <Button
//                                                     size="sm"
//                                                     onClick={() => setIsAddingPermission(true)}
//                                                 >
//                                                     <Plus className="h-4 w-4 mr-2" /> Add Permission
//                                                 </Button>
//                                             )}
//                                         </div>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//                                             <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
//                                                 {Object.keys(permissionGroups || {}).map((group) => (
//                                                     <TabsTrigger key={group} value={group} className="capitalize">
//                                                         {group}
//                                                     </TabsTrigger>
//                                                 ))}
//                                             </TabsList>
//
//                                             {Object.keys(permissionGroups || {}).map((group) => (
//                                                 <TabsContent key={group} value={group} className="space-y-4">
//                                                     {(permissionGroups[group] || []).map((category) => (
//                                                         <Card key={category} className="overflow-hidden">
//                                                             <CardHeader className="bg-secondary/50 py-2">
//                                                                 <CardTitle className="text-base font-medium capitalize">
//                                                                     {toInitialCase(category)}
//                                                                 </CardTitle>
//                                                             </CardHeader>
//                                                             <CardContent className="pt-4">
//                                                                 <div className="flex flex-wrap gap-2">
//                                                                     {editedPermissions[category] && Object.keys(editedPermissions[category]).map((action) => (
//                                                                         <Badge
//                                                                             key={`${category}-${action}`}
//                                                                             variant={editedPermissions[category][action] ? "default" : "outline"}
//                                                                             className="flex items-center gap-1"
//                                                                         >
//                                                                             <span>{action}</span>
//                                                                             {isEdit && (
//                                                                                 <button
//                                                                                     onClick={() => handlePermissionChange(category, action)}
//                                                                                     className="ml-1 p-0.5 rounded-full hover:bg-primary-foreground"
//                                                                                 >
//                                                                                     {editedPermissions[category][action] ? (
//                                                                                         <Check className="h-3 w-3" />
//                                                                                     ) : (
//                                                                                         <X className="h-3 w-3" />
//                                                                                     )}
//                                                                                 </button>
//                                                                             )}
//                                                                         </Badge>
//                                                                     ))}
//                                                                 </div>
//                                                             </CardContent>
//                                                         </Card>
//                                                     ))}
//                                                 </TabsContent>
//                                             ))}
//                                         </Tabs>
//                                     </CardContent>
//                                 </Card>
//                             </div>
//                         }
//                         Add={handleSubmit}
//                         Cancel={handleCancel}
//                         isloading={isSending}
//                     />
//                 }
//             />
//
//             {/* Add Permission Dialog */}
//             <AlertDialog open={isAddingPermission} onOpenChange={setIsAddingPermission}>
//                 <AlertDialogContent>
//                     <AlertDialogHeader>
//                         <AlertDialogTitle>Add Permission</AlertDialogTitle>
//                         <AlertDialogDescription>
//                             Select a category and permission to add.
//                         </AlertDialogDescription>
//                     </AlertDialogHeader>
//
//                     <div className="grid gap-4 py-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="category">Category</Label>
//                             <Select
//                                 value={selectedCategory}
//                                 onValueChange={setSelectedCategory}
//                             >
//                                 <SelectTrigger id="category">
//                                     <SelectValue placeholder="Select a category" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {getAvailableCategories().map((category) => (
//                                         <SelectItem key={category} value={category}>
//                                             {toInitialCase(category)}
//                                         </SelectItem>
//                                     ))}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//
//                         <div className="space-y-2">
//                             <Label htmlFor="action">Action</Label>
//                             <Select
//                                 value={selectedAction}
//                                 onValueChange={setSelectedAction}
//                                 disabled={!selectedCategory}
//                             >
//                                 <SelectTrigger id="action">
//                                     <SelectValue placeholder="Select an action" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     {selectedCategory &&
//                                         getAvailableActions(selectedCategory).map((action) => (
//                                             <SelectItem key={action} value={action}>
//                                                 {action}
//                                             </SelectItem>
//                                         ))
//                                     }
//                                 </SelectContent>
//                             </Select>
//                         </div>
//                     </div>
//
//                     <AlertDialogFooter>
//                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                         <AlertDialogAction onClick={handleAddPermission}>Add</AlertDialogAction>
//                     </AlertDialogFooter>
//                 </AlertDialogContent>
//             </AlertDialog>
//         </>
//     );
// };
//
// export default UserPermissionPage;


import React, { useEffect, useState } from "react";
import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../components/Actions components/AddComponent";
import { useGetOneUserQuery, useUpdateUserMutation } from "@/states/apislice.js";
import { BiEditAlt } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import FetchingPage from "../FetchingPage";
import { toInitialCase } from "@/components/helperFunctions.js";
import { Check, Plus, X } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {useToast} from '@/hooks/use-toast.js'

const UserPermissionPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isEdit, setIsEdit] = useState(false);
    const [userData, setUserData] = useState({ name: "", role: "", active: null });
    const [permissions, setPermissions] = useState({});
    const [editedPermissions, setEditedPermissions] = useState({});
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedAction, setSelectedAction] = useState("");
    const [isAddingPermission, setIsAddingPermission] = useState(false);
    const [activeTab, setActiveTab] = useState("general");
    const [permissionGroups, setPermissionGroups] = useState([]);

    // Define roles for the dropdown
    const roles = [
        { value: "ceo", label: "CEO" },
        { value: "managingDirector", label: "Managing Director Office" },
        { value: "operationsManager", label: "Operations Manager Office" },
        { value: "accountant", label: "Accountancy Office" },
        { value: "traceabilityOfficer", label: "Traceability Office" },
        { value: "dueDiligenceOfficer", label: "Due Diligence Officer" },
        { value: "laboratoryOfficer", label: "Laboratory Officer" },
        { value: "storekeeper", label: "Storekeeper" },
    ];

    const { data, isLoading, isSuccess, isError, error } = useGetOneUserQuery(
        userId,
        {
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
        }
    );

    const [
        updateUser,
        {
            isLoading: isSending,
            isSuccess: isDone,
            isError: isProblem,
            error: problem,
        },
    ] = useUpdateUserMutation();

    useEffect(() => {
        if (isDone) {
            toast({
                title: "Success",
                description: "User updated successfully",
                variant: "default",
            });
            navigate("/users");
        } else if (isProblem) {
            const { message: errorMessage } = problem.data;
            toast({
                title: "Error",
                description: errorMessage,
                variant: "destructive",
            });
        }
    }, [isDone, isProblem, problem, toast, navigate]);

    useEffect(() => {
        if (isSuccess) {
            const { user } = data.data;
            const { permissions } = data.data.user;
            setUserData(prevState => ({...prevState, name: user.name, role: user.role, active: user.active}));
            setPermissions(permissions);
            setEditedPermissions(permissions);

            // Group permissions into categories for tabs
            const groups = Object.keys(permissions).reduce((acc, key) => {
                // Group permissions into logical categories
                if (key.includes("Tags") || key.includes("tags")) {
                    acc["tags"] = [...(acc["tags"] || []), key];
                } else if (key.includes("Price") || key.includes("price") || key.includes("USD") || key.includes("RWF") || key.includes("fees") || key.includes("Fee")) {
                    acc["finance"] = [...(acc["finance"] || []), key];
                } else if (key.includes("shipment") || key.includes("entry") || key.includes("mineral") || key.includes("Grade") || key.includes("iron") || key.includes("tantal") || key.includes("niobium")) {
                    acc["minerals"] = [...(acc["minerals"] || []), key];
                } else if (key.includes("user") || key.includes("settings") || key.includes("comment")) {
                    acc["management"] = [...(acc["management"] || []), key];
                } else {
                    acc["general"] = [...(acc["general"] || []), key];
                }
                return acc;
            }, {});

            setPermissionGroups(groups);

            // Set initial tab to first available group
            if (Object.keys(groups).length > 0) {
                setActiveTab(Object.keys(groups)[0]);
            }
        }
    }, [isSuccess, data]);

    const handlePermissionChange = (category, action) => {
        setEditedPermissions((prevPermissions) => {
            const updatedPermissions = { ...prevPermissions };
            updatedPermissions[category] = { ...updatedPermissions[category] };
            updatedPermissions[category][action] = !updatedPermissions[category][action];
            return updatedPermissions;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = { permissions: editedPermissions, ...userData };
        await updateUser({ body, userId });
        setIsEdit(false);
    };

    const handleCancel = () => {
        setEditedPermissions(permissions);
        setUserData(prevState => ({
            name: data?.data?.user?.name || prevState.name,
            role: data?.data?.user?.role || prevState.role,
            active: data?.data?.user?.active || prevState.active
        }));
        setIsEdit(false);
    };

    const handleChange = (field, value) => {
        if (field === "active") {
            setUserData((prevData) => ({
                ...prevData,
                active: value,
            }));
        } else {
            setUserData((prevData) => ({
                ...prevData,
                [field]: value,
            }));
        }
    };

    const getAvailableActions = (category) => {
        if (!editedPermissions[category]) return [];
        return Object.keys(editedPermissions[category]);
    };

    const getAvailableCategories = () => {
        return Object.keys(editedPermissions);
    };

    const handleAddPermission = () => {
        if (!selectedCategory || !selectedAction) return;

        setEditedPermissions((prev) => {
            const updated = { ...prev };
            if (!updated[selectedCategory]) {
                updated[selectedCategory] = {};
            }
            updated[selectedCategory][selectedAction] = true;
            return updated;
        });

        setSelectedAction("");
        setIsAddingPermission(false);
    };

    // Function to toggle edit mode
    const toggleEditMode = (e) => {
        e.stopPropagation(); // Prevent event bubbling

        if (!isEdit) {
            // Entering edit mode - make a copy of current data
            setEditedPermissions({...permissions});
        } else {
            // Exiting edit mode without saving - restore original data
            handleCancel();
        }

        setIsEdit(!isEdit);
    };

    if (isLoading) return <FetchingPage />;

    // Construct the content for the AddComponent
    const contentComponent = (
        <div className="w-full grid grid-cols-1 gap-6">
            {/* User Profile Card */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle>User Profile</CardTitle>
                    <CardDescription>Edit user information and status</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                        <div className="text-center">
                            <div className="rounded-full h-24 w-24 bg-center bg-no-repeat bg-cover bg-slate-200 mb-2"></div>
                            <div className="flex items-center justify-center">
                                <Label htmlFor="user-active" className="mr-2">Status</Label>
                                <Switch
                                    id="user-active"
                                    checked={userData.active || false}
                                    onCheckedChange={(checked) => handleChange("active", checked)}
                                    disabled={!isEdit}
                                />
                                <span className="ml-2 text-sm text-muted-foreground">
                  {userData.active ? "Active" : "Suspended"}
                </span>
                            </div>
                        </div>

                        <div className="flex-1 space-y-4">
                            <div className="flex justify-between items-center">
                                {isEdit ? (
                                    <div className="space-y-4 w-full">
                                        <div>
                                            <Label htmlFor="name">Name</Label>
                                            <Input
                                                id="name"
                                                value={userData.name || ""}
                                                onChange={(e) => handleChange("name", e.target.value)}
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="role">Role</Label>
                                            <Select
                                                value={userData.role || ""}
                                                onValueChange={(value) => handleChange("role", value)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {roles.map((role) => (
                                                        <SelectItem key={role.value} value={role.value}>
                                                            {role.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-semibold">{userData.name}</h3>
                                        <p className="text-muted-foreground">{toInitialCase(userData.role || "")}</p>
                                    </div>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={toggleEditMode}
                                    className="ml-auto"
                                    type="button"
                                >
                                    <BiEditAlt className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Permissions Section */}
            <Card>
                <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Permissions</CardTitle>
                            <CardDescription>Manage user access permissions</CardDescription>
                        </div>
                        {/*{isEdit && (*/}
                        {/*    <Button*/}
                        {/*        size="sm"*/}
                        {/*        onClick={() => setIsAddingPermission(true)}*/}
                        {/*        type="button" // Explicitly set to button to prevent form submission*/}
                        {/*    >*/}
                        {/*        <Plus className="h-4 w-4 mr-2" /> Add Permission*/}
                        {/*    </Button>*/}
                        {/*)}*/}
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-4">
                            {Object.keys(permissionGroups || {}).map((group) => (
                                <TabsTrigger key={group} value={group} className="capitalize">
                                    {group}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        {Object.keys(permissionGroups || {}).map((group) => (
                            <TabsContent key={group} value={group} className="space-y-4">
                                {(permissionGroups[group] || []).map((category) => (
                                    <Card key={category} className="overflow-hidden">
                                        <CardHeader className="bg-secondary/50 py-2">
                                            <CardTitle className="text-base font-medium capitalize">
                                                {toInitialCase(category)}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="pt-4">
                                            <div className="flex flex-wrap gap-2">
                                                {editedPermissions[category] && Object.keys(editedPermissions[category]).map((action) => (
                                                    <Badge
                                                        key={`${category}-${action}`}
                                                        variant={editedPermissions[category][action] ? "default" : "outline"}
                                                        className="flex items-center gap-1"
                                                    >
                                                        <span>{action}</span>
                                                        {isEdit && (
                                                            <button
                                                                onClick={() => handlePermissionChange(category, action)}
                                                                className="ml-1 p-0.5 rounded-full hover:bg-blue-900"
                                                                type="button" // Explicitly set to button to prevent form submission
                                                            >
                                                                {editedPermissions[category][action] ? (
                                                                    <Check className="h-15 w-15" />
                                                                ) : (
                                                                    <X className="h-15 w-15" />
                                                                )}
                                                            </button>
                                                        )}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>
                        ))}
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <>
            <ActionsPagesContainer
                title={"Edit User Permissions"}
                subTitle={"Manage user access rights"}
                actionsContainer={
                    <AddComponent
                        component={contentComponent}
                        Add={handleSubmit}
                        Cancel={handleCancel}
                        isloading={isSending}
                        // Only show the action buttons if in edit mode
                        hideActions={!isEdit}
                    />
                }
            />

            {/* Add Permission Dialog */}
            <AlertDialog open={isAddingPermission} onOpenChange={setIsAddingPermission}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Add Permission</AlertDialogTitle>
                        <AlertDialogDescription>
                            Select a category and permission to add.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                value={selectedCategory}
                                onValueChange={setSelectedCategory}
                            >
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {getAvailableCategories().map((category) => (
                                        <SelectItem key={category} value={category}>
                                            {toInitialCase(category)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="action">Action</Label>
                            <Select
                                value={selectedAction}
                                onValueChange={setSelectedAction}
                                disabled={!selectedCategory}
                            >
                                <SelectTrigger id="action">
                                    <SelectValue placeholder="Select an action" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedCategory &&
                                        getAvailableActions(selectedCategory).map((action) => (
                                            <SelectItem key={action} value={action}>
                                                {action}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleAddPermission}>Add</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default UserPermissionPage;
