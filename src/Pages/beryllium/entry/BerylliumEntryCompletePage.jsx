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
import {LotExpandable} from "../../HelpersJsx";
import ConfirmFooter from "../../../components/modalsfooters/ConfirmFooter";

const BerylliumEntryCompletePage = ({entryId}) => {
    // const {entryId} = useParams();
    const navigate = useNavigate();
    const { permissions: userPermissions } = useSelector(state => state.persistedReducer?.global);
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
        if (isSuccess || isUpdateSuccess) {
            const {data: info} = data;
            const {entry: entr} = info;
            const output = [
                {
                    ...entr
                }
            ]
            setSuply(entr);
            setLotInfo(output);
        }
    }, [isSuccess, isUpdateSuccess, data]);

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
            if (info.file.status === "done") {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === "error") {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };

    const customRequest = async ({ file, onSuccess, onError, fileName }) => {
        const formData = new FormData();
        formData.append(fileName, file);
        await updateBerylliumiteEntry({entryId, body: formData});
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
                if (updatedItem.nonSellAgreementAmount > 0) {
                    updatedItem.nonSellAgreement = {weight: updatedItem.weightOut};
                    updatedItem.cumulativeAmount = 0;
                } else {
                    updatedItem.nonSellAgreement = {weight: 0};
                    updatedItem.cumulativeAmount = updatedItem.weightOut;
                }
            }
            if (Boolean(parseFloat(updatedItem.pricePerUnit)) === true) {
                updatedItem.mineralPrice = (parseFloat(updatedItem.pricePerUnit) * parseFloat(updatedItem.weightOut)).toFixed(5) || null;
            }
            newData.splice(index, 1, updatedItem);
            setLotInfo(newData);
            setEditRowKey("");
            await updateBerylliumiteEntry({ body: updatedItem, entryId: updatedItem._id });
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
            table: true,
            sorter: (a, b) => a.mineralgrade - b.mineralgrade,
        },
        gradeImg: {
            title: "Grade Img",
            dataIndex: "gradeImg",
            key: "gradeImg",
            width: 100,
            // editTable: true,
            table: true,
            render: (_, record) => {
                if (record.gradeImg) {
                    return (
                        <div className="flex items-center">
                            {record.gradeImg && (<Button onClick={() => handlePreview(record.gradeImg?.filePath)} icon={<FaImage title="Preview" className="text-lg"/>}/>)}
                            {userPermissions.gradeImg?.edit && (<IoClose title="Delete" className="text-lg" onClick={() => removeFile(entryId)}/>)}
                        </div>
                    )
                } else {
                    return (
                        <Upload
                            beforeUpload={beforeUpload}
                            // name={record.lotNumber}
                            // action={`${AppUrls.server}/coltan/${entryId}`}
                            // method="PATCH"
                            {...props}
                            customRequest={async ({file, onSuccess, onError}) => customRequest({file, onSuccess, onError, fileName: "berylliumGradeImg"})}
                            onRemove={() => removeFile(entryId)}
                        >
                            <Button icon={<UploadOutlined/>}/>
                        </Upload>
                    )
                }

            }
        },
        pricePerUnit: {
            title: "price/kg (RWF)",
            dataIndex: "pricePerUnit",
            key: "pricePerUnit",
            table: true,
            sorter: (a, b) => a.pricePerUnit - b.pricePerUnit,
        },
        mineralPrice: {
            title: "Price (RWF)",
            dataIndex: "mineralPrice",
            key: "mineralPrice",
            table: true,
            sorter: (a, b) => a.mineralPrice - b.mineralPrice,
        },
        paid: {
            title: "paid (RWF)",
            dataIndex: "paid",
            key: "paid",
            table: false,
            sorter: (a, b) => a.paid - b.paid,
        },
        sampleIdentification: {
            title: "Sample Identification",
            dataIndex: "sampleIdentification",
            key: "sampleIdentification",
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
            // editTable: true,
            table: false,
            render: (_, record) => {
                if (record.nonSellAgreement?.weight) {
                    return <span>{record.nonSellAgreement?.weight}</span>
                }
            }
        }
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
    ];

    if (restrictedColumns && userPermissions && columns) {
        filterColumns(restrictedColumns, userPermissions, columns, "beryllium");
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
                                                        return (
                                                            <LotExpandable
                                                                updateEntry={updateBerylliumiteEntry}
                                                                userPermissions={userPermissions}
                                                                record={record}
                                                                isProcessing={isSending}
                                                                restrictedColumns={restrictedColumns}
                                                                entryId={entryId}
                                                            />
                                                        )
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
                     <ConfirmFooter key={"actions"} isSending={isSending} defText={"Confirm"} dsText={"Sending"} handleCancel={() => setShowPayModel(!showPayModel)} handleConfirm={handleModelAdvance}/>
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
