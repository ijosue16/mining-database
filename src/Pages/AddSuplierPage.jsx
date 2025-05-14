// import { useState } from "react";
// import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
// import AddComponent from "../components/Actions components/AddComponent";
// import { useAddSupplierMutation } from "../states/apislice";
// import { useNavigate } from "react-router-dom";
// import { HiPlus, HiMinus } from "react-icons/hi";
//
// const AddSuplierPage = () => {
//     const navigate = useNavigate();
//     const [formval, setFormval] = useState({ companyName: '', TINNumber: '', licenseNumber: '', email: '', nationalId: '', typeOfMinerals: '', phoneNumber: '', mineSites: [{ coordinates: { lat: '', long: '', }, name: '', code: '', }], address: { province: '', district: '', sector: '', cell: '' }, typeOfMining: '', equipmentList: [], surfaceArea: null, categoryOfMine: '', numberOfDiggers: '', numberOfWashers: '', numberOfTransporters: '',companyRepresentative:"" });
//     const [mineSitesDetails, setmineSitesDetails] = useState([
//         { coordinates: { lat: '', long: '', }, name: '', code: '' },
//     ]);
//     const [show, setShow] = useState(false);
//     const [addressFields, setAddresField] = useState(false);
//     const [createNewSupplier, { isSuccess, isLoading, isError, error }] = useAddSupplierMutation();
//
//     const updateLotNumbers = () => {
//         setmineSitesDetails((prevmineSitesDetails) => {
//             return prevmineSitesDetails.map((lot, index) => ({
//                 ...lot,
//                 lotNumber: index + 1,
//             }));
//         });
//     };
//
//     const handleAddSite = () => {
//         setmineSitesDetails((prevmineSitesDetails) => [...prevmineSitesDetails, { coordinates: { lat: '', long: '', }, name: '', code: '', }]);
//         updateLotNumbers();
//     };
//
//   const handleRemoveSite = (index) => {
//     const values = [...mineSitesDetails];
//     values.splice(index, 1);
//     values.forEach((lot, i) => {
//       lot.lotNumber = i + 1;
//     });
//     setmineSitesDetails(values);
//   };
//
//
//     const handleSiteEntry =  (index, e) => {
//         setmineSitesDetails((prevmineDetails) => {
//             const updatedmineDetails = prevmineDetails.map((mine, i) => {
//                 if (i === index) {
//                     if (e.target.name.startsWith("coordinates.")) {
//                         const coordField = e.target.name.split(".")[1];
//                         return {
//                             ...mine,
//                             coordinates: {
//                                 ...mine.coordinates,
//                                 [coordField]: e.target.value,
//                             },
//                         };
//                     } else {
//                         return {
//                             ...mine,
//                             [e.target.name]: e.target.value,
//                         };
//                     }
//                 }
//                 return mine;
//             });
//             if (index === prevmineDetails.length) {
//                 if (e.target.name.startsWith("coordinates.")) {
//                     const coordField = e.target.name.split(".")[1];
//                     return [
//                         ...updatedmineDetails,
//                         {
//                             coordinates: {
//                                 [coordField]: e.target.value,
//                             },
//                         },
//                     ];
//                 } else {
//                     return [
//                         ...updatedmineDetails,
//                         { [e.target.name]: e.target.value },
//                     ];
//                 }
//             }
//
//             return updatedmineDetails;
//         });
//     };
//     const handleAddproduct = (e) => {
//
//         if (e.target.name.startsWith("address.")) {
//             const addressField = e.target.name.split(".")[1];
//             setFormval((prevFormval) => ({
//                 ...prevFormval,
//                 address: {
//                     ...prevFormval.address,
//                     [addressField]: e.target.value,
//                 },
//             }));
//         } else if (e.target.name.startsWith("mineSites.")) {
//             const minesiteField = e.target.name.split(".")[1];
//             if (minesiteField === "coordinates") {
//                 const coordField = e.target.name.split(".")[2];
//                 setFormval((prevFormval) => ({
//                     ...prevFormval,
//                     mineSites: [
//                         {
//                             ...prevFormval.mineSites[0],
//                             coordinates: {
//                                 ...prevFormval.mineSites[0].coordinates,
//                                 [coordField]: e.target.value,
//                             },
//                         },
//                     ],
//                 }));
//             } else {
//                 setFormval((prevFormval) => ({
//                     ...prevFormval,
//                     mineSites: [
//                         {
//                             ...prevFormval.mineSites[0],
//                             [minesiteField]: e.target.value,
//                         },
//                     ],
//                 }));
//             }
//         } else {
//             setFormval((prevFormval) => ({ ...prevFormval, [e.target.name]: e.target.value }));
//         }
//     };
//
//     const handleProductSubmit = async (e) => {
//         e.preventDefault();
//         const body = { ...formval, mineSites: mineSitesDetails, typeOfMinerals: formval.typeOfMinerals.split(' ') };
//         await createNewSupplier({ ...formval, body });
//         setFormval({ companyName: '', TINNumber: '', licenseNumber: '', email: '', nationalId: '', typeOfMinerals: '', phoneNumber: '', mineSites: [{ coordinates: { lat: '', long: '', }, name: '', code: '', }], address: { province: '', district: '', sector: '', cell: '' }, typeOfMining: '', equipmentList: [], surfaceArea: null, categoryOfMine: '', numberOfDiggers: '', numberOfWashers: '', numberOfTransporters: '',companyRepresentative:"" });
//         setmineSitesDetails([{ coordinates: { lat: '', long: '', }, name: '', code: '' },]);
//         navigate(-1);
//     }
//     const handleCancel = () => {
//         setFormval({ companyName: '', TINNumber: '', licenseNumber: '', email: '', nationalId: '', typeOfMinerals: '', phoneNumber: '', mineSites: [{ coordinates: { lat: '', long: '', }, name: '', code: '', }], address: { province: '', district: '', sector: '', cell: '' }, typeOfMining: '', equipmentList: [], surfaceArea: null, categoryOfMine: '', numberOfDiggers: '', numberOfWashers: '', numberOfTransporters: '',companyRepresentative:"" });
//         setmineSitesDetails([{ coordinates: { lat: '', long: '', }, name: '', code: '' },]);
//         navigate(-1);
//     }
//     return (
//         <div>
//             <ActionsPagesContainer title={'Add Supplier'}
//                 subTitle={'Add/Update supplier'}
//                 actionsContainer={<AddComponent component={
//                     <div className="grid grid-cols-1 gap-y-10 pb-10">
//                         <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center">
//                             <li>
//                                 <p className="mb-1">Company Name</p>
//                                 <input value={formval.companyName || ''} type="text" name="companyName" id="companyName" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"
//                                     onChange={handleAddproduct} />
//                             </li>
//                             {/* ******* */}
//                             <li>
//                                 <p className="mb-1">TIN Number</p>
//
//                                 <input type="text" name="TINNumber" id="TINNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.TINNumber || ''} onChange={handleAddproduct} />
//                             </li>
//                             {/* ******* */}
//                             <li>
//                                 <p className="mb-1">License Number</p>
//
//                                 <input type="text" name="licenseNumber" id="licenseNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.licenseNumber || ''} onChange={handleAddproduct} />
//                             </li>
//                             {/* ******* */}
//                             <li>
//                                 <p className="mb-1">Email</p>
//                                 <input type="email" name="email" id="email" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.email || ''} onChange={handleAddproduct} />
//                             </li>
//                             {/* ******* */}
//                             {/* <li>
//                                 <p className="mb-1">National ID</p>
//                                 <input type="text" name="nationalId" id="nationalId" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full"value={formval.nationalId|| ''} onChange={handleAddproduct} />
//                             </li> */}
//                             {/* ******* */}
//                             <li>
//                                 <p className="mb-1">Phone Number</p>
//                                 <input type="text" name="phoneNumber" id="phoneNumber" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.phoneNumber || ''} onChange={handleAddproduct} />
//                             </li>
//                             {/* ******* */}
//
//                             <li>
//                                 <p className="mb-1">Company representative</p>
//                                 <input type="text" name="companyRepresentative" id="companyRepresentative" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.companyRepresentative || ''} onChange={handleAddproduct} />
//                             </li>
//                             {/* ******* */}
//
//                             <li>
//                                 <p className="mb-1">Type Of Minerals</p>
//                                 <input type="text" autoComplete="off" name="typeOfMinerals" id="typeOfMinerals" className="focus:outline-none p-2 border rounded-md w-full" value={formval.typeOfMinerals || ''} onChange={handleAddproduct} />
//
//                             </li>
//                             {/* ******* */}
//                             <li>
//                                 <p className="mb-1">Number Of Diggers</p>
//                                 <input type="text" name="numberOfDiggers" id="numberOfDiggers" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.numberOfDiggers || ''} onChange={handleAddproduct} />
//                             </li>
//                             {/* ******* */}
//
//                             <li>
//                                 <p className="mb-1">Number Of Washers</p>
//                                 <input type="text" name="numberOfWashers" id="numberOfWashers" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.numberOfWashers || ''} onChange={handleAddproduct} />
//                             </li>
//                             {/* ******* */}
//                             <li>
//                                 <p className="mb-1">Number Of Transporters</p>
//                                 <input type="text" name="numberOfTransporters" id="numberOfTransporters" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.numberOfTransporters || ''} onChange={handleAddproduct} />
//                             </li>
//                             {/* ******* */}
//
//                         </ul>
//                         <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center mt-2 border-t  relative p-2 pb-9 shadow-md rounded-md bg-slate-50">
//                             <p className=" col-span-full absolute -top-[13px] bg-white left-4 px-2 p-0 font-semibold">Minesite</p>
//                             {mineSitesDetails.map((site, index) => (
//                                 <ul className=" col-span-full grid grid-cols-1 mt-3 gap-x-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center relative p-2 bg-white rounded-md border py-4" key={index}>
//                                     <span className="flex items-center gap-2 col-span-full justify-end">
//                                         <p className=" font-semibold justify-self-start">Site {index + 1}</p>
//                                         <HiMinus onClick={() => handleRemoveSite(index)} className={`${mineSitesDetails.length - 1 == 0 ? 'hidden' : ''}`} />
//                                         <HiPlus onClick={handleAddSite} className={`${mineSitesDetails.length - 1 !== index ? 'hidden' : ''}`} />
//                                     </span>
//                                     <li>
//                                         <p className="mb-1">Name</p>
//                                         <input type="text" name="name"  autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={site.name || ''} onChange={e => handleSiteEntry(index, e)} />
//                                     </li>
//                                     {/* ******* */}
//                                     <li>
//                                         <p className="mb-1">code</p>
//                                         <input type="text" name="code"  autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={site.code || ''} onChange={e => handleSiteEntry(index, e)} />
//                                     </li>
//                                     {/* ******* */}
//                                     <li>
//                                         <p className="mb-1">Latitude</p>
//                                         <input type="text" name="coordinates.lat"  autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={site.coordinates.lat || ''} onChange={e => handleSiteEntry(index, e)} />
//                                     </li>
//                                     {/* ******* */}
//                                     <li>
//                                         <p className="mb-1">Longitude</p>
//                                         <input type="text" name="coordinates.long" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={site.coordinates.long || ''} onChange={e => handleSiteEntry(index, e)} />
//                                     </li>
//                                     {/* ******* */}
//                                 </ul>
//                             ))}
//
//                         </ul>
//
//                         <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center mt-2 border-t relative p-2 pb-9 shadow-md rounded-md bg-slate-50">
//                             <p className=" col-span-full absolute -top-[13px] bg-white left-4 px-2 p-0 font-semibold">Mining Info</p>
//
//                             <li>
//                                 <p className="mb-1">Type of Mining</p>
//                                 {/* <input type="text" name="typeOfMining" id="typeOfMining" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.typeOfMining || ''} onChange={handleAddproduct} /> */}
//                                 <select
//                                     name="typeOfMining"
//                                     id="typeOfMining"
//                                     autoComplete="off"
//                                     className="focus:outline-none p-2 border rounded-md w-full"
//                                     defaultValue="typeOfMining"
//                                     onChange={handleAddproduct}
//                                 >
//                                     <option value="typeOfMining" hidden>
//                                         Select a mineral type
//                                     </option>
//                                     <option value="Underground">Underground</option>
//                                     <option value="Open Pits">Open Pits</option>
//                                     <option value="Both">Both</option>
//                                 </select>
//
//                             </li>
//                             {/* ******* */}
//                             <li>
//                                 <p className="mb-1">Surface Area</p>
//                                 <input type="text" name="surfaceArea" id="surfaceArea" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.surfaceArea || ''} onChange={handleAddproduct} />
//                             </li>
//                             {/* ******* */}
//                             <li>
//                                 <p className="mb-1">Equipment List</p>
//                                 <input type="text" name="equipmentList" id="equipmentList" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.equipmentList || ''} onChange={handleAddproduct} />
//                             </li>
//                             {/* ******* */}
//                             <li>
//                                 <p className="mb-1">Category of Mine</p>
//                                 <input type="text" name="categoryOfMine" id="categoryOfMine" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.categoryOfMine || ''} onChange={handleAddproduct} />
//                             </li>
//                             {/* ******* */}
//                         </ul>
//
//                         <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 h-fit list-none items-center mt-2 border-t relative p-2 pb-9 shadow-md rounded-md bg-slate-50">
//                             <p className=" col-span-full absolute -top-[13px] bg-white left-4 px-2 p-0 font-semibold">Address</p>
//
//                             <li>
//                                 <p className="mb-1">Province</p>
//                                 <input type="text" name="address.province" id="address.province" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.address.province || ''} onChange={handleAddproduct} />
//                             </li>
//                             {/* ******* */}
//                             <li>
//                                 <p className="mb-1">District</p>
//                                 <input type="text" name="address.district" id="address.district" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.address.district || ''} onChange={handleAddproduct} />
//                             </li>
//                             {/* ******* */}
//                             <li>
//                                 <p className="mb-1">Sector</p>
//                                 <input type="text" name="address.sector" id="address.sector" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.address.sector || ''} onChange={handleAddproduct} />
//                             </li>
//                             {/* ******* */}
//                             <li>
//                                 <p className="mb-1">Cell</p>
//                                 <input type="text" name="address.cell" id="address.cell" autoComplete="off" className="focus:outline-none p-2 border rounded-lg w-full" value={formval.address.cell || ''} onChange={handleAddproduct} />
//                             </li>
//                             {/* ******* */}
//                         </ul>
//
//                     </div>
//                 }
//                     Add={handleProductSubmit}
//                     Cancel={handleCancel}
//                     isloading={isLoading} />} />
//         </div>
//     )
// }
// export default AddSuplierPage;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HiPlus, HiMinus } from "react-icons/hi";
import { useAddSupplierMutation } from "../states/apislice";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../components/Actions components/AddComponent";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import {useToast} from "@/hooks/use-toast.js";

const AddSupplierPage = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [formVal, setFormVal] = useState({
        companyName: "",
        TINNumber: "",
        licenseNumber: "",
        email: "",
        nationalId: "",
        typeOfMinerals: "",
        phoneNumber: "",
        mineSites: [{ coordinates: { lat: "", long: "" }, name: "", code: "" }],
        address: { province: "", district: "", sector: "", cell: "" },
        typeOfMining: "Underground",
        equipmentList: [],
        surfaceArea: null,
        categoryOfMine: "",
        numberOfDiggers: "",
        numberOfWashers: "",
        numberOfTransporters: "",
        companyRepresentative: "",
    });

    const [mineSitesDetails, setMineSitesDetails] = useState([
        { coordinates: { lat: "", long: "" }, name: "", code: "" },
    ]);

    const [createNewSupplier, { isSuccess, isLoading, isError, error }] = useAddSupplierMutation();

    useEffect(() => {
        if (isSuccess) {
            toast({
                title: 'Success',
                description: 'Supplier added successfully',
            })
        }
    }, [isSuccess, toast]);

    useEffect(() => {
        if (isError) {
            console.log('Error', error.data.message);
        }
    }, [isError, error]);

    const updateLotNumbers = () => {
        setMineSitesDetails((prevMineSitesDetails) => {
            return prevMineSitesDetails.map((lot, index) => ({
                ...lot,
                lotNumber: index + 1,
            }));
        });
    };

    const handleAddSite = () => {
        setMineSitesDetails((prevMineSitesDetails) => [
            ...prevMineSitesDetails,
            { coordinates: { lat: "", long: "" }, name: "", code: "" },
        ]);
        updateLotNumbers();
    };

    const handleRemoveSite = (index) => {
        const values = [...mineSitesDetails];
        values.splice(index, 1);
        values.forEach((lot, i) => {
            lot.lotNumber = i + 1;
        });
        setMineSitesDetails(values);
    };

    const handleSiteEntry = (index, e) => {
        setMineSitesDetails((prevMineDetails) => {
            const updatedMineDetails = prevMineDetails.map((mine, i) => {
                if (i === index) {
                    if (e.target.name.startsWith("coordinates.")) {
                        const coordField = e.target.name.split(".")[1];
                        return {
                            ...mine,
                            coordinates: {
                                ...mine.coordinates,
                                [coordField]: e.target.value,
                            },
                        };
                    } else {
                        return {
                            ...mine,
                            [e.target.name]: e.target.value,
                        };
                    }
                }
                return mine;
            });

            if (index === prevMineDetails.length) {
                if (e.target.name.startsWith("coordinates.")) {
                    const coordField = e.target.name.split(".")[1];
                    return [
                        ...updatedMineDetails,
                        {
                            coordinates: {
                                [coordField]: e.target.value,
                            },
                        },
                    ];
                } else {
                    return [
                        ...updatedMineDetails,
                        { [e.target.name]: e.target.value },
                    ];
                }
            }

            return updatedMineDetails;
        });
    };

    const handleAddProduct = (e) => {
        if (e.target.name.startsWith("address.")) {
            const addressField = e.target.name.split(".")[1];
            setFormVal((prevFormVal) => ({
                ...prevFormVal,
                address: {
                    ...prevFormVal.address,
                    [addressField]: e.target.value,
                },
            }));
        } else if (e.target.name.startsWith("mineSites.")) {
            const minesiteField = e.target.name.split(".")[1];
            if (minesiteField === "coordinates") {
                const coordField = e.target.name.split(".")[2];
                setFormVal((prevFormVal) => ({
                    ...prevFormVal,
                    mineSites: [
                        {
                            ...prevFormVal.mineSites[0],
                            coordinates: {
                                ...prevFormVal.mineSites[0].coordinates,
                                [coordField]: e.target.value,
                            },
                        },
                    ],
                }));
            } else {
                setFormVal((prevFormVal) => ({
                    ...prevFormVal,
                    mineSites: [
                        {
                            ...prevFormVal.mineSites[0],
                            [minesiteField]: e.target.value,
                        },
                    ],
                }));
            }
        } else {
            setFormVal((prevFormVal) => ({ ...prevFormVal, [e.target.name]: e.target.value }));
        }
    };

    const handleSelectChange = (value, fieldName) => {
        setFormVal((prevFormVal) => ({ ...prevFormVal, [fieldName]: value }));
    };

    const handleProductSubmit = async (e) => {
        e.preventDefault();
        const body = {
            ...formVal,
            mineSites: mineSitesDetails,
            typeOfMinerals: formVal.typeOfMinerals.split(" ")
        };
        await createNewSupplier({...formVal, body});

    }

    const resetForm = () => {
        setFormVal({
            companyName: "",
            TINNumber: "",
            licenseNumber: "",
            email: "",
            nationalId: "",
            typeOfMinerals: "",
            phoneNumber: "",
            mineSites: [{ coordinates: { lat: "", long: "" }, name: "", code: "" }],
            address: { province: "", district: "", sector: "", cell: "" },
            typeOfMining: "",
            equipmentList: [],
            surfaceArea: null,
            categoryOfMine: "",
            numberOfDiggers: "",
            numberOfWashers: "",
            numberOfTransporters: "",
            companyRepresentative: "",
        });
        setMineSitesDetails([{ coordinates: { lat: "", long: "" }, name: "", code: "" }]);
    };

    const handleCancel = () => {
        resetForm();
        navigate(-1);
    };

    // Error message formatting helper
    const getErrorMessage = () => {
        if (typeof error === 'string') return error;
        if (error?.data?.message) return error.data.message;
        if (error?.error) return error.error;
        return "An error occurred while adding the supplier. Please try again.";
    };

    return (
        <div>
            <ActionsPagesContainer
                title={"Add Supplier"}
                subTitle={"Add/Update supplier"}
                actionsContainer={
                    <AddComponent
                        component={
                            <div className="grid grid-cols-1 gap-y-8 pb-10 w-full">
                                {isError && (
                                    <Alert variant="destructive" className="mb-6">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>
                                            {getErrorMessage()}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Company Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="companyName">Company Name</Label>
                                                <Input
                                                    id="companyName"
                                                    name="companyName"
                                                    value={formVal.companyName || ""}
                                                    onChange={handleAddProduct}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="TINNumber">TIN Number</Label>
                                                <Input
                                                    id="TINNumber"
                                                    name="TINNumber"
                                                    value={formVal.TINNumber || ""}
                                                    onChange={handleAddProduct}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="licenseNumber">License Number</Label>
                                                <Input
                                                    id="licenseNumber"
                                                    name="licenseNumber"
                                                    value={formVal.licenseNumber || ""}
                                                    onChange={handleAddProduct}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formVal.email || ""}
                                                    onChange={handleAddProduct}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phoneNumber">Phone Number</Label>
                                                <Input
                                                    id="phoneNumber"
                                                    name="phoneNumber"
                                                    value={formVal.phoneNumber || ""}
                                                    onChange={handleAddProduct}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="companyRepresentative">Company Representative</Label>
                                                <Input
                                                    id="companyRepresentative"
                                                    name="companyRepresentative"
                                                    value={formVal.companyRepresentative || ""}
                                                    onChange={handleAddProduct}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="typeOfMinerals">Type Of Minerals</Label>
                                                <Input
                                                    id="typeOfMinerals"
                                                    name="typeOfMinerals"
                                                    value={formVal.typeOfMinerals || ""}
                                                    onChange={handleAddProduct}
                                                    placeholder="Enter minerals separated by space"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="numberOfDiggers">Number Of Diggers</Label>
                                                <Input
                                                    id="numberOfDiggers"
                                                    name="numberOfDiggers"
                                                    value={formVal.numberOfDiggers || ""}
                                                    onChange={handleAddProduct}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="numberOfWashers">Number Of Washers</Label>
                                                <Input
                                                    id="numberOfWashers"
                                                    name="numberOfWashers"
                                                    value={formVal.numberOfWashers || ""}
                                                    onChange={handleAddProduct}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="numberOfTransporters">Number Of Transporters</Label>
                                                <Input
                                                    id="numberOfTransporters"
                                                    name="numberOfTransporters"
                                                    value={formVal.numberOfTransporters || ""}
                                                    onChange={handleAddProduct}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <CardTitle>Mine Sites</CardTitle>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={handleAddSite}
                                        >
                                            <HiPlus className="mr-1" /> Add Site
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        {mineSitesDetails.map((site, index) => (
                                            <Card key={index} className="mb-4 border-dashed">
                                                <CardHeader className="pb-2 pt-4">
                                                    <div className="flex items-center justify-between">
                                                        <h4 className="text-sm font-medium">Site {index + 1}</h4>
                                                        {mineSitesDetails.length > 1 && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRemoveSite(index)}
                                                            >
                                                                <HiMinus />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                                                        <div className="space-y-2">
                                                            <Label htmlFor={`name-${index}`}>Name</Label>
                                                            <Input
                                                                id={`name-${index}`}
                                                                name="name"
                                                                value={site.name || ""}
                                                                onChange={(e) => handleSiteEntry(index, e)}
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor={`code-${index}`}>Code</Label>
                                                            <Input
                                                                id={`code-${index}`}
                                                                name="code"
                                                                value={site.code || ""}
                                                                onChange={(e) => handleSiteEntry(index, e)}
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor={`lat-${index}`}>Latitude</Label>
                                                            <Input
                                                                id={`lat-${index}`}
                                                                name="coordinates.lat"
                                                                value={site.coordinates.lat || ""}
                                                                onChange={(e) => handleSiteEntry(index, e)}
                                                            />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Label htmlFor={`long-${index}`}>Longitude</Label>
                                                            <Input
                                                                id={`long-${index}`}
                                                                name="coordinates.long"
                                                                value={site.coordinates.long || ""}
                                                                onChange={(e) => handleSiteEntry(index, e)}
                                                            />
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Mining Information</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="typeOfMining">Type of Mining</Label>
                                                <Select
                                                    value={formVal.typeOfMining}
                                                    onValueChange={(value) => handleSelectChange(value, "typeOfMining")}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select mining type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Underground">Underground</SelectItem>
                                                        <SelectItem value="Open Pits">Open Pits</SelectItem>
                                                        <SelectItem value="Both">Both</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="surfaceArea">Surface Area</Label>
                                                <Input
                                                    id="surfaceArea"
                                                    name="surfaceArea"
                                                    value={formVal.surfaceArea || ""}
                                                    onChange={handleAddProduct}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="equipmentList">Equipment List</Label>
                                                <Input
                                                    id="equipmentList"
                                                    name="equipmentList"
                                                    value={formVal.equipmentList || ""}
                                                    onChange={handleAddProduct}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="categoryOfMine">Category of Mine</Label>
                                                <Input
                                                    id="categoryOfMine"
                                                    name="categoryOfMine"
                                                    value={formVal.categoryOfMine || ""}
                                                    onChange={handleAddProduct}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Address</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="address.province">Province</Label>
                                                <Input
                                                    id="address.province"
                                                    name="address.province"
                                                    value={formVal.address.province || ""}
                                                    onChange={handleAddProduct}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="address.district">District</Label>
                                                <Input
                                                    id="address.district"
                                                    name="address.district"
                                                    value={formVal.address.district || ""}
                                                    onChange={handleAddProduct}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="address.sector">Sector</Label>
                                                <Input
                                                    id="address.sector"
                                                    name="address.sector"
                                                    value={formVal.address.sector || ""}
                                                    onChange={handleAddProduct}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="address.cell">Cell</Label>
                                                <Input
                                                    id="address.cell"
                                                    name="address.cell"
                                                    value={formVal.address.cell || ""}
                                                    onChange={handleAddProduct}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        }
                        Add={handleProductSubmit}
                        Cancel={handleCancel}
                        isloading={isLoading}
                    />
                }
            />
        </div>
    )

};


export default AddSupplierPage;