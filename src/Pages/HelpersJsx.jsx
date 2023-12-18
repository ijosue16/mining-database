import React, {useEffect, useState} from "react";
import {Button, Checkbox, Popover, Radio} from "antd";
import {toInitialCase} from "../components/helperFunctions";
import dayjs from "dayjs";
import LoadingButton from "./LoadingButton";


export const PricingGrade = ({updateEntry, value, entryId, lotNumber}) => {
    const [pricingGrade, setPricingGrade] = useState(null);
    useEffect(() => {
        if (value) setPricingGrade(value)
    }, [value])
    const updatePricingGrade = async (value) => {
        setPricingGrade(value);
        const body = {output: [{lotNumber, pricingGrade: value}]};
        await updateEntry({body, entryId});
    }
    const content = (
        <div className="flex flex-col">
            <Radio.Group value={pricingGrade} onChange={(e) => updatePricingGrade(e.target.value)}>
                <Radio value="KZM">KZM</Radio>
                <Radio value="ASIR">ASIR</Radio>
            </Radio.Group>
        </div>
    )
    return (
        <Popover content={content} title="Title" trigger="click">
            <Button>Click me</Button>
        </Popover>
    )

}

export const LotExpandable = ({record, updateEntry, entryId, restrictedColumns, userPermissions, isProcessing}) => {
    const [nonSellAgreement, setNonSellAgreement] = useState(record.nonSellAgreement?.weight > 0);

    const excludedFields = ["shipments", "comment", "tantalum", "weightOut", "lotNumber", "cumulativeAmount", "paymentHistory", "_id", "id", "createdAt", "updatedAt", "__v"];
    const numberFields = ["USDRate", "niobium", "iron"];
    const [lot, setLot] = useState({});

    useEffect(() => {
        // Initialize the lot state once after the component mounts
        const initialLot = Object.entries(record)
            .filter(([key]) => !excludedFields.includes(key))
            .reduce((acc, [key, value]) => {
                if (Object.keys(restrictedColumns).includes(key) && Object.keys(userPermissions).includes(key)) {
                    if (!restrictedColumns[key].table && userPermissions[key].view) {
                        if (key !== "nonSellAgreement") {
                            acc[key] = value;
                        }
                    }
                }
                return acc;
            }, {});
        setLot(initialLot);
    }, [record, restrictedColumns, userPermissions]);

    const handleChange = (e) => {
        if (e.target.name === "nonSellAgreement") {
            setLot({...lot, nonSellAgreement: { weight: e.target.checked ? record.weightOut : 0 }});
            return;
        }
        setLot({...lot, [e.target.name]: e.target.value});

    }
    const handleUpdate = async () => {
        const body = {output: [{...lot, lotNumber: record.lotNumber}]};
        await updateEntry({body, entryId});

    }

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

    const decideFieldType = (key, value, editable) => {
        if (key === "rmaFeeDecision") {
            return (
                <span className="flex">
                    <select name={key} value={value || ""}
                            disabled={!editable}
                            className=" font-medium col-span-1 p-2 w-full border"
                            onChange={handleChange}>
                          <option value="pending">Pending</option>
                          <option value="collected">Collected</option>
                          <option value="exempted">Exempted</option>
                    </select>
                </span>
            )
        } else if (key === "nonSellAgreement") {
            return (
                <Checkbox name={key} disabled={!editable} checked={nonSellAgreement} onChange={e => {
                    setNonSellAgreement(e.target.checked);
                    handleChange(e);
                }}/>
            )
        } else {
            return (
                <input
                    name={key}
                    disabled={!editable}
                    type={numberFields.includes(key) ? "number" : "text"}
                    onChange={handleChange}
                    className={`font-medium col-span-1 p-2 w-full border`}
                    value={lot[key] || ""}
                    onWheelCapture={e => e.target.blur()}
                />
            )
        }
    }

    return (
        <>
            <div className="w-full flex flex-col bg-white rounded-md p-2">
                <span
                    className="grid grid-cols-3 items-center justify-between w-full md:w-1/2  rounded-sm">
                  <p className=" font-semibold col-span-1 p-2 w-full border-b border-t text-start bg-slate-50">
                    Field Name
                  </p>
                  <p className=" font-medium col-span-1 p-2 w-full border ">
                    Value
                  </p>
                </span>
                {Object.entries(record).map(([key, value]) => {
                    if (!excludedFields.includes(key)) {
                        if (Object.keys(restrictedColumns).includes(key) && Object.keys(userPermissions).includes(key)) {
                            if (!restrictedColumns[key].table && userPermissions[key].view) {
                                return (
                                    <span key={key}
                                          className="grid grid-cols-3 items-center justify-between w-full md:w-1/2  rounded-sm">
                                        <p className=" font-semibold col-span-1 p-2 w-full border text-start bg-slate-50">
                                            {toInitialCase(key)}
                                        </p>
                                        {decideFieldType(key, lot[key], userPermissions[key].edit)}
                                    </span>
                                )
                            }
                        }
                    }
                })}
                <LoadingButton name={"Submit"} onClickFunction={handleUpdate} isProcessing={isProcessing} />
            </div>

            <div className="w-full flex flex-col items-end bg-white rounded-md p-2">
                <span
                    className="grid grid-cols-3 items-center justify-between w-full md:w-1/2  rounded-sm">
                  <p className=" font-semibold col-span-1 p-2 w-full border-b border-t text-start bg-slate-50">
                    Shipment Number
                  </p>
                  <p className=" font-medium col-span-1 p-2 w-full border ">
                    Weight
                  </p>
                  <p className=" font-medium col-span-1 p-2 w-full border ">
                    Date
                  </p>
                </span>
                {record.shipments?.map((shipment, index) => {
                    if (!Array.isArray(shipment)) {
                        return (
                            <span
                                key={index}
                                className="grid grid-cols-3 items-center justify-between w-full md:w-1/2  rounded-sm"
                            >
                                <p className=" font-semibold col-span-1 p-2 w-full border text-start bg-slate-50">
                                  {shipment.shipmentNumber}
                                </p>
                                <p className=" font-medium col-span-1 p-2 w-full border ">
                                  {shipment.weight}
                                </p>
                                <p className=" font-medium col-span-1 p-2 w-full border ">
                                    {dayjs(shipment.date).format("MMM DD, YYYY")}
                                </p>
                            </span>
                        );
                    }
                })}

            </div>
        </>
    );
}



