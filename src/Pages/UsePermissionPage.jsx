import React, { useState } from "react";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../components/Actions components/AddComponent";
import {BiEditAlt} from "react-icons/bi";

const UsePermissionPage = () => {
  const[isEdit,setIsEdit]=useState(false);
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
                    <div className=" grid grid-cols-1 gap-2 items-start justify-start sm:col-span-5">
                       {isEdit? (<>
                        <label className=" font-semibold pl-2">Name</label>
                       <input type="text" name="" id="" className=" p-2 border w-fit rounded-md focus:outline-none"  value={"wee"}/>
                       <label className=" font-semibold pl-2">Role</label>
                       <input type="text" name="" id="" className=" p-2 border w-fit rounded-md focus:outline-none"  value={"storekeeper"}/>
                       </>):(<>
                        <p className="text-xl font-bold">wee</p>
                        <p className="text-lg font-semibold">storekeeper</p></>)}
                        <span className=" justify-self-end text-black text-2xl"  onClick={()=>{setIsEdit(!isEdit)}}>
                          <BiEditAlt/>
                        </span>
                    </div>
                </div>
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-center">

                  <div className=" col-span-1 lg:col-span-4 md:border p-2">
                    <p>Users management</p>
                  </div>
                  <ul className=" col-span-1 lg:col-span-8 md:border sm:flex sm:justify-between sm:items-center py-2 px-6">
                    <li className="flex items-center gap-2 justify-start">
                      <input
                        type="checkbox"
                        id="view"
                        name=""
                        value=""
                        className=""
                      />
                      <label for="view"> view</label>
                    </li>
                    <li className="flex items-center gap-2 justify-start">
                      <input
                        type="checkbox"
                        id="create"
                        name=""
                        value=""
                        className=""
                      />
                      <label for="create"> Create</label>
                    </li>
                    <li className="flex items-center gap-2 justify-start">
                      <input
                        type="checkbox"
                        id="edit"
                        name=""
                        value=""
                        className=""
                      />
                      <label for="edit"> Edit</label>
                    </li>
                    <li className="flex items-center gap-2 justify-start w-fit">
                      <input
                        type="checkbox"
                        id="viewAllRecords"
                        name=""
                        value=""
                        className=""
                      />
                      <label for="viewAllRecords"> View all records</label>
                    </li>
                  </ul>
                  {/* *** */}
                  <div className=" col-span-1 lg:col-span-4 md:border p-2">
                    <p>Users management</p>
                  </div>
                  <ul className=" col-span-1 lg:col-span-8 md:border sm:flex sm:justify-between sm:items-center py-2 px-6">
                    <li className="flex items-center gap-2 justify-start">
                      <input
                        type="checkbox"
                        id="view"
                        name=""
                        value=""
                        className=""
                      />
                      <label for="view"> view</label>
                    </li>
                    <li className="flex items-center gap-2 justify-start">
                      <input
                        type="checkbox"
                        id="create"
                        name=""
                        value=""
                        className=""
                      />
                      <label for="create"> Create</label>
                    </li>
                    <li className="flex items-center gap-2 justify-start">
                      <input
                        type="checkbox"
                        id="edit"
                        name=""
                        value=""
                        className=""
                      />
                      <label for="edit"> Edit</label>
                    </li>
                    <li className="flex items-center gap-2 justify-start w-fit">
                      <input
                        type="checkbox"
                        id="viewAllRecords"
                        name=""
                        value=""
                        className=""
                      />
                      <label for="viewAllRecords"> View all records</label>
                    </li>
                  </ul>
                  {/* *** */}
                  <div className=" col-span-1 lg:col-span-4 md:border p-2">
                    <p>Users management</p>
                  </div>
                  <ul className=" col-span-1 lg:col-span-8 md:border sm:flex sm:justify-between sm:items-center py-2 px-6">
                    <li className="flex items-center gap-2 justify-start">
                      <input
                        type="checkbox"
                        id="view"
                        name=""
                        value=""
                        className=""
                      />
                      <label for="view"> view</label>
                    </li>
                    <li className="flex items-center gap-2 justify-start">
                      <input
                        type="checkbox"
                        id="create"
                        name=""
                        value=""
                        className=""
                      />
                      <label for="create"> Create</label>
                    </li>
                    <li className="flex items-center gap-2 justify-start">
                      <input
                        type="checkbox"
                        id="edit"
                        name=""
                        value=""
                        className=""
                      />
                      <label for="edit"> Edit</label>
                    </li>
                    <li className="flex items-center gap-2 justify-start w-fit">
                      <input
                        type="checkbox"
                        id="viewAllRecords"
                        name=""
                        value=""
                        className=""
                      />
                      <label for="viewAllRecords"> View all records</label>
                    </li>
                  </ul>
                  {/* *** */}

                </div>
              </div>
            }
          />
        }
      />
    </>
  );
};
export default UsePermissionPage;
