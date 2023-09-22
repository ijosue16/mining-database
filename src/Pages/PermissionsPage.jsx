import React from "react";
import { useSelector } from "react-redux";

const PermissionsPage = () => {

    const existingPermissions = useSelector(state => {
        console.log(state.global.permissions);
    });

    if (existingPermissions) {
        console.log(existingPermissions);
    }



    return (
        <div>
            <p>ASSIGN PERMISSIONS</p>
        </div>
    )
}

export default PermissionsPage;