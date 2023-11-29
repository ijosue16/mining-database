import React from "react";
import { useSelector } from "react-redux";
import { Route, Navigate } from "react-router-dom";

const RoleBasedRoute = ({ element, roles,permissionKey }) => {
  const {userData} = useSelector(state => state.persistedReducer.global);
  const {permissions}=userData;
    // const role=useSelector((state)=>state.global.role)
    console.log(userData)
    // console.log(role)
  
    // Check if the user's role is allowed to access the route
    // const isRoleAllowed = roles.includes(role);
    const hasPermission = permissionKey ? permissions[permissionKey].view : true;
    return hasPermission ? (
      <>{element}</>
    ) : (
      <Navigate to="*" replace />
    );
  };

  export default RoleBasedRoute;