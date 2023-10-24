import React, {useEffect,useState,useRef} from "react";
import SuppliersListContainer from "../components/Listcomponents/SuppliersListContainer";
import { useMyContext } from "../context files/LoginDatacontextProvider";
import { Table } from "antd";
import { useGetSuppliersInvoiceQuery, useGetAllInvoicesQuery } from "../states/apislice";
import dayjs from "dayjs";
import {PiDotsThreeVerticalBold} from "react-icons/pi";
import { ImSpinner2 } from "react-icons/im";
import {motion} from "framer-motion";
import {BiSolidDetail} from "react-icons/bi";
import {MdOutlineClose, MdPayments} from "react-icons/md";
import {FaSave} from "react-icons/fa";

const InvoiceList = () => {
    let dataz=[];
    // const {data, isLoading, isSuccess, isError, error} = useGetSuppliersInvoiceQuery();
    const { data, isLoading, isSuccess, isError, error } = useGetAllInvoicesQuery();
    const { loginData } = useMyContext();
    const{profile,permissions}=loginData;
    const [showActions, SetShowActions] = useState(false);
    const [selectedRow, SetSelectedRow] = useState(null);

    if (isSuccess) {
            const {invoices}=data.data;
            dataz=invoices;
            console.log(dataz);
        } else if (isError) {
            console.log(error.data.message);
        };
        let modalRef = useRef();

        const handleClickOutside = (event) => {
          if (!modalRef.current || !modalRef.current.contains(event.target)) {
            SetShowActions(false);
          }
        };
      
        useEffect(() => {
          document.addEventListener("click", handleClickOutside, true);
          return () => {
            document.removeEventListener("click", handleClickOutside, true);
          };
        }, []);
          const handleActions = (id) => {
            if (selectedRow === id) {
              console.log("uri muduki sha");
              SetShowActions(false);
              SetSelectedRow("");
            } else {
              SetSelectedRow(id);
              SetShowActions(true);
              console.log("Clicked ID:", id);
            }
          };

          
    const columns = [
        {
            title: "invoice #", 
            dataIndex: "invoiceNo",
            key: "invoiceNo",
            sorter: (a, b) => a.invoiceNo.localeCompare(b.invoiceNo),
        },
        {
            title: "Date",
            dataIndex: "dateOfIssue",
            key: "dateOfIssue",
            sorter: (a, b) => a.dateOfIssue - b.dateOfIssue,
            render: (text) => {
                return (
                    <>
                        <p>{dayjs(text).format("MMM DD, YYYY")}</p>
                    </>
                );
            },
        },
        {
            title: "Supplier",
            dataIndex: "supplierCompanyName",
            key: "supplierCompanyName",
            editTable: true,
            sorter: (a, b) => a.supplierCompanyName.localeCompare(b.supplierCompanyName),
        },

        {
            title: "beneficiary",
            dataIndex: "beneficiary",
            key: "beneficiary",
            sorter: (a, b) => a.beneficiary.localeCompare(b.beneficiary),
        },

        {
            title: "items",
            dataIndex: "items",
            key: "items",
            sorter: (a, b) => a.items.localeCompare(b.items),
            render: (record) => {
                return (
                    <>
                        <p>{record.length}</p>
                    </>
                );
            },
        },

        {
            title: "total",
            dataIndex: "total",
            key: "total",
            sorter: (a, b) => a.total.localeCompare(b.total),
        },
        // {
        //     title: "status",
        //     dataIndex: "status",
        //     key: "status",
        //     sorter: (a, b) => a.status.localeCompare(b.status),
        //     render: (text) => {
        //         // "in stock", "fully exported", "rejected", "non-sell agreement", "partially exported"
        //         let color = "";
        //         // const value='non-sell agreement'
        //         switch (text) {
        //             case "in stock": {
        //                 color = "bg-green-500";
        //                 break;
        //             }
        //             case "partially exported": {
        //                 color = "bg-gradient-to-r from-slate-500 shadow-md";
        //                 break;
        //             }
        //             case "fully exported": {
        //                 color = "bg-slate-600";
        //                 break;
        //             }
        //             case "in progress": {
        //                 color = "bg-orange-400";
        //                 break;
        //             }
        //             case "rejected": {
        //                 color = "bg-red-500";
        //                 break;
        //             }
        //             case "non-sell agreement": {
        //                 color = "bg-indigo-400";
        //                 break;
        //             }
        //             default: {
        //                 color = "bg-green-300";
        //             }
        //         }
        //         return (
        //             <p className={` px-3 py-1 ${color} w-fit text-white rounded`}>
        //                 {text}
        //             </p>
        //         );
        //     },
        // },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_, record) => {
                
                return (
                    <>
                        <div className="flex items-center gap-2">
                                <>
                  <span className="relative">
                    <PiDotsThreeVerticalBold
                        className=" text-xl"
                        onClick={() => handleActions(record._id)}
                    />
                      {selectedRow === record._id && (
                          <motion.ul
                              ref={modalRef}
                              animate={
                                  showActions
                                      ? {opacity: 1, x: -10, display: "block"}
                                      : {opacity: 0, x: 0, display: "none"}
                              }
                              className={` border bg-white z-20 shadow-md rounded absolute -left-[200px] w-[200px] space-y-2`}
                          >
                              <li
                                  className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                  onClick={() => edit(record)}
                              >
                                  <BiSolidDetail className=" text-lg"/>
                                  <p>details</p>
                              </li>
                              {/* {permissions.payments.create ? (
                                  <li
                                      className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                      onClick={() => {
                                          setSelectedLotNumber(record.lotNumber);
                                          setShowPayModel(true);
                                      }}
                                  >
                                      <MdPayments className=" text-lg"/>
                                      <p>Pay</p>
                                  </li>
                              ) : null} */}
                          </motion.ul>
                      )}
                  </span>
                                </>
                            

            
                        </div>
                    </>
                );
            },
        },
    ];



    return (
       <>
        <SuppliersListContainer
        title={"Invoice List"}
        subTitle={"Manage your invoices"}
        navLinktext={"add/invoice"}
        navtext={"Add invoice"}
        table={
            <Table
                className=" w-full"
                loading={{
                  indicator: (
                    <ImSpinner2
                      style={{ width: "60px", height: "60px" }}
                      className="animate-spin text-gray-500"
                    />
                  ),
                  spinning: isLoading,
                }}
                dataSource={dataz}
                columns={columns}
                rowKey="_id"
              />
        }/>
       </>
    )
}

export default InvoiceList;