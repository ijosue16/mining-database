import React from "react";
import {useSelector} from "react-redux";
import {Route, Navigate} from "react-router-dom";
import {hasPermission} from "../components/helperFunctions.js";

const RoleBasedRoute = ({element, roles, permissionKey}) => {
    const {userData, token} = useSelector(state => state.persistedReducer.global);
    const {permissions} = userData;
    // const role=useSelector((state)=>state.global.role)
    // Check if the user's role is allowed to access the route
    // const isRoleAllowed = roles.includes(role);

    if (!token) {
        return <Navigate to="/login"/>;
    }
    const isAllowed = permissionKey ? hasPermission(permissions, permissionKey) : false;
    return isAllowed ? (
        <>{element}</>
    ) : (
        <Navigate to="/permissions-denied" replace/>
    );
};

export default RoleBasedRoute;