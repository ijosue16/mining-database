import React from "react";
import { useSelector } from "react-redux";
import { Route, Navigate } from "react-router-dom";

const RoleBasedRoute = ({ element, roles }) => {
    const accessibility = useSelector((state) => state.global.userData);
    const role=useSelector((state)=>state.global.role)
    console.log(accessibility.fullName)
    console.log(role)
  
    // Check if the user's role is allowed to access the route
    const isRoleAllowed = roles.includes(role);
  
    return isRoleAllowed ? (
      <>{element}</>
    ) : (
      <Navigate to="*" replace />
    );
  };

  export default RoleBasedRoute;