import React, {useEffect, useRef, useState} from "react";
import ListContainer from "../../components/Listcomponents/ListContainer";
import {useNavigate} from "react-router-dom";
import {motion} from "framer-motion";
import dayjs from "dayjs";
import {Modal, Table} from "antd";
import {ImSpinner2} from "react-icons/im";
import {PiDotsThreeVerticalBold, PiMagnifyingGlassDuotone} from "react-icons/pi";
import {BiSolidFilePdf} from "react-icons/bi";
import {BsCardList} from "react-icons/bs";
import {HiOutlinePrinter} from "react-icons/hi";
import {FaClipboardList} from "react-icons/fa";
import {
    useGetAllAdvancePaymentsQuery,
    useSaveFileMutation,
} from "@/states/apislice.js";
import {useSelector} from "react-redux";
import {Button} from "@/components/ui/button.jsx";
import {Link} from "react-router-dom";

const AdvancedPaymentsList = () => {
    let dataz = [];
    const navigate = useNavigate();
    const {permissions} = useSelector(state => state.persistedReducer?.global);
    const [searchText, SetSearchText] = useState("");
    const [selectedRow, SetSelectedRow] = useState("");
    const [showActions, SetShowActions] = useState(false);
    const [showmodal, setShowmodal] = useState(false);
    const [paymentDetailsModal, setPaymentDetailsModal] = useState({
        companyName: "",
        beneficiary: "",
        nationalId: "",
        phoneNumber: "",
        email: "",
        paymentAmount: "",
        currency: "",
        paymentDate: "",
        consumed: "",
        remainingAmount: "",
        consumptionDetails: "",
        id: ""
    });
    const [showPyDetailsModal, setShowPyDetailsModal] = useState(false);
    const [selectedRowInfo, SetSelectedRowInfo] = useState({
        name: "",
        date: "",
    });
    const {data, isLoading, isSuccess, isError, error} = useGetAllAdvancePaymentsQuery("", {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });


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
            SetShowActions(false);
            SetSelectedRow("");
        } else {
            SetSelectedRow(id);
            SetShowActions(true);
        }
    };

    const handleCancel = () => {
        setPaymentDetailsModal({
            companyName: "",
            beneficiary: "",
            nationalId: "",
            phoneNumber: "",
            email: "",
            paymentAmount: "",
            currency: "",
            paymentDate: "",
            consumed: "",
            remainingAmount: "",
            consumptionDetails: ""
        });
        setShowPyDetailsModal(!showPyDetailsModal);
        SetSelectedRow("");
// SetShowActions(false);

    };


    const onSave = async () => {
        if (documentEditor.documentEditor) {
            const file = await documentEditor.documentEditor.saveAsBlob('Docx');
            const formData = new FormData();
            formData.append('data', file);
        }
    }

    // useEffect(() => {
    //     if (isSuccess) {
    //         const { payments } = data.data;
    //         dataz = payments;
    //     }
    // }, [isSuccess]);


    if (isSuccess) {
        const {payments} = data.data;
        dataz = payments;
    }

    const columns = [
        {
            title: "Payment date",
            dataIndex: "paymentDate",
            // key: "paymentDate",
            Key: "_id",
            sorter: (a, b) => a.paymentDate.localeCompare(b.paymentDate),
            render: (text) => {
                return (
                    <>
                        <p>{dayjs(text).format("MMM DD, YYYY")}</p>
                    </>
                );
            },
        },
        {
            title: "Company name",
            dataIndex: "companyName",
            // key: "companyName",
            Key: "_id",
            render: (_, record) => <p>{record.supplierId?.companyName}</p>,
            sorter: (a, b) => a.companyName.localeCompare(b.companyName),
            filteredValue: [searchText],
            onFilter: (value, record) => {
                return (
                    String(record.companyName)
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    String(record.beneficiary)
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    String(record.mineralType)
                        .toLowerCase()
                        .includes(value.toLowerCase()) ||
                    String(record.weightIn).toLowerCase().includes(value.toLowerCase()) ||
                    String(dayjs(record.supplyDate).format("MMM DD, YYYY"))
                        .toLowerCase()
                        .includes(value.toLowerCase())
                );
            },
        },
        {
            title: "Beneficiary",
            dataIndex: "beneficiary",
            key: "beneficiary",
            sorter: (a, b) => a.beneficiary.localeCompare(b.beneficiary),
        },
        {
            title: "Phone Nbr",
            dataIndex: "phoneNumber",
            key: "phoneNumber",
            sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
        },
        {
            title: "Amount payed",
            dataIndex: "paymentAmount",
            key: "paymentAmount",
            sorter: (a, b) => a.paymentAmount - b.paymentAmount,
        },
        {
            title: "Amount remaining",
            dataIndex: "remainingAmount",
            key: "remainingAmount",
            sorter: (a, b) => a.remainingAmount - b.remainingAmount,
        },
        {
            title: "Currency",
            dataIndex: "currency",
            key: "currency",
            sorter: (a, b) => a.currency - b.currency,
        },

        {
            title: "Action",
            dataIndex: "action",
            key: "_id",
            render: (_, record) => {
                return (
                    <>
                        <div className="flex items-center gap-4">
                      <span>
                        <span className="relative">
                          <PiDotsThreeVerticalBold
                              className="text-lg"
                              onClick={() => handleActions(record._id)}
                          />
                            {selectedRow === record._id ? (
                                <motion.ul
                                    ref={modalRef}
                                    animate={
                                        showActions
                                            ? {opacity: 1, x: -10, y: 1, display: "block"}
                                            : {opacity: 0, x: 0, y: 0, display: "none"}
                                    }
                                    className={` border bg-white z-20 shadow-md rounded absolute -left-[200px] w-[200px] space-y-2`}
                                >
                                    <li
                                        className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                        onClick={() => {
                                            setPaymentDetailsModal((prevstate) => ({
                                                ...prevstate,
                                                companyName: record.companyName,
                                                beneficiary: record.beneficiary,
                                                nationalId: record.nationalId,
                                                phoneNumber: record.phoneNumber,
                                                email: record.email,
                                                paymentAmount: record.paymentAmount,
                                                currency: record.currency,
                                                paymentDate: record.paymentDate,
                                                consumed: record.fullyConsumed,
                                                remainingAmount: record.remainingAmount,
                                                consumptionDetails: "",
                                                id: record._id
                                            }));
                                            setShowPyDetailsModal(!showPyDetailsModal);

                                        }}
                                    >
                                        <FaClipboardList className=" text-lg"/>
                                        <p>Details</p>
                                    </li>

                                    <li
                                        className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                        onClick={() => navigate(`/advance-payment/edit/${record._id}`)}
                                    >
                                        <FaClipboardList className=" text-lg"/>
                                        <p>Edit Contract</p>
                                    </li>
                                </motion.ul>
                            ) : null}
                        </span>
                      </span>

                        </div>
                    </>
                );
            },
        },
    ];

    return (
        <>
            <ListContainer
                title={"Advanced payments"}
                subTitle={"Advanced payments list"}
                navLinktext={"payment/advanced/entry"}
                navtext={"Add new advanced payment Entry"}
                isAllowed={permissions.payments?.create}
                table={
                    <>
                        <Modal
                            width={'95%'}
                            title="Payment details"
                            open={showPyDetailsModal}
                            // onOk={handleOk}
                            onCancel={handleCancel}
                            // key={paymentDetailsModal.id}
                            destroyOnClose
                            footer={[
                                <button key="close" className=" w-fit rounded px-2 py-1 bg-red-300 font-semibold"
                                        onClick={handleCancel}>Close</button>
                            ]}
                        >
                            <div className=" py-4 flex flex-col gap-3">
                                <div
                                    className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 items-stretch">
                                    <ul className="space-y-1">
                                        <li className="items-baseline">
                                            <p className=" text-slate-800 text-[16px]">Payment date</p>
                                            <p className="font-semibold text-[16px]">{`${dayjs(paymentDetailsModal.paymentDate).format("MMM DD, YYYY")}`}</p>
                                        </li>
                                        <li className="items-baseline">
                                            <p className=" text-slate-800 text-[16px]">Company name</p>
                                            <p className="font-semibold text-[16px]">{`${paymentDetailsModal.companyName}`}</p>
                                        </li>
                                        <li className="items-baseline">
                                            <p className=" text-slate-800 text-[16px]">Beneficiary</p>
                                            <p className="font-semibold text-[16px]">{`${paymentDetailsModal.beneficiary}`}</p>
                                        </li>
                                    </ul>
                                    <ul className="space-y-1">
                                        <li className="items-baseline">
                                            <p className=" text-slate-800 text-[16px]">Phone number</p>
                                            <p className="font-semibold text-[16px]">{`${paymentDetailsModal.phoneNumber}`}</p>
                                        </li>
                                        <li className="items-baseline">
                                            <p className=" text-slate-800 text-[16px]">Email</p>
                                            <p className="font-semibold text-[16px]">{`${paymentDetailsModal.email}`}</p>
                                        </li>
                                        <li className="items-baseline">
                                            <p className=" text-slate-800 text-[16px]">National ID</p>
                                            <p className="font-semibold text-[16px]">{`${paymentDetailsModal.nationalId}`}</p>
                                        </li>
                                    </ul>

                                    <ul className="space-y-1">
                                        <li className="items-baseline">
                                            <p className=" text-slate-800 text-[16px]">Payment amount</p>
                                            <p className="font-semibold text-[16px]">{`${paymentDetailsModal.paymentAmount} ${paymentDetailsModal.currency}`}</p>
                                        </li>
                                        <li className="items-baseline">
                                            <p className=" text-slate-800 text-[16px]">Remaining amount</p>
                                            <p className="font-semibold text-[16px]">{`${paymentDetailsModal.remainingAmount} ${paymentDetailsModal.currency}`}</p>
                                        </li>
                                        <li className="items-baseline">
                                            <p className=" text-slate-800 text-[16px]">Consumed</p>
                                            <p className="font-semibold text-[16px]">{`${paymentDetailsModal.remainingAmount  <= 0 ? "Yes" : "No"}`}</p>
                                        </li>
                                    </ul>


                                </div>
                            </div>
                        </Modal>

                        <div className=" w-full overflow-x-auto h-full min-h-[320px]">
                            <div className="w-full flex flex-col  sm:flex-row justify-between items-center mb-4 gap-3">
                <span className="max-w-[220px] border rounded flex items-center p-1 justify-between gap-2">
                  <PiMagnifyingGlassDuotone className="h-4 w-4"/>
                  <input
                      type="text"
                      className=" w-full focus:outline-none"
                      name="tableFilter"
                      id="tableFilter"
                      placeholder="Search..."
                      onChange={(e) => SetSearchText(e.target.value)}
                  />
                </span>

                                <span className="flex w-fit justify-evenly items-center gap-6 pr-1">
                                  <BiSolidFilePdf className=" text-2xl"/>
                                  <BsCardList className=" text-2xl"/>
                                  <HiOutlinePrinter className=" text-2xl"/>
                                </span>
                            </div>
                            <Table
                                className=" w-full"
                                loading={{
                                    indicator: (
                                        <ImSpinner2
                                            style={{width: "60px", height: "60px"}}
                                            className="animate-spin text-gray-500"
                                        />
                                    ),
                                    spinning: isLoading,
                                }}
                                dataSource={dataz}
                                columns={columns}
                                rowClassName={record => record.fullyConsumed && "bg-green-100"}
                                expandable={{
                                    expandedRowRender: record => {
                                        return (
                                            <div>
                                                <p className="text-lg font-semibold">Payment details</p>
                                                <div
                                                    className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 items-stretch">
                                                    {record.usage?.length > 0 && record.usage.map((item, index) => (
                                                        <ul className="space-y-1" key={index}>
                                                            <li className="items-baseline">
                                                                <p className=" text-slate-800 text-[16px]">Payment
                                                                    date</p>
                                                                <p className="font-semibold text-[16px]">{`${dayjs(record.date).format("MMM DD, YYYY")}`}</p>
                                                            </li>
                                                            <li className="items-baseline">
                                                                <p className=" text-slate-800 text-[16px]">Description</p>
                                                                <p className="font-semibold text-[16px]">{`${item.description}`}</p>
                                                            </li>
                                                            <div className="flex flex-row gap-3">
                                                                <Link to={`/lots/${item.lotId}`}>
                                                                    <Button>
                                                                        Link to Lot
                                                                    </Button>
                                                                </Link>
                                                                <Link to={`/payments`}>
                                                                    <Button>
                                                                        Link to Payment
                                                                    </Button>
                                                                </Link>
                                                            </div>
                                                        </ul>
                                                    ))}
                                                </div>
                                            </div>
                                        )
                                    },
                                    rowExpandable: record => record.usage?.length > 0,
                                }}
                                rowKey="_id"
                            />
                        </div>
                    </>
                }
            />

        </>
    );
};
export default AdvancedPaymentsList;
