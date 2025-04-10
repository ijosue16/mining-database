// import React, {useEffect, useRef, useState} from "react";
// import {motion} from "framer-motion";
// import {Button, Form, Input, message, Modal, Table, Upload} from "antd";
// import {UploadOutlined} from "@ant-design/icons";
// import AddComponent from "../../../components/Actions components/AddComponent";
// import {BiSolidEditAlt} from "react-icons/bi";
// import {PiDotsThreeVerticalBold} from "react-icons/pi";
// import {ImSpinner2} from "react-icons/im";
// import {FaImage, FaSave} from "react-icons/fa";
// import {MdOutlineClose, MdPayments} from "react-icons/md";
// import {useDeleteGradeImgMutation, useGetEntryQuery, useUpdateEntryMutation} from "@/states/apislice.js";
// import {useNavigate} from "react-router-dom";
// import FetchingPage from "../../FetchingPage";
// import {useSelector} from "react-redux";
// import {IoClose} from "react-icons/io5";
// import {decidePricingGrade, filterColumns, getBase64FromServer} from "@/components/helperFunctions.js";
// import {TbReport} from "react-icons/tb";
// import {LotExpandable, PricingGrade} from "../../HelpersJsx";
// import ConfirmFooter from "../../../components/modalsfooters/ConfirmFooter";
// import DetailsPageContainer from "../../../components/Actions components/DetailsComponentscontainer";
//
//
// const ColtanEntryCompletePage = ({entryId}) => {
//     const {permissions: userPermissions} = useSelector(state => state.persistedReducer?.global);
//     // const {entryId} = useParams();
//     const navigate = useNavigate();
//     const [form] = Form.useForm();
//     const [selectedLotNumber, setSelectedLotNumber] = useState(null);
//     const [imageAvailable, setImageAvailable] = useState(false);
//     // const [decision, setDecision] = useState("");
//     const {data, isLoading, isError, isSuccess, error,} =
//         useGetEntryQuery({entryId, model: "coltan"},
//             {
//                 skip: entryId === undefined,
//                 refetchOnMountOrArgChange: true,
//                 refetchOnReconnect: true
//             }
//         );
//     const [updateEntry, {
//         isSuccess: isUpdateSuccess,
//         isLoading: isSending,
//         isError: isUpdateError,
//         error: updateError
//     }] = useUpdateEntryMutation();
//
//
//     const [
//         deleteGradeImg,
//         {
//             isSuccess: isImageDeleteSuccess,
//             isError: isImageDeleteError,
//             error: imageDeleteError,
//         },
//     ] = useDeleteGradeImgMutation();
//
//     let modalRef = useRef();
//
//     const handleClickOutside = (event) => {
//         if (!modalRef.current || !modalRef.current.contains(event.target)) {
//             setShow(false);
//         }
//     };
//
//     useEffect(() => {
//         document.addEventListener("click", handleClickOutside, true);
//         return () => {
//             document.removeEventListener("click", handleClickOutside, true);
//         };
//     }, []);
//
//     useEffect(() => {
//         if (isUpdateSuccess) {
//             return message.success("Entry updated successfully");
//         } else if (isUpdateError) {
//             const {message: errorMessage} = updateError.data;
//             return message.error(errorMessage);
//         }
//     }, [isUpdateError, isUpdateSuccess, updateError]);
//     const [formval, setFormval] = useState({
//         lat: "",
//         long: "",
//         name: "",
//         code: "",
//     });
//     const [selectedRow, SetSelectedRow] = useState({
//         id: null,
//         name: "",
//         date: "",
//     });
//     const [suply, setSuply] = useState([]);
//     const [lotInfo, setLotInfo] = useState(null);
//     const [editingRow, setEditingRow] = useState(null);
//     const [editRowKey, setEditRowKey] = useState("");
//     const [show, setShow] = useState(false);
//     const [showPayModel, setShowPayModel] = useState(false);
//
//
//     const [previewVisible, setPreviewVisible] = useState(false);
//     const [previewImage, setPreviewImage] = useState("");
//
//     const handleClose = () => {
//         setPreviewVisible(false);
//     };
//
//     const handlePreview = async (fileUrl) => {
//         // const fileUrl = 'https://mining-company-management-system.onrender.com/data/coltan/DSC_0494.jpg';
//         const previewedUrl = await getBase64FromServer(fileUrl);
//         setPreviewImage(previewedUrl);
//         setPreviewVisible(true);
//     };
//
//     const props = {
//         onChange: (info) => {
//             if (info.file.status === "done") {
//                 message.success(`${info.file.name} file uploaded successfully`);
//             } else if (info.file.status === "error") {
//                 message.error(`${info.file.name} file upload failed.`);
//             }
//         },
//     };
//
//     const customRequest = async ({file, onSuccess, onError, lotNumber}) => {
//         const formData = new FormData();
//         formData.append(lotNumber, file);
//         await updateEntry({entryId, body: formData, model: "coltan"});
//     };
//
//     const beforeUpload = (file) => {
//         const isPNG = file.type === "image/png" || file.type === "image/jpeg";
//         if (!isPNG) {
//             message.error(`${file.name} is not a .png or .jpeg file`);
//         }
//         return isPNG || Upload.LIST_IGNORE;
//     };
//
//     const removeFile = async (lotNumber, entryId) => {
//         const body = {lotNumber};
//         await deleteGradeImg({body, entryId, model: "coltan"});
//     };
//
//     useEffect(() => {
//         if (isImageDeleteSuccess) {
//             message.success("File successfully deleted");
//         } else if (isImageDeleteError) {
//             const {message: deleteError} = imageDeleteError.data;
//             message.error(deleteError);
//         }
//     }, [isImageDeleteSuccess, isImageDeleteError, imageDeleteError]);
//
//
//     useEffect(() => {
//         if (isSuccess || isUpdateSuccess) {
//             const {data: info} = data;
//             const {entry: entr} = info;
//             setSuply(entr);
//             setLotInfo(entr.output);
//         }
//     }, [isSuccess, data, isUpdateSuccess]);
//
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const body = {...suply, output: lotInfo};
//         await updateEntry({body, entryId, model: "coltan"});
//     };
//     const handleModelAdvance = async () => {
//         const body = {...suply, output: lotInfo};
//         await updateEntry({body, entryId, model: "coltan"});
//         navigate(`/payment/coltan/${suply._id}/${selectedLotNumber}`);
//     };
//
//     const handleCancel = () => {
//         setFormval({lat: "", long: "", name: "", code: ""});
//         navigate(-1);
//     };
//
//     const isEditing = (record) => {
//         return record._id === editRowKey;
//     };
//     const edit = (record) => {
//         form.setFieldsValue({
//             weightOut: record.weightOut,
//             rmaFee: record.rmaFee,
//             ...record,
//         });
//         setEditRowKey(record._id);
//         setShow(false);
//     };
//     const calculatePricePerUnit = (tantal, grade) => {
//         if (tantal && grade) {
//             return (tantal * grade);
//         }
//     }
//     const save = async (key) => {
//         const row = await form.validateFields();
//         const newData = [...lotInfo];
//         const index = newData.findIndex((item) => key === item._id);
//         if (index > -1) {
//             const item = newData[index];
//             const updatedItem = {
//                 ...item,
//                 ...row,
//             };
//             if (item.nonSellAgreement !== updatedItem.nonSellAgreement) {
//                 if (parseFloat(updatedItem.nonSellAgreement) > parseFloat(updatedItem.cumulativeAmount)) {
//                     return message.error("Non Sell Agreement Amount cannot be greater than Weight Out", 5);
//                 }
//                 if (Boolean(item.nonSellAgreement) === true && Boolean(updatedItem.nonSellAgreement) === false) {
//                     return message.error("Non Sell Agreement Amount cannot be empty", 5);
//                 }
//                 if (updatedItem.nonSellAgreement > 0) {
//                     updatedItem.nonSellAgreement = {weight: updatedItem.weightOut};
//                     updatedItem.cumulativeAmount = 0;
//                 } else {
//                     updatedItem.nonSellAgreement = {weight: 0};
//                     updatedItem.cumulativeAmount = updatedItem.weightOut;
//                 }
//             }
//             if (item.mineralGrade !== updatedItem.mineralGrade) {
//                 if (parseFloat(updatedItem.mineralGrade) === 0) return message.error("Mineral Grade cannot be zero", 5);
//                 if (Boolean(item.mineralGrade) === true && Boolean(updatedItem.mineralGrade) === false)
//                     return message.error("Mineral Grade cannot be empty or zero", 5);
//             }
//             if (item.ASIR !== updatedItem.ASIR) {
//                 if (parseFloat(updatedItem.ASIR) === 0) return message.error("ASIR cannot be zero", 5);
//                 if (Boolean(item.ASIR) === true && Boolean(updatedItem.ASIR) === false)
//                     return message.error("ASIR cannot be empty or zero", 5);
//             }
//             if (parseFloat(item.USDRate) !== parseFloat(updatedItem.USDRate)) {
//                 if (parseFloat(updatedItem.USDRate) === 0) return message.error("USD rate cannot be zero", 5);
//                 if (Boolean(item.USDRate) === true && Boolean(updatedItem.USDRate) === false)
//                     return message.error("USD rate cannot be empty or zero", 5);
//             }
//             if (parseFloat(item.tantalum) !== parseFloat(updatedItem.tantalum)) {
//                 if (parseFloat(updatedItem.tantalum) === 0) return message.error("Tantal cannot be zero", 5);
//                 if (Boolean(item.tantalum) === true && Boolean(updatedItem.tantalum) === false)
//                     return message.error("Tantal cannot be empty or zero", 5);
//             }
//             if (Boolean(updatedItem.tantalum) === true && updatedItem.pricingGrade && Boolean(updatedItem[decidePricingGrade(updatedItem.pricingGrade)]) === true && parseFloat(updatedItem[decidePricingGrade(updatedItem.pricingGrade)]) !== 0 && parseFloat(updatedItem.tantalum) !== 0) {
//                 updatedItem.pricePerUnit = calculatePricePerUnit(parseFloat(updatedItem.tantalum), parseFloat(updatedItem[decidePricingGrade(updatedItem.pricingGrade)])).toFixed(5) || null;
//             }
//             if (Boolean(updatedItem.pricePerUnit) === true) {
//                 updatedItem.mineralPrice = (updatedItem.pricePerUnit * parseFloat(updatedItem.weightOut)).toFixed(5) || null;
//             }
//             newData.splice(index, 1, updatedItem);
//             setLotInfo(newData);
//             setEditRowKey("");
//             const body = {output: [updatedItem]};
//             await updateEntry({body, entryId, model: "coltan"});
//         }
//     };
//     const handleActions = (id) => {
//         setShow(!show);
//         SetSelectedRow(id);
//     };
//     const restrictedColumns = {
//         ASIR: {
//             title: "ASIR",
//             dataIndex: "ASIR",
//             key: "ASIR",
//             table: true,
//         },
//         mineralGrade: {
//             title: "Grade-SMC(%)",
//             dataIndex: "mineralGrade",
//             key: "mineralGrade",
//             table: true,
//             // editTable: true, // adjust edit permission based on user permissions
//         },
//         tantal: {
//             title: "Tantal ($)",
//             dataIndex: "tantal",
//             key: "tantal",
//             table: true,
//             // sorter: (a, b) => a.tantalum - b.tantalum,
//         },
//         gradeImg: {
//             title: "Grade Img",
//             dataIndex: "gradeImg",
//             key: "gradeImg",
//             width: 100,
//             // editTable: true,
//             table: true,
//             render: (_, record) => {
//                 if (record.gradeImg?.filePath !== null) {
//                     return (
//                         <div>
//                             <div className="flex items-center">
//                                 <Button onClick={() => handlePreview(record.gradeImg.filePath)}
//                                         icon={<FaImage title="Preview" className="text-lg"/>}/>
//                                 {userPermissions.gradeImg.edit && (<IoClose title="Delete" className="text-lg"
//                                                                             onClick={() => removeFile(record.lotNumber, entryId)}/>)}
//                             </div>
//                         </div>
//                     )
//                 } else {
//                     return (
//                         <Upload
//                             beforeUpload={beforeUpload}
//                             {...props}
//                             customRequest={async ({file, onSuccess, onError}) => customRequest({
//                                 file,
//                                 onSuccess,
//                                 onError,
//                                 lotNumber: record.lotNumber
//                             })}
//                             onRemove={() => removeFile(record.lotNumber, entryId)}
//                         >
//                             <Button icon={<UploadOutlined/>}/>
//                         </Upload>
//                     )
//                 }
//
//             }
//         },
//         pricingGrade: {
//             title: "Pricing Grade",
//             dataIndex: "pricingGrade",
//             key: "pricingGrade",
//             table: true,
//             width: 80,
//             render: (_, record) => {
//                 return (
//                     <PricingGrade
//                         value={record.pricingGrade ? record.pricingGrade : ""}
//                         lotNumber={record.lotNumber}
//                         updateEntry={updateEntry}
//                         entryId={entryId}
//                         model={"coltan"}
//                     />
//                 )
//
//             }
//         },
//         pricePerUnit: {
//             title: "price/kg ($)",
//             dataIndex: "pricePerUnit",
//             key: "pricePerUnit",
//             table: true,
//             render: (_, record) => {
//                 if (record.pricePerUnit) {
//                     return <span>{Number(record.pricePerUnit).toFixed(5)}</span>
//                 }
//             }
//         },
//         mineralPrice: {
//             title: "Price ($)",
//             dataIndex: "mineralPrice",
//             key: "mineralPrice",
//             table: true,
//             render: (_, record) => {
//                 if (record.mineralPrice) {
//                     return <span>{Number(record.mineralPrice).toFixed(5)}</span>
//                 }
//             }
//         },
//         netPrice: {
//             title: "Net Price ($)",
//             dataIndex: "netPrice",
//             key: "netPrice",
//             table: true,
//         },
//         paid: {
//             title: "paid ($)",
//             dataIndex: "paid",
//             key: "paid",
//             table: false,
//         },
//         unpaid: {
//             title: "unpaid ($)",
//             dataIndex: "unpaid",
//             key: "unpaid",
//             table: false,
//         },
//         rmaFeeRWF: {
//             title: "RMA Fee (RWF)",
//             dataIndex: "rmaFeeRWF",
//             key: "rmaFeeRWF",
//             table: false,
//         },
//         USDRate: {
//             title: "USD Rate (rwf)",
//             dataIndex: "USDRate",
//             key: "USDRate",
//             table: false,
//         },
//         rmaFeeUSD: {
//             title: "RMA Fee ($)",
//             dataIndex: "rmaFeeUSD",
//             key: "rmaFeeUSD",
//             table: false,
//         },
//         sampleIdentification: {
//             title: "Sample Identification",
//             dataIndex: "sampleIdentification",
//             key: "sampleIdentification",
//             table: false,
//         },
//         niobium: {
//             title: "Niobium",
//             dataIndex: "niobium",
//             key: "niobium",
//             table: false,
//         },
//         iron: {
//             title: "Iron",
//             dataIndex: "iron",
//             key: "iron",
//             table: false,
//         },
//         rmaFeeDecision: {
//             title: "RMA Fee Decision",
//             dataIndex: "rmaFeeDecision",
//             key: "rmaFeeDecision",
//             table: false,
//         },
//         nonSellAgreement: {
//             title: "non-sell agreement (KG)",
//             dataIndex: "nonSellAgreement",
//             key: "nonSellAgreement",
//             editTable: true,
//             table: false,
//             render: (_, record) => {
//                 if (record.nonSellAgreement?.weight) {
//                     return <span>{record.nonSellAgreement?.weight}</span>
//                 }
//             }
//         }
//     }
//     const columns = [
//         {
//             title: "#",
//             dataIndex: "lotNumber",
//             key: "lotNumber",
//         },
//         {
//             title: "weight out (KG)",
//             dataIndex: "weightOut",
//             key: "weightOut",
//             // editTable: true,
//         },
//         {
//             title: "balance (KG)",
//             dataIndex: "cumulativeAmount",
//             key: "cumulativeAmount",
//         },
//     ];
//
//     if (restrictedColumns && userPermissions && columns) {
//         filterColumns(restrictedColumns, userPermissions, columns, "coltan");
//         columns.push({
//             title: "Action",
//             dataIndex: "action",
//             key: "action",
//             render: (_, record) => {
//                 const editable = isEditing(record);
//                 return (
//                     <>
//                         <div className="flex items-center gap-2">
//                             {editable ? null : (
//                                 <>
//                   <span className="relative">
//                     <PiDotsThreeVerticalBold
//                         className=" text-xl"
//                         onClick={() => handleActions(record._id)}
//                     />
//                       {selectedRow === record._id && (
//                           <motion.ul
//                               ref={modalRef}
//                               animate={
//                                   show
//                                       ? {opacity: 1, x: -10, display: "block"}
//                                       : {opacity: 0, x: 0, display: "none"}
//                               }
//                               className={` border bg-white z-20 shadow-md rounded absolute -left-[200px] w-[200px] space-y-2`}
//                           >
//                               <li
//                                   className="flex gap-4 p-2 items-center hover:bg-slate-100"
//                                   onClick={() => edit(record)}
//                               >
//                                   <BiSolidEditAlt className=" text-lg"/>
//                                   <p>edit</p>
//                               </li>
//
//                               { /* // TODO 8: USE CORRECT PERMISSION OBJECT INSTEAD OF ENTRY */}
//
//                               {/*{userPermissions.entry?.create ? (*/}
//                               {/*    <li*/}
//                               {/*        className="flex gap-4 p-2 items-center hover:bg-slate-100"*/}
//                               {/*        onClick={() => navigate(`/lab-report/coltan/${entryId}/${record.lotNumber}`)}*/}
//                               {/*    >*/}
//                               {/*        <TbReport className=" text-lg"/>*/}
//                               {/*        <p>Lab Report</p>*/}
//                               {/*    </li>*/}
//                               {/*) : null}*/}
//
//                               {userPermissions.payments?.create ? (
//                                   <li
//                                       className="flex gap-4 p-2 items-center hover:bg-slate-100"
//                                       onClick={() => {
//                                           setSelectedLotNumber(record.lotNumber);
//                                           setShowPayModel(true);
//                                       }}
//                                   >
//                                       <MdPayments className=" text-lg"/>
//                                       <p>Pay</p>
//                                   </li>
//                               ) : null}
//                           </motion.ul>
//                       )}
//                   </span>
//                                 </>
//                             )}
//
//                             {editable ? (
//                                 <div className="flex items-center gap-3">
//                                     <FaSave
//                                         className=" text-xl"
//                                         onClick={() => save(record._id)}
//                                     />
//                                     <MdOutlineClose
//                                         className=" text-xl"
//                                         onClick={() => setEditRowKey("")}
//                                     />
//                                 </div>
//                             ) : null}
//                         </div>
//                     </>
//                 );
//             },
//         });
//     }
//
//     const mergedColumns = columns.map((col) => {
//         if (!col.editTable) {
//             return col;
//         }
//         return {
//             ...col,
//             onCell: (record) => ({
//                 record,
//                 dataIndex: col.dataIndex,
//                 title: col.title,
//                 editing: isEditing(record),
//             }),
//         };
//     });
//
//     const EditableCell = ({
//                               editing,
//                               dataIndex,
//                               title,
//                               record,
//                               children,
//                               ...restProps
//                           }) => {
//         const input = (
//             <Input
//                 style={{margin: 0}}
//                 type={"number"}
//                 onWheelCapture={(e) => {
//                     e.target.blur();
//                 }}
//             />
//         );
//         return (
//             <td {...restProps}>
//                 {editing ? (
//                     <Form.Item name={dataIndex} style={{margin: 0}}>
//                         {input}
//                     </Form.Item>
//                 ) : (
//                     children
//                 )}
//             </td>
//         );
//     };
//     return (
//         <>
//             {isLoading ? (
//                 <FetchingPage/>
//             ) : (
//                 <DetailsPageContainer
//                     title={"LOT DETAILS"}
//                     // subTitle={"View Coltan detailes"}
//                     actionsContainer={
//                         <AddComponent
//                             component={
//                                 <>
//                                     <div className="w-full">
//                                         <Form form={form} component={false}>
//                                             <Table
//                                                 className="overflow-x-auto w-full"
//                                                 loading={{
//                                                     indicator: (<ImSpinner2 style={{width: "60px", height: "60px"}}
//                                                                             className="animate-spin text-gray-500"/>),
//                                                     spinning: isLoading
//                                                 }}
//                                                 dataSource={lotInfo}
//                                                 columns={mergedColumns}
//                                                 rowClassName={(record) => {
//                                                     if (record.status === "non-sell agreement") {
//                                                         return "bg-red-200";
//                                                     }
//                                                 }}
//                                                 bordered={true}
//                                                 expandable={{
//                                                     expandedRowRender: record => {
//                                                         return (
//                                                             <LotExpandable
//                                                                 entryId={entryId}
//                                                                 record={record}
//                                                                 updateEntry={updateEntry}
//                                                                 userPermissions={userPermissions}
//                                                                 restrictedColumns={restrictedColumns}
//                                                                 isProcessing={isSending}
//                                                                 model={"coltan"}
//                                                             />
//                                                         )
//
//                                                     },
//                                                     rowExpandable: (record) => record,
//                                                 }}
//                                                 components={{
//                                                     body: {
//                                                         cell: EditableCell,
//                                                     },
//                                                 }}
//                                                 rowKey="_id"
//                                             />
//                                         </Form>
//                                     </div>
//                                     <Modal
//                                         open={showPayModel}
//                                         onOk={""}
//                                         onCancel={() => setShowPayModel(!showPayModel)}
//                                         destroyOnClose
//                                         footer={[
//                                             <ConfirmFooter
//                                                 key={"actions"
//                                                 } isSending={isSending} defText={"Confirm"} dsText={"Sending"} handleCancel={() => setShowPayModel(!showPayModel)}
//                                                 handleConfirm={handleModelAdvance}/>
//                                         ]}
//                                     >
//                                         <h2 className="modal-title text-center font-bold text-xl">
//                                             Proceed Payment
//                                         </h2>
//                                         <p className="text-center text-lg">
//                                             {`Please verify all the information before proceeding`}.
//                                         </p>
//                                     </Modal>
//
//                                     <Modal
//                                         width={"70%"}
//                                         open={previewVisible}
//                                         title="Image Preview"
//                                         footer={null}
//                                         onCancel={handleClose}
//                                     >
//                                         <img
//                                             alt="example"
//                                             style={{width: "100%", height: "100%"}}
//                                             src={previewImage}
//                                         />
//                                     </Modal>
//                                 </>
//                             }
//                             Add={handleSubmit}
//                             Cancel={handleCancel}
//                             isloading={isSending}
//                         />
//                     }
//                 />
//             )}
//         </>
//     );
// }
// export default ColtanEntryCompletePage;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { message, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

// Shadcn UI components
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

// Icons
import { BiSolidEditAlt } from "react-icons/bi";
import { FaImage, FaSave } from "react-icons/fa";
import { MdPayments } from "react-icons/md";
import { TbReport } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { MoreVertical, Loader2 } from "lucide-react";

// API hooks and helper functions
import {
    useDeleteGradeImgMutation,
    useGetEntryQuery,
    useUpdateEntryMutation,
} from "@/states/apislice.js";
import { decidePricingGrade, filterColumns, getBase64FromServer } from "@/components/helperFunctions.js";

// Components
import FetchingPage from "../../FetchingPage";
import { LotExpandable, PricingGrade } from "../../HelpersJsx";
import DetailsPageContainer from "../../../components/Actions components/DetailsComponentscontainer";
import { useForm } from "react-hook-form";

const ColtanEntryCompletePage = ({ entryId }) => {
    // Form and navigation
    const navigate = useNavigate();
    const form = useForm();

    // State management
    const [selectedLotNumber, setSelectedLotNumber] = useState(null);
    const [suply, setSuply] = useState({});
    const [lotInfo, setLotInfo] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentEditRow, setCurrentEditRow] = useState(null);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    // Get user permissions from Redux store
    const { permissions: userPermissions } = useSelector(state => state.persistedReducer?.global);

    // API Queries and Mutations
    const {
        data,
        isLoading,
        isSuccess,
    } = useGetEntryQuery(
        { entryId, model: "coltan" },
        {
            skip: entryId === undefined,
            refetchOnMountOrArgChange: true,
            refetchOnReconnect: true,
        }
    );

    const [updateEntry, {
        isSuccess: isUpdateSuccess,
        isLoading: isSending,
        isError: isUpdateError,
        error: updateError,
    }] = useUpdateEntryMutation();

    const [deleteGradeImg, {
        isSuccess: isImageDeleteSuccess,
        isError: isImageDeleteError,
        error: imageDeleteError,
    }] = useDeleteGradeImgMutation();

    // Image preview handlers
    const handlePreview = async (fileUrl) => {
        const previewedUrl = await getBase64FromServer(fileUrl);
        setPreviewImage(previewedUrl);
        setPreviewVisible(true);
    };

    const handleClosePreview = () => {
        setPreviewVisible(false);
    };

    // // File upload handlers
    const customRequest = async ({ file, lotNumber }) => {
        const formData = new FormData();
        formData.append(lotNumber, file);
        await updateEntry({ entryId, body: formData, model: "coltan" });
    };

    // const customRequest = async ({file, onSuccess, onError, lotNumber}) => {
    //     const formData = new FormData();
    //     formData.append(lotNumber, file);
    //     await updateEntry({entryId, body: formData, model: "coltan"});
    // };

    const beforeUpload = (file) => {
        const isPNG = file.type === "image/png" || file.type === "image/jpeg";
        if (!isPNG) {
            message.error(`${file.name} is not a .png or .jpeg file`);
        }
        return isPNG || Upload.LIST_IGNORE;
    };

    const removeFile = async (lotNumber) => {
        const body = { lotNumber };
        await deleteGradeImg({ body, entryId, model: "coltan" });
    };

    // Calculate price per unit
    const calculatePricePerUnit = (tantal, grade) => {
        if (tantal && grade) {
            return (tantal * grade);
        }
        return 0;
    };

    // Edit modal handlers
    const openEditModal = (row) => {
        setCurrentEditRow(row);
        // console.log('row', row);
        form.reset({
            weightOut: row.weightOut,
            ASIR: row.ASIR,
            mineralGrade: row.mineralGrade,
            tantalum: row.tantal,
            USDRate: row.USDRate,
            nonSellAgreement: row.nonSellAgreement?.weight || 0,
        });
        setIsEditModalOpen(true);
    };

    const handleEditSave = async (values) => {
        if (!currentEditRow) return;

        const newData = [...lotInfo];
        const index = newData.findIndex((item) => currentEditRow._id === item._id);

        if (index > -1) {
            const item = newData[index];
            const updatedItem = { ...item, ...values };

            // Validation checks
            if (parseFloat(updatedItem.nonSellAgreement) > parseFloat(updatedItem.cumulativeAmount)) {
                message.error("Non Sell Agreement Amount cannot be greater than Weight Out", 5);
                return;
            }

            if (parseFloat(updatedItem.mineralGrade) === 0) {
                message.error("Mineral Grade cannot be zero", 5);
                return;
            }

            if (parseFloat(updatedItem.ASIR) === 0) {
                message.error("ASIR cannot be zero", 5);
                return;
            }

            if (parseFloat(updatedItem.USDRate) === 0) {
                message.error("USD rate cannot be zero", 5);
                return;
            }

            if (parseFloat(updatedItem.tantalum) === 0) {
                message.error("Tantalum cannot be zero", 5);
                return;
            }

            // Update non-sell agreement
            if (updatedItem.nonSellAgreement > 0) {
                updatedItem.nonSellAgreement = { weight: updatedItem.weightOut };
                updatedItem.cumulativeAmount = 0;
            } else {
                updatedItem.nonSellAgreement = { weight: 0 };
                updatedItem.cumulativeAmount = updatedItem.weightOut;
            }

            // Calculate pricing
            if (
                updatedItem.tantalum &&
                updatedItem.pricingGrade &&
                updatedItem[decidePricingGrade(updatedItem.pricingGrade)] &&
                parseFloat(updatedItem[decidePricingGrade(updatedItem.pricingGrade)]) !== 0 &&
                parseFloat(updatedItem.tantalum) !== 0
            ) {
                updatedItem.pricePerUnit = calculatePricePerUnit(
                    parseFloat(updatedItem.tantalum),
                    parseFloat(updatedItem[decidePricingGrade(updatedItem.pricingGrade)])
                ).toFixed(5) || null;
            }

            if (updatedItem.pricePerUnit) {
                updatedItem.mineralPrice = (updatedItem.pricePerUnit * parseFloat(updatedItem.weightOut)).toFixed(5) || null;
            }


            const newItem = {...updatedItem, tantal: parseFloat(updatedItem.tantalum)};
            newData.splice(index, 1, newItem);
            setLotInfo(newData);
            const body = { output: [newItem] };
            await updateEntry({ body, entryId, model: "coltan" });
            setIsEditModalOpen(false);
        }
    };

    // Payment modal handlers
    const handlePaymentModalOpen = (lotNumber) => {
        setSelectedLotNumber(lotNumber);
        setIsPaymentModalOpen(true);
    };

    const handleModelAdvance = async () => {
        const body = { ...suply, output: lotInfo };
        await updateEntry({ body, entryId, model: "coltan" });
        navigate(`/payment/coltan/${suply._id}/${selectedLotNumber}`);
    };

    // Form submission handlers
    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = { ...suply, output: lotInfo };
        await updateEntry({ body, entryId, model: "coltan" });
    };

    const handleCancel = () => {
        navigate(-1);
    };

    // Effects
    useEffect(() => {
        if (isSuccess || isUpdateSuccess) {
            const { data: info } = data;
            const { entry: entr } = info;
            setSuply(entr);
            setLotInfo(entr.output);
        }
    }, [isSuccess, data, isUpdateSuccess]);

    useEffect(() => {
        if (isUpdateSuccess) {
            message.success("Entry updated successfully");
        } else if (isUpdateError) {
            const { message: errorMessage } = updateError.data;
            message.error(errorMessage);
        }
    }, [isUpdateError, isUpdateSuccess, updateError]);

    useEffect(() => {
        if (isImageDeleteSuccess) {
            message.success("File successfully deleted");
        } else if (isImageDeleteError) {
            const { message: deleteError } = imageDeleteError.data;
            message.error(deleteError);
        }
    }, [isImageDeleteSuccess, isImageDeleteError, imageDeleteError]);

    // Define restricted columns for table
    const restrictedColumns = {
        ASIR: {
            title: "ASIR",
            dataIndex: "ASIR",
            key: "ASIR",
            table: true,
        },
        mineralGrade: {
            title: "Grade-SMC(%)",
            dataIndex: "mineralGrade",
            key: "mineralGrade",
            table: true,
        },
        tantal: {
            title: "Tantal ($)",
            dataIndex: "tantal",
            key: "tantal",
            table: true,
        },
        gradeImg: {
            title: "Grade Img",
            dataIndex: "gradeImg",
            key: "gradeImg",
            table: true,
            render: (_, record) => {
                if (record.gradeImg?.filePath !== null) {
                    return (
                        <div className="flex items-center">
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handlePreview(record.gradeImg.filePath)}
                            >
                                <FaImage className="mr-2" /> View
                            </Button>
                            {userPermissions.gradeImg.edit && (
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="ml-2"
                                    onClick={() => removeFile(record.lotNumber, entryId)}
                                >
                                    <IoClose />
                                </Button>
                            )}
                        </div>
                    );
                } else {
                    return (
                        <Upload
                            beforeUpload={beforeUpload}
                            customRequest={async ({ file }) => customRequest({
                                file,
                                lotNumber: record.lotNumber
                            })}
                            onRemove={() => removeFile(record.lotNumber, entryId)}
                        >
                            <Button size="sm" variant="outline">
                                <UploadOutlined className="mr-2" /> Upload
                            </Button>
                        </Upload>
                    );
                }
            }
        },
        pricingGrade: {
            title: "Pricing Grade",
            dataIndex: "pricingGrade",
            key: "pricingGrade",
            table: true,
            render: (_, record) => (
                <PricingGrade
                    value={record.pricingGrade ? record.pricingGrade : ""}
                    lotNumber={record.lotNumber}
                    updateEntry={updateEntry}
                    entryId={entryId}
                    model={"coltan"}
                />
            )
        },
        pricePerUnit: {
            title: "price/kg ($)",
            dataIndex: "pricePerUnit",
            key: "pricePerUnit",
            table: true,
            render: (_, record) => (
                record.pricePerUnit ? <span>{Number(record.pricePerUnit).toFixed(5)}</span> : null
            )
        },
        mineralPrice: {
            title: "Price ($)",
            dataIndex: "mineralPrice",
            key: "mineralPrice",
            table: true,
            render: (_, record) => (
                record.mineralPrice ? <span>{Number(record.mineralPrice).toFixed(5)}</span> : null
            )
        },
        netPrice: {
            title: "Net Price ($)",
            dataIndex: "netPrice",
            key: "netPrice",
            table: true,
        },
        paid: {
            title: "paid ($)",
            dataIndex: "paid",
            key: "paid",
            table: false,
        },
        unpaid: {
            title: "unpaid ($)",
            dataIndex: "unpaid",
            key: "unpaid",
            table: false,
        },
        rmaFeeRWF: {
            title: "RMA Fee (RWF)",
            dataIndex: "rmaFeeRWF",
            key: "rmaFeeRWF",
            table: false,
        },
        USDRate: {
            title: "USD Rate (rwf)",
            dataIndex: "USDRate",
            key: "USDRate",
            table: false,
        },
        rmaFeeUSD: {
            title: "RMA Fee ($)",
            dataIndex: "rmaFeeUSD",
            key: "rmaFeeUSD",
            table: false,
        },
        sampleIdentification: {
            title: "Sample Identification",
            dataIndex: "sampleIdentification",
            key: "sampleIdentification",
            table: false,
        },
        niobium: {
            title: "Niobium",
            dataIndex: "niobium",
            key: "niobium",
            table: false,
        },
        iron: {
            title: "Iron",
            dataIndex: "iron",
            key: "iron",
            table: false,
        },
        rmaFeeDecision: {
            title: "RMA Fee Decision",
            dataIndex: "rmaFeeDecision",
            key: "rmaFeeDecision",
            table: false,
        },
        nonSellAgreement: {
            title: "non-sell agreement (KG)",
            dataIndex: "nonSellAgreement",
            key: "nonSellAgreement",
            table: false,
            render: (_, record) => (
                record.nonSellAgreement?.weight ? <span>{record.nonSellAgreement?.weight}</span> : null
            )
        }
    };

    // Build columns array for shadcn table
    const baseColumns = [
        {
            title: "#",
            dataIndex: "lotNumber",
            key: "lotNumber",
        },
        {
            title: "weight out (KG)",
            dataIndex: "weightOut",
            key: "weightOut",
        },
        {
            title: "balance (KG)",
            dataIndex: "cumulativeAmount",
            key: "cumulativeAmount",
        }
    ];

    // Filter columns based on user permissions
    const visibleColumns = [];
    if (restrictedColumns && userPermissions && baseColumns) {
        visibleColumns.push(...baseColumns);
        filterColumns(restrictedColumns, userPermissions, visibleColumns, "coltan");
    }

    if (isLoading) {
        return <FetchingPage />;
    }

    return (
        <DetailsPageContainer
            title="LOT DETAILS"
            actionsContainer={
                <div className="w-full">
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {visibleColumns.map((column) => (
                                        <TableHead key={column.key}>{column.title}</TableHead>
                                    ))}
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {lotInfo.map((row) => (
                                    <TableRow
                                        key={row._id}
                                        className={row.status === "non-sell agreement" ? "bg-red-100" : ""}
                                    >
                                        {visibleColumns.map((column) => (
                                            <TableCell key={`${row._id}-${column.key}`}>
                                                {column.render
                                                    ? column.render(null, row)
                                                    : row[column.dataIndex]}
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="sm">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => openEditModal(row)}>
                                                        <BiSolidEditAlt className="mr-2" />
                                                        Edit
                                                    </DropdownMenuItem>

                                                    {userPermissions.payments?.create && (
                                                        <DropdownMenuItem onClick={() => handlePaymentModalOpen(row.lotNumber)}>
                                                            <MdPayments className="mr-2" />
                                                            Pay
                                                        </DropdownMenuItem>
                                                    )}

                                                    {/* Add Lab Report option if needed based on permissions */}
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        <Button variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={isSending}>
                            {isSending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FaSave className="mr-2" />
                                    Save
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Edit Modal */}
                    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                        <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle>Edit Lot</DialogTitle>
                                <DialogDescription>
                                    Update the details for this lot
                                </DialogDescription>
                            </DialogHeader>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleEditSave)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="weightOut"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Weight Out (KG)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="ASIR"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>ASIR</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="mineralGrade"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Grade-SMC (%)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="tantalum"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tantalum ($)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="USDRate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>USD Rate (RWF)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="nonSellAgreement"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Non-Sell Agreement (KG)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />

                                    <DialogFooter>
                                        <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={isSending}>
                                            {isSending ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                    Saving...
                                                </>
                                            ) : (
                                                "Save Changes"
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>

                    {/* Payment Modal */}
                    <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Proceed Payment</DialogTitle>
                                <DialogDescription>
                                    Please verify all the information before proceeding
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleModelAdvance} disabled={isSending}>
                                    {isSending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Confirm"
                                    )}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Image Preview Modal */}
                    <Dialog open={previewVisible} onOpenChange={setPreviewVisible}>
                        <DialogContent className="sm:max-w-xl">
                            <DialogHeader>
                                <DialogTitle>Image Preview</DialogTitle>
                            </DialogHeader>
                            <div className="flex items-center justify-center">
                                <img
                                    alt="Grade image"
                                    src={previewImage}
                                    className="max-w-full max-h-[70vh] object-contain"
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={handleClosePreview}>Close</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            }
        />
    );
};

export default ColtanEntryCompletePage;
