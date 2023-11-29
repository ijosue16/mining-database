import React, { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { IoFilterOutline } from "react-icons/io5";
import { Avatar, message } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useCreateChatMutation, useGetAllUsersQuery } from "../../states/apislice";
import { current } from "@reduxjs/toolkit";
import { positions } from "slate";
import { Skeleton } from "antd";
import { useSelector } from "react-redux";

const NewUSerChart = ({ currentUser, visible, position }) => {
  const {userData}=useSelector(state => state.persistedReducer.global);
  const { data, isLoading, isSuccess, isError, error } = useGetAllUsersQuery();
  const [createNewChart,{isLoading:isCreating,isSuccess:isDone,isError:isFail,error:fail}]=useCreateChatMutation();
  // senderId,receiverId
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    if (isSuccess) {
      const { users } = data.data;
      const filterUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchInput.toLowerCase())
      );
      setFilteredUsers(filterUsers);
    }
  }, [isSuccess, data, searchInput]);

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };
  const handleNewChartUser =async(id)=>{
    const body={senderId:userData._id,receiverId:id};
    await createNewChart({body});
    console.log(body);

  };


  return (
    <>
      <div
        className={`bg-red-500 rounded-md shadow-lg h-96 max-w-72 absolute ${position} z-50 p-2 space-y-1 ${
          visible ? "block" : "hidden"
        }`}
      >
        <p className=" text-lg font-bold">New Chat</p>
        <input
          type="text"
          name="filteredUser"
          className="w-full px-2 py-1 rounded-md focus:outline-none"
          onChange={handleSearchInputChange}
          value={searchInput}
        />

        <div className=" space-y-2 max-h-[290px] w-full overflow-y-auto">
          <p>all contacts</p>
          {filteredUsers.length > 0 ? (
            filteredUsers.map(({ name, role, _id }) => (
              <div
                key={_id}
                className="flex items-center gap-3"
                onClick={currentUser}
              >
                {isLoading ?(
                  <>
                    <Skeleton.Avatar active size={40} />
                    <Skeleton.Input active />
                  </>
                ): (
                  <div onClick={()=>{handleNewChartUser(_id)}}>
                    <Avatar size={40} icon={<UserOutlined />} />
                    <div
                      className="name flex flex-col"
                      style={{ fontSize: "0.9rem" }}
                    >
                      <span className=" font-bold">{name}</span>
                      <span className="">{role}</span>
                    </div>
                  </div>
                ) }
              </div>
            ))
          ) : (
            <>
                    <Skeleton.Avatar active size={40} />
                    <Skeleton.Input active />
                  </>
          )}
        </div>
      </div>
    </>
  );
};

export default NewUSerChart;
