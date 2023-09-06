import {useEffect, useState} from "react";
import dayjs from "dayjs";
import {Form, Input, Modal, Spin, Table} from "antd";
import ActionsPagesContainer from "../../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../../components/Actions components/AddComponent";
import {BiSolidEditAlt} from "react-icons/bi";
import {FaSave} from "react-icons/fa";
import { toast} from "react-toastify";
import {MdOutlineClose, MdPayments,} from "react-icons/md";
import {useGetOneColtanEntryQuery, useUpdateColtanEntryMutation} from "../../../states/apislice";
import {useNavigate, useParams} from "react-router-dom";

const ColtanEntryCompletePage = () => {
    const {entryId} = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [selectedLotNumber, setSelectedLotNumber] = useState(null);
    const {data, isLoading, isError, isSuccess, error} =
        useGetOneColtanEntryQuery({entryId});
    const [ updateColtanEntry, { isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError}] = useUpdateColtanEntryMutation();
    useEffect( () => {
        if (isUpdateSuccess) {
            toast.success("Entry updated successfully");
        } else if (isUpdateError) {
            const { message } = updateError.data;
            toast.error(message);
        }
    }, [isUpdateError, isUpdateSuccess, updateError]);
    const [formval, setFormval] = useState({
        lat: "",
        long: "",
        name: "",
        code: "",
    });
    const [selectedRow, SetSelectedRow] = useState({
        id: null,
        name: "",
        date: "",
    });
    const [suply, setSuply] = useState([]);
    const [lotInfo, setLotInfo] = useState(null);
    const [editingRow, setEditingRow] = useState(null);
    const [editRowKey, setEditRowKey] = useState("");
    const [show, setShow] = useState(false);
    const [showPayModel, setShowPayModel] = useState(false);

    useEffect(() => {
        if (isSuccess) {
            const {data: info} = data;
            const {entry: entr} = info;
            setSuply(entr);
            setLotInfo(entr.output);
            console.log(entr);
            // console.log(lotInfo);
        }
    }, [isSuccess]);

    // const onFinish = (values) => {
    //     console.log('onFinish:', values);
    //     const editingRowIndex = lotInfo.findIndex((item) => item._id === editingRow);

    //     if (editingRowIndex !== -1) {
    //         const updatedDataSource = [...lotInfo];
    //         updatedDataSource[editingRowIndex] = { ...values };

    //         console.log('updatedDataSource:', updatedDataSource);

    //         setLotInfo(updatedDataSource);
    //         setEditingRow(null);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {...suply};
        await updateColtanEntry({body, entryId});
        // await updateBuyer({ body, buyerId });
        // console.log(suply);
        console.log(lotInfo);
        // navigate(-1);
    };
    const handleModelAdvance = () => {
        console.log("backend done");
        navigate(`/coltan/payment/coltan/${suply._id}/${selectedLotNumber}`);
    };


    const handleCancel = () => {
        setFormval({lat: "", long: "", name: "", code: ""});
        navigate(-1);
    };

    const isEditing = (record) => {
        return record._id === editRowKey;
    };
    const edit = (record) => {
        form.setFieldsValue({
            weightOut: record.weightOut,
            rmaFee: record.rmaFee,
            ...record,
        });
        setEditRowKey(record._id);
        setShow(false);
    };
    const save = async (key) => {
        const row = await form.validateFields();
        const newData = [...lotInfo];
        const index = newData.findIndex((item) => key === item._id);
        if (index > -1) {
            const item = newData[index];
            newData.splice(index, 1, {...item, ...row});
            setLotInfo(newData);
            setEditRowKey("");
        }
    };
    const handleActions = (id) => {
        setShow(!show);
        SetSelectedRow(id);
        console.log("Deleted ID:", id);
    };

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
        // {
        //   title: "Paid",
        //   dataIndex: "paid",
        //   key: "paid",
        //   editTable: true,
        //   sorter: (a, b) => a.paid - b.paid,
        // },
        // {
        //   title: "Cummulative A",
        //   dataIndex: "cumulativeAmount",
        //   key: "cumulativeAmount",
        //   sorter: (a, b) => a.cumulativeAmount - b.cumulativeAmount,
        // },
        // {
        //   title: "rma Fee",
        //   dataIndex: "rmaFee",
        //   key: "rmaFee",
        //   editTable: true,
        //         sorter: (a, b) => a.weightOut - b.weightOut,
        //     },
        {
            title: "balance (KG)",
            dataIndex: "cumulativeAmount",
            key: "cumulativeAmount",
            sorter: (a, b) => a.cumulativeAmount - b.cumulativeAmount,
        },

        {
            title: "paid ($)",
            dataIndex: "paid",
            key: "paid",
            editTable: true,
            sorter: (a, b) => a.paid - b.paid,
        },
        {
            title: "unpaid ($)",
            dataIndex: "unpaid",
            key: "unpaid",
            editTable: true,
            sorter: (a, b) => a.unpaid - b.unpaid,
        },
        {
            title: "Tantal ($)",
            dataIndex: "tantalum",
            key: "tantalum",
            editTable: true,
            sorter: (a, b) => a.tantalum - b.tantalum,
        },
        {
            title: "Grade (%)",
            dataIndex: "mineralGrade",
            key: "mineralGrade",
            editTable: true,
            sorter: (a, b) => a.mineralgrade - b.mineralgrade,
        },
        {
            title: "Price ($)",
            dataIndex: "mineralPrice",
            key: "mineralPrice",
            editTable: true,
            sorter: (a, b) => a.mineralPrice - b.mineralPrice,
        },
        {
            title: "RMA Fee (RWF)",
            dataIndex: "rmaFee",
            key: "rmaFee",
            editTable: true,

            sorter: (a, b) => a.rmaFee - b.rmaFee,
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
                            {editable ? null : <>
                                {/* <span className="relative">
                <PiDotsThreeVerticalBold
                  className=" text-xl"
                  onClick={() => handleActions(record._id)}
                />
                {selectedRow === record._id && (
                  <motion.ul
                    animate={
                      show
                        ? { opacity: 1, x: -10, display: "block" }
                        : { opacity: 0, x: 0, display: "none" }
                    }
                    className={` border bg-white z-20 shadow-md rounded absolute -left-[200px] w-[200px] space-y-2`}
                  >
                    <li
                      className="flex gap-4 p-2 items-center hover:bg-slate-100"
                      onClick={() => {
                        navigate(`/buyer/details/${record._id}`);
                      }}
                    >
                      <RiFileListFill className=" text-lg" />
                      <p>more details</p>
                    </li>
                    <li
                      className="flex gap-4 p-2 items-center hover:bg-slate-100"
                      onClick={() => {
                        {
                          navigate(`/edit/coltan/${record._id}`);
                        }
                      }}
                    >
                      <BiSolidEditAlt className=" text-lg" />
                      <p>edit</p>
                    </li>
                    <li
                      className="flex gap-4 p-2 items-center hover:bg-slate-100"
                      onClick={() => {
                        {
                          navigate(`/complete/coltan/${record._id}`);
                        }
                      }}
                    >
                      <RiFileEditFill className=" text-lg" />
                      <p>complete entry</p>
                    </li>
                    <li
                      className="flex gap-4 p-2 items-center hover:bg-slate-100"
                      onClick={() => setShowPayModel(true)}
                    >
                      <MdPayments className=" text-lg" />
                      <p>Pay</p>
                    </li>
                  </motion.ul>
                )}
              </span> */}

                                <MdPayments
                                    className=" text-xl"
                                    onClick={() => {
                                        setSelectedLotNumber(record.lotNumber);
                                        setShowPayModel(true);
                                    }
                                    }
                                />

                                <BiSolidEditAlt
                                    className=" text-xl"
                                    onClick={() => edit(record)}
                                />

                            </>}

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
    const mergedColumns = columns.map((col) => {
        if (!col.editTable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const EditableCell = ({
                              editing,
                              dataIndex,
                              title,
                              record,
                              children,
                              ...restProps
                          }) => {
        const input = (
            <Input
                style={{margin: 0}}
                type={
                    dataIndex === "weightOut" || dataIndex === "rmaFee"
                        ? "number"
                        : "text"
                }
            />
        );
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item name={dataIndex} style={{margin: 0}}>
                        {input}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };
    return (
        <div>
            <ActionsPagesContainer
                title={"Coltan Details"}
                subTitle={"View Coltan detailes"}
                actionsContainer={
                    <AddComponent
                        component={
                            <>
                                {isLoading ? (
                                    <Spin/>
                                ) : (
                                    <div className="flex flex-col gap-3 w-full">
                                        <div
                                            className="w-full bg-slate-50 grid grid-cols-2 p-2 border-b items-center justify-between rounded-md">
                                            <p className=" font-semibold">Entry details</p>

                                        </div>

                                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full">
                                            <li>
                                                <p className=" text-md text-indigo-500 pb-[1px] font-semibold">
                                                    Entry details
                                                </p>
                                                <p>Weight in: {suply?.weightIn}</p>
                                                <p>Mineral type: {suply?.mineralType}</p>
                                                {/* <p>Supply date: {dayjs(suply?.supplyDate).format("MMM DD, YYYY")}</p> */}
                                                <p>Number of tags: {suply?.numberOfTags}</p>
                                                <p>Beneficiary: {suply?.beneficiary}</p>
                                            </li>
                                            <li>
                                                <p className=" text-md text-indigo-500 pb-[1px] font-semibold">
                                                    Representative info
                                                </p>
                                                <p>Nbr of Digers:{suply.numberOfDiggers}</p>
                                                <p>Nbr of washers:{suply.numberOfWashers}</p>
                                                <p>Nbr of Transporters:{suply.numberOfTransporters}</p>
                                            </li>
                                            <li>
                                                <p className=" text-md text-indigo-500 pb-[1px] font-semibold">
                                                    company info
                                                </p>
                                                <p>Name:{suply?.companyName}</p>
                                                <p>Email:{suply.email}</p>
                                                <p>TIN Number:{suply.TINNumber}</p>
                                                <p className=" shrink">License Number:{suply.licenseNumber}</p>
                                            </li>
                                        </ul>

                                        {/* <div className="grid grid-cols-1 gap-2">

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 w-full gap-3">

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
                            </div> */}
                                    </div>
                                )}

                                <div className="w-full">
                                    {/* {suply.output?.map(({ name, code, _id, coordinates }) => (

                                            <MineSiteCard key={_id}
                                                name={name}
                                                code={code}
                                                lat={coordinates.lat}
                                                long={coordinates.long}
                                                onclick={() => { navigate(`/edit/supplier/minesite/${_id}`) }} />

                                        ))} */}
                                    <Form form={form} component={false}>
                                        <Table
                                            className="overflow-x-auto w-full"
                                            loading={isLoading}
                                            dataSource={lotInfo}
                                            columns={mergedColumns}
                                            components={{
                                                body: {
                                                    cell: EditableCell,
                                                },
                                            }}
                                            rowKey="_id"
                                        />
                                    </Form>
                                </div>
                                <Modal
                                    open={showPayModel}
                                    onOk={""}
                                    onCancel={() => setShowPayModel(!showPayModel)}
                                    destroyOnClose
                                    footer={[
                                        <span
                                            key="actions"
                                            className=" flex w-full justify-center gap-4 text-base text-white"
                                        >
                      <button
                          key="back"
                          className=" bg-green-400 p-2 rounded-lg"
                          onClick={() => handleModelAdvance()}
                      >
                        Confirm
                      </button>
                      <button
                          key="submit"
                          className=" bg-red-400 p-2 rounded-lg"
                          type="primary"
                          onClick={() => setShowPayModel(!showPayModel)}
                      >
                        Cancel
                      </button>
                    </span>,
                                    ]}
                                >
                                    <h2 className="modal-title text-center font-bold text-xl">
                                        Proceed Payment
                                    </h2>
                                    <p className="text-center text-lg">
                                        {`Please verify all the information before proceeding`}
                                        .
                                    </p>
                                </Modal>
                            </>
                        }
                        Add={handleSubmit}
                        Cancel={handleCancel}
                        // isloading={isSending}
                    />
                }
            />
        </div>
    );
};
export default ColtanEntryCompletePage;
