import React, { useState } from "react";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../components/Actions components/AddComponent";
import {BiEditAlt} from "react-icons/bi";
import { useSelector } from "react-redux";

const UsePermissionPage = () => {
  const store = useSelector(state => {
      console.log(state.global);
  })
  const[isEdit,setIsEdit]=useState(false);
  const[userData,setUserData]=useState({});

  const initialPermissions = {
    entry: {
      view: true,
      create: true,
      edit: true,
      delete: false
    },
    suppliers: {
      view: true,
      create: true,
      edit: true,
      delete: false
    },
    buyers: {
      view: false,
      create: false,
      edit: false,
      delete: true
    },
    payments: {
      view: false,
      create: false,
      edit: false,
      delete: false
    },
    shipments: {
      view: false,
      create: false,
      edit: false,
      delete: false
    }
  }

  const [permissions, setPermissions] = useState(initialPermissions);

  const handlePermissionChange = (category, action) => {
    // Create a copy of the current permissions state
    const updatedPermissions = { ...permissions };

    // Toggle the action (e.g., view, create, edit, delete)
    updatedPermissions[category][action] = !permissions[category][action];

    // Update the state with the new permissions
    setPermissions(updatedPermissions);
    console.log(permissions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
      console.log(permissions);
  }
  const handleCancel = () => {

  }

  const handleChange=()=>{

  }



  return (
    <>
      <ActionsPagesContainer
        title={"Edit user permisions"}
        subTitle={"Add new coltan entry"}
        actionsContainer={
          <AddComponent
            component={
              <div className=" w-full grid grid-cols-1 gap-4">
                <div className="w-full grid gap-2 items-center grid-cols-1 sm:grid-cols-6">
                    <div className="text center sm:col-span-1">
                        <img src="" alt="" className=" text-3xl bg-origin-border rounded-full h-24 w-24 bg-center bg-no-repeat bg-cover bg-[url('https://img.freepik.com/free-vector/landscape-coal-mining-scene-with-crane-trucks_1308-55217.jpg?w=2000')]" />
                    </div>
                    <div className=" grid grid-cols-1 gap-1 items-end justify-start sm:col-span-5">
                       {isEdit? (<>
                        <label htmlFor="name" className=" font-semibold pl-2">Name</label>
                       <input type="text" name="name" id="name" autoComplete="off" className=" p-2 border w-fit rounded-md focus:outline-none"  value={"wee"} onChange={()=>console.log("welee")}/>
                       <label htmlFor="role" className=" font-semibold pl-2">Role</label>
                       <input type="text" name="role" id="role" autoComplete="off" className=" p-2 border w-fit rounded-md focus:outline-none"  value={"storekeeper"} onChange={()=>console.log("welee")}/>
                       </>):(
                       <span className="items-center">
                        <p className="text-xl ">Kubwimana Evrald</p>
                        <p className="text-lg font-semibold">storekeeper</p>
                        </span>)}
                        <span className=" justify-self-end text-black text-2xl"  onClick={()=>{setIsEdit(!isEdit)}}>
                          <BiEditAlt/>
                        </span>
                    </div>
                </div>

                <div>
                  {Object.keys(permissions).map((category,index) => (
                      <div key={category} className="w-full grid grid-cols-1 lg:grid-cols-12 items-center">
                        <div className={` col-span-1 lg:col-span-4 sm:border-0 md:border-b-0 p-2 md:border md:border-r-0 bg-slate-300 ${index === Object.keys(permissions).length - 1 ? 'md:border-b' : 'md:border-b-0'}`}>
                          <p className=" font-semibold b md:text-base md:font-normal">{category} Management</p>
                        </div>
                        <ul className={`col-span-1 lg:col-span-8 sm:flex sm:justify-between sm:items-center py-2 px-6 sm:border-0 md:border ${index === Object.keys(permissions).length - 1 ? 'md:border-b' : 'md:border-b-0'}`}>
                          {Object.keys(permissions[category]).map((action) => (
                              <li key={action} className="flex items-center gap-2 justify-start ">
                                <input
                                    type="checkbox"
                                    id={`${category}-${action}`}
                                    name={`${category}-${action}`}
                                    value={`${category}-${action}`}
                                    className=""
                                    checked={permissions[category][action]}
                                    onChange={() => handlePermissionChange(category, action)}
                                />
                                <label htmlFor={`${category}-${action}`}>{action}</label>
                              </li>
                          ))}
                        </ul>
                      </div>
                  ))}
                </div>

              </div>
            }
            Add={handleSubmit}
            // Cancel={}
            // isloading={}
          />
        }

      />
    </>
  );
}
export default UsePermissionPage;
