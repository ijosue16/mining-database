import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Spin } from 'antd';
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import { BiSolidEditAlt } from "react-icons/bi"
import { MdAddLocationAlt } from "react-icons/md"
import { useGetOneSupplierQuery } from "../states/apislice";
import { useNavigate, useParams } from "react-router-dom";
import MineSiteCard from "../Cards/MineSiteCard";


const SupplierDetailsPage = () => {
    const { supplierId } = useParams();
    const navigate = useNavigate();

    const { data, isLoading, isError, isSuccess, error } = useGetOneSupplierQuery({ supplierId });
    const [formval, setFormval] = useState({ lat: '', long: '', name: '', code: '' });
    let suply = [];
    let suplyMinesites=[];
    const [show, setShow] = useState(false);
    const handleAddSite = (e) => {
        setFormval({ ...formval, [e.target.name]: e.target.value }) 
    }
    
    const handleSiteSubmit = async (e) => {
        e.preventDefault();
        const body = { ...formval };
        // await updateBuyer({ body, buyerId });
        setFormval({ lat: '', long: '', name: '', code: '' });
        // navigate(-1);
    }
    const handleCancel = () => {
        setFormval({ lat: '', long: '', name: '', code: '' });
        navigate(-1);
    }

        if (isSuccess) {
            const { data: info } = data;
            const { supplier: sup } = info;
            suply= sup;
            suplyMinesites =sup.mineSites;

        }

    return (
        <div>
            <ActionsPagesContainer title={'Supplier Details'}
                subTitle={'View Supplier detailes'}
                actionsContainer={
                    <>
                        {isLoading ? <Spin /> : (<div className="grid grid-cols-1 gap-12 w-full">


                            <div className="w-full  grid grid-cols-2 py-2 border-b items-center justify-between">
                                <p className="text-lg font-semibold">Supplier details</p>
                                <BiSolidEditAlt className=" text-2xl pb-1 justify-self-end" onClick={() => navigate(`/edit/supplier/${supplierId}`)} />
                            </div>


                            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
                                <li>
                                    <p className=" text-md text-indigo-500 pb-[1px] font-semibold">company info</p>
                                    <p>Name:{suply.companyName}</p>
                                    <p>Email:{suply.email}</p>
                                    <p>TIN Number:{suply.TINNumber}</p>
                                    <p>License Number:{suply.licenseNumber}</p>
                                </li>
                                <li>
                                    <p className=" text-md text-indigo-500 pb-[1px] font-semibold">Adress</p>
                                    <p>Province:{suply.address?.province}</p>
                                    <p>District:{suply.address?.district}</p>
                                    <p>Sector:{suply.address?.sector}</p>
                                    <p>Phone Number:{suply.phoneNumber}</p>
                                </li>
                                <li>
                                    <p className=" text-md text-indigo-500 pb-[1px] font-semibold">Additional</p>
                                    <p>Nbr of Digers:{suply.numberOfDiggers}</p>
                                    <p>Nbr of washers:{suply.numberOfWashers}</p>
                                    <p>Nbr of Transporters:{suply.numberOfTransporters}</p>
                                    {/* <p>Type of minerals:{suply.}</p> */}
                                </li>
                            </ul>


                            <div className="grid grid-cols-1 gap-2">
                                <div className="  relative py-2 border-b grid items-center">
                                    <p className="text-lg font-semibold">Minesites</p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 w-full gap-3">
                                    <div className="pb-6 col-span-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                                        {suplyMinesites.map(({ name, code, _id, coordinates }) => (

                                            <MineSiteCard key={_id}
                                                name={name}
                                                code={code}
                                                lat={coordinates.lat}
                                                long={coordinates.long}
                                                onclick={() => { navigate(`/edit/supplier/minesite/${_id}`) }} />

                                        ))}
                                    </div>
                                    {/* <div className="col-span-full ">
                                        <span className="flex items-center gap-2 bg-slate-50 w-fit p-1 rounded-md px-4 border" onClick={() => { setShow(!show) }}>
                                            <button>Add new site</button>
                                            <MdAddLocationAlt />
                                        </span>
                                    </div> */}
                                    {show ? <motion.form onSubmit={handleSiteSubmit} animate={show ? { opacity: 1, y: -10, display: "grid" } : { opacity: 0, y: 0, display: "none", }} action="" className="grid grid-cols-1 sm:grid-cols-2 col-span-full gap-3 pb-9">
                                        <span>
                                            <label htmlFor="code">name</label>
                                            <input type="text" autoComplete="off" name="name" id="name" value={formval.name || ''} onChange={handleAddSite} className="focus:outline-none p-2 border rounded-lg w-full" />
                                        </span>
                                        <span>
                                            <label htmlFor="code">code</label>
                                            <input type="text" autoComplete="off" name="code" id="code" value={formval.code || ''} onChange={handleAddSite} className="focus:outline-none p-2 border rounded-lg w-full" />
                                        </span>
                                        <span>
                                            <label htmlFor="code">latitude</label>
                                            <input type="text" autoComplete="off" name="lat" id="latitude" value={formval.lat || ''} onChange={handleAddSite} className="focus:outline-none p-2 border rounded-lg w-full" />
                                        </span>
                                        <span>
                                            <label htmlFor="code">longitude</label>
                                            <input type="text" autoComplete="off" name="long" id="longitude" value={formval.long || ''} onChange={handleAddSite} className="focus:outline-none p-2 border rounded-lg w-full" />
                                        </span>
                                        <button type="submit" className="w-fit py-1 px-3 bg-slate-100 border rounded-md">Add site</button>
                                    </motion.form> : null}


                                </div>
                            </div>
                        </div>)}

                    </>} />
        </div>
    )
}
export default SupplierDetailsPage;