import React, {useEffect, useRef, useState} from "react";
import {motion} from "framer-motion";
import {Button, Form, Input, message, Modal, Table, Upload} from "antd";
import {UploadOutlined} from "@ant-design/icons";
import AddComponent from "@/components/Actions components/AddComponent.jsx";
import {BiSolidEditAlt} from "react-icons/bi";
import {PiDotsThreeVerticalBold} from "react-icons/pi";
import {ImSpinner2} from "react-icons/im";
import {FaImage, FaSave} from "react-icons/fa";
import {MdOutlineClose, MdPayments} from "react-icons/md";
import {
    useCreateLotsMutation,
    useDeleteGradeImgMutation,
    useGetEntryQuery,
    useUpdateEntryMutation,
    useUpdateLotMutation
} from "@/states/apislice.js";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import FetchingPage from "@/Pages/FetchingPage.jsx";
import {IoClose} from "react-icons/io5";
import {
    calculatePricePerUnit,
    decidePricingGrade,
    filterColumns,
    getBase64FromServer
} from "@/components/helperFunctions.js";
import {TbReport} from "react-icons/tb";
import {LotExpandable, PricingGrade} from "@/Pages/HelpersJsx.jsx";
import ConfirmFooter from "@/components/modalsfooters/ConfirmFooter.jsx";
import DetailsPageContainer from "@/components/Actions components/DetailsComponentscontainer.jsx";
import {Trash, Calculator} from 'lucide-react';

const EntryCompletePage = ({entryId, model}) => {
    const {permissions: userPermissions} = useSelector(state => state.persistedReducer?.global);
    // const {entryId} = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [selectedLotNumber, setSelectedLotNumber] = useState(null);
    const [imageAvailable, setImageAvailable] = useState(false);
    // const [decision, setDecision] = useState("");
    const {data, isLoading, isError, isSuccess, error,} =
        useGetEntryQuery({entryId, model},
            {
                skip: entryId === undefined,
                refetchOnMountOrArgChange: true,
                refetchOnReconnect: true
            }
        );
    const [updateEntry, {
        isSuccess: isUpdateSuccess,
        isLoading: isSending,
        isError: isUpdateError,
        error: updateError
    }] = useUpdateEntryMutation();


    const [
        deleteGradeImg,
        {
            isSuccess: isImageDeleteSuccess,
            isError: isImageDeleteError,
            error: imageDeleteError,
        },
    ] = useDeleteGradeImgMutation();

    const [updateLot, {isSuccess: isUpdateLotSuccess, isLoading: isUpdatingLot}] = useUpdateLotMutation();

    const [createAndUpdateLots, {
        isSuccess: isCreateDone,
        isLoading: isCreating,
        isError: isCreateError,
        error: createError
    }] = useCreateLotsMutation();

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
        if (isCreateDone || isUpdateLotSuccess) {
            return message.success("Lot updated successfully");
        } else if (isCreateError) {
            const {message: errorMessage} = createError.data;
            return message.error(errorMessage);
        }
    }, [isCreateError, isCreateDone, createError, isUpdateLotSuccess]);

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

    const handleClose = () => {
        setPreviewVisible(false);
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

    const customRequest = async ({file, onSuccess, onError, lotId}) => {
        const formData = new FormData();
        formData.append(lotId, file);
        await updateLot({lotId, body: formData});
        // await updateEntry({entryId, body: formData, model: "coltan"});
    };

    const beforeUpload = (file) => {
        const isPNG = file.type === "image/png" || file.type === "image/jpeg";
        if (!isPNG) {
            message.error(`${file.name} is not a .png or .jpeg file`);
        }
        return isPNG || Upload.LIST_IGNORE;
    };

    const removeFile = async (lotId) => {
        // const body = {lotId};
        // console.log('lotId', lotId);
        await deleteGradeImg({lotId});
    };

    useEffect(() => {
        if (isImageDeleteSuccess) {
            message.success("File successfully deleted");
        } else if (isImageDeleteError) {
            const {message: deleteError} = imageDeleteError.data;
            message.error(deleteError);
        }
    }, [isImageDeleteSuccess, isImageDeleteError, imageDeleteError]);


    useEffect(() => {
        if (isSuccess || isUpdateSuccess) {
            const {data: info} = data;
            const {entry: entr} = info;
            setSuply(entr);
            setLotInfo(entr.output);
        }
    }, [isSuccess, data, isUpdateSuccess]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        const body = {...suply, output: lotInfo};
        await updateEntry({body, entryId, model: "coltan"});
    };
    const handleModelAdvance = async () => {
        const body = {...suply, output: lotInfo};
        await updateEntry({body, entryId, model: "coltan"});
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
    // const calculatePricePerUnit = (tantal, grade) => {
    //     if (tantal && grade) {
    //         return (tantal * grade);
    //     }
    // }
    // const save = async (key) => {
    //     const row = await form.validateFields();
    //     const newData = [...lotInfo];
    //     const index = newData.findIndex((item) => key === item._id);
    //     if (index > -1) {
    //         const item = newData[index];
    //         const updatedItem = {
    //             ...item,
    //             ...row,
    //         };
    //         if (item.nonSellAgreement !== updatedItem.nonSellAgreement) {
    //             if (parseFloat(updatedItem.nonSellAgreement) > parseFloat(updatedItem.cumulativeAmount)) {
    //                 return message.error("Non Sell Agreement Amount cannot be greater than Weight Out", 5);
    //             }
    //             if (Boolean(item.nonSellAgreement) === true && Boolean(updatedItem.nonSellAgreement) === false) {
    //                 return message.error("Non Sell Agreement Amount cannot be empty", 5);
    //             }
    //             if (updatedItem.nonSellAgreement > 0) {
    //                 updatedItem.nonSellAgreement = {weight: updatedItem.weightOut};
    //                 updatedItem.cumulativeAmount = 0;
    //             } else {
    //                 updatedItem.nonSellAgreement = {weight: 0};
    //                 updatedItem.cumulativeAmount = updatedItem.weightOut;
    //             }
    //         }
    //         if (item.mineralGrade !== updatedItem.mineralGrade) {
    //             if (parseFloat(updatedItem.mineralGrade) === 0) return message.error("Mineral Grade cannot be zero", 5);
    //             if (Boolean(item.mineralGrade) === true && Boolean(updatedItem.mineralGrade) === false)
    //                 return message.error("Mineral Grade cannot be empty or zero", 5);
    //         }
    //         if (item.ASIR !== updatedItem.ASIR) {
    //             if (parseFloat(updatedItem.ASIR) === 0) return message.error("ASIR cannot be zero", 5);
    //             if (Boolean(item.ASIR) === true && Boolean(updatedItem.ASIR) === false)
    //                 return message.error("ASIR cannot be empty or zero", 5);
    //         }
    //         if (parseFloat(item.USDRate) !== parseFloat(updatedItem.USDRate)) {
    //             if (parseFloat(updatedItem.USDRate) === 0) return message.error("USD rate cannot be zero", 5);
    //             if (Boolean(item.USDRate) === true && Boolean(updatedItem.USDRate) === false)
    //                 return message.error("USD rate cannot be empty or zero", 5);
    //         }
    //         if (parseFloat(item.tantalum) !== parseFloat(updatedItem.tantalum)) {
    //             if (parseFloat(updatedItem.tantalum) === 0) return message.error("Tantal cannot be zero", 5);
    //             if (Boolean(item.tantalum) === true && Boolean(updatedItem.tantalum) === false)
    //                 return message.error("Tantal cannot be empty or zero", 5);
    //         }
    //         if (Boolean(updatedItem.tantalum) === true && updatedItem.pricingGrade && Boolean(updatedItem[decidePricingGrade(updatedItem.pricingGrade)]) === true && parseFloat(updatedItem[decidePricingGrade(updatedItem.pricingGrade)]) !== 0 && parseFloat(updatedItem.tantalum) !== 0) {
    //             updatedItem.pricePerUnit = calculatePricePerUnit(parseFloat(updatedItem.tantalum), parseFloat(updatedItem[decidePricingGrade(updatedItem.pricingGrade)])).toFixed(5) || null;
    //         }
    //         if (Boolean(updatedItem.pricePerUnit) === true) {
    //             updatedItem.mineralPrice = (updatedItem.pricePerUnit * parseFloat(updatedItem.weightOut)).toFixed(5) || null;
    //         }
    //         newData.splice(index, 1, updatedItem);
    //         setLotInfo(newData);
    //         setEditRowKey("");
    //         const body = {output: [updatedItem]};
    //         await updateEntry({body, entryId, model: "coltan"});
    //     }
    // };
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
            // const model = updatedItem.docModel?.toLowerCase() || row.model; // Get model from the item or passed parameter

            // Common validation for non-sell agreement
            if (item.nonSellAgreement !== updatedItem.nonSellAgreement) {
                if (parseFloat(updatedItem.nonSellAgreement) > parseFloat(updatedItem.cumulativeAmount)) {
                    return message.error("Non Sell Agreement Amount cannot be greater than Weight Out", 5);
                }
                if (Boolean(item.nonSellAgreement) === true && Boolean(updatedItem.nonSellAgreement) === false) {
                    return message.error("Non Sell Agreement Amount cannot be empty", 5);
                }
                if (updatedItem.nonSellAgreement > 0) {
                    updatedItem.nonSellAgreement = {weight: updatedItem.weightOut};
                    updatedItem.cumulativeAmount = 0;
                } else {
                    updatedItem.nonSellAgreement = {weight: 0};
                    updatedItem.cumulativeAmount = updatedItem.weightOut;
                }
            }

            // Common validations for all mineral types
            if (item.mineralGrade !== updatedItem.mineralGrade) {
                if (parseFloat(updatedItem.mineralGrade) === 0) return message.error("Mineral Grade cannot be zero", 5);
                if (Boolean(item.mineralGrade) === true && Boolean(updatedItem.mineralGrade) === false)
                    return message.error("Mineral Grade cannot be empty or zero", 5);
            }

            if (item.ASIR !== updatedItem.ASIR) {
                if (parseFloat(updatedItem.ASIR) === 0) return message.error("ASIR cannot be zero", 5);
                if (Boolean(item.ASIR) === true && Boolean(updatedItem.ASIR) === false)
                    return message.error("ASIR cannot be empty or zero", 5);
            }

            if (item.USDRate !== updatedItem.USDRate) {
                if (parseFloat(updatedItem.USDRate) === 0) return message.error("USD rate cannot be zero", 5);
                if (Boolean(item.USDRate) === true && Boolean(updatedItem.USDRate) === false)
                    return message.error("USD rate cannot be empty or zero", 5);
            }

            // Mineral-specific validations and calculations
            switch (model) {
                case "cassiterite":
                    if (item.londonMetalExchange !== updatedItem.londonMetalExchange) {
                        if (parseFloat(updatedItem.londonMetalExchange) === 0) return message.error("LME cannot be zero", 5);
                        if (Boolean(item.londonMetalExchange) === true && Boolean(updatedItem.londonMetalExchange) === false)
                            return message.error("LME cannot be empty or zero", 5);
                    }
                    if (item.treatmentCharges !== updatedItem.treatmentCharges) {
                        if (parseFloat(updatedItem.treatmentCharges) === 0) return message.error("Treatment Charges cannot be zero", 5);
                        if (Boolean(item.treatmentCharges) === true && Boolean(updatedItem.treatmentCharges) === false)
                            return message.error("Treatment Charges cannot be empty or zero", 5);
                    }
                    if (Boolean(parseFloat(updatedItem.londonMetalExchange)) === true &&
                        updatedItem.pricingGrade &&
                        Boolean(parseFloat(updatedItem[decidePricingGrade(updatedItem.pricingGrade)])) === true &&
                        Boolean(parseFloat(updatedItem.treatmentCharges)) === true) {
                        updatedItem.pricePerUnit = calculatePricePerUnit(model, {
                            LME: parseFloat(updatedItem.londonMetalExchange),
                            grade: parseFloat(updatedItem[decidePricingGrade(updatedItem.pricingGrade)]),
                            TC: parseFloat(updatedItem.treatmentCharges)
                        });
                    }
                    break;

                case "coltan":
                    if (parseFloat(item.tantalum) !== parseFloat(updatedItem.tantalum)) {
                        if (parseFloat(updatedItem.tantalum) === 0) return message.error("Tantal cannot be zero", 5);
                        if (Boolean(item.tantalum) === true && Boolean(updatedItem.tantalum) === false)
                            return message.error("Tantal cannot be empty or zero", 5);
                    }
                    if (Boolean(updatedItem.tantalum) === true &&
                        updatedItem.pricingGrade &&
                        Boolean(updatedItem[decidePricingGrade(updatedItem.pricingGrade)]) === true &&
                        parseFloat(updatedItem[decidePricingGrade(updatedItem.pricingGrade)]) !== 0 &&
                        parseFloat(updatedItem.tantalum) !== 0) {
                        console.log(calculatePricePerUnit(model, {
                            tantal: parseFloat(updatedItem.tantalum),
                            grade: parseFloat(updatedItem[decidePricingGrade(updatedItem.pricingGrade)])
                        }));
                        updatedItem.pricePerUnit = calculatePricePerUnit(model, {
                            tantal: parseFloat(updatedItem.tantalum),
                            grade: parseFloat(updatedItem[decidePricingGrade(updatedItem.pricingGrade)])
                        });
                    }
                    break;

                case "wolframite":
                    if (item.metricTonUnit !== updatedItem.metricTonUnit) {
                        if (Boolean(updatedItem.metricTonUnit) === false)
                            return message.error("MTU cannot be empty or zero", 5);
                        if ((Boolean(item.metricTonUnit) === true && Boolean(updatedItem.metricTonUnit) === false))
                            return message.error("MTU cannot be empty or zero", 5);
                        updatedItem.metricTonUnit = parseFloat(updatedItem.metricTonUnit);
                    }
                    if (Boolean(updatedItem.metricTonUnit) === true &&
                        updatedItem.pricingGrade &&
                        Boolean(updatedItem[decidePricingGrade(updatedItem.pricingGrade)]) === true) {
                        updatedItem.pricePerUnit = calculatePricePerUnit(model, {
                            MTU: parseFloat(updatedItem.metricTonUnit),
                            grade: parseFloat(updatedItem[decidePricingGrade(updatedItem.pricingGrade)])
                        });
                    }
                    break;

                case "lithium":
                case "beryllium":
                    // For lithium and beryllium, use the direct price per unit
                    if (item.pricePerUnit !== updatedItem.pricePerUnit) {
                        if (parseFloat(updatedItem.pricePerUnit) === 0) return message.error("Price Per Unit cannot be zero", 5);
                        if (Boolean(item.pricePerUnit) === true && Boolean(updatedItem.pricePerUnit) === false)
                            return message.error("Price Per Unit cannot be empty or zero", 5);
                    }
                    // pricePerUnit is already set directly in these cases
                    break;
            }

            // Calculate mineral price if price per unit is available
            if (Boolean(updatedItem.pricePerUnit) === true) {
                updatedItem.mineralPrice = (parseFloat(updatedItem.pricePerUnit) * parseFloat(updatedItem.weightOut)).toFixed(5) || null;
            }

            // Update state and save to database
            newData.splice(index, 1, updatedItem);
            setLotInfo(newData);
            setEditRowKey("");

            await createAndUpdateLots({body: {lots: [updatedItem]}, model});
            // const body = { output: [updatedItem] };
            // await updateEntry({ model, body, entryId });
        }
    };

    const handleActions = (id) => {
        setShow(!show);
        SetSelectedRow(id);
    };
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
            // editTable: true, // adjust edit permission based on user permissions
        },
        tantal: {
            title: "Tantal ($)",
            dataIndex: "tantal",
            key: "tantal",
            table: true,
            model: 'coltan'
            // sorter: (a, b) => a.tantalum - b.tantalum,
        },
        metricTonUnit: {
            title: "MTU ($)",
            dataIndex: "metricTonUnit",
            key: "metricTonUnit",
            table: true,
            model: 'wolframite'
        },
        gradeImg: {
            title: "Grade Img",
            dataIndex: "gradeImg",
            key: "gradeImg",
            width: 100,
            // editTable: true,
            table: true,
            render: (_, record) => {
                if (record.gradeImg?.filePath !== null) {
                    return (
                        <div>
                            <div className="flex items-center">
                                <Button onClick={() => handlePreview(record.gradeImg.filePath)}
                                        icon={<FaImage title="Preview" className="text-lg"/>}/>
                                {userPermissions.gradeImg.edit && (<IoClose title="Delete" className="text-lg"
                                                                            onClick={() => removeFile(record._id)}/>)}
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <Upload
                            beforeUpload={beforeUpload}
                            {...props}
                            customRequest={async ({file, onSuccess, onError}) => customRequest({
                                file,
                                onSuccess,
                                onError,
                                lotId: record._id
                            })}
                            onRemove={() => removeFile(record._id)}
                        >
                            <Button icon={<UploadOutlined/>}/>
                        </Upload>
                    )
                }

            }
        },
        pricingGrade: {
            title: "Pricing Grade",
            dataIndex: "pricingGrade",
            key: "pricingGrade",
            table: true,
            width: 80,
            render: (_, record) => {
                return (
                    <PricingGrade
                        value={record.pricingGrade ? record.pricingGrade : ""}
                        lotNumber={record.lotNumber}
                        createAndUpdateLots={createAndUpdateLots}
                        record={record}
                        entryId={entryId}
                        model={model}
                    />
                )

            }
        },
        londonMetalExchange: {
            title: "LME ($)",
            dataIndex: "londonMetalExchange",
            key: "londonMetalExchange",
            table: true,
            model: 'cassiterite'
        },
        treatmentCharges: {
            title: "T.C ($)",
            dataIndex: "treatmentCharges",
            key: "treatmentCharges",
            width: 90,
            table: true,
            model: 'cassiterite'
        },
        pricePerUnit: {
            title: "price/kg ($)",
            dataIndex: "pricePerUnit",
            key: "pricePerUnit",
            table: true,
            render: (_, record) => {
                if (record.pricePerUnit) {
                    return <span>{Number(record.pricePerUnit).toFixed(5)}</span>
                }
            }
        },
        mineralPrice: {
            title: "Price ($)",
            dataIndex: "mineralPrice",
            key: "mineralPrice",
            table: true,
            render: (_, record) => {
                if (record.mineralPrice) {
                    return <span>{Number(record.mineralPrice).toFixed(5)}</span>
                }
            }
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
            model: 'coltan'
        },
        iron: {
            title: "Iron",
            dataIndex: "iron",
            key: "iron",
            table: false,
            model: 'coltan'
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
            editTable: true,
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
        },
        {
            title: "weight out (KG)",
            dataIndex: "weightOut",
            key: "weightOut",
            // editTable: true,
        },
        {
            title: "balance (KG)",
            dataIndex: "cumulativeAmount",
            key: "cumulativeAmount",
        },
    ];

    if (restrictedColumns && userPermissions && columns) {
        filterColumns(restrictedColumns, userPermissions, columns, model);
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

                              {record.nonSellAgreement?.decision !== true && (
                                  <>
                                      <li
                                          className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                          onClick={() => {
                                              navigate(`/lots/${record._id}`)
                                          }}
                                      >
                                          <Calculator size={16}/>
                                          <p>Price Calculations</p>
                                      </li>

                                      {userPermissions.payments?.create ? (
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
                                  </>
                              )}

                              {/*<li*/}
                              {/*    className="flex gap-4 p-2 items-center hover:bg-slate-100"*/}
                              {/*    onClick={() => edit(record)}*/}
                              {/*>*/}
                              {/*    <BiSolidEditAlt className=" text-lg"/>*/}
                              {/*    <p>edit</p>*/}
                              {/*</li>*/}

                              { /* // TODO 8: USE CORRECT PERMISSION OBJECT INSTEAD OF ENTRY */}

                              {/*{userPermissions.entry?.create ? (*/}
                              {/*    <li*/}
                              {/*        className="flex gap-4 p-2 items-center hover:bg-slate-100"*/}
                              {/*        onClick={() => navigate(`/lab-report/coltan/${entryId}/${record.lotNumber}`)}*/}
                              {/*    >*/}
                              {/*        <TbReport className=" text-lg"/>*/}
                              {/*        <p>Lab Report</p>*/}
                              {/*    </li>*/}
                              {/*) : null}*/}


                              <li
                                  className="flex gap-4 p-2 items-center hover:bg-slate-100"
                                  onClick={() => {
                                      console.log('The feature to be implemented soon');
                                  }}
                              >
                                  <Trash size={16}/>
                                  <p>Delete</p>
                              </li>

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
                onWheelCapture={(e) => {
                    e.target.blur();
                }}
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

    if (isUpdatingLot) return <FetchingPage/>

    return (
        <>
            {isLoading ? (
                <FetchingPage/>
            ) : (
                <DetailsPageContainer
                    title={"LOT DETAILS"}
                    // subTitle={"View Coltan detailes"}
                    actionsContainer={
                        <AddComponent
                            component={
                                <>
                                    <div className="w-full">
                                        <Form form={form} component={false}>
                                            <Table
                                                className="overflow-x-auto w-full"
                                                loading={{
                                                    indicator: (<ImSpinner2 style={{width: "60px", height: "60px"}}
                                                                            className="animate-spin text-gray-500"/>),
                                                    spinning: isLoading || isCreating
                                                }}
                                                dataSource={lotInfo}
                                                columns={mergedColumns}
                                                rowClassName={(record) => {
                                                    if (record.nonSellAgreement?.decision === true) {
                                                        return "bg-red-200";
                                                    }
                                                }}
                                                bordered={true}
                                                // expandable={{
                                                //     expandedRowRender: record => {
                                                //         return (
                                                //             <LotExpandable
                                                //                 entryId={entryId}
                                                //                 record={record}
                                                //                 createAndUpdateLots={createAndUpdateLots}
                                                //                 userPermissions={userPermissions}
                                                //                 restrictedColumns={restrictedColumns}
                                                //                 isProcessing={isCreating}
                                                //                 model={record.docModel?.toLowerCase()}
                                                //             />
                                                //         )
                                                //
                                                //     },
                                                //     rowExpandable: (record) => record,
                                                // }}
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
                                            <ConfirmFooter
                                                key={"actions"
                                                } isSending={isSending} defText={"Confirm"} dsText={"Sending"}
                                                handleCancel={() => setShowPayModel(!showPayModel)}
                                                handleConfirm={handleModelAdvance}/>
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
                                            style={{width: "100%", height: "100%"}}
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
                />
            )}
        </>
    );
}
export default EntryCompletePage;


// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useSelector } from "react-redux";
// import { message, Upload } from "antd";
// import { UploadOutlined } from "@ant-design/icons";
//
// // Shadcn UI components
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
//
// // Icons
// import { BiSolidEditAlt } from "react-icons/bi";
// import { FaImage, FaSave } from "react-icons/fa";
// import { MdPayments } from "react-icons/md";
// import { TbReport } from "react-icons/tb";
// import { IoClose } from "react-icons/io5";
// import { MoreVertical, Loader2 } from "lucide-react";
//
// // API hooks and helper functions
// import {
//     useDeleteGradeImgMutation,
//     useGetEntryQuery,
//     useUpdateEntryMutation,
// } from "@/states/apislice.js";
// import { decidePricingGrade, filterColumns, getBase64FromServer } from "@/components/helperFunctions.js";
//
// // Components
// import FetchingPage from "../../FetchingPage";
// import { LotExpandable, PricingGrade } from "../../HelpersJsx";
// import DetailsPageContainer from "../../../components/Actions components/DetailsComponentscontainer";
// import { useForm } from "react-hook-form";
//
// const ColtanEntryCompletePage = ({ entryId }) => {
//     // Form and navigation
//     const navigate = useNavigate();
//     const form = useForm();
//
//     // State management
//     const [selectedLotNumber, setSelectedLotNumber] = useState(null);
//     const [suply, setSuply] = useState({});
//     const [lotInfo, setLotInfo] = useState([]);
//     const [selectedRow, setSelectedRow] = useState(null);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [currentEditRow, setCurrentEditRow] = useState(null);
//     const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
//     const [previewVisible, setPreviewVisible] = useState(false);
//     const [previewImage, setPreviewImage] = useState("");
//
//     // Get user permissions from Redux store
//     const { permissions: userPermissions } = useSelector(state => state.persistedReducer?.global);
//
//     // API Queries and Mutations
//     const {
//         data,
//         isLoading,
//         isSuccess,
//     } = useGetEntryQuery(
//         { entryId, model: "coltan" },
//         {
//             skip: entryId === undefined,
//             refetchOnMountOrArgChange: true,
//             refetchOnReconnect: true,
//         }
//     );
//
//     const [updateEntry, {
//         isSuccess: isUpdateSuccess,
//         isLoading: isSending,
//         isError: isUpdateError,
//         error: updateError,
//     }] = useUpdateEntryMutation();
//
//     const [deleteGradeImg, {
//         isSuccess: isImageDeleteSuccess,
//         isError: isImageDeleteError,
//         error: imageDeleteError,
//     }] = useDeleteGradeImgMutation();
//
//     // Image preview handlers
//     const handlePreview = async (fileUrl) => {
//         const previewedUrl = await getBase64FromServer(fileUrl);
//         setPreviewImage(previewedUrl);
//         setPreviewVisible(true);
//     };
//
//     const handleClosePreview = () => {
//         setPreviewVisible(false);
//     };
//
//     // // File upload handlers
//     const customRequest = async ({ file, lotNumber }) => {
//         const formData = new FormData();
//         formData.append(lotNumber, file);
//         await updateEntry({ entryId, body: formData, model: "coltan" });
//     };
//
//     // const customRequest = async ({file, onSuccess, onError, lotNumber}) => {
//     //     const formData = new FormData();
//     //     formData.append(lotNumber, file);
//     //     await updateEntry({entryId, body: formData, model: "coltan"});
//     // };
//
//     const beforeUpload = (file) => {
//         const isPNG = file.type === "image/png" || file.type === "image/jpeg";
//         if (!isPNG) {
//             message.error(`${file.name} is not a .png or .jpeg file`);
//         }
//         return isPNG || Upload.LIST_IGNORE;
//     };
//
//     const removeFile = async (lotNumber) => {
//         const body = { lotNumber };
//         await deleteGradeImg({ body, entryId, model: "coltan" });
//     };
//
//     // Calculate price per unit
//     const calculatePricePerUnit = (tantal, grade) => {
//         if (tantal && grade) {
//             return (tantal * grade);
//         }
//         return 0;
//     };
//
//     // Edit modal handlers
//     const openEditModal = (row) => {
//         setCurrentEditRow(row);
//         // console.log('row', row);
//         form.reset({
//             weightOut: row.weightOut,
//             ASIR: row.ASIR,
//             mineralGrade: row.mineralGrade,
//             tantalum: row.tantal,
//             USDRate: row.USDRate,
//             nonSellAgreement: row.nonSellAgreement?.weight || 0,
//         });
//         setIsEditModalOpen(true);
//     };
//
//     const handleEditSave = async (values) => {
//         if (!currentEditRow) return;
//
//         const newData = [...lotInfo];
//         const index = newData.findIndex((item) => currentEditRow._id === item._id);
//
//         if (index > -1) {
//             const item = newData[index];
//             const updatedItem = { ...item, ...values };
//
//             // Validation checks
//             if (parseFloat(updatedItem.nonSellAgreement) > parseFloat(updatedItem.cumulativeAmount)) {
//                 message.error("Non Sell Agreement Amount cannot be greater than Weight Out", 5);
//                 return;
//             }
//
//             if (parseFloat(updatedItem.mineralGrade) === 0) {
//                 message.error("Mineral Grade cannot be zero", 5);
//                 return;
//             }
//
//             if (parseFloat(updatedItem.ASIR) === 0) {
//                 message.error("ASIR cannot be zero", 5);
//                 return;
//             }
//
//             if (parseFloat(updatedItem.USDRate) === 0) {
//                 message.error("USD rate cannot be zero", 5);
//                 return;
//             }
//
//             if (parseFloat(updatedItem.tantalum) === 0) {
//                 message.error("Tantalum cannot be zero", 5);
//                 return;
//             }
//
//             // Update non-sell agreement
//             if (updatedItem.nonSellAgreement > 0) {
//                 updatedItem.nonSellAgreement = { weight: updatedItem.weightOut };
//                 updatedItem.cumulativeAmount = 0;
//             } else {
//                 updatedItem.nonSellAgreement = { weight: 0 };
//                 updatedItem.cumulativeAmount = updatedItem.weightOut;
//             }
//
//             // Calculate pricing
//             if (
//                 updatedItem.tantalum &&
//                 updatedItem.pricingGrade &&
//                 updatedItem[decidePricingGrade(updatedItem.pricingGrade)] &&
//                 parseFloat(updatedItem[decidePricingGrade(updatedItem.pricingGrade)]) !== 0 &&
//                 parseFloat(updatedItem.tantalum) !== 0
//             ) {
//                 updatedItem.pricePerUnit = calculatePricePerUnit(
//                     parseFloat(updatedItem.tantalum),
//                     parseFloat(updatedItem[decidePricingGrade(updatedItem.pricingGrade)])
//                 ).toFixed(5) || null;
//             }
//
//             if (updatedItem.pricePerUnit) {
//                 updatedItem.mineralPrice = (updatedItem.pricePerUnit * parseFloat(updatedItem.weightOut)).toFixed(5) || null;
//             }
//
//
//             const newItem = {...updatedItem, tantal: parseFloat(updatedItem.tantalum)};
//             newData.splice(index, 1, newItem);
//             setLotInfo(newData);
//             const body = { output: [newItem] };
//             await updateEntry({ body, entryId, model: "coltan" });
//             setIsEditModalOpen(false);
//         }
//     };
//
//     // Payment modal handlers
//     const handlePaymentModalOpen = (lotNumber) => {
//         setSelectedLotNumber(lotNumber);
//         setIsPaymentModalOpen(true);
//     };
//
//     const handleModelAdvance = async () => {
//         const body = { ...suply, output: lotInfo };
//         await updateEntry({ body, entryId, model: "coltan" });
//         navigate(`/payment/coltan/${suply._id}/${selectedLotNumber}`);
//     };
//
//     // Form submission handlers
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const body = { ...suply, output: lotInfo };
//         await updateEntry({ body, entryId, model: "coltan" });
//     };
//
//     const handleCancel = () => {
//         navigate(-1);
//     };
//
//     // Effects
//     useEffect(() => {
//         if (isSuccess || isUpdateSuccess) {
//             const { data: info } = data;
//             const { entry: entr } = info;
//             setSuply(entr);
//             setLotInfo(entr.output);
//         }
//     }, [isSuccess, data, isUpdateSuccess]);
//
//     useEffect(() => {
//         if (isUpdateSuccess) {
//             message.success("Entry updated successfully");
//         } else if (isUpdateError) {
//             const { message: errorMessage } = updateError.data;
//             message.error(errorMessage);
//         }
//     }, [isUpdateError, isUpdateSuccess, updateError]);
//
//     useEffect(() => {
//         if (isImageDeleteSuccess) {
//             message.success("File successfully deleted");
//         } else if (isImageDeleteError) {
//             const { message: deleteError } = imageDeleteError.data;
//             message.error(deleteError);
//         }
//     }, [isImageDeleteSuccess, isImageDeleteError, imageDeleteError]);
//
//     // Define restricted columns for table
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
//         },
//         tantal: {
//             title: "Tantal ($)",
//             dataIndex: "tantal",
//             key: "tantal",
//             table: true,
//         },
//         gradeImg: {
//             title: "Grade Img",
//             dataIndex: "gradeImg",
//             key: "gradeImg",
//             table: true,
//             render: (_, record) => {
//                 if (record.gradeImg?.filePath !== null) {
//                     return (
//                         <div className="flex items-center">
//                             <Button
//                                 size="sm"
//                                 variant="outline"
//                                 onClick={() => handlePreview(record.gradeImg.filePath)}
//                             >
//                                 <FaImage className="mr-2" /> View
//                             </Button>
//                             {userPermissions.gradeImg.edit && (
//                                 <Button
//                                     size="sm"
//                                     variant="destructive"
//                                     className="ml-2"
//                                     onClick={() => removeFile(record.lotNumber, entryId)}
//                                 >
//                                     <IoClose />
//                                 </Button>
//                             )}
//                         </div>
//                     );
//                 } else {
//                     return (
//                         <Upload
//                             beforeUpload={beforeUpload}
//                             customRequest={async ({ file }) => customRequest({
//                                 file,
//                                 lotNumber: record.lotNumber
//                             })}
//                             onRemove={() => removeFile(record.lotNumber, entryId)}
//                         >
//                             <Button size="sm" variant="outline">
//                                 <UploadOutlined className="mr-2" /> Upload
//                             </Button>
//                         </Upload>
//                     );
//                 }
//             }
//         },
//         pricingGrade: {
//             title: "Pricing Grade",
//             dataIndex: "pricingGrade",
//             key: "pricingGrade",
//             table: true,
//             render: (_, record) => (
//                 <PricingGrade
//                     value={record.pricingGrade ? record.pricingGrade : ""}
//                     lotNumber={record.lotNumber}
//                     updateEntry={updateEntry}
//                     entryId={entryId}
//                     model={"coltan"}
//                 />
//             )
//         },
//         pricePerUnit: {
//             title: "price/kg ($)",
//             dataIndex: "pricePerUnit",
//             key: "pricePerUnit",
//             table: true,
//             render: (_, record) => (
//                 record.pricePerUnit ? <span>{Number(record.pricePerUnit).toFixed(5)}</span> : null
//             )
//         },
//         mineralPrice: {
//             title: "Price ($)",
//             dataIndex: "mineralPrice",
//             key: "mineralPrice",
//             table: true,
//             render: (_, record) => (
//                 record.mineralPrice ? <span>{Number(record.mineralPrice).toFixed(5)}</span> : null
//             )
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
//             table: false,
//             render: (_, record) => (
//                 record.nonSellAgreement?.weight ? <span>{record.nonSellAgreement?.weight}</span> : null
//             )
//         }
//     };
//
//     // Build columns array for shadcn table
//     const baseColumns = [
//         {
//             title: "#",
//             dataIndex: "lotNumber",
//             key: "lotNumber",
//         },
//         {
//             title: "weight out (KG)",
//             dataIndex: "weightOut",
//             key: "weightOut",
//         },
//         {
//             title: "balance (KG)",
//             dataIndex: "cumulativeAmount",
//             key: "cumulativeAmount",
//         }
//     ];
//
//     // Filter columns based on user permissions
//     const visibleColumns = [];
//     if (restrictedColumns && userPermissions && baseColumns) {
//         visibleColumns.push(...baseColumns);
//         filterColumns(restrictedColumns, userPermissions, visibleColumns, "coltan");
//     }
//
//     if (isLoading) {
//         return <FetchingPage />;
//     }
//
//     return (
//         <DetailsPageContainer
//             title="LOT DETAILS"
//             actionsContainer={
//                 <div className="w-full">
//                     <div className="rounded-md border">
//                         <Table>
//                             <TableHeader>
//                                 <TableRow>
//                                     {visibleColumns.map((column) => (
//                                         <TableHead key={column.key}>{column.title}</TableHead>
//                                     ))}
//                                     <TableHead>Actions</TableHead>
//                                 </TableRow>
//                             </TableHeader>
//                             <TableBody>
//                                 {lotInfo.map((row) => (
//                                     <TableRow
//                                         key={row._id}
//                                         className={row.status === "non-sell agreement" ? "bg-red-100" : ""}
//                                     >
//                                         {visibleColumns.map((column) => (
//                                             <TableCell key={`${row._id}-${column.key}`}>
//                                                 {column.render
//                                                     ? column.render(null, row)
//                                                     : row[column.dataIndex]}
//                                             </TableCell>
//                                         ))}
//                                         <TableCell>
//                                             <DropdownMenu>
//                                                 <DropdownMenuTrigger asChild>
//                                                     <Button variant="ghost" size="sm">
//                                                         <MoreVertical className="h-4 w-4" />
//                                                     </Button>
//                                                 </DropdownMenuTrigger>
//                                                 <DropdownMenuContent align="end">
//                                                     <DropdownMenuItem onClick={() => openEditModal(row)}>
//                                                         <BiSolidEditAlt className="mr-2" />
//                                                         Edit
//                                                     </DropdownMenuItem>
//
//                                                     {userPermissions.payments?.create && (
//                                                         <DropdownMenuItem onClick={() => handlePaymentModalOpen(row.lotNumber)}>
//                                                             <MdPayments className="mr-2" />
//                                                             Pay
//                                                         </DropdownMenuItem>
//                                                     )}
//
//                                                     {/* Add Lab Report option if needed based on permissions */}
//                                                 </DropdownMenuContent>
//                                             </DropdownMenu>
//                                         </TableCell>
//                                     </TableRow>
//                                 ))}
//                             </TableBody>
//                         </Table>
//                     </div>
//
//                     <div className="flex justify-end gap-4 mt-4">
//                         <Button variant="outline" onClick={handleCancel}>
//                             Cancel
//                         </Button>
//                         <Button onClick={handleSubmit} disabled={isSending}>
//                             {isSending ? (
//                                 <>
//                                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                     Saving...
//                                 </>
//                             ) : (
//                                 <>
//                                     <FaSave className="mr-2" />
//                                     Save
//                                 </>
//                             )}
//                         </Button>
//                     </div>
//
//                     {/* Edit Modal */}
//                     <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
//                         <DialogContent className="sm:max-w-md">
//                             <DialogHeader>
//                                 <DialogTitle>Edit Lot</DialogTitle>
//                                 <DialogDescription>
//                                     Update the details for this lot
//                                 </DialogDescription>
//                             </DialogHeader>
//
//                             <Form {...form}>
//                                 <form onSubmit={form.handleSubmit(handleEditSave)} className="space-y-4">
//                                     <FormField
//                                         control={form.control}
//                                         name="weightOut"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Weight Out (KG)</FormLabel>
//                                                 <FormControl>
//                                                     <Input type="number" step="0.01" {...field} />
//                                                 </FormControl>
//                                             </FormItem>
//                                         )}
//                                     />
//
//                                     <FormField
//                                         control={form.control}
//                                         name="ASIR"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>ASIR</FormLabel>
//                                                 <FormControl>
//                                                     <Input type="number" step="0.01" {...field} />
//                                                 </FormControl>
//                                             </FormItem>
//                                         )}
//                                     />
//
//                                     <FormField
//                                         control={form.control}
//                                         name="mineralGrade"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Grade-SMC (%)</FormLabel>
//                                                 <FormControl>
//                                                     <Input type="number" step="0.01" {...field} />
//                                                 </FormControl>
//                                             </FormItem>
//                                         )}
//                                     />
//
//                                     <FormField
//                                         control={form.control}
//                                         name="tantalum"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Tantalum ($)</FormLabel>
//                                                 <FormControl>
//                                                     <Input type="number" step="0.01" {...field} />
//                                                 </FormControl>
//                                             </FormItem>
//                                         )}
//                                     />
//
//                                     <FormField
//                                         control={form.control}
//                                         name="USDRate"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>USD Rate (RWF)</FormLabel>
//                                                 <FormControl>
//                                                     <Input type="number" step="0.01" {...field} />
//                                                 </FormControl>
//                                             </FormItem>
//                                         )}
//                                     />
//
//                                     <FormField
//                                         control={form.control}
//                                         name="nonSellAgreement"
//                                         render={({ field }) => (
//                                             <FormItem>
//                                                 <FormLabel>Non-Sell Agreement (KG)</FormLabel>
//                                                 <FormControl>
//                                                     <Input type="number" step="0.01" {...field} />
//                                                 </FormControl>
//                                             </FormItem>
//                                         )}
//                                     />
//
//                                     <DialogFooter>
//                                         <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
//                                             Cancel
//                                         </Button>
//                                         <Button type="submit" disabled={isSending}>
//                                             {isSending ? (
//                                                 <>
//                                                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                                     Saving...
//                                                 </>
//                                             ) : (
//                                                 "Save Changes"
//                                             )}
//                                         </Button>
//                                     </DialogFooter>
//                                 </form>
//                             </Form>
//                         </DialogContent>
//                     </Dialog>
//
//                     {/* Payment Modal */}
//                     <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
//                         <DialogContent>
//                             <DialogHeader>
//                                 <DialogTitle>Proceed Payment</DialogTitle>
//                                 <DialogDescription>
//                                     Please verify all the information before proceeding
//                                 </DialogDescription>
//                             </DialogHeader>
//                             <DialogFooter>
//                                 <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)}>
//                                     Cancel
//                                 </Button>
//                                 <Button onClick={handleModelAdvance} disabled={isSending}>
//                                     {isSending ? (
//                                         <>
//                                             <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                                             Processing...
//                                         </>
//                                     ) : (
//                                         "Confirm"
//                                     )}
//                                 </Button>
//                             </DialogFooter>
//                         </DialogContent>
//                     </Dialog>
//
//                     {/* Image Preview Modal */}
//                     <Dialog open={previewVisible} onOpenChange={setPreviewVisible}>
//                         <DialogContent className="sm:max-w-xl">
//                             <DialogHeader>
//                                 <DialogTitle>Image Preview</DialogTitle>
//                             </DialogHeader>
//                             <div className="flex items-center justify-center">
//                                 <img
//                                     alt="Grade image"
//                                     src={previewImage}
//                                     className="max-w-full max-h-[70vh] object-contain"
//                                 />
//                             </div>
//                             <DialogFooter>
//                                 <Button onClick={handleClosePreview}>Close</Button>
//                             </DialogFooter>
//                         </DialogContent>
//                     </Dialog>
//                 </div>
//             }
//         />
//     );
// };
//
// export default ColtanEntryCompletePage;


// GOOD CANDIDATE

// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { useGetEntryQuery, useUpdateEntryMutation, useDeleteGradeImgMutation } from "@/states/apislice.js";
// import { decidePricingGrade, filterColumns, getBase64FromServer } from "@/components/helperFunctions.js";
//
// // shadcn components
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow
// } from "@/components/ui/table";
// import {
//     Dialog,
//     DialogContent,
//     DialogDescription,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
// } from "@/components/ui/dialog";
// import {
//     DropdownMenu,
//     DropdownMenuContent,
//     DropdownMenuItem,
//     DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { Skeleton } from "@/components/ui/skeleton";
// import { AlertCircle, CheckCircle, MoreVertical, Edit, Trash, Upload, Image, X, Save, ChevronDown, DollarSign } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Separator } from "@/components/ui/separator";
// import { ScrollArea } from "@/components/ui/scroll-area";
//
// // Ant Design components where convenient
// import { Upload as AntUpload, Modal as AntModal } from "antd";
// import { ImSpinner2 } from "react-icons/im";
// import {useToast} from "@/hooks/use-toast.js";
//
// const ColtanEntryDetailsPage = ({ entryId }) => {
//     const { permissions: userPermissions } = useSelector(state => state.persistedReducer?.global);
//     const navigate = useNavigate();
//
//     // State management
//     const [lotInfo, setLotInfo] = useState([]);
//     const [supplierInfo, setSupplierInfo] = useState({});
//     const [entryDetails, setEntryDetails] = useState({});
//     const [editingLot, setEditingLot] = useState(null);
//     const [editForm, setEditForm] = useState({});
//     const [previewVisible, setPreviewVisible] = useState(false);
//     const [previewImage, setPreviewImage] = useState("");
//     const [selectedLotNumber, setSelectedLotNumber] = useState(null);
//     const [showPaymentModal, setShowPaymentModal] = useState(false);
//     const { toast } = useToast();
//
//     // Query and mutations
//     const {
//         data,
//         isLoading,
//         isSuccess
//     } = useGetEntryQuery(
//         { entryId, model: "coltan" },
//         {
//             skip: entryId === undefined,
//             refetchOnMountOrArgChange: true,
//             refetchOnReconnect: true
//         }
//     );
//
//     const [
//         updateEntry,
//         { isLoading: isUpdating, isSuccess: isUpdateSuccess, isError: isUpdateError, error: updateError }
//     ] = useUpdateEntryMutation();
//
//     const [
//         deleteGradeImg,
//         { isSuccess: isImageDeleteSuccess, isError: isImageDeleteError, error: imageDeleteError }
//     ] = useDeleteGradeImgMutation();
//
//     // Effects
//     useEffect(() => {
//         if (isSuccess) {
//             const { data: info } = data;
//             const { entry: entryData } = info;
//             setEntryDetails(entryData);
//             setLotInfo(entryData.output || []);
//             setSupplierInfo(entryData.supplierId || {});
//         }
//     }, [isSuccess, data]);
//
//     useEffect(() => {
//         if (isUpdateSuccess) {
//             toast({
//                 title: "Success",
//                 description: "Entry updated successfully",
//                 variant: "default",
//             });
//             setEditingLot(null);
//         } else if (isUpdateError) {
//             toast({
//                 title: "Error",
//                 description: updateError?.data?.message || "Failed to update entry",
//                 variant: "destructive",
//             });
//         }
//     }, [isUpdateError, isUpdateSuccess, updateError]);
//
//     useEffect(() => {
//         if (isImageDeleteSuccess) {
//             toast({
//                 title: "Success",
//                 description: "File successfully deleted",
//                 variant: "default",
//             });
//         } else if (isImageDeleteError) {
//             toast({
//                 title: "Error",
//                 description: imageDeleteError?.data?.message || "Failed to delete image",
//                 variant: "destructive",
//             });
//         }
//     }, [isImageDeleteSuccess, isImageDeleteError, imageDeleteError]);
//
//     // Helper functions
//     const handleEditLot = (lot) => {
//         setEditingLot(lot._id);
//         setEditForm({ ...lot });
//     };
//
//     const handleCancelEdit = () => {
//         setEditingLot(null);
//         setEditForm({});
//     };
//
//     const handleFormChange = (field, value) => {
//         setEditForm(prev => ({
//             ...prev,
//             [field]: value
//         }));
//     };
//
//     const handleSaveLot = async () => {
//         // Validate form fields
//         if (editForm.mineralGrade && parseFloat(editForm.mineralGrade) === 0) {
//             toast({
//                 title: "Validation Error",
//                 description: "Mineral Grade cannot be zero",
//                 variant: "destructive",
//             });
//             return;
//         }
//
//         if (editForm.ASIR && parseFloat(editForm.ASIR) === 0) {
//             toast({
//                 title: "Validation Error",
//                 description: "ASIR cannot be zero",
//                 variant: "destructive",
//             });
//             return;
//         }
//
//         if (editForm.USDRate && parseFloat(editForm.USDRate) === 0) {
//             toast({
//                 title: "Validation Error",
//                 description: "USD Rate cannot be zero",
//                 variant: "destructive",
//             });
//             return;
//         }
//
//         if (editForm.tantalum && parseFloat(editForm.tantalum) === 0) {
//             toast({
//                 title: "Validation Error",
//                 description: "Tantalum cannot be zero",
//                 variant: "destructive",
//             });
//             return;
//         }
//
//         // Handle non-sell agreement
//         let updatedForm = { ...editForm };
//         if (editForm.nonSellAgreement && typeof editForm.nonSellAgreement === 'object') {
//             const nonSellWeight = parseFloat(editForm.nonSellAgreement.weight || 0);
//             if (nonSellWeight > parseFloat(editForm.weightOut)) {
//                 toast({
//                     title: "Validation Error",
//                     description: "Non Sell Agreement Amount cannot be greater than Weight Out",
//                     variant: "destructive",
//                 });
//                 return;
//             }
//         }
//
//         // Calculate price per unit if possible
//         if (
//             updatedForm.tantalum &&
//             updatedForm.pricingGrade &&
//             updatedForm[decidePricingGrade(updatedForm.pricingGrade)]
//         ) {
//             const pricePerUnit = (
//                 parseFloat(updatedForm.tantalum) *
//                 parseFloat(updatedForm[decidePricingGrade(updatedForm.pricingGrade)])
//             ).toFixed(5);
//
//             updatedForm.pricePerUnit = pricePerUnit;
//
//             // Calculate mineral price
//             if (updatedForm.pricePerUnit) {
//                 updatedForm.mineralPrice = (
//                     parseFloat(updatedForm.pricePerUnit) *
//                     parseFloat(updatedForm.weightOut)
//                 ).toFixed(5);
//             }
//         }
//
//         // Update lot in state
//         const updatedLots = lotInfo.map(lot =>
//             lot._id === editingLot ? updatedForm : lot
//         );
//
//         setLotInfo(updatedLots);
//
//         // Send update to API
//         const body = { output: [updatedForm] };
//         await updateEntry({ body, entryId, model: "coltan" });
//         setEditingLot(null);
//     };
//
//     const handleViewImage = async (fileUrl) => {
//         const previewedUrl = await getBase64FromServer(fileUrl);
//         setPreviewImage(previewedUrl);
//         setPreviewVisible(true);
//     };
//
//     const handleRemoveImage = async (lotNumber) => {
//         await deleteGradeImg({ body: { lotNumber }, entryId, model: "coltan" });
//     };
//
//     const customUploadRequest = async ({ file, onSuccess, onError, lotNumber }) => {
//         const formData = new FormData();
//         formData.append(lotNumber, file);
//         try {
//             await updateEntry({ entryId, body: formData, model: "coltan" });
//             onSuccess();
//         } catch (error) {
//             onError(error);
//         }
//     };
//
//     const beforeUpload = (file) => {
//         const isPNG = file.type === "image/png" || file.type === "image/jpeg";
//         if (!isPNG) {
//             toast({
//                 title: "Upload Error",
//                 description: `${file.name} is not a .png or .jpeg file`,
//                 variant: "destructive",
//             });
//         }
//         return isPNG || AntUpload.LIST_IGNORE;
//     };
//
//     const handlePayment = (lotNumber) => {
//         setSelectedLotNumber(lotNumber);
//         setShowPaymentModal(true);
//     };
//
//     const proceedToPayment = () => {
//         navigate(`/payment/coltan/${entryId}/${selectedLotNumber}`);
//         setShowPaymentModal(false);
//     };
//
//     // Loading state
//     if (isLoading) {
//         return (
//             <div className="container mx-auto py-8">
//                 <Card>
//                     <CardHeader>
//                         <Skeleton className="h-8 w-1/3 mb-2" />
//                         <Skeleton className="h-4 w-1/4" />
//                     </CardHeader>
//                     <CardContent>
//                         <div className="grid gap-6">
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                 {[1, 2, 3].map(i => (
//                                     <Skeleton key={i} className="h-24 w-full" />
//                                 ))}
//                             </div>
//                             <Skeleton className="h-64 w-full" />
//                         </div>
//                     </CardContent>
//                 </Card>
//             </div>
//         );
//     }
//
//
//     return (
//         <div className="container mx-auto py-6">
//             <Card className="mb-6">
//                 <CardHeader>
//                     <div className="flex justify-between items-center">
//                         <div>
//                             <CardTitle className="text-2xl">Coltan Entry Details</CardTitle>
//                             <CardDescription>
//                                 Manage and view details for this coltan entry
//                             </CardDescription>
//                         </div>
//                         <Button variant="outline" onClick={() => navigate(-1)}>
//                             Back
//                         </Button>
//                     </div>
//                 </CardHeader>
//
//                 <CardContent>
//                     <Tabs defaultValue="overview">
//                         <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
//                             <TabsTrigger value="overview">Overview</TabsTrigger>
//                             <TabsTrigger value="lots">Lots</TabsTrigger>
//                             <TabsTrigger value="supplier">Supplier</TabsTrigger>
//                             <TabsTrigger value="activity">Activity</TabsTrigger>
//                         </TabsList>
//
//                         <TabsContent value="overview" className="space-y-4 mt-4">
//                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                 <Card>
//                                     <CardHeader className="pb-2">
//                                         <CardTitle className="text-sm font-medium">Entry ID</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <p className="text-2xl font-bold">{entryDetails._id?.substring(0, 8) || "N/A"}</p>
//                                     </CardContent>
//                                 </Card>
//
//                                 <Card>
//                                     <CardHeader className="pb-2">
//                                         <CardTitle className="text-sm font-medium">Weight In</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <p className="text-2xl font-bold">{entryDetails.weightIn || 0} kg</p>
//                                     </CardContent>
//                                 </Card>
//
//                                 <Card>
//                                     <CardHeader className="pb-2">
//                                         <CardTitle className="text-sm font-medium">Total Lots</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <p className="text-2xl font-bold">{lotInfo?.length || 0}</p>
//                                     </CardContent>
//                                 </Card>
//
//                                 <Card>
//                                     <CardHeader className="pb-2">
//                                         <CardTitle className="text-sm font-medium">Supply Date</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <p className="text-lg font-medium">
//                                             {entryDetails.supplyDate
//                                                 ? new Date(entryDetails.supplyDate).toLocaleDateString()
//                                                 : "N/A"}
//                                         </p>
//                                     </CardContent>
//                                 </Card>
//
//                                 <Card>
//                                     <CardHeader className="pb-2">
//                                         <CardTitle className="text-sm font-medium">Supply Time</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <p className="text-lg font-medium">{entryDetails.time || "N/A"}</p>
//                                     </CardContent>
//                                 </Card>
//
//                                 <Card>
//                                     <CardHeader className="pb-2">
//                                         <CardTitle className="text-sm font-medium">Mineral Type</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
//                                             {entryDetails.mineralType || "Coltan"}
//                                         </Badge>
//                                     </CardContent>
//                                 </Card>
//                             </div>
//
//                             {entryDetails.comment && (
//                                 <Card>
//                                     <CardHeader>
//                                         <CardTitle className="text-sm font-medium">Comments</CardTitle>
//                                     </CardHeader>
//                                     <CardContent>
//                                         <p className="text-gray-600">{entryDetails.comment}</p>
//                                     </CardContent>
//                                 </Card>
//                             )}
//
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Lots Summary</CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="overflow-x-auto">
//                                         <Table>
//                                             <TableHeader>
//                                                 <TableRow>
//                                                     <TableHead>Lot Number</TableHead>
//                                                     <TableHead>Weight Out (kg)</TableHead>
//                                                     <TableHead>Grade (%)</TableHead>
//                                                     <TableHead>Price ($)</TableHead>
//                                                     <TableHead>Status</TableHead>
//                                                 </TableRow>
//                                             </TableHeader>
//                                             <TableBody>
//                                                 {lotInfo?.length > 0 ? (
//                                                     lotInfo.map((lot) => (
//                                                         <TableRow key={lot._id}>
//                                                             <TableCell className="font-medium">{lot.lotNumber}</TableCell>
//                                                             <TableCell>{lot.weightOut}</TableCell>
//                                                             <TableCell>{lot.mineralGrade || "N/A"}</TableCell>
//                                                             <TableCell>{lot.mineralPrice ? `$${parseFloat(lot.mineralPrice).toFixed(2)}` : "N/A"}</TableCell>
//                                                             <TableCell>
//                                                                 {lot.nonSellAgreement?.weight > 0 ? (
//                                                                     <Badge variant="destructive">Non-Sell Agreement</Badge>
//                                                                 ) : (
//                                                                     <Badge variant="outline">Active</Badge>
//                                                                 )}
//                                                             </TableCell>
//                                                         </TableRow>
//                                                     ))
//                                                 ) : (
//                                                     <TableRow>
//                                                         <TableCell colSpan={5} className="text-center">No lots available</TableCell>
//                                                     </TableRow>
//                                                 )}
//                                             </TableBody>
//                                         </Table>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </TabsContent>
//
//                         <TabsContent value="lots" className="space-y-4 mt-4">
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Lots Management</CardTitle>
//                                     <CardDescription>Edit and manage individual lots details</CardDescription>
//                                 </CardHeader>
//                                 <CardContent className="p-0">
//                                     <ScrollArea className="h-[60vh]">
//                                         <div className="p-4 space-y-8">
//                                             {lotInfo && lotInfo.length > 0 ? (
//                                                 lotInfo.map((lot) => (
//                                                     <Card key={lot._id} className={`border ${lot.nonSellAgreement?.weight > 0 ? 'border-red-200 bg-red-50' : ''}`}>
//                                                         <CardHeader className="pb-2">
//                                                             <div className="flex justify-between items-center">
//                                                                 <div className="flex items-center gap-2">
//                                                                     <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
//                                                                         Lot #{lot.lotNumber}
//                                                                     </Badge>
//                                                                     {lot.nonSellAgreement?.weight > 0 && (
//                                                                         <Badge variant="destructive">Non-Sell Agreement</Badge>
//                                                                     )}
//                                                                 </div>
//
//                                                                 {editingLot !== lot._id && (
//                                                                     <DropdownMenu>
//                                                                         <DropdownMenuTrigger asChild>
//                                                                             <Button variant="ghost" size="sm">
//                                                                                 <MoreVertical className="h-4 w-4" />
//                                                                             </Button>
//                                                                         </DropdownMenuTrigger>
//                                                                         <DropdownMenuContent align="end">
//                                                                             <DropdownMenuItem onClick={() => handleEditLot(lot)}>
//                                                                                 <Edit className="h-4 w-4 mr-2" />
//                                                                                 Edit Lot
//                                                                             </DropdownMenuItem>
//                                                                             {userPermissions.payments?.create && (
//                                                                                 <DropdownMenuItem onClick={() => handlePayment(lot.lotNumber)}>
//                                                                                     <DollarSign className="h-4 w-4 mr-2" />
//                                                                                     Process Payment
//                                                                                 </DropdownMenuItem>
//                                                                             )}
//                                                                         </DropdownMenuContent>
//                                                                     </DropdownMenu>
//                                                                 )}
//                                                             </div>
//                                                         </CardHeader>
//
//                                                         <CardContent>
//                                                             {editingLot === lot._id ? (
//                                                                 <div className="space-y-4">
//                                                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                                                         <div className="space-y-2">
//                                                                             <Label htmlFor="weightOut">Weight Out (kg)</Label>
//                                                                             <Input
//                                                                                 id="weightOut"
//                                                                                 type="number"
//                                                                                 step="0.01"
//                                                                                 value={editForm.weightOut || ""}
//                                                                                 onChange={(e) => handleFormChange("weightOut", e.target.value)}
//                                                                             />
//                                                                         </div>
//
//                                                                         <div className="space-y-2">
//                                                                             <Label htmlFor="mineralGrade">Grade-SMC (%)</Label>
//                                                                             <Input
//                                                                                 id="mineralGrade"
//                                                                                 type="number"
//                                                                                 step="0.01"
//                                                                                 value={editForm.mineralGrade || ""}
//                                                                                 onChange={(e) => handleFormChange("mineralGrade", e.target.value)}
//                                                                             />
//                                                                         </div>
//
//                                                                         <div className="space-y-2">
//                                                                             <Label htmlFor="ASIR">ASIR</Label>
//                                                                             <Input
//                                                                                 id="ASIR"
//                                                                                 type="number"
//                                                                                 step="0.01"
//                                                                                 value={editForm.ASIR || ""}
//                                                                                 onChange={(e) => handleFormChange("ASIR", e.target.value)}
//                                                                             />
//                                                                         </div>
//
//                                                                         <div className="space-y-2">
//                                                                             <Label htmlFor="tantalum">Tantalum ($)</Label>
//                                                                             <Input
//                                                                                 id="tantalum"
//                                                                                 type="number"
//                                                                                 step="0.01"
//                                                                                 value={editForm.tantalum || ""}
//                                                                                 onChange={(e) => handleFormChange("tantalum", e.target.value)}
//                                                                             />
//                                                                         </div>
//
//                                                                         <div className="space-y-2">
//                                                                             <Label htmlFor="USDRate">USD Rate (RWF)</Label>
//                                                                             <Input
//                                                                                 id="USDRate"
//                                                                                 type="number"
//                                                                                 step="0.01"
//                                                                                 value={editForm.USDRate || ""}
//                                                                                 onChange={(e) => handleFormChange("USDRate", e.target.value)}
//                                                                             />
//                                                                         </div>
//
//                                                                         <div className="space-y-2">
//                                                                             <Label htmlFor="pricingGrade">Pricing Grade</Label>
//                                                                             <select
//                                                                                 id="pricingGrade"
//                                                                                 className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
//                                                                                 value={editForm.pricingGrade || ""}
//                                                                                 onChange={(e) => handleFormChange("pricingGrade", e.target.value)}
//                                                                             >
//                                                                                 <option value="">Select grade</option>
//                                                                                 <option value="ASIR">ASIR</option>
//                                                                                 <option value="mineralGrade">Mineral Grade</option>
//                                                                             </select>
//                                                                         </div>
//
//                                                                         <div className="space-y-2">
//                                                                             <Label htmlFor="rmaFeeRWF">RMA Fee (RWF)</Label>
//                                                                             <Input
//                                                                                 id="rmaFeeRWF"
//                                                                                 type="number"
//                                                                                 step="0.01"
//                                                                                 value={editForm.rmaFeeRWF || ""}
//                                                                                 onChange={(e) => handleFormChange("rmaFeeRWF", e.target.value)}
//                                                                             />
//                                                                         </div>
//
//                                                                         <div className="space-y-2">
//                                                                             <Label htmlFor="niobium">Niobium</Label>
//                                                                             <Input
//                                                                                 id="niobium"
//                                                                                 type="number"
//                                                                                 step="0.01"
//                                                                                 value={editForm.niobium || ""}
//                                                                                 onChange={(e) => handleFormChange("niobium", e.target.value)}
//                                                                             />
//                                                                         </div>
//
//                                                                         <div className="space-y-2">
//                                                                             <Label htmlFor="iron">Iron</Label>
//                                                                             <Input
//                                                                                 id="iron"
//                                                                                 type="number"
//                                                                                 step="0.01"
//                                                                                 value={editForm.iron || ""}
//                                                                                 onChange={(e) => handleFormChange("iron", e.target.value)}
//                                                                             />
//                                                                         </div>
//
//                                                                         <div className="space-y-2">
//                                                                             <Label htmlFor="nonSellAgreement">Non-Sell Agreement (kg)</Label>
//                                                                             <Input
//                                                                                 id="nonSellAgreement"
//                                                                                 type="number"
//                                                                                 step="0.01"
//                                                                                 value={editForm.nonSellAgreement?.weight || ""}
//                                                                                 onChange={(e) => handleFormChange("nonSellAgreement", { weight: e.target.value })}
//                                                                             />
//                                                                         </div>
//                                                                     </div>
//
//                                                                     <div className="flex justify-end gap-2 mt-4">
//                                                                         <Button variant="outline" onClick={handleCancelEdit}>
//                                                                             Cancel
//                                                                         </Button>
//                                                                         <Button
//                                                                             onClick={handleSaveLot}
//                                                                             disabled={isUpdating}
//                                                                         >
//                                                                             {isUpdating ? (
//                                                                                 <>
//                                                                                     <ImSpinner2 className="mr-2 h-4 w-4 animate-spin" />
//                                                                                     Saving
//                                                                                 </>
//                                                                             ) : (
//                                                                                 <>
//                                                                                     <Save className="mr-2 h-4 w-4" />
//                                                                                     Save Changes
//                                                                                 </>
//                                                                             )}
//                                                                         </Button>
//                                                                     </div>
//                                                                 </div>
//                                                             ) : (
//                                                                 <div className="space-y-4">
//                                                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                                                                         <div>
//                                                                             <h4 className="text-sm font-medium text-gray-500">Weight Out</h4>
//                                                                             <p className="text-base">{lot.weightOut} kg</p>
//                                                                         </div>
//
//                                                                         <div>
//                                                                             <h4 className="text-sm font-medium text-gray-500">Balance</h4>
//                                                                             <p className="text-base">{lot.cumulativeAmount || 0} kg</p>
//                                                                         </div>
//
//                                                                         {lot.mineralGrade && (
//                                                                             <div>
//                                                                                 <h4 className="text-sm font-medium text-gray-500">Grade-SMC</h4>
//                                                                                 <p className="text-base">{lot.mineralGrade}%</p>
//                                                                             </div>
//                                                                         )}
//
//                                                                         {lot.ASIR && (
//                                                                             <div>
//                                                                                 <h4 className="text-sm font-medium text-gray-500">ASIR</h4>
//                                                                                 <p className="text-base">{lot.ASIR}</p>
//                                                                             </div>
//                                                                         )}
//
//                                                                         {lot.tantalum && (
//                                                                             <div>
//                                                                                 <h4 className="text-sm font-medium text-gray-500">Tantalum</h4>
//                                                                                 <p className="text-base">${lot.tantalum}</p>
//                                                                             </div>
//                                                                         )}
//
//                                                                         {lot.pricePerUnit && (
//                                                                             <div>
//                                                                                 <h4 className="text-sm font-medium text-gray-500">Price per kg</h4>
//                                                                                 <p className="text-base">${parseFloat(lot.pricePerUnit).toFixed(5)}</p>
//                                                                             </div>
//                                                                         )}
//
//                                                                         {lot.mineralPrice && (
//                                                                             <div>
//                                                                                 <h4 className="text-sm font-medium text-gray-500">Total Price</h4>
//                                                                                 <p className="text-base font-medium">${parseFloat(lot.mineralPrice).toFixed(5)}</p>
//                                                                             </div>
//                                                                         )}
//
//                                                                         {lot.pricingGrade && (
//                                                                             <div>
//                                                                                 <h4 className="text-sm font-medium text-gray-500">Pricing Grade</h4>
//                                                                                 <p className="text-base">{lot.pricingGrade}</p>
//                                                                             </div>
//                                                                         )}
//
//                                                                         {lot.nonSellAgreement?.weight > 0 && (
//                                                                             <div>
//                                                                                 <h4 className="text-sm font-medium text-gray-500">Non-Sell Agreement</h4>
//                                                                                 <p className="text-base">{lot.nonSellAgreement.weight} kg</p>
//                                                                             </div>
//                                                                         )}
//                                                                     </div>
//
//                                                                     <Separator />
//
//                                                                     <div>
//                                                                         <h4 className="text-sm font-medium mb-2">Grade Image</h4>
//                                                                         {lot.gradeImg?.filePath ? (
//                                                                             <div className="flex items-center gap-2">
//                                                                                 <Button variant="outline" size="sm" onClick={() => handleViewImage(lot.gradeImg.filePath)}>
//                                                                                     <Image className="h-4 w-4 mr-2" />
//                                                                                     View Image
//                                                                                 </Button>
//                                                                                 {userPermissions.gradeImg?.edit && (
//                                                                                     <Button
//                                                                                         variant="outline"
//                                                                                         size="sm"
//                                                                                         onClick={() => handleRemoveImage(lot.lotNumber)}
//                                                                                     >
//                                                                                         <Trash className="h-4 w-4 mr-2" />
//                                                                                         Remove
//                                                                                     </Button>
//                                                                                 )}
//                                                                             </div>
//                                                                         ) : (
//                                                                             <AntUpload
//                                                                                 beforeUpload={beforeUpload}
//                                                                                 customRequest={({ file, onSuccess, onError }) =>
//                                                                                     customUploadRequest({
//                                                                                         file,
//                                                                                         onSuccess,
//                                                                                         onError,
//                                                                                         lotNumber: lot.lotNumber
//                                                                                     })
//                                                                                 }
//                                                                             >
//                                                                                 <Button variant="outline" size="sm">
//                                                                                     <Upload className="h-4 w-4 mr-2" />
//                                                                                     Upload Image
//                                                                                 </Button>
//                                                                             </AntUpload>
//                                                                         )}
//                                                                     </div>
//                                                                 </div>
//                                                             )}
//                                                         </CardContent>
//                                                     </Card>
//                                                 ))
//                                             ) : (
//                                                 <Alert>
//                                                     <AlertCircle className="h-4 w-4" />
//                                                     <AlertDescription>No lots available for this entry.</AlertDescription>
//                                                 </Alert>
//                                             )}
//                                         </div>
//                                     </ScrollArea>
//                                 </CardContent>
//                             </Card>
//                         </TabsContent>
//
//                         <TabsContent value="supplier" className="space-y-4 mt-4">
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Supplier Information</CardTitle>
//                                 </CardHeader>
//                                 <CardContent>
//                                     {supplierInfo && Object.keys(supplierInfo).length > 0 ? (
//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                             <div>
//                                                 <h4 className="text-sm font-medium text-gray-500">Company Name</h4>
//                                                 <p className="text-base">{supplierInfo.companyName || "N/A"}</p>
//                                             </div>
//                                             <div>
//                                                 <h4 className="text-sm font-medium text-gray-500">License Number</h4>
//                                                 <p className="text-base">{supplierInfo.licenseNumber || "N/A"}</p>
//                                             </div>
//                                             <div>
//                                                 <h4 className="text-sm font-medium text-gray-500">Representative</h4>
//                                                 <p className="text-base">{supplierInfo.representative || "N/A"}</p>
//                                             </div>
//                                             <div>
//                                                 <h4 className="text-sm font-medium text-gray-500">Contact</h4>
//                                                 <p className="text-base">{supplierInfo.contact || "N/A"}</p>
//                                             </div>
//                                         </div>
//                                     ) : (
//                                         <Alert>
//                                             <AlertCircle className="h-4 w-4" />
//                                             <AlertDescription>Supplier information not available.</AlertDescription>
//                                         </Alert>
//                                     )}
//                                 </CardContent>
//                             </Card>
//                         </TabsContent>
//
//                         <TabsContent value="activity" className="space-y-4 mt-4">
//                             <Card>
//                                 <CardHeader>
//                                     <CardTitle>Activity Log</CardTitle>
//                                     <CardDescription>Recent changes and updates to this entry</CardDescription>
//                                 </CardHeader>
//                                 <CardContent>
//                                     <div className="space-y-4">
//                                         <Alert className="bg-blue-50 border-blue-200">
//                                             <CheckCircle className="h-4 w-4 text-blue-500" />
//                                             <AlertDescription className="text-blue-700">
//                                                 Entry created on {new Date(entryDetails.createdAt).toLocaleString()}
//                                             </AlertDescription>
//                                         </Alert>
//                                         <Alert className="bg-green-50 border-green-200">
//                                             <CheckCircle className="h-4 w-4 text-green-500" />
//                                             <AlertDescription className="text-green-700">
//                                                 Last updated on {new Date(entryDetails.updatedAt).toLocaleString()}
//                                             </AlertDescription>
//                                         </Alert>
//                                     </div>
//                                 </CardContent>
//                             </Card>
//                         </TabsContent>
//                     </Tabs>
//                 </CardContent>
//             </Card>
//
//             {/* Payment Confirmation Modal */}
//             <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
//                 <DialogContent>
//                     <DialogHeader>
//                         <DialogTitle>Proceed to Payment</DialogTitle>
//                         <DialogDescription>
//                             Are you sure you want to process payment for Lot #{selectedLotNumber}?
//                         </DialogDescription>
//                     </DialogHeader>
//                     <DialogFooter>
//                         <Button variant="outline" onClick={() => setShowPaymentModal(false)}>
//                             Cancel
//                         </Button>
//                         <Button onClick={proceedToPayment} disabled={isUpdating}>
//                             {isUpdating ? (
//                                 <>
//                                     <ImSpinner2 className="mr-2 h-4 w-4 animate-spin" />
//                                     Processing
//                                 </>
//                             ) : (
//                                 <>
//                                     <DollarSign className="mr-2 h-4 w-4" />
//                                     Proceed to Payment
//                                 </>
//                             )}
//                         </Button>
//                     </DialogFooter>
//                 </DialogContent>
//             </Dialog>
//
//             {/* Image Preview Modal */}
//             <AntModal
//                 width="70%"
//                 open={previewVisible}
//                 title="Image Preview"
//                 footer={null}
//                 onCancel={() => setPreviewVisible(false)}
//             >
//                 <img
//                     alt="Grade image"
//                     style={{ width: "100%", height: "100%" }}
//                     src={previewImage}
//                 />
//             </AntModal>
//         </div>
//     );
// }
//
// export default ColtanEntryDetailsPage;