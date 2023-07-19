import { useState } from "react";
import ActionsPagesContainer from "../components/Actions components/ActionsComponent container";
import AddComponent from "../components/Actions components/AddComponent";
import { PiEyeSlashFill,PiEyeFill } from "react-icons/pi";


const AddSuplierPage = () => {
    const [formval, setFormval] = useState({ firstName: 'Hp victus',lastName:'Computer',userName:'Pc',password:'Hp',phone:'652',email:'4',role:'6',quantity:'22',tax:'2%',discountType:'0%',price:'859£',status:'Available' });
    const [show ,setShow]=useState(false);
    const handleAddproduct = (e) => {
        setFormval({ ...formval, [e.target.name]: [e.target.value] })
    }
    const handleProductSubmit=()=>{
        console.log(formval);
    }
    const handleCancel=()=>{
        setFormval({ productName: '',category:'',subCategory:'',brand:'',unit:'',sku:'',minimumQty:'',quantity:'',tax:'',discountType:'',price:'',status:'' })
    }
    return (
        <div>
            <ActionsPagesContainer title={'Add User'}
                subTitle={'Add/Update user'}
                actionsContainer={<AddComponent component={
                    <div className="flex flex-col gap-3">
                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-fit list-none">
                            <li>
                                <p className="mb-1">Supplier Name</p>
                                <input value={formval.productName || ''} type="text" name="supplierName" id="supplierName" className="focus:outline-none p-2 border rounded-lg w-full"
                                    onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Email</p>
                              
                                <input type="text" name="email" id="email" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.lastName || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Phone</p>
                              
                                <input type="text" name="name" id="name" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.lastName || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Choose country</p>
                                <input type="text" name="country" id="country" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.userName|| ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">city</p>
                                <div className=" flex items-center w-full justify-between border rounded-lg p-2 gap-2"> 
                                <input type={show?"text":"password"} name="city" id="city" className=" focus:outline-none" value={formval.password || ''} onChange={handleAddproduct} />
                                {show? <PiEyeSlashFill onClick={()=>setShow(!show)}/>:<PiEyeFill onClick={()=>setShow(!show)}/>}
                                </div>
                               
                            </li>
                            {/* ******* */}
                            <li className=" lg:col-start-2 lg:col-span-3">
                                <p className="mb-1">Adres</p>
                                <input type="number" name="phone" id="phone" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.phone || ''} onChange={handleAddproduct}  />
                            </li>
                            {/* ******* */}

                        </ul>
                        <span>
                            <p className="mb-1">Description</p>
                            <textarea className="focus:outline-none border rounded-md w-full h-24 p-2" name="comment" id="comment"></textarea>
                        </span>
                        <span>
                                <p className="mb-1">User image</p>
                                <input type="file" name="userImage" id="userImage" className=" p-2 border rounded-lg w-full h-24" />
                            </span>

                    </div>
                } 
                Add={handleProductSubmit}
                Cancel={handleCancel}/>} />
        </div>
    )
}
export default AddSuplierPage;