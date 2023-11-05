import React, {useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import {motion} from "framer-motion";
import {Form, Input, Modal, Table, Upload, Button, message} from "antd";
import { UploadOutlined } from '@ant-design/icons';
import ActionsPagesContainer from "../../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../../components/Actions components/AddComponent";
import {BiSolidEditAlt} from "react-icons/bi";
import {PiDotsThreeVerticalBold} from "react-icons/pi";
import {ImSpinner2} from "react-icons/im";
import {FaSave, FaImage} from "react-icons/fa";
import {toast} from "react-toastify";
import {MdOutlineClose, MdPayments} from "react-icons/md";
import {useGetOneColtanEntryQuery, useUpdateColtanEntryMutation, useDeleteGradeImgMutation} from "../../../states/apislice";
import {useNavigate, useParams} from "react-router-dom";
import {useMyContext} from "../../../context files/LoginDatacontextProvider";
import FetchingPage from "../../FetchingPage";

const getBase64FromServer = (fileUrl) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = fileUrl;
        img.onload = () => {
            resolve(fileUrl);
        };
    });
};



const ColtanEntryCompletePage = () => {
    const {entryId} = useParams();
    const navigate = useNavigate();
    const {loginData} = useMyContext();
    const {profile, permissions} = loginData;
    const [form] = Form.useForm();
    const [selectedLotNumber, setSelectedLotNumber] = useState(null);
    const {data, isLoading, isError, isSuccess, error, refetch} =
        useGetOneColtanEntryQuery({entryId});
    const [updateColtanEntry, {
        isSuccess: isUpdateSuccess,
        isLoading: isSending,
        isError: isUpdateError,
        error: updateError
    }] = useUpdateColtanEntryMutation();

    const [deleteGradeImg, {isSuccess: isImageDeleteSuccess, isError: isImageDeleteError, error: imageDeleteError}] = useDeleteGradeImgMutation();

    let modalRef = useRef();

    const handleClickOutside = (event) => {
        if (!modalRef.current || !modalRef.current.contains(event.target)) {
            setShow(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    useEffect(() => {
        if (isUpdateSuccess) {
            toast.success("Entry updated successfully");
        } else if (isUpdateError) {
            const {message} = updateError.data;
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


    ///////////////////////

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [file, setFile] = useState(null);

    const handleClose = () => {
        setPreviewVisible(false);
        setFile(null);
    };

    const handlePreview = async (fileUrl) => {
        // const fileUrl = 'https://mining-company-management-system.onrender.com/data/coltan/DSC_0494.jpg';
        const previewedUrl = await getBase64FromServer(fileUrl);
        setPreviewImage(previewedUrl);
        setPreviewVisible(true);
    };


    const props = {
        // beforeUpload: (file) => {
        //     const isPNG = file.type === 'image/png';
        //     if (!isPNG) {
        //         message.error(`${file.name} is not a png file`);
        //     }
        //     return isPNG || Upload.LIST_IGNORE;
        // },
        onChange: (info) => {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
                // refetch()
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const customRequest = async ({ file, onSuccess, onError }) => {
        try {
            const formData = new FormData();
            formData.append('1', file);
            // formData.append('customData', 'Your custom data here');

            // Make a custom HTTP request to your server
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                message.success(`${file.name} file uploaded successfully`);
                onSuccess();
            } else {
                message.error(`${file.name} file upload failed.`);
                onError(new Error('Upload failed'));
            }
        } catch (error) {
            message.error(`${file.name} file upload failed.`);
            onError(error);
        }
    };

    const beforeUpload = (file) => {
        const isPNG = file.type === 'image/png' || file.type === 'image/jpeg';
        if (!isPNG) {
            message.error(`${file.name} is not a .png or .jpeg file`);
        }
        return isPNG || Upload.LIST_IGNORE;
    }

    const removeFile = async (lotNumber, entryId) => {
        const body = {lotNumber}
        await deleteGradeImg({body, entryId});
    }

    useEffect(() => {
        if (isImageDeleteSuccess) {
            message.success("File successfully deleted");
        } else if (isImageDeleteError) {
            const { message: deleteError } = imageDeleteError.data;
            message.error(deleteError);
        }
    }, [isImageDeleteSuccess, isImageDeleteError, imageDeleteError]);

    ///////////////////////

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {...suply, output: lotInfo};
        await updateColtanEntry({body, entryId});

        console.log(lotInfo);
        // navigate(-1);
    };
    const handleModelAdvance = async () => {
        console.log("backend done");
        console.log(suply);
        const body = {...suply, output: lotInfo};
        await updateColtanEntry({body, entryId});
        navigate(`/payment/coltan/${suply._id}/${selectedLotNumber}`);
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
    const calculatePrice = (tantal, grade, weightOut) => {
        if (tantal && grade && weightOut) {
            return ((tantal * grade)*weightOut).toFixed(3)
        }
    }
    const save = async (key) => {
        const row = await form.validateFields();
        const newData = [...lotInfo];
        const index = newData.findIndex((item) => key === item._id);
        if (index > -1) {
            const item = newData[index];
            const updatedItem = {
                ...item,
                ...row,
                mineralPrice: calculatePrice(row.tantalum, row.mineralGrade, row.weightOut),
            };
            newData.splice(index, 1, updatedItem);
            setLotInfo(newData);
            setEditRowKey("");
        }
    };
    const handleActions = (id) => {
        setShow(!show);
        SetSelectedRow(id);
    };
    const restrictedColumns = {
        grade: {
            title: "Grade (%)",
            dataIndex: "mineralGrade",
            key: "mineralGrade",
            editTable: true,
            sorter: (a, b) => a.mineralgrade - b.mineralgrade,
        },
        tantal: {
            title: "Tantal ($)",
            dataIndex: "tantalum",
            key: "tantalum",
            editTable: true,
            sorter: (a, b) => a.tantalum - b.tantalum,
        },
        gradeImg: {
            title: "Grade Img",
            dataIndex: "gradeImg",
            key: "gradeImg",
            // editTable: true,
            sorter: (a, b) => a.mineralgrade - b.mineralgrade,
            render: (_, record) => {
                if (record.gradeImg) {
                    return <Button icon={<FaImage title="Preview" className="text-lg" onClick={() => handlePreview(record.gradeImg.filePath)}/>}/>
                } else {
                    return (
                        <Upload
                            beforeUpload={beforeUpload}
                            name={record.lotNumber}
                            action={`https://mining-company-management-system.onrender.com/api/v1/coltan/${entryId}`}
                            method="PATCH"
                            {...props}
                            onRemove={() => removeFile(record.lotNumber, entryId)}
                        >
                            {!record.gradeImg ? <Button icon={<UploadOutlined />}/>: null}

                        </Upload>
                    )
                }

            }
        },
        price: {
            title: "Price ($)",
            dataIndex: "mineralPrice",
            key: "mineralPrice",
            editTable: true,
            sorter: (a, b) => a.mineralPrice - b.mineralPrice,
        },
        paid: {
            title: "paid ($)",
            dataIndex: "paid",
            key: "paid",
            sorter: (a, b) => a.paid - b.paid,
        },
        // unpaid: {
        //     title: "unpaid ($)",
        //     dataIndex: "unpaid",
        //     key: "unpaid",
        //     sorter: (a, b) => a.unpaid - b.unpaid,
        // },
        USDRate: {
            title: "USD Rate (rwf)",
            dataIndex: "USDRate",
            key: "USDRate",
            editTable: true,
            sorter: (a, b) => a.USDRate - b.USDRate,
        },

        rmaFee: {
            title: "RMA Fee ($)",
            dataIndex: "rmaFeeUSD",
            key: "rmaFeeUSD",

            sorter: (a, b) => a.rmaFeeUSD - b.rmaFeeUSD,
        },
    }
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
    if (profile.role === "storekeeper") {
    // && profile.role !== "traceabilityOfficer"
        console.log(profile.role);
        for (const key in restrictedColumns) {
            if (restrictedColumns.hasOwnProperty(key)) {
                columns.splice(4 + Object.keys(restrictedColumns).indexOf(key), 0, restrictedColumns[key]);
            }
        }
    }

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
        <>
          {isLoading ? (
        <FetchingPage />
      ) : (
            <ActionsPagesContainer
                title={"Coltan Details"}
                subTitle={"View Coltan detailes"}
                actionsContainer={
                    <AddComponent
                        component={
                            <>
                                {isLoading ? (
                                    <div className="flex h-32 w-full items-center justify-center bg-white">
                                        <ImSpinner2 className=" h-10 w-10 animate-spin text-gray-400"/>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-6 w-full">
                                        <div
                                            className="w-full  grid grid-cols-2 p-2 border-b items-center justify-between rounded-md">
                                            <p className=" font-semibold text-lg">Entry details</p>
                                        </div>

                                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full pb-6">
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
                                                    Company info
                                                </p>
                                                <p>Name: {suply?.companyName}</p>
                                                <p>Email: {suply.email}</p>
                                                <p>TIN Number: {suply.TINNumber}</p>
                                                <p className=" shrink">
                                                    License Number: {suply.licenseNumber}
                                                </p>
                                            </li>
                                            <li>
                                                <p className=" text-md text-indigo-500 pb-[1px] font-semibold">
                                                    Representative info
                                                </p>
                                                <p>Phone number: {suply.representativePhoneNumber}</p>
                                                <p>ID: {suply.representativeId}</p>
                                                {/*<p>Nbr of Transporters:{suply.numberOfTransporters}</p>*/}
                                            </li>

                                        </ul>
                                    </div>
                                )}
                                <div className="w-full">
                                    <Form form={form} component={false}>
                                        <Table
                                            className="overflow-x-auto w-full"
                                            loading={{
                                                indicator: (<ImSpinner2 style={{width: "60px", height: "60px"}}
                                                                        className="animate-spin text-gray-500"/>),
                                                spinning: isLoading
                                            }}
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
                      {isSending ?
                          <button
                              key="back"
                              className=" bg-green-200 flex items-center gap-1 p-2 text-gray-500 rounded-lg"
                          >
                              <ImSpinner2 className="h-[20px] w-[20px] animate-spin text-gray-500"/>
                              Sending
                          </button> : <button
                              key="back"
                              className=" bg-green-400 p-2 rounded-lg"
                              onClick={() => handleModelAdvance()}
                          >
                              Confirm
                          </button>}

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
                                        {`Please verify all the information before proceeding`}.
                                    </p>
                                </Modal>

                                <Modal
                                width= {'70%'}
                                 
                                    visible={previewVisible}
                                    title="Image Preview"
                                    footer={null}
                                    onCancel={handleClose}
                                >
                                    <img alt="example" style={{width: '100%', height: "100%"}} src={previewImage}/>
                                </Modal>
                            </>
                        }
                        Add={handleSubmit}
                        Cancel={handleCancel}
                        isloading={isSending}
                    />
                }
            />)}
        </>
    );
};
export default ColtanEntryCompletePage;
