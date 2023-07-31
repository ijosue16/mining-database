import React, { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import mData from "../MOCK_DATA.json"
import ActionsPagesContainer from "../components/Actions components/ActionsComponent container";
import AddComponent from "../components/Actions components/AddComponent";
import { FiSearch } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { useGetAllSuppliersQuery } from "../states/apislice";


const StoreKeeperData = () => {
    let sup = [''];
    const { data, isLoading, isError, error, isSuccess } = useGetAllSuppliersQuery()
    const [formval, setFormval] = useState({ grossQty: "", netQty: "", companyName: "", licenseNumber: "", TINNumber: '', email: '', companyRepresentative: "", representativeId: "", representativePhoneNbr: "", date: "", mineTagsNbr: "", mineTags: '', negociantTags: '', mineralType: '', mineralgrade: '', mineralprice: '', shipmentnumber: '', Beneficiary: '' });
    const [checked, setchecked] = useState(false);
    const [openlist, setOpenlist] = useState(false);
    const [search, setSearch] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(-1);
    const [beneficial, setBeneficial] = useState("");
    const [admin, setAdmin] = useState({ role: 'admin' });
    const handleSearch = (e) => {
        setSearch(e.target.value);
        // const clickedBook = sup.find((sup) => sup._id === e.target.value);
        // if (clickedBook) {
        //     setFormval({ companyName: clickedBook.companyName, licenseNumber: clickedBook.licenseNumber, TINNumber: clickedBook.TINNumber, email: clickedBook.email });
        //     setBeneficial(clickedBook.companyName);
        // };
        // setchecked(false);
    };
    const handleSearchCancel = () => {
        setSearch("");
        setSearchData([]);
        setSelectedItem(-1)
    }
    const handleSelectedSearch=(e)=>{
        setSearch(e);
        setBeneficial(e);
        setOpenlist(false);
    }
    const handleKeydown=(e)=>{
        if( selectedItem < searchData.length){
            
           
        if(e.key=== "ArrowUp" && selectedItem > 0){
        setSelectedItem((prev)=>prev-1);
        }
    else if(e.key=== "ArrowDown" && selectedItem < searchData.length-1){
        setSelectedItem((prev)=>prev +1);
        }
        else if(e.key=== "Enter" && selectedItem >= 0){
            setBeneficial(searchData[selectedItem].companyName);
            console.log(searchData[selectedItem].companyName);
            setSearch(searchData[selectedItem].companyName);
            setSelectedItem(-1)
            setSearchData([]);
            setOpenlist(false)
            }
        }
        else{
            selectedItem(-1)
        }
        if (e.key === "Enter") {
            setSearchData([]);
        }
    }

    useEffect(() => {
        if (isSuccess) {
            const { data: dt } = data;
            const { suppliers: sups } = dt;
            sup = sups;
            console.log(sup);
            if (search === '' || search !== '') {
                console.log(searchData)
                const newfilteredData=sup.filter((rcp)=>{
                   return rcp.companyName.toLowerCase().includes(search.toLowerCase())
                });
                setSearchData(newfilteredData)
            }
            else{
                setSearchData([]);
            }
        }
       
    }, [search,isSuccess]);


    const handleEntry = (e) => {
        setFormval((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
        if (e.target.name === 'mineralType') {
            if (e.target.value === 'mixed') {
                setExtraform(!extrafom);
            }
            else {
                setExtraform(false);
            }
        }

    };
    const handleAddDate = (e) => {
        setFormval((prevState) => ({ ...prevState, date: dayjs(e).format('MMM/DD/YYYY') }));
    };
    const handleCheck = () => {
        setchecked((prev)=>!prev);
        console.log(checked)
        if (Boolean(checked) === false ) {
            setFormval({ ...formval, Beneficiary: beneficial });
        }
        else if(Boolean(checked) === true ) {
            setFormval({ ...formval, Beneficiary: '' });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formval);
    };
    const handleCancel = () => {
        setFormval({ grossQty: "", netQty: "", companyName: "", licenseNumber: "", TINNumber: '', email: '', companyRepresentative: "", representativeId: "", representativePhoneNbr: "", date: "", mineTagsNbr: "", mineTags: '', negociantTags: '', mineralType: '', mineralgrade: '', mineralprice: '', shipmentnumber: '', Beneficiary: '' })
        console.log(checked)
    };
    // useEffect(()=>{

    // },[isSuccess])
    // if (isSuccess) {
    //     const { data: dt } = data;
    //     const { suppliers: sups } = dt;
    //     sup = sups;
    //     console.log(sup);
    // }
    return (
        <>
            <ActionsPagesContainer title={'Register entry'}
                subTitle={'Add new entry'}
                actionsContainer={<AddComponent component={
                    <div className="grid grid-cols-1 gap-1">
                        <ul className="grid grid-cols-1 gap-1 gap-x-2 md:grid-cols-2 lg:grid-cols-3 pb-12">
                            <li className="space-y-2 relative">
                                <p className="pl-1">Trade in Company</p>
                                <span className="flex items-center border w-full rounded-md p-2">
                                    <input type="text" name="search" id="search" autoComplete="off" placeholder="search supplier" className=" focus:outline-none  w-full" value={search || ''} onChange={handleSearch}
                                    onKeyDown={handleKeydown} 
                                    onClick={()=>setOpenlist(true)}/>
                                    <span className="flex items-center gap-2 rounded-tl-md rounded-bl-md">
                                        {search === '' ? <FiSearch className=" text-xl" /> : <GrClose className=" text-xl" onClick={handleSearchCancel} />
                                        }
                                    </span>
                                </span>
                               {openlist && <ul className=" bg-slate-100 absolute w-full overflow-auto rounded-md z-50 max-h-[400px] shadow-xl">
                                    {searchData.map(({ _id, companyName }, index) =>
                                        <li className={` p-2 hover:bg-zinc-400 ${selectedItem===index? 'bg-zinc-400':''}`} key={_id} onClick={()=>{handleSelectedSearch(companyName)}}>{`${index}) ${companyName}`}</li>
                                    )}
                                </ul>}



                                {/* <input list="suppliers" name="search" id="search" autoComplete="off" placeholder="search supplier" className=" py-1 focus:outline-none  w-full" />
                            <datalist id="suppliers" className="w-full h-full bg-slate-100 max-w-[240px] p-2 rounded-md shadow-md">
                                <option value="Chrome"></option>
                                <option value="Firefox"></option>
                                <option value="Opera"></option>
                                <option value="Safari"></option>
                                <option value="Microsoft Edge"></option>
                            </datalist> */}
                            </li>
                            {/* <ul className=" bg-slate-100 max-w-[240px] p-2 rounded-md shadow-md">
      {sup.map(({companyName,_id}) => (
        <li key={_id}>{companyName}</li>
      ))}
    </ul> */}
{/* 
                          <li className=" space-y-2">
                          <p>Trade in Company</p>
                          <select autoComplete="off" required name="search supplier" id="search supplier" className="focus:outline-none p-2 border rounded-md w-full" onChange={handleSearch} >
                                {sup.map(({ companyName},index) => (
                                    <option value={_id} key={index} >{companyName}</option>
                                ))}
                            </select>
                          </li>  */}
                            {/* **** */}
                            <li className=" space-y-2">
                                <p className="pl-1">Minerals Types</p>
                                <select autoComplete="off" name="mineralType" id="mineralType" className="focus:outline-none p-2 border rounded-md w-full" value={formval.mineralType || ''} onChange={handleEntry} >
                                    <option value="casiterite">Casiterite</option>
                                    <option value="coltan">Coltan</option>
                                    <option value="wolframite">Wolframite</option>
                                    <option value="berlyium">Berlyium</option>
                                    <option value="lithium">Lithium</option>
                                    <option value="mixed">Mixed</option>
                                </select>
                            </li>
                        </ul>
                        {/* <span className=" flex gap-2 items-center">
                            <span className={`border h-4 w-9 rounded-xl p-[0.5px] duration-200 transform ease-in-out flex ${checked ? ' justify-end bg-green-400' : ' justify-start bg-slate-400'}`} onClick={handleCheck}>
                                <span className={` w-4 h- border bg-white rounded-full `}></span>
                            </span>
                            <p>Beneficiary</p>
                        </span> */}

                        <ul className="list-none grid gap-4 items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                            {admin.role === 'admin' ? (<>
                                <li className=" space-y-1">
                                    <p className="pl-1">Company name</p>
                                    <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="companyName" id="companyName" value={formval.companyName || ''} onChange={handleEntry} />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Email</p>
                                    <input type="email" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="email" id="email" value={formval.email || ''} onChange={handleEntry} />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">TIN Number</p>
                                    <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="TINNumber" id="TINNumber" value={formval.TINNumber || ''} onChange={handleEntry} />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Licence number</p>
                                    <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="licenseNumber" id="licenseNumber" value={formval.licenseNumber || ''} onChange={handleEntry} />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Company representative</p>
                                    <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="companyRepresentative" id="companyRepresentative" value={formval.companyRepresentative || ''} onChange={handleEntry} />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Representative ID number</p>
                                    <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="representativeId" id="representativeId" value={formval.representativeId || ''} onChange={handleEntry} />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Representative phone nbr</p>
                                    <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="representativePhoneNbr" id="representativePhoneNbr" value={formval.representativePhoneNbr || ''} onChange={handleEntry} />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Date</p>
                                    <DatePicker onChange={handleAddDate} id="date" name="date" className=" focus:outline-none p-2 border rounded-md w-full" />
                                </li>
                                <li className=" space-y-2">
                                    <p className="pl-1">Minerals Types</p>
                                    <select autoComplete="off" name="mineralType" id="mineralType" className="focus:outline-none p-2 border rounded-md w-full" value={formval.mineralType || ''} onChange={handleEntry} >
                                        <option value="casiterite">Casiterite</option>
                                        <option value="coltan">Coltan</option>
                                        <option value="wolframite">Wolframite</option>
                                        <option value="berlyium">Berlyium</option>
                                        <option value="lithium">Lithium</option>
                                        <option value="mixed">Mixed</option>
                                    </select>
                                    {/* <input type="text" required autoComplete="off" className={`focus:outline-none p-2 border rounded-md w-full ${extrafom ? 'block' : 'hidden'}`} name="extraForm" id="extraForm" onChange={handleExtraForm} /> */}
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Weight in</p>
                                    <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="grossQty" id="grossQty" value={formval.grossQty || ''} onChange={handleEntry} />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Weight out</p>
                                    <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="netQty" id="netQty" value={formval.netQty || ''} onChange={handleEntry} />
                                </li>
                                <li className=" space-y-1">
                                    <p className="pl-1">Mine tags Number</p>
                                    <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="mineTagsNbr" id="mineTagsNbr" value={formval.mineTagsNbr || ''} onChange={handleEntry} />
                                </li>
                                <li className=" space-y-1">
                                    <span className=" flex gap-2 items-center">
                                        <p>Beneficiary</p>
                                        <span className={`border h-4 w-9 rounded-xl p-[0.5px] duration-200 transform ease-in-out flex ${checked ? ' justify-end bg-green-400' : ' justify-start bg-slate-400'}`} onClick={handleCheck}>
                                            <span className={` w-4 h- border bg-white rounded-full `}></span>
                                        </span>
                                    </span>
                                    <input type="text" autoComplete="off" disabled={checked} className="focus:outline-none p-2 border rounded-md w-full" name="Beneficiary" id="Beneficiary" value={formval.Beneficiary || ''} onChange={handleEntry} />
                                </li>
                            </>) : null}

                            {admin.role === 'admin' ? (
                                <>
                                    <li className=" space-y-1">
                                        <p className="pl-1">Mine tags</p>
                                        <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="mineTags" id="mineTags" value={formval.mineTags || ''} onChange={handleEntry} />
                                    </li>
                                    {/* ***** */}
                                    <li className=" space-y-1">
                                        <p className="pl-1">Negociant Tags</p>
                                        <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="negociantTags" id="negociantTags" value={formval.negociantTags || ''} onChange={handleEntry} />
                                    </li>
                                    {/* ***** */}
                                    <li className=" space-y-1">
                                        <p className="pl-1">Shipment number</p>
                                        <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="shipmentnumber" id="shipmentnumber" value={formval.shipmentnumber || ''} onChange={handleEntry} />
                                    </li>
                                    {/* ***** */}
                                    <li className=" space-y-1">
                                        <p className="pl-1">Lot number</p>
                                        <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="lotnumber" id="lotnumber" value={formval.lotnumber || ''} onChange={handleEntry} />
                                    </li>
                                    {/* ***** */}
                                </>
                            ) : null}
                            {admin.role === 'admin' ? (
                                <>
                                    <li className=" space-y-1">
                                        <p className="pl-1">Mineral grade</p>
                                        <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="mineralgrade" id="mineralgrade" value={formval.mineralgrade || ''} onChange={handleEntry} />
                                    </li>
                                    {/* ***** */}
                                    <li className=" space-y-1">
                                        <p className="pl-1">Mineral price</p>
                                        <input type="text" autoComplete="off" className="focus:outline-none p-2 border rounded-md w-full" name="mineralprice" id="mineralprice" value={formval.mineralprice || ''} onChange={handleEntry} />
                                    </li>
                                    {/* ***** */}

                                </>
                            ) : null}
                        </ul>
                    </div>
                }
                    Add={handleSubmit}
                    Cancel={handleCancel} />} />
        </>
    )
}
export default StoreKeeperData;