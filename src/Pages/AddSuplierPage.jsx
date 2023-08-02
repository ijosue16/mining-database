import { useState } from "react";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../components/Actions components/AddComponent";
import { useAddSupplierMutation } from "../states/apislice";
import { useNavigate } from "react-router-dom";

const AddSuplierPage = () => {
    const navigate = useNavigate();
    const [formval, setFormval] = useState({ companyName: '', TINNumber: '', licenseNumber: '', email: '', nationalId: '', typeOfMinerals: '', phoneNumber: '', mineSites: [{ coordinates: { lat: '', long: '', }, name: '', code: '', }], address: { province: '', district: '', sector: '' }, numberOfDiggers: '', numberOfWashers: '', numberOfTransporters: '' });
    const [show, setShow] = useState(false);
    const [addressFields, setAddresField] = useState(false);
    const [createNewSupplier, { isSuccess, isLoading, isError, error }] = useAddSupplierMutation();
    const handleAddproduct = (e) => {

        if (e.target.name.startsWith("address.")) {
            const addressField = e.target.name.split(".")[1];
            setFormval((prevFormval) => ({
                ...prevFormval,
                address: {
                    ...prevFormval.address,
                    [addressField]: e.target.value,
                },
            }));
        } else if (e.target.name.startsWith("mineSites.")) {
            const minesiteField = e.target.name.split(".")[1];
            if (minesiteField === "coordinates") {
                const coordField = e.target.name.split(".")[2];
                setFormval((prevFormval) => ({
                    ...prevFormval,
                    mineSites: [
                        {
                            ...prevFormval.mineSites[0],
                            coordinates: {
                                ...prevFormval.mineSites[0].coordinates,
                                [coordField]: e.target.value,
                            },
                        },
                    ],
                }));
            } else {
                setFormval((prevFormval) => ({
                    ...prevFormval,
                    mineSites: [
                        {
                            ...prevFormval.mineSites[0],
                            [minesiteField]: e.target.value,
                        },
                    ],
                }));
            }
        } else {
            setFormval((prevFormval) => ({ ...prevFormval, [e.target.name]: e.target.value }));
        }
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const body = { ...formval };
        await createNewSupplier({ ...formval, body });
        navigate(-1);
    }
    const handleCancel = () => {
        setFormval({ companyName: '', TINNumber: '', licenseNumber: '', email: '', nationalId: '', typeOfMinerals: '', phoneNumber: '', mineSites: [{ coordinates: { lat: '', long: '', }, name: '', code: '', }], address: { province: '', district: '', sector: '' }, numberOfDiggers: '', numberOfWashers: '', numberOfTransporters: '' })
    }
    return (
        <div>
            <ActionsPagesContainer title={'Add Supplier'}
                subTitle={'Add/Update supplier'}
                actionsContainer={<AddComponent component={
                    <div className="flex flex-col gap-4">
                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center">
                            <li>
                                <p className="mb-1">Company Name</p>
                                <input value={formval.companyName || ''} type="text" name="companyName" id="companyName" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"
                                    onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">TIN Number</p>

                                <input type="text" name="TINNumber" id="TINNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.TINNumber || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">License Number</p>

                                <input type="text" name="licenseNumber" id="licenseNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.licenseNumber || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Email</p>
                                <input type="email" name="email" id="email" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.email || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            {/* <li>
                                <p className="mb-1">National ID</p>
                                <input type="text" name="nationalId" id="nationalId" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.nationalId|| ''} onChange={handleAddproduct} />
                            </li> */}
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Phone Number</p>
                                <input type="text" name="phoneNumber" id="phoneNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.phoneNumber || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}

                            <li>
                                <p className="mb-1">Type Of Minerals</p>
                                <select autoComplete="off" required name="typeOfMinerals" id="typeOfMinerals" className="focus:outline-none p-2 border rounded-md w-full" value={formval.typeOfMinerals || ''} onChange={handleAddproduct} >
                                    <option value="casiterite">Casiterite</option>
                                    <option value="coltan">Coltan</option>
                                    <option value="wolframite">Wolframite</option>
                                    <option value="berlyium">Berlyium</option>
                                    <option value="lithium">Lithium</option>
                                    <option value="mixed">Mixed</option>
                                </select>
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Number Of Diggers</p>
                                <input type="text" name="numberOfDiggers" id="numberOfDiggers" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.numberOfDiggers || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}

                            <li>
                                <p className="mb-1">Number Of Washers</p>
                                <input type="text" name="numberOfWashers" id="numberOfWashers" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.numberOfWashers || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Number Of Transporters</p>
                                <input type="text" name="numberOfTransporters" id="numberOfTransporters" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.numberOfTransporters || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}

                        </ul>
                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center mt-2 border-t  relative p-2">
                            <p className=" col-span-full absolute -top-[13px] bg-white left-4 px-2 p-0 font-semibold">Minesite</p>

                            <li>
                                <p className="mb-1">Name</p>
                                <input type="text" name="mineSites.name" id="mineSites.name" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.mineSites[0].name || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">code</p>
                                <input type="text" name="mineSites.code" id="mineSites.code" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.mineSites[0].code || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Latitude</p>
                                <input type="text" name="mineSites.coordinates.lat" id="mineSites.coordinates.lat" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.mineSites[0].coordinates.lat || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Longitude</p>
                                <input type="text" name="mineSites.coordinates.long" id="mineSites.coordinates.long" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.mineSites[0].coordinates.long || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                        </ul>
                        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center mt-2 border-t relative p-2">
                            <p className=" col-span-full absolute -top-[13px] bg-white left-4 px-2 p-0 font-semibold">Address</p>

                            <li>
                                <p className="mb-1">Province</p>
                                <input type="text" name="address.province" id="address.province" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.address.province || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">District</p>
                                <input type="text" name="address.district" id="address.district" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.address.district || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                            <li>
                                <p className="mb-1">Sector</p>
                                <input type="text" name="address.sector" id="address.sector" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.address.sector || ''} onChange={handleAddproduct} />
                            </li>
                            {/* ******* */}
                        </ul>

                    </div>
                }
                    Add={handleProductSubmit}
                    Cancel={handleCancel}
                    isloading={isLoading} />} />
        </div>
    )
}
export default AddSuplierPage;