// import React,{useState,useRef,useEffect} from "react";
// import dayjs from "dayjs";
// import { Input, Modal, Table } from "antd";
// import { motion } from "framer-motion";
// import { PiMagnifyingGlassDuotone, PiDotsThreeVerticalBold, PiClipboardDuotone,PiEyeDuotone, PiTrashFill, PiPencilCircleDuotone } from "react-icons/pi";
// import { BsCardList } from "react-icons/bs"
// import {MdDelete} from "react-icons/md"
// import {FiEdit} from "react-icons/fi"
// import {RiFileEditFill} from "react-icons/ri";
// import {BiSolidEditAlt, BiSolidFilePdf} from "react-icons/bi"
// import {FaClipboardList} from "react-icons/fa"
// import { HiOutlinePrinter } from "react-icons/hi"
// import SalesListContainer from "../components/Listcomponents/ListContainer";
// import { useGetAllPaymentsQuery } from "../states/apislice";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
//
// const PaymentsListPage=()=>{
//     const { permissions } = useSelector(state => state.persistedReducer.global);
//     let dataz = [];
//     const navigate=useNavigate();
//     const { data, isLoading, isSuccess, isError, error } = useGetAllPaymentsQuery();
//     const [searchText, SetSearchText] = useState("");
//     const [showActions, SetShowActions] = useState(false);
//     const [selectedRow, SetSelectedRow] = useState(null);
//     const [showmodal, setShowmodal] = useState(false);
//     const [paymentDetailsModal, setPaymentDetailsModal] = useState({companyName:"",beneficiary:"",nationalId:"",phoneNumber:"",paymentAmount:"",currency:"",paymentDate:"",TINNumber:"",licenseNumber:"",location:""});
//     const [showPyDetailsModal, setShowPyDetailsModal] = useState(false);
//     const [selectedRowInfo, SetSelectedRowInfo] = useState({
//         name: "",
//         date: "",
//         amount:""
//     });
//
//     let modalRef = useRef();
//
//     const handleClickOutside = (event) => {
//         if (!modalRef.current || !modalRef.current.contains(event.target)) {
//             SetShowActions(false);
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
//     if(isSuccess){
//         const{data:dt}=data;
//         const{payments:paymentz}=dt;
//         dataz=paymentz
//     };
//
//     const handleActions = (id) => {
//         SetShowActions(!showActions);
//         SetSelectedRow(id)
//     };
//
//     const handleDelete = async() => {
//         const buyerId= selectedRow;
//         await deleteBuyer({buyerId});
//         setShowmodal(!showmodal);
//
//     };
//
//     const handleCancel=()=>{
//         setPaymentDetailsModal({companyName:"",beneficiary:"",nationalId:"",phoneNumber:"",paymentAmount:"",currency:"",paymentDate:"",TINNumber:"",licenseNumber:"",location:""});
//         setShowPyDetailsModal(!showPyDetailsModal);
//         SetSelectedRow("");
//         // SetShowActions(false);
//
//         };
//
//     const columns = [
//         {
//             title: 'Date',
//             dataIndex: 'paymentDate',
//             key: 'paymentDate',
//             render: (text) => (
//                 <p>{dayjs(text).format("MMM DD, YYYY")}</p>
//             ),
//             sorter: (a, b) => a.paymentDate.localeCompare(b.paymentDate),
//         },
//         {
//             title: 'Company',
//             dataIndex: 'companyName',
//             key: 'companyName',
//             sorter: (a, b) => a.companyName.localeCompare(b.companyName),
//         },
//         {
//             title: 'Representative',
//             dataIndex: 'beneficiary',
//             key: 'beneficiary',
//             sorter: (a, b) => a.beneficiary.localeCompare(b.beneficiary),
//         },
//         {
//             title: 'License number',
//             dataIndex: 'licenseNumber',
//             key: 'licenseNumber',
//             sorter: (a, b) => a.licenseNumber.localeCompare(b.licenseNumber),
//         },
//         {
//             title: 'Location',
//             dataIndex: 'location',
//             key: 'location',
//         },
//         {
//             title: 'Amount payed',
//             dataIndex: 'paymentAmount',
//             key: 'paymentAmount',
//             sorter: (a, b) => a.paymentAmount - b.paymentAmount,
//         },
//
//         {
//             title: "Action",
//             dataIndex: "action",
//             key: "action",
//             render: (_, record) => {
//               return (
//                   <>
//                     <div className="flex items-center gap-4">
//                     <span>
//                       <span className="relative">
//                         <PiDotsThreeVerticalBold
//                             className="text-lg"
//                             onClick={() => handleActions(record._id)}
//                         />
//                         {selectedRow === record._id ? (
//                             <motion.ul
//                                 ref={modalRef}
//                                 animate={
//                                   showActions
//                                       ? { opacity: 1, x: -10, y: 1, display: "block" }
//                                       : { opacity: 0, x: 0, y: 0, display: "none" }
//                                 }
//                                 className={` border bg-white z-20 shadow-md rounded absolute -left-[200px] w-[200px] space-y-2`}
//                             >
//                                     <li
//                                         className="flex gap-4 p-2 items-center hover:bg-slate-100"
//                                         onClick={() => {
//                                           setPaymentDetailsModal((prevstate)=>({...prevstate,companyName:record.companyName,beneficiary:record.beneficiary,nationalId:record.nationalId,phoneNumber:record.phoneNumber,paymentAmount:record.paymentAmount,currency:record.currency,paymentDate:record.paymentDate,TINNumber:record.TINNumber,licenseNumber:record.licenseNumber,location:record.location}));
//                                            setShowPyDetailsModal(!showPyDetailsModal);
//
//                                         }}
//                                     >
//                                         <FaClipboardList className=" text-lg"/>
//                                         <p>details</p>
//                                     </li>
//                               {permissions.entry?.edit ? (
//                                   <>
//                                     {/* <li
//                                         className="flex gap-4 p-2 items-center hover:bg-slate-100"
//                                         onClick={() => {
//                                           {
//                                             navigate(`/complete/cassiterite/${record._id}`);
//                                           }
//                                         }}
//                                     >
//                                       <RiFileEditFill className=" text-lg" />
//                                       <p>complete entry</p>
//                                     </li> */}
//                                     <li
//                                         className="flex gap-4 p-2 items-center hover:bg-slate-100"
//                                         onClick={() => {
//                                           SetSelectedRow(record._id);
//                                           SetSelectedRowInfo({
//                                             ...selectedRowInfo,
//                                             name: record.companyName,
//                                             date: record.supplyDate,
//                                           });
//                                           setShowmodal(!showmodal);
//                                         }}
//                                     >
//                                       <MdDelete className=" text-lg" />
//                                       <p>delete</p>
//                                     </li>
//                                   </>
//                               ) : null}
//                             </motion.ul>
//                         ) : null}
//                       </span>
//                     </span>
//
//                       {permissions.entry?.delete ? (
//                           <span>
//                         <MdDelete
//                             className="text-lg"
//                             onClick={() => {
//                               SetSelectedRow(record._id);
//                               SetSelectedRowInfo({
//                                 ...selectedRowInfo,
//                                 name: record.companyName,
//                                 date: record.supplyDate,
//                                 amount:record.paymentAmount
//                               });
//                               setShowmodal(!showmodal);
//                             }}
//                         />
//                       </span>
//                       ) : null}
//                     </div>
//                   </>
//               );
//             },
//           },
//     ]
//     return(
//         <>
//         <SalesListContainer title={'Payments list'}
//         subTitle={'Manage your payments'}
//         navLinktext={'add/payment'}
//         navtext={'Add new payment'}
//         table={
//             <>
//             <Modal
//
//                 open={showmodal}
//                 onOk={() => handleDelete(selectedRow)}
//                 onCancel={() => setShowmodal(!showmodal)}
//                 destroyOnClose
//                 footer={[
//                     <span key="actions" className=" flex w-full justify-center gap-4 text-base text-white">
//                         <button key="back" className=" bg-green-400 p-2 rounded-lg" onClick={handleDelete}>
//                             Confirm
//                         </button>
//                         <button key="submit" className=" bg-red-400 p-2 rounded-lg" type="primary" onClick={() => setShowmodal(!showmodal)}>
//                             Cancel
//                         </button>
//                     </span>
//                 ]}
//
//             >
//
//                 <h2 className="modal-title text-center font-bold text-xl">Confirm Delete</h2>
//                 <p className="text-center text-lg">Are you sure you want to delete payment with:</p>
//                 <p className=" text-lg">{`company name: ${selectedRowInfo.name}`}</p>
//                 <p className=" text-lg">{`Amount payed: ${selectedRowInfo.amount}`}</p>
//                             <p className=" text-lg">{`Supply date: ${dayjs(
//                                 selectedRowInfo.date
//                             ).format("MMM/DD/YYYY")}`}</p>
//             </Modal>
//
//             <Modal
//                          width= {'95%'}
//                         title="Payment details"
//                         open={showPyDetailsModal}
//                         // onOk={handleOk}
//                         onCancel={handleCancel}
//                         // key={paymentDetailsModal.id}
//                         destroyOnClose
//                         footer={[
//                           <button key="close" className=" w-fit rounded px-2 py-1 bg-red-300 font-semibold" onClick={handleCancel}>Close</button>
//                         ]}
//                         >
//                           <div className=" py-4 flex flex-col gap-3">
//                             <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 items-stretch">
//                               <ul className="space-y-1">
//                               <li className="items-baseline">
//                                   <p className=" text-slate-800 text-[16px]">Payment date</p>
//                                   <p className="font-semibold text-[16px]">{`${dayjs(paymentDetailsModal.paymentDate ).format("MMM DD, YYYY")}`}</p>
//                                 </li>
//                               <li className="items-baseline">
//                                   <p className=" text-slate-800 text-[16px]">Company name</p>
//                                   <p className="font-semibold text-[16px]">{`${paymentDetailsModal.companyName}`}</p>
//                                 </li>
//                                 <li className="items-baseline">
//                                   <p className=" text-slate-800 text-[16px]">Beneficiary</p>
//                                   <p className="font-semibold text-[16px]">{`${paymentDetailsModal.beneficiary}`}</p>
//                                 </li>
//                                 <li className="items-baseline">
//                                   <p className=" text-slate-800 text-[16px]">Location</p>
//                                   <p className="font-semibold text-[16px]">{`${paymentDetailsModal.location}`}</p>
//                                 </li>
//                               </ul>
//                               <ul className="space-y-1">
//                               <li className="items-baseline">
//                                   <p className=" text-slate-800 text-[16px]">Phone number</p>
//                                   <p className="font-semibold text-[16px]">{`${paymentDetailsModal.phoneNumber}`}</p>
//                                 </li>
//                                 <li className="items-baseline">
//                                   <p className=" text-slate-800 text-[16px]">License number</p>
//                                   <p className="font-semibold text-[16px]">{`${paymentDetailsModal.licenseNumber}`}</p>
//                                 </li>
//                                 <li className="items-baseline">
//                                   <p className=" text-slate-800 text-[16px]">TIN number</p>
//                                   <p className="font-semibold text-[16px]">{`${paymentDetailsModal.TINNumber}`}</p>
//                                 </li>
//                                 <li className="items-baseline">
//                                   <p className=" text-slate-800 text-[16px]">National ID</p>
//                                   <p className="font-semibold text-[16px]">{`${paymentDetailsModal.nationalId}`}</p>
//                                 </li>
//                               </ul>
//
//                               <ul className="space-y-1">
//                                 <li className="items-baseline">
//                                   <p className=" text-slate-800 text-[16px]">Payment amount</p>
//                                   <p className="font-semibold text-[16px]">{`${paymentDetailsModal.paymentAmount} ${paymentDetailsModal.currency}`}</p>
//                                 </li>
//
//                               </ul>
//
//
//                             </div>
//                           </div>
//                         </Modal>
//
//             <div className=" w-full overflow-x-auto h-full min-h-[320px]">
//                 <div className="w-full flex flex-col  sm:flex-row justify-between items-center mb-4 gap-3">
//                     <span className="max-w-[220px] border rounded flex items-center p-1 justify-between gap-2">
//                         <PiMagnifyingGlassDuotone className="h-4 w-4" />
//                         <input type="text" className=" w-full focus:outline-none" name="tableFilter" id="tableFilter" placeholder="Search..." onChange={(e) => SetSearchText(e.target.value)} />
//                     </span>
//
//                     <span className="flex w-fit justify-evenly items-center gap-6 pr-1">
//                         <BiSolidFilePdf className=" text-2xl" />
//                         <BsCardList className=" text-2xl" />
//                         <HiOutlinePrinter className=" text-2xl" />
//                     </span>
//                 </div>
//                 <Table className=" w-full"
//                     loading={isLoading}
//                     dataSource={dataz}
//                     columns={columns}
//                     rowKey="_id"
//                 />
//             </div>
//         </>
//         }/>
//         </>
//     )
// }
// export default PaymentsListPage;




// import { useState, useEffect } from "react";
// import {
//     Card,
//     CardContent,
//     CardHeader,
//     CardTitle,
//     CardDescription
// } from "@/components/ui/card";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow
// } from "@/components/ui/table";
// import {
//     Pagination,
//     PaginationContent,
//     PaginationItem,
//     PaginationLink,
//     PaginationNext,
//     PaginationPrevious
// } from "@/components/ui/pagination";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/components/ui/popover";
// import { Badge } from "@/components/ui/badge";
//
// import { CalendarIcon, Search, Filter, Eye, FileText } from "lucide-react";
// import { format } from "date-fns";
//
// export default function PaymentsDashboard() {
//     // States
//     const [payments, setPayments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [viewPaymentHistory, setViewPaymentHistory] = useState(false);
//     const [selectedPayment, setSelectedPayment] = useState(null);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [totalPages, setTotalPages] = useState(1);
//     const [pageSize] = useState(10);
//
//     // Filter states
//     const [filters, setFilters] = useState({
//         supplierId: "",
//         lotId: "",
//         entryId: "",
//         startDate: null,
//         endDate: null,
//         currency: "",
//         sortBy: "paymentDate",
//         order: "desc"
//     });
//
//     const [showFilterDialog, setShowFilterDialog] = useState(false);
//     const [suppliers, setSuppliers] = useState([]);
//     const [startDateOpen, setStartDateOpen] = useState(false);
//     const [endDateOpen, setEndDateOpen] = useState(false);
//
//     // Fetch payments with pagination and filters
//     const fetchPayments = async () => {
//         try {
//             setLoading(true);
//
//             // Build query params
//             const queryParams = new URLSearchParams();
//             queryParams.append('page', currentPage);
//             queryParams.append('limit', pageSize);
//
//             // Add filters
//             Object.entries(filters).forEach(([key, value]) => {
//                 if (value && value !== '') {
//                     // Format dates for API
//                     if (key === 'startDate' || key === 'endDate') {
//                         if (value) {
//                             queryParams.append(key, format(value, 'yyyy-MM-dd'));
//                         }
//                     } else {
//                         queryParams.append(key, value);
//                     }
//                 }
//             });
//
//             // Mock API call (in a real app, this would be a fetch to your backend)
//             // const response = await fetch(`/api/payments?${queryParams}`);
//             // const data = await response.json();
//
//             // For demo purposes, we'll use mock data
//             const mockData = {
//                 success: true,
//                 count: 45, // Total number of payments matching filters
//                 data: Array(10).fill().map((_, i) => ({
//                     _id: `payment_${i + (currentPage - 1) * 10}`,
//                     supplierId: {
//                         _id: `supplier_${(i % 5) + 1}`,
//                         name: `Supplier ${(i % 5) + 1}`,
//                         companyName: `Mining Co. ${(i % 5) + 1}`
//                     },
//                     entryId: {
//                         _id: `entry_${i}`,
//                         entryCode: `E-${100 + i}`
//                     },
//                     lotId: {
//                         _id: `lot_${i}`,
//                         lotNumber: `LOT-${200 + i}`
//                     },
//                     location: i % 2 ? "Kigali" : "Rubavu",
//                     grossAmount: 5000 + (i * 500),
//                     netAmount: 4000 + (i * 400),
//                     advanceDeductions: 1000 + (i * 100),
//                     currency: i % 3 ? "USD" : "RWF",
//                     paymentDate: new Date(2025, 3, 1 + i).toISOString(),
//                     paymentMode: i % 2 ? "Bank Transfer" : "Mobile Money",
//                     appliedAdvances: Array(i % 3 + 1).fill().map((_, j) => ({
//                         advanceId: {
//                             _id: `advance_${j}`,
//                             originalAmount: 2000,
//                             remainingAmount: 500,
//                             paymentDate: new Date(2025, 2, 15 + j).toISOString(),
//                             beneficiary: `Beneficiary ${j + 1}`
//                         },
//                         amountApplied: 500,
//                         appliedOn: new Date(2025, 3, 1 + i).toISOString()
//                     })),
//                     createdAt: new Date(2025, 3, 1 + i).toISOString()
//                 }))
//             };
//
//             // Mock suppliers data
//             const mockSuppliers = Array(5).fill().map((_, i) => ({
//                 _id: `supplier_${i + 1}`,
//                 name: `Supplier ${i + 1}`,
//                 companyName: `Mining Co. ${i + 1}`
//             }));
//
//             setPayments(mockData.data);
//             setTotalPages(Math.ceil(mockData.count / pageSize));
//             setSuppliers(mockSuppliers);
//
//         } catch (err) {
//             console.error("Error fetching payments:", err);
//             setError("Failed to load payments. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Initial data fetch and when deps change
//     useEffect(() => {
//         fetchPayments();
//     }, [currentPage, filters.sortBy, filters.order]);
//
//     // Apply filters handler
//     const handleApplyFilters = () => {
//         setCurrentPage(1); // Reset to first page when applying new filters
//         fetchPayments();
//         setShowFilterDialog(false);
//     };
//
//     // Reset filters handler
//     const handleResetFilters = () => {
//         setFilters({
//             supplierId: "",
//             lotId: "",
//             entryId: "",
//             startDate: null,
//             endDate: null,
//             currency: "",
//             sortBy: "paymentDate",
//             order: "desc"
//         });
//         setCurrentPage(1);
//     };
//
//     // View payment history handler
//     const handleViewPaymentHistory = (payment) => {
//         setSelectedPayment(payment);
//         setViewPaymentHistory(true);
//     };
//
//     // Format date
//     const formatDate = (dateString) => {
//         const date = new Date(dateString);
//         return format(date, "MMM dd, yyyy");
//     };
//
//     // Format currency
//     const formatCurrency = (amount, currency) => {
//         return new Intl.NumberFormat('en-US', {
//             style: 'currency',
//             currency: currency || 'USD',
//             minimumFractionDigits: 2
//         }).format(amount);
//     };
//
//     // Render payment rows
//     const renderPaymentRows = () => {
//         if (loading) {
//             return (
//                 <TableRow>
//                     <TableCell colSpan={7} className="text-center py-10">
//                         Loading payments...
//                     </TableCell>
//                 </TableRow>
//             );
//         }
//
//         if (error) {
//             return (
//                 <TableRow>
//                     <TableCell colSpan={7} className="text-center py-10 text-red-500">
//                         {error}
//                     </TableCell>
//                 </TableRow>
//             );
//         }
//
//         if (payments.length === 0) {
//             return (
//                 <TableRow>
//                     <TableCell colSpan={7} className="text-center py-10">
//                         No payments found. Try adjusting your filters.
//                     </TableCell>
//                 </TableRow>
//             );
//         }
//
//         return payments.map((payment) => (
//             <TableRow key={payment._id}>
//                 <TableCell className="font-medium">
//                     {payment.supplierId.name}
//                     <div className="text-xs text-gray-500">{payment.supplierId.companyName}</div>
//                 </TableCell>
//                 <TableCell>
//                     <Badge variant={payment.currency === "USD" ? "default" : "outline"}>
//                         {formatCurrency(payment.grossAmount, payment.currency)}
//                     </Badge>
//                 </TableCell>
//                 <TableCell>
//                     {payment.advanceDeductions > 0 ? (
//                         <Badge variant="destructive">
//                             {formatCurrency(payment.advanceDeductions, payment.currency)}
//                         </Badge>
//                     ) : (
//                         <span className="text-gray-500">None</span>
//                     )}
//                 </TableCell>
//                 <TableCell>
//                     <Badge variant="secondary">
//                         {formatCurrency(payment.netAmount, payment.currency)}
//                     </Badge>
//                 </TableCell>
//                 <TableCell>{formatDate(payment.paymentDate)}</TableCell>
//                 <TableCell>
//                     <Badge variant="outline" className="capitalize">
//                         {payment.paymentMode || "Not specified"}
//                     </Badge>
//                 </TableCell>
//                 <TableCell>
//                     <div className="flex gap-2">
//                         <Button
//                             variant="outline"
//                             size="icon"
//                             onClick={() => handleViewPaymentHistory(payment)}
//                             title="View payment history"
//                         >
//                             <Eye className="h-4 w-4" />
//                         </Button>
//                     </div>
//                 </TableCell>
//             </TableRow>
//         ));
//     };
//
//     return (
//         <div className="container mx-auto py-6">
//             <div className="flex justify-between items-center mb-6">
//                 <h1 className="text-3xl font-bold">Payments Dashboard</h1>
//                 <div className="flex gap-2">
//                     <Button variant="outline" onClick={() => setShowFilterDialog(true)}>
//                         <Filter className="h-4 w-4 mr-2" />
//                         Filter
//                     </Button>
//                 </div>
//             </div>
//
//             {/* Payment List Card */}
//             <Card className="mb-6">
//                 <CardHeader>
//                     <CardTitle>Payment Transactions</CardTitle>
//                     <CardDescription>
//                         View all payment transactions made to suppliers
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="rounded-md border">
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     <TableHead>Supplier</TableHead>
//                                     <TableHead>Gross Amount</TableHead>
//                                     <TableHead>Advance Deductions</TableHead>
//                                     <TableHead>Net Amount</TableHead>
//                                     <TableHead>Payment Date</TableHead>
//                                     <TableHead>Payment Mode</TableHead>
//                                     <TableHead className="w-24">Actions</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {renderPaymentRows()}
//                             </TableBody>
//                         </Table>
//                     </div>
//
//                     {/* Pagination */}
//                     <div className="mt-4">
//                         <Pagination>
//                             <PaginationContent>
//                                 <PaginationItem>
//                                     <PaginationPrevious
//                                         onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
//                                         disabled={currentPage === 1}
//                                     />
//                                 </PaginationItem>
//
//                                 {/* Render pagination numbers */}
//                                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                                     // Logic to show proper page numbers around current page
//                                     let pageNum;
//                                     if (totalPages <= 5) {
//                                         pageNum = i + 1;
//                                     } else if (currentPage <= 3) {
//                                         pageNum = i + 1;
//                                     } else if (currentPage >= totalPages - 2) {
//                                         pageNum = totalPages - 4 + i;
//                                     } else {
//                                         pageNum = currentPage - 2 + i;
//                                     }
//
//                                     if (pageNum > 0 && pageNum <= totalPages) {
//                                         return (
//                                             <PaginationItem key={pageNum}>
//                                                 <PaginationLink
//                                                     isActive={pageNum === currentPage}
//                                                     onClick={() => setCurrentPage(pageNum)}
//                                                 >
//                                                     {pageNum}
//                                                 </PaginationLink>
//                                             </PaginationItem>
//                                         );
//                                     }
//                                     return null;
//                                 })}
//
//                                 <PaginationItem>
//                                     <PaginationNext
//                                         onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
//                                         disabled={currentPage === totalPages}
//                                     />
//                                 </PaginationItem>
//                             </PaginationContent>
//                         </Pagination>
//                     </div>
//                 </CardContent>
//             </Card>
//
//             {/* Filter Dialog */}
//             <Dialog open={showFilterDialog} onOpenChange={setShowFilterDialog}>
//                 <DialogContent className="sm:max-w-[425px]">
//                     <DialogHeader>
//                         <DialogTitle>Filter Payments</DialogTitle>
//                         <DialogDescription>
//                             Apply filters to narrow down payment results
//                         </DialogDescription>
//                     </DialogHeader>
//
//                     <div className="grid gap-4 py-4">
//                         <div className="grid gap-2">
//                             <Label htmlFor="supplier">Supplier</Label>
//                             <Select
//                                 value={filters.supplierId}
//                                 onValueChange={(value) => setFilters({...filters, supplierId: value})}
//                             >
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select supplier" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="all">All Suppliers</SelectItem>
//                                     {/*{suppliers.map(supplier => (*/}
//                                     {/*    <SelectItem key={supplier._id} value={supplier._id}>*/}
//                                     {/*        {supplier.name} ({supplier.companyName})*/}
//                                     {/*    </SelectItem>*/}
//                                     {/*))}*/}
//                                 </SelectContent>
//                             </Select>
//                         </div>
//
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="grid gap-2">
//                                 <Label htmlFor="entryId">Entry ID</Label>
//                                 <Input
//                                     id="entryId"
//                                     placeholder="E.g. E-123"
//                                     value={filters.entryId}
//                                     onChange={(e) => setFilters({...filters, entryId: e.target.value})}
//                                 />
//                             </div>
//
//                             <div className="grid gap-2">
//                                 <Label htmlFor="lotId">Lot ID</Label>
//                                 <Input
//                                     id="lotId"
//                                     placeholder="E.g. LOT-456"
//                                     value={filters.lotId}
//                                     onChange={(e) => setFilters({...filters, lotId: e.target.value})}
//                                 />
//                             </div>
//                         </div>
//
//                         <div className="grid gap-2">
//                             <Label>Currency</Label>
//                             <Select
//                                 value={filters.currency}
//                                 onValueChange={(value) => setFilters({...filters, currency: value})}
//                             >
//                                 <SelectTrigger>
//                                     <SelectValue placeholder="Select currency" />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                     <SelectItem value="all">All Currencies</SelectItem>
//                                     <SelectItem value="USD">USD</SelectItem>
//                                     <SelectItem value="RWF">RWF</SelectItem>
//                                 </SelectContent>
//                             </Select>
//                         </div>
//
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="grid gap-2">
//                                 <Label>Start Date</Label>
//                                 <Popover open={startDateOpen} onOpenChange={setStartDateOpen}>
//                                     <PopoverTrigger asChild>
//                                         <Button
//                                             variant="outline"
//                                             className="w-full justify-start text-left font-normal"
//                                         >
//                                             <CalendarIcon className="mr-2 h-4 w-4" />
//                                             {filters.startDate ? (
//                                                 format(filters.startDate, "PPP")
//                                             ) : (
//                                                 <span>Pick a date</span>
//                                             )}
//                                         </Button>
//                                     </PopoverTrigger>
//                                     <PopoverContent className="w-auto p-0">
//                                         {/*<Calendar*/}
//                                         {/*    mode="single"*/}
//                                         {/*    selected={filters.startDate}*/}
//                                         {/*    onSelect={(date) => {*/}
//                                         {/*        setFilters({...filters, startDate: date});*/}
//                                         {/*        setStartDateOpen(false);*/}
//                                         {/*    }}*/}
//                                         {/*    initialFocus*/}
//                                         {/*/>*/}
//                                     </PopoverContent>
//                                 </Popover>
//                             </div>
//
//                             <div className="grid gap-2">
//                                 <Label>End Date</Label>
//                                 <Popover open={endDateOpen} onOpenChange={setEndDateOpen}>
//                                     <PopoverTrigger asChild>
//                                         <Button
//                                             variant="outline"
//                                             className="w-full justify-start text-left font-normal"
//                                         >
//                                             <CalendarIcon className="mr-2 h-4 w-4" />
//                                             {filters.endDate ? (
//                                                 format(filters.endDate, "PPP")
//                                             ) : (
//                                                 <span>Pick a date</span>
//                                             )}
//                                         </Button>
//                                     </PopoverTrigger>
//                                     <PopoverContent className="w-auto p-0">
//                                         {/*<Calendar*/}
//                                         {/*    mode="single"*/}
//                                         {/*    selected={filters.endDate}*/}
//                                         {/*    onSelect={(date) => {*/}
//                                         {/*        setFilters({...filters, endDate: date});*/}
//                                         {/*        setEndDateOpen(false);*/}
//                                         {/*    }}*/}
//                                         {/*    initialFocus*/}
//                                         {/*/>*/}
//                                     </PopoverContent>
//                                 </Popover>
//                             </div>
//                         </div>
//
//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="grid gap-2">
//                                 <Label>Sort By</Label>
//                                 <Select
//                                     value={filters.sortBy}
//                                     onValueChange={(value) => setFilters({...filters, sortBy: value})}
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Sort by" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="paymentDate">Payment Date</SelectItem>
//                                         <SelectItem value="grossAmount">Gross Amount</SelectItem>
//                                         <SelectItem value="netAmount">Net Amount</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//
//                             <div className="grid gap-2">
//                                 <Label>Order</Label>
//                                 <Select
//                                     value={filters.order}
//                                     onValueChange={(value) => setFilters({...filters, order: value})}
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Order" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="desc">Descending</SelectItem>
//                                         <SelectItem value="asc">Ascending</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                         </div>
//                     </div>
//
//                     <div className="flex justify-between">
//                         <Button variant="outline" onClick={handleResetFilters}>
//                             Reset Filters
//                         </Button>
//                         <Button onClick={handleApplyFilters}>
//                             Apply Filters
//                         </Button>
//                     </div>
//                 </DialogContent>
//             </Dialog>
//
//             {/* Payment History Dialog */}
//             <Dialog open={viewPaymentHistory} onOpenChange={setViewPaymentHistory}>
//                 <DialogContent className="sm:max-w-[700px]">
//                     <DialogHeader>
//                         <DialogTitle>Payment History Details</DialogTitle>
//                         <DialogDescription>
//                             {selectedPayment && (
//                                 <>Payment #{selectedPayment._id.slice(-5)} - {formatDate(selectedPayment.paymentDate)}</>
//                             )}
//                         </DialogDescription>
//                     </DialogHeader>
//
//                     {selectedPayment && (
//                         <div className="space-y-6">
//                             {/* Payment Overview Card */}
//                             <Card>
//                                 <CardHeader className="pb-2">
//                                     <CardTitle className="text-lg">Payment Overview</CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="grid grid-cols-2 gap-4">
//                                         <div>
//                                             <p className="text-sm font-medium text-gray-500">Supplier</p>
//                                             <p>{selectedPayment.supplierId.name}</p>
//                                             <p className="text-sm text-gray-500">{selectedPayment.supplierId.companyName}</p>
//                                         </div>
//
//                                         <div>
//                                             <p className="text-sm font-medium text-gray-500">Location</p>
//                                             <p>{selectedPayment.location || "Not specified"}</p>
//                                         </div>
//
//                                         <div>
//                                             <p className="text-sm font-medium text-gray-500">Entry</p>
//                                             <p>{selectedPayment.entryId?.entryCode || "None"}</p>
//                                         </div>
//
//                                         <div>
//                                             <p className="text-sm font-medium text-gray-500">Lot</p>
//                                             <p>{selectedPayment.lotId?.lotNumber || "None"}</p>
//                                         </div>
//
//                                         <div>
//                                             <p className="text-sm font-medium text-gray-500">Payment Date</p>
//                                             <p>{formatDate(selectedPayment.paymentDate)}</p>
//                                         </div>
//
//                                         <div>
//                                             <p className="text-sm font-medium text-gray-500">Payment Mode</p>
//                                             <p className="capitalize">{selectedPayment.paymentMode || "Not specified"}</p>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//
//                             {/* Payment Amounts Card */}
//                             <Card>
//                                 <CardHeader className="pb-2">
//                                     <CardTitle className="text-lg">Payment Amounts</CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="space-y-2">
//                                         <div className="flex justify-between border-b pb-2">
//                                             <span className="font-medium">Gross Amount:</span>
//                                             <span>{formatCurrency(selectedPayment.grossAmount, selectedPayment.currency)}</span>
//                                         </div>
//
//                                         <div className="flex justify-between border-b pb-2">
//                                             <span className="font-medium">Advance Deductions:</span>
//                                             <span className="text-red-500">{formatCurrency(selectedPayment.advanceDeductions, selectedPayment.currency)}</span>
//                                         </div>
//
//                                         <div className="flex justify-between pt-2 text-lg font-bold">
//                                             <span>Net Amount Paid:</span>
//                                             <span>{formatCurrency(selectedPayment.netAmount, selectedPayment.currency)}</span>
//                                         </div>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//
//                             {/* Applied Advances Card */}
//                             {selectedPayment.appliedAdvances && selectedPayment.appliedAdvances.length > 0 ? (
//                                 <Card>
//                                     <CardHeader className="pb-2">
//                                         <CardTitle className="text-lg">Applied Advance Payments</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <Table>
//                                             <TableHeader>
//                                                 <TableRow>
//                                                     <TableHead>Advance ID</TableHead>
//                                                     <TableHead>Beneficiary</TableHead>
//                                                     <TableHead>Original Amount</TableHead>
//                                                     <TableHead>Applied Amount</TableHead>
//                                                     <TableHead>Applied On</TableHead>
//                                                 </TableRow>
//                                             </TableHeader>
//                                             <TableBody>
//                                                 {selectedPayment.appliedAdvances.map((advance) => (
//                                                     <TableRow key={advance.advanceId._id}>
//                                                         <TableCell className="font-medium">
//                                                             {advance.advanceId._id.slice(-5)}
//                                                         </TableCell>
//                                                         <TableCell>
//                                                             {advance.advanceId.beneficiary}
//                                                         </TableCell>
//                                                         <TableCell>
//                                                             {formatCurrency(advance.advanceId.originalAmount, selectedPayment.currency)}
//                                                         </TableCell>
//                                                         <TableCell>
//                                                             <Badge variant="secondary">
//                                                                 {formatCurrency(advance.amountApplied, selectedPayment.currency)}
//                                                             </Badge>
//                                                         </TableCell>
//                                                         <TableCell>
//                                                             {formatDate(advance.appliedOn)}
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 ))}
//                                             </TableBody>
//                                         </Table>
//                                     </CardContent>
//                                 </Card>
//                             ) : (
//                                 <Card>
//                                     <CardContent className="py-4">
//                                         <p className="text-center text-gray-500">No advance payments were applied to this payment.</p>
//                                     </CardContent>
//                                 </Card>
//                             )}
//                         </div>
//                     )}
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }


// pages/Finance/FinancialEntries.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, DatePicker, Button, Input, Select, Space, Spin } from 'antd';
import { SearchOutlined, FilterOutlined, DownloadOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import axios from 'axios';

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {useLazyGetEntriesPaymentsQuery} from "@/states/apislice.js";
import {useToast} from "@/hooks/use-toast.js";
import FetchingPage from "@/Pages/FetchingPage.jsx";

const { RangePicker } = DatePicker;
const { Option } = Select;

const FinancialEntries = () => {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        dateRange: null,
        mineralType: null,
        supplier: null,
        searchText: '',
    });
    const {toast} = useToast();
    const [getEntriesPayments, {isLoading, isError, error}] = useLazyGetEntriesPaymentsQuery()
    const [suppliers, setSuppliers] = useState([]);

    // Fetch suppliers for filter dropdown
    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                const response = await axios.get('/api/suppliers');
                setSuppliers(response.data.data);
            } catch (error) {
                console.error('Error fetching suppliers:', error);
            }
        };

        fetchSuppliers();
    }, []);

    useEffect(() => {
        if (isError && error) {
            toast({
                title: 'Error',
                description: error.data?.message,
            })
        }
    }, [isError, error, toast]);


    // Fetch financial entries data
    useEffect(() => {
        const fetchFinancialEntries = async () => {
            setLoading(true);
            try {
                let queryParams = new URLSearchParams();

                if (filters.dateRange && filters.dateRange[0] && filters.dateRange[1]) {
                    queryParams.append('startDate', filters.dateRange[0].toISOString());
                    queryParams.append('endDate', filters.dateRange[1].toISOString());
                }

                if (filters.mineralType) {
                    queryParams.append('mineralType', filters.mineralType);
                }

                if (filters.supplier) {
                    queryParams.append('supplier', filters.supplier);
                }

                const response = await getEntriesPayments({query: queryParams});
                // const response = await axios.get(`/api/finance/entries?${queryParams.toString()}`);
                console.log('response', response);
                setEntries(response.data.data);
            } catch (error) {
                console.error('Error fetching financial entries:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFinancialEntries();
    }, [filters]);

    // Handle filter changes
    const handleDateRangeChange = (dates) => {
        setFilters(prev => ({ ...prev, dateRange: dates }));
    };

    const handleMineralTypeChange = (value) => {
        setFilters(prev => ({ ...prev, mineralType: value }));
    };

    const handleSupplierChange = (value) => {
        setFilters(prev => ({ ...prev, supplier: value }));
    };

    const handleSearch = (e) => {
        setFilters(prev => ({ ...prev, searchText: e.target.value }));
    };

    // Navigate to lot payment details
    const navigateToLotPayments = (lotId) => {
        navigate(`/lots/payments/${lotId}`);
    };

    // Format currency
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(value);
    };

    // Define expandable row for lots
    const expandedRowRender = (record) => {
        const columns = [
            {
                title: 'Lot Number',
                dataIndex: 'lotNumber',
                key: 'lotNumber'
            },
            {
                title: 'Type',
                dataIndex: 'docModel',
                key: 'type'
            },
            {
                title: 'Beneficiary',
                dataIndex: 'beneficiary',
                key: 'beneficiary'
            },
            {
                title: 'Weight In (kg)',
                dataIndex: 'weightIn',
                key: 'weightIn',
                render: (text) => text ? text.toFixed(2) : '0.00'
            },
            {
                title: 'Weight Out (kg)',
                dataIndex: 'weightOut',
                key: 'weightOut',
                render: (text) => text ? text.toFixed(2) : '0.00'
            },
            {
                title: 'Grade',
                dataIndex: 'mineralGrade',
                key: 'mineralGrade',
                render: (text) => text ? `${text}%` : 'N/A'
            },
            {
                title: 'Price/Unit',
                dataIndex: 'pricePerUnit',
                key: 'pricePerUnit',
                render: (text) => text ? formatCurrency(text) : 'N/A'
            },
            {
                title: 'Total Value',
                dataIndex: 'totalValue',
                key: 'totalValue',
                render: (text) => formatCurrency(text)
            },
            {
                title: 'Fees',
                dataIndex: 'fees',
                key: 'fees',
                render: (text) => formatCurrency(text)
            },
            {
                title: 'Actions',
                key: 'actions',
                render: (_, record) => (
                    <div className="flex justify-between items-center">
                        <Button
                            type="link"
                            onClick={() => navigate(`/lots/${record._id}`)}
                        >
                            Price Calculations
                        </Button>
                        <Button
                            type="link"
                            onClick={() => navigateToLotPayments(record._id)}
                        >
                            Full History
                        </Button>
                    </div>
                )
            }
        ];

        return (
            <Card className="bg-gray-50">
                <CardContent className="p-4">
                    <Table
                        columns={columns}
                        dataSource={record.lots}
                        pagination={false}
                        rowClassName={(record) => {
                            if (record.nonSellAgreement?.decision === true) {
                                return "bg-red-200";
                            }
                        }}
                        rowKey="_id"
                    />
                </CardContent>
            </Card>
        );
    };

    // Filter entries by search text
    const filteredEntries = entries.filter(entry => {
        if (!filters.searchText) return true;

        const searchLower = filters.searchText.toLowerCase();
        return (
            entry.company.toLowerCase().includes(searchLower) ||
            entry.mineralType.toLowerCase().includes(searchLower)
        );
    });

    // Define main table columns
    const columns = [
        {
            title: 'Supply Date',
            dataIndex: 'supplyDate',
            key: 'supplyDate',
            sorter: (a, b) => new Date(a.supplyDate) - new Date(b.supplyDate),
            render: (text) => text ? format(new Date(text), 'dd/MM/yyyy') : 'N/A'
        },
        {
            title: 'Company',
            dataIndex: 'company',
            key: 'company',
            sorter: (a, b) => a.company.localeCompare(b.company)
        },
        {
            title: 'Number of Lots',
            dataIndex: 'numberOfLots',
            key: 'numberOfLots',
            sorter: (a, b) => a.numberOfLots - b.numberOfLots
        },
        {
            title: 'Mineral Type',
            dataIndex: 'mineralType',
            key: 'mineralType',
            render: (text) => (
                <Badge className="capitalize" variant="outline">
                    {text}
                </Badge>
            )
        },
        {
            title: 'Total Weight Out (kg)',
            dataIndex: 'totalWeightOut',
            key: 'totalWeightOut',
            sorter: (a, b) => a.totalWeightOut - b.totalWeightOut,
            render: (text) => text.toFixed(2)
        },
        {
            title: 'Total Mineral Value',
            dataIndex: 'totalMineralPrice',
            key: 'totalMineralPrice',
            sorter: (a, b) => a.totalMineralPrice - b.totalMineralPrice,
            render: (text) => formatCurrency(text)
        },
        {
            title: 'Total Fees Deducted',
            dataIndex: 'totalFeesDeducted',
            key: 'totalFeesDeducted',
            sorter: (a, b) => a.totalFeesDeducted - b.totalFeesDeducted,
            render: (text) => formatCurrency(text)
        },
        {
            title: 'Advances Deducted',
            dataIndex: 'advancesDeducted',
            key: 'advancesDeducted',
            sorter: (a, b) => a.advancesDeducted - b.advancesDeducted,
            render: (text) => formatCurrency(text)
        }
    ];

    // Export data functionality
    const exportToExcel = () => {
        // Implementation would depend on the library you're using
        // This is a placeholder for the export functionality
        console.log('Exporting data...');
    };

    if (isLoading) return <FetchingPage/>

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-2xl">Financial Overview</CardTitle>
                    <CardDescription>
                        View financial information for all entries and their associated lots
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {/* Filters */}
                    <div className="mb-6 flex flex-wrap gap-4">
                        <Space direction="vertical" size={12}>
                            <span className="text-sm font-medium">Date Range</span>
                            <RangePicker onChange={handleDateRangeChange} />
                        </Space>

                        <Space direction="vertical" size={12}>
                            <span className="text-sm font-medium">Mineral Type</span>
                            <Select
                                placeholder="Select Mineral Type"
                                allowClear
                                style={{ width: 200 }}
                                onChange={handleMineralTypeChange}
                            >
                                <Option value="coltan">Coltan</Option>
                                <Option value="cassiterite">Cassiterite</Option>
                                <Option value="wolframite">Wolframite</Option>
                                <Option value="lithium">Lithium</Option>
                                <Option value="beryllium">Beryllium</Option>
                                <Option value="mixed">Mixed</Option>
                            </Select>
                        </Space>

                        <Space direction="vertical" size={12}>
                            <span className="text-sm font-medium">Supplier</span>
                            <Select
                                placeholder="Select Supplier"
                                allowClear
                                style={{ width: 200 }}
                                onChange={handleSupplierChange}
                            >
                                {suppliers.map(supplier => (
                                    <Option key={supplier._id} value={supplier._id}>
                                        {supplier.companyName || supplier.name}
                                    </Option>
                                ))}
                            </Select>
                        </Space>

                        <Space direction="vertical" size={12}>
                            <span className="text-sm font-medium">Search</span>
                            <Input
                                placeholder="Search by company or mineral"
                                prefix={<SearchOutlined />}
                                onChange={handleSearch}
                                style={{ width: 250 }}
                            />
                        </Space>

                        {/*<Space direction="vertical" size={12} className="ml-auto">*/}
                        {/*    <span className="text-sm font-medium">Actions</span>*/}
                        {/*    <Button*/}
                        {/*        icon={<DownloadOutlined />}*/}
                        {/*        onClick={exportToExcel}*/}
                        {/*    >*/}
                        {/*        Export Data*/}
                        {/*    </Button>*/}
                        {/*</Space>*/}
                    </div>

                    {/* Table */}
                    {loading ? (
                        <div className="flex justify-center p-8">
                            <Spin size="large" />
                        </div>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={filteredEntries}
                            rowKey="_id"
                            expandable={{
                                expandedRowRender,
                                expandRowByClick: false
                            }}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                pageSizeOptions: ['10', '20', '50'],
                            }}
                            summary={(pageData) => {
                                const totalWeightOut = pageData.reduce((sum, entry) => sum + entry.totalWeightOut, 0);
                                const totalValue = pageData.reduce((sum, entry) => sum + entry.totalMineralPrice, 0);
                                const totalFees = pageData.reduce((sum, entry) => sum + entry.totalFeesDeducted, 0);
                                const totalAdvances = pageData.reduce((sum, entry) => sum + entry.advancesDeducted, 0);

                                return (
                                    <Table.Summary fixed>
                                        <Table.Summary.Row>
                                            <Table.Summary.Cell index={0} colSpan={4}>
                                                <strong>Total</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={4}>
                                                <strong>{totalWeightOut.toFixed(2)}</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={5}>
                                                <strong>{formatCurrency(totalValue)}</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={6}>
                                                <strong>{formatCurrency(totalFees)}</strong>
                                            </Table.Summary.Cell>
                                            <Table.Summary.Cell index={7}>
                                                <strong>{formatCurrency(totalAdvances)}</strong>
                                            </Table.Summary.Cell>
                                        </Table.Summary.Row>
                                    </Table.Summary>
                                );
                            }}
                        />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FinancialEntries;