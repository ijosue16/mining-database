import { useState } from "react";
import ActionsPagesContainer from "../components/Actions components/ActionsComponent container";
import AddComponent from "../components/Actions components/AddComponent";
import { PiEyeSlashFill,PiEyeFill } from "react-icons/pi";
import { useAddSupplierMutation } from "../states/apislice";

const AddSuplierPage = () => {
    const [formval, setFormval] = useState({ companyName: '',TINNumber:'',licenseNumber:'',email:'',nationalId:'',phoneNumber:'',mineSites:'',address:'',typeOfMinerals:'',numberOfDiggers:'',numberOfWashers:'',numberOfTransporters:'' });
    const [show ,setShow]=useState(false);
    const [createNewSupplier,{isSuccess,isLoading,isError,error}]=useAddSupplierMutation();
    const handleAddproduct = (e) => {
        setFormval({ ...formval, [e.target.name]: e.target.value })
    }
    const handleProductSubmit= async(e)=>{
        e.preventDefault();
        const body={...formval};
        await createNewSupplier({...formval,body});
        console.log(formval);
    }
    const handleCancel=()=>{
        setFormval({ companyName: '',TINNumber:'',licenseNumber:'',email:'',nationalId:'',phoneNumber:'',mineSites:'',address:'',typeOfMinerals:'',numberOfDiggers:'',numberOfWashers:'',numberOfTransporters:'' })
    }
    return (
        <div>
            <ActionsPagesContainer title={'Add Supplier'}
                subTitle={'Add/Update supplier'}
                actionsContainer={<AddComponent component={
                    <div className="flex flex-col gap-3">
                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-fit list-none">
                            <li>
                                <p className="mb-1">Company Name</p>
                                <input value={formval.companyName || ''} type="text" name="companyName" id="companyName" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"
                                    onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">TIN Number</p>
                              
                                <input type="text" name="TINNumber" id="TINNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.TINNumber || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">License Number</p>
                              
                                <input type="text" name="licenseNumber" id="licenseNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.licenseNumber || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Email</p>
                                <input type="email" name="email" id="email" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.email|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">National ID</p>
                                <input type="text" name="nationalId" id="nationalId" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.nationalId|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Phone Number</p>
                                <input type="text" name="phoneNumber" id="phoneNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.phoneNumber|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Mine Sites</p>
                                <input type="text" name="mineSites" id="mineSites" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.mineSites|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Address</p>
                                <input type="text" name="address" id="address" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.address|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Type Of Minerals</p>
                                <input type="text" name="typeOfMinerals" id="typeOfMinerals" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.typeOfMinerals|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Number Of Diggers</p>
                                <input type="text" name="numberOfDiggers" id="numberOfDiggers" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.numberOfDiggers|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Number Of Washers</p>
                                <input type="text" name="numberOfTransporters" id="numberOfTransporters" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.numberOfTransporters|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                        </ul>
                       
                    </div>
                } 
                Add={handleProductSubmit}
                Cancel={handleCancel}
                isloading={isLoading}/>} />
        </div>
    )
}
export default AddSuplierPage;