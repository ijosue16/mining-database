import React, {useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import {motion} from "framer-motion";
import {Button, Form, Input, message, Modal, Table, Upload} from "antd";
import ActionsPagesContainer from "../../../components/Actions components/ActionsComponentcontainer";
import AddComponent from "../../../components/Actions components/AddComponent";
import {BiSolidEditAlt} from "react-icons/bi";
import {PiDotsThreeVerticalBold} from "react-icons/pi";
import {ImSpinner2} from "react-icons/im";
import {FaImage, FaSave} from "react-icons/fa";
import {toast} from "react-toastify";
import {MdOutlineClose, MdPayments} from "react-icons/md";
import {
    useDeleteGradeImgMutation,
    useGetOneBerylliumEntryQuery,
    useUpdateBerylliumEntryMutation
} from "../../../states/apislice";
import {useNavigate, useParams} from "react-router-dom";
import {useMyContext} from "../../../context files/LoginDatacontextProvider";
import FetchingPage from "../../FetchingPage";
import {AppUrls, filterColumns, getBase64FromServer} from "../../../components/helperFunctions";
import {useSelector} from "react-redux";
import {IoClose} from "react-icons/io5";
import {UploadOutlined} from "@ant-design/icons";

const BerylliumEntryCompletePage = ({entryId}) => {
    // const {entryId} = useParams();
    const navigate = useNavigate();
    const { permissions: userPermissions } = useSelector(state => state.persistedReducer.global);
    // const {loginData} = useMyContext();
    // const {profile, permissions} = loginData;
    const [form] = Form.useForm();
    const {data, isLoading, isError, isSuccess, error} =
    useGetOneBerylliumEntryQuery({entryId}, {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });
    const [updateBerylliumiteEntry, {
        isSuccess: isUpdateSuccess,
        isLoading: isSending,
        isError: isUpdateError,
        error: updateError
    }] = useUpdateBerylliumEntryMutation();

    const [
        deleteGradeImg,
        {
            isSuccess: isImageDeleteSuccess,
            isError: isImageDeleteError,
            error: imageDeleteError,
        },
    ] = useDeleteGradeImgMutation();

    useEffect(() => {
        if (isImageDeleteSuccess) {
            return message.success("File successfully deleted");
        } else if (isImageDeleteError) {
            const { message: deleteError } = imageDeleteError.data;
            return message.error(deleteError);
        }
    }, [isImageDeleteSuccess, isImageDeleteError, imageDeleteError]);

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
            return message.success("Entry updated successfully");
        } else if (isUpdateError) {
            const {message: errorMessage} = updateError.data;
            return message.error(errorMessage);
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

    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    useEffect(() => {
        if (isSuccess) {
            const {data: info} = data;
            const {entry: entr} = info;
            const output = [
                {
                    ...entr
                }
            ]
            setSuply(entr);
            setLotInfo(output);
            // console.log(lotInfo);
        }
    }, [isSuccess]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {...suply, ...lotInfo[0]};
        await updateBerylliumiteEntry({body, entryId});

        // navigate(-1);
    };
    const handleModelAdvance = async () => {
        const body = {...suply, ...lotInfo[0]};
        await updateBerylliumiteEntry({body, entryId});
        navigate(`/payment/beryllium/${suply._id}`);
    };

    const handleCancel = () => {
        setFormval({lat: "", long: "", name: "", code: ""});
        navigate(-1);
    };

    const handlePreview = async (fileUrl) => {
        // const fileUrl = 'https://mining-company-management-system.onrender.com/data/coltan/DSC_0494.jpg';
        const previewedUrl = await getBase64FromServer(fileUrl);
        setPreviewImage(previewedUrl);
        setPreviewVisible(true);
    };
    const props = {
        onChange: (info) => {
            if (info.file.status !== "uploading") {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === "done") {
                return message.success(`${info.file.name} file uploaded successfully`);
                // refetch()
            } else if (info.file.status === "error") {
                return message.error(`${info.file.name} file upload failed.`);
            }
        },
    };
    const beforeUpload = (file) => {
        const isPNG = file.type === "image/png" || file.type === "image/jpeg";
        if (!isPNG) {
            message.error(`${file.name} is not a .png or .jpeg file`);
        }
        return isPNG || Upload.LIST_IGNORE;
    };
    const removeFile = async (entryId) => {
        const body = {};
        await deleteGradeImg({ body, entryId, model: "beryllium" });
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
            const updatedItem = {
                ...item,
                ...row,
            };
            // TODO 3: HOW TO CALCULATE MINERAL PRICE FOR BERYLLIUM
            if (item.nonSellAgreementAmount !== updatedItem.nonSellAgreementAmount) {
                if (parseFloat(updatedItem.nonSellAgreementAmount) > parseFloat(updatedItem.cumulativeAmount)) {
                    return message.error("Non Sell Agreement Amount cannot be greater than Weight Out", 5);
                }
                if (Boolean(item.nonSellAgreementAmount) === true && Boolean(updatedItem.nonSellAgreementAmount) === false) {
                    return message.error("Non Sell Agreement Amount cannot be empty", 5);
                }
                updatedItem.cumulativeAmount = 0;
            }
            if (updatedItem.pricePerUnit) {
                updatedItem.mineralPrice = (parseFloat(updatedItem.pricePerUnit) * parseFloat(updatedItem.weightOut)).toFixed(3) || null;
            }
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
        mineralGrade: {
            title: "Grade (%)",
            dataIndex: "mineralGrade",
            key: "mineralGrade",
            sorter: (a, b) => a.mineralgrade - b.mineralgrade,
        },
        gradeImg: {
            title: "Grade Img",
            dataIndex: "gradeImg",
            key: "gradeImg",
            // editTable: true,
            sorter: (a, b) => a.mineralgrade - b.mineralgrade,
            render: (_, record) => {
                if (record.gradeImg) {
                    return (
                        <div className="flex items-center">
                            {record.gradeImg && (<Button onClick={() => handlePreview(record.gradeImg.filePath)} icon={<FaImage title="Preview" className="text-lg"/>}/>)}
                            {userPermissions.gradeImg.edit && (<IoClose title="Delete" className="text-lg" onClick={() => removeFile(entryId)}/>)}
                        </div>
                    )
                } else {
                    return (
                        <Upload
                            beforeUpload={beforeUpload}
                            name={record.lotNumber}
                            action={`${AppUrls.server}/wolframite/${entryId}`}
                            method="PATCH"
                            {...props}
                            onRemove={() => removeFile(entryId)}
                        >
                            {!record.gradeImg ? <Button icon={<UploadOutlined/>}/> : null}
                        </Upload>
                    )
                }

            }
        },
        pricePerUnit: {
            title: "price/kg ($)",
            dataIndex: "pricePerUnit",
            key: "pricePerUnit",
            sorter: (a, b) => a.pricePerUnit - b.pricePerUnit,
        },
        mineralPrice: {
            title: "Price ($)",
            dataIndex: "mineralPrice",
            key: "mineralPrice",
            sorter: (a, b) => a.mineralPrice - b.mineralPrice,
        },
        paid: {
            title: "paid ($)",
            dataIndex: "paid",
            key: "paid",
            sorter: (a, b) => a.paid - b.paid,
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
            title: "weight out (KG)",
            dataIndex: "weightOut",
            key: "weightOut",
            sorter: (a, b) => a.weightOut - b.weightOut,
        },
        {
            title: "balance (KG)",
            dataIndex: "cumulativeAmount",
            key: "cumulativeAmount",
            sorter: (a, b) => a.cumulativeAmount - b.cumulativeAmount,
        },
        {
            title: "non-sell agreement (KG)",
            dataIndex: "nonSellAgreementAmount",
            key: "nonSellAgreementAmount",
            editTable: true,
            sorter: (a, b) => a.nonSellAgreementAmount - b.nonSellAgreementAmount,
            render: (_, record) => {
                if (record.nonSellAgreementAmount?.weight) {
                    return <span>{record.nonSellAgreementAmount.weight}</span>
                }
            }
        },
    ];

    if (restrictedColumns && userPermissions && columns) {
        filterColumns(restrictedColumns, userPermissions, columns);
        columns.push({
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
                              {userPermissions.payments?.create ? (
                                  <li
                                      className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                      onClick={() => {
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
        });
    }
    const handleClose = () => {
        setPreviewVisible(false);
        // setFile(null);
    };

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
                type={"number"}
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
                title={"Berylliumite Details"}
                subTitle={"View Berylliumite detailes"}
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
                                        {/*<div*/}
                                        {/*    className="w-full  grid grid-cols-2 p-2 border-b items-center justify-between rounded-md">*/}
                                        {/*    <p className=" font-semibold text-lg">Entry details</p>*/}
                                        {/*</div>*/}

                                        {/*<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 w-full pb-6">*/}
                                        {/*    <li>*/}
                                        {/*        <p className=" text-md text-indigo-500 pb-[1px] font-semibold">*/}
                                        {/*            Entry details*/}
                                        {/*        </p>*/}
                                        {/*        <p>Weight in: {suply?.weightIn}</p>*/}
                                        {/*        <p>Mineral type: {suply?.name}</p>*/}
                                        {/*         <p>Supply date: {dayjs(suply?.supplyDate).format("MMM DD, YYYY")}</p> */}
                                        {/*        <p>Number of tags: {suply?.numberOfTags}</p>*/}
                                        {/*        <p>Beneficiary: {suply?.beneficiary}</p>*/}
                                        {/*    </li>*/}
                                            {/*<li>*/}
                                            {/*    <p className=" text-md text-indigo-500 pb-[1px] font-semibold">*/}
                                            {/*        Company info*/}
                                            {/*    </p>*/}
                                            {/*    <p>Name: {suply?.companyName}</p>*/}
                                            {/*    <p>Email: {suply.email}</p>*/}
                                            {/*    <p>TIN Number: {suply.TINNumber}</p>*/}
                                            {/*    <p className=" shrink">*/}
                                            {/*        License Number: {suply.licenseNumber}*/}
                                            {/*    </p>*/}
                                            {/*</li>*/}
                                            {/*<li>*/}
                                            {/*    <p className=" text-md text-indigo-500 pb-[1px] font-semibold">*/}
                                            {/*        Representative info*/}
                                            {/*    </p>*/}
                                            {/*    <p>Phone number: {suply.representativePhoneNumber}</p>*/}
                                            {/*    <p>ID: {suply.representativeId}</p>*/}
                                            {/*    /!*<p>Nbr of Transporters:{suply.numberOfTransporters}</p>*!/*/}
                                            {/*</li>*/}

                                        {/*</ul>*/}
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
                                            expandable={{
                                                expandedRowRender: (record) => {
                                                    if (record.shipments) {
                                                        let color = "";
                                                        // const value='non-sell agreement'
                                                        switch (record.status) {
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
                                                            <>
                                                                <div className=" space-y-3 w-full">
                                                                    <p className=" text-lg font-bold">More Details</p>
                                                                    <div className=" w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                                                        <span className=" space-y-2">
                                                                            <p className="text-md font-semibold">
                                                                              Exported Amount: {record.exportedAmount}
                                                                            </p>
                                                                          </span>
                                                                        <span className=" space-y-2">
                                                                            <p className="text-md font-semibold">
                                                                              paid: {record.paid}
                                                                            </p>
                                                                            <p className="text-md font-semibold">
                                                                              Unpaid: {record.unpaid}
                                                                            </p>
                                                                          </span>
                                                                        <span className=" space-y-2">
                                                                            <p className="text-md font-semibold">
                                                                              Payment status: {record.settled}
                                                                            </p>
                                                                            <p className="text-md font-semibold">
                                                                              Unpaid: {record.unpaid}
                                                                            </p>
                                                                          </span>
                                                                        <span className=" space-y-2">
                                                                              <p className={"text-md font-semibold"}>
                                                                                  status: <span className={` px-3 py-1 ${color} w-fit text-white rounded`}>{record.status}</span>
                                                                              </p>
                                                                          </span>
                                                                    </div>
                                                                </div>
                                                                <div className="w-full flex flex-col items-end bg-white rounded-md p-2">
                                                                    <span className="grid grid-cols-3 items-center justify-between w-full md:w-1/2  rounded-sm">
                                                                      <p className=" font-semibold col-span-1 p-2 w-full border-b border-t text-start bg-slate-50">Shipment Number</p>
                                                                      <p className=" font-medium col-span-1 p-2 w-full border ">Weight</p>
                                                                      <p className=" font-medium col-span-1 p-2 w-full border ">Date</p>
                                                                    </span>
                                                                    {record.shipments.map((shipment, index) => {
                                                                        if (!Array.isArray(shipment)) {
                                                                            return (
                                                                                <span key={index} className="grid grid-cols-3 items-center justify-between w-full md:w-1/2  rounded-sm">
                                                                                  <p className=" font-semibold col-span-1 p-2 w-full border-b border-t text-start bg-slate-50">{shipment.shipmentNumber}</p>
                                                                                  <p className=" font-medium col-span-1 p-2 w-full border ">{shipment.weight}</p>
                                                                                  <p className=" font-medium col-span-1 p-2 w-full border ">Date</p>
                                                                                </span>
                                                                            )
                                                                        }
                                                                    })}
                                                                </div>
                                                            </>
                                                        )
                                                    }
                                                },
                                                rowExpandable: (record) => record.supplierName !== "Not Expandable",
                                            }}
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
                                    width={"70%"}
                                    open={previewVisible}
                                    title="Image Preview"
                                    footer={null}
                                    onCancel={handleClose}
                                >
                                    <img
                                        alt="example"
                                        style={{ width: "100%", height: "100%" }}
                                        src={previewImage}
                                    />
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
export default BerylliumEntryCompletePage;
