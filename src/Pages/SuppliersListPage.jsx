import React from "react";
import SuppliersListContainer from "../components/Listcomponents/SuppliersListContainer";

const SuppliersListPage=()=>{
    return (
        <>
        <SuppliersListContainer title={'Suppliers List'}
        subTitle={'Manage your Suppliers'}
        navLinktext={'add/supplier'}
        navtext={'Add supplier'}
        table={''}/>
        </>
    )
}
export default SuppliersListPage;