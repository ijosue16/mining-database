import { useEffect, useState } from "react";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../components/Actions components/AddComponent";
import { PiEyeSlashFill,PiEyeFill } from "react-icons/pi";
import { useGetOnePaymentQuery,useAddPaymentMutation } from "../states/apislice";
import { useNavigate, useParams } from "react-router-dom";


const EditPaymentPage = () => {

    let info=[];
    const{paymentId}=useParams();
    const navigate=useNavigate();
    const{data,isLoading,isSuccess,isError}=useGetOnePaymentQuery({paymentId});
    const [formval, setFormval] = useState({supplierName:'',companyRepresentative:'',nationalId:'',licenseNumber:'',phoneNumber:'',TINNumber:'',email:'',location:'',amountReceived:'',currency:''});
    const [show ,setShow]=useState(false);
useEffect(()=>{
    if(isSuccess){
        const{data:dt}=data;
        const{payment:paymnt}=dt;
        setFormval({supplierName:paymnt.supplierName,companyRepresentative:paymnt.companyRepresentative,nationalId:paymnt.nationalId,licenseNumber:paymnt.licenseNumber,phoneNumber:paymnt.phoneNumber,TINNumber:paymnt.TINNumber,email:paymnt.email,location:paymnt.location,amountReceived:paymnt.amountReceived,currency:paymnt.currency})
        console.log(paymnt);
    };
},[isSuccess])
   
    const handleAddproduct = (e) => {
        setFormval({ ...formval, [e.target.name]: e.target.value })
    }
    const handleProductSubmit= async(e)=>{
        e.preventDefault();
        const body={...formval};
        await createPayment({...formval,body});
        console.log(formval);
        navigate(-1);
    }
    const handleCancel=()=>{
        setFormval({supplierName:'',companyRepresentative:'',nationalId:'',licenseNumber:'',phoneNumber:'',TINNumber:'',email:'',location:'',amountReceived:'',currency:''});
        navigate(-1);
    }
    return (
        <div>
            <ActionsPagesContainer title={'Edit Payment'}
                subTitle={'Edit/Update payment'}
                actionsContainer={<AddComponent component={
                    <div className="flex flex-col gap-3">
                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-fit list-none">
                            <li>
                                <p className="mb-1">Supplier Name</p>
                              
                                <input type="text" name="supplierName" id="supplierName" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.supplierName || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Company representative</p>
                              
                                <input type="text" name="companyRepresentative" id="companyRepresentative" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.companyRepresentative || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">National ID</p>
                                <input type="text" name="nationalId" id="nationalId" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.nationalId|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">License number</p>
                                <input type="text" name="licenseNumber" id="licenseNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.licenseNumber|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Phone number</p>
                                <input type="text" name="phoneNumber" id="phoneNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.phoneNumber|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">TIN number</p>
                                <input type="text" name="TINNumber" id="TINNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.TINNumber|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Email</p>
                                <input type="email" name="email" id="email" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.email|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Location</p>
                                <input type="text" name="location" id="location" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.location|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Amount received</p>
                                <input type="text" name="amountReceived" id="amountReceived" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.amountReceived|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Currency</p>
                                <input type="text" name="currency" id="currency" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.currency|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
 
                        </ul>
                       
                    </div>
                } 
                Add={handleProductSubmit}
                Cancel={handleCancel}/>} />
        </div>
    )
}
export default EditPaymentPage;