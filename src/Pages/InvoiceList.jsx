import React, {useEffect} from "react";
import { useGetSuppliersInvoiceQuery, useGetAllInvoicesQuery } from "../states/apislice";
import dayjs from "dayjs";
import {PiDotsThreeVerticalBold} from "react-icons/pi";
import {motion} from "framer-motion";
import {BiSolidEditAlt} from "react-icons/bi";
import {MdOutlineClose, MdPayments} from "react-icons/md";
import {FaSave} from "react-icons/fa";

const InvoiceList = () => {
    // const {data, isLoading, isSuccess, isError, error} = useGetSuppliersInvoiceQuery();
    const { data, isSuccess, isError, error } = useGetAllInvoicesQuery();
    useEffect(() => {
        if (isSuccess) {
            console.log(data.data);
        } else if (isError) {
            console.log(error.data.message);
        }
    }, [isSuccess, isError, error]);

    const columns = [
        {
            title: "#", 
            dataIndex: "lotNumber",
            key: "lotNumber",
            sorter: (a, b) => a.lotNumber.localeCompare(b.lotNumber),
        },
        {
            title: "Date",
            dataIndex: "supplyDate",
            key: "supplyDate",
            sorter: (a, b) => a.supplyDate - b.supplyDate,
            render: (text) => {
                return (
                    <>
                        <p>{dayjs(text).format("MMM DD, YYYY")}</p>
                    </>
                );
            },
        },
        {
            title: "weight out (KG)",
            dataIndex: "weightOut",
            key: "weightOut",
            editTable: true,
            sorter: (a, b) => a.weightOut - b.weightOut,
        },

        {
            title: "balance (KG)",
            dataIndex: "cumulativeAmount",
            key: "cumulativeAmount",
            sorter: (a, b) => a.cumulativeAmount - b.cumulativeAmount,
        },
        {
            title: "status",
            dataIndex: "status",
            key: "status",
            sorter: (a, b) => a.status.localeCompare(b.status),
            render: (text) => {
                // "in stock", "fully exported", "rejected", "non-sell agreement", "partially exported"
                let color = "";
                // const value='non-sell agreement'
                switch (text) {
                    case "in stock": {
                        color = "bg-green-500";
                        break;
                    }
                    case "partially exported": {
                        color = "bg-gradient-to-r from-slate-500 shadow-md";
                        break;
                    }
                    case "fully exported": {
                        color = "bg-slate-600";
                        break;
                    }
                    case "in progress": {
                        color = "bg-orange-400";
                        break;
                    }
                    case "rejected": {
                        color = "bg-red-500";
                        break;
                    }
                    case "non-sell agreement": {
                        color = "bg-indigo-400";
                        break;
                    }
                    default: {
                        color = "bg-green-300";
                    }
                }
                return (
                    <p className={` px-3 py-1 ${color} w-fit text-white rounded`}>
                        {text}
                    </p>
                );
            },
        },
        {
            title: "Action",
            dataIndex: "action",
            key: "action",
            render: (_, record) => {
                const editable = isEditing(record);
                return (
                    <>
                        <div className="flex items-center gap-2">
                            {editable ? null : (
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
                                  show
                                      ? {opacity: 1, x: -10, display: "block"}
                                      : {opacity: 0, x: 0, display: "none"}
                              }
                              className={` border bg-white z-20 shadow-md rounded absolute -left-[200px] w-[200px] space-y-2`}
                          >
                              <li
                                  className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                  onClick={() => edit(record)}
                              >
                                  <BiSolidEditAlt className=" text-lg"/>
                                  <p>edit</p>
                              </li>
                              {permissions.payments.create ? (
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
                              ) : null}
                          </motion.ul>
                      )}
                  </span>
                                </>
                            )}

                            {editable ? (
                                <div className="flex items-center gap-3">
                                    <FaSave
                                        className=" text-xl"
                                        onClick={() => save(record._id)}
                                    />
                                    <MdOutlineClose
                                        className=" text-xl"
                                        onClick={() => setEditRowKey("")}
                                    />
                                </div>
                            ) : null}
                        </div>
                    </>
                );
            },
        },
    ];



    return (
        <div>
            INVOICE LIST
        </div>
    )
}

export default InvoiceList;