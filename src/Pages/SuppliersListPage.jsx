import React from "react";
import SuppliersListContainer from "../components/Listcomponents/SuppliersListContainer";
import { useGetAllSuppliersQuery } from "../states/apislice";
import { useMyContext } from "../context files/MycontextProvider";

const SuppliersListPage=()=>{

    const {data,isLoading,isError,isSuccess,error}=useGetAllSuppliersQuery();
    const { sharedData,setsharedData}=useMyContext();

    if (isSuccess) {
        console.log(data)
      }
    return (
        <>
        <SuppliersListContainer title={'Suppliers List'}
        subTitle={'Manage your Suppliers'}
        navLinktext={'add/supplier'}
        navtext={'Add supplier'}
        table={

            <div>{sharedData}</div>
        }/>
        </>
    )
}
export default SuppliersListPage;