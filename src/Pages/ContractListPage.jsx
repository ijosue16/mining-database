import React from "react";
import PurchasesListContainer from "../components/Listcomponents/PurchasesListContainer";

const ContractsistPage=()=>{
return(
    <>
    <PurchasesListContainer title={'Contracts list'}
    subTitle={'Manage your contracts'}
    navLinktext={'add/contract'}
    navtext={'add new contract'}
    table={''}/>
    </>
)
}
export default ContractsistPage;