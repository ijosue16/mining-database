import React from "react";
import UsersListContainer from "../components/Listcomponents/UsersListContainer";

const UsersListPage=()=>{
    return(
        <>
        <UsersListContainer title={'Users list'}
        subTitle={'Manage users'}
        navLinktext={'add/user'}
        navtext={'Add user'}
        table={''}/>
        </>
    )
}
export default UsersListPage;