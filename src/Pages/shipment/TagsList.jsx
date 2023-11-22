import React, {useEffect, useState} from "react";
import ListContainer from "../../components/Listcomponents/ListContainer";
import { useGetTagsListQuery, useUpdateTagMutation, useGenerateTagListMutation, useGetOneShipmentQuery } from "../../states/apislice";
import { Table, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";


const TagsList = () => {
    const { shipmentId } = useParams();
    const { data: shipmentData, isSuccess: isShipmentSuccess } = useGetOneShipmentQuery(shipmentId, {refetchOnMountOrArgChange: true, refetchOnReconnect: true});
    const { data, isLoading, isSuccess } = useGetTagsListQuery({shipmentId}, {refetchOnMountOrArgChange: true, refetchOnReconnect: true});
    const [updateTag, {isSuccess: isUpdateTagSuccess, isError: isUpdateTagError, error: updateTagError}] = useUpdateTagMutation();
    const [generateTagList, {isSuccess: isGenerateTagListSuccess, isError: isGenerateTagListError, error: generateTagListError}] = useGenerateTagListMutation();

    const [entries, setEntries] = useState([]);
    const [tagListFile, setTagListFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (isSuccess) {
            const { entries } = data.data;
            setEntries(entries);
        }
    }, [isSuccess]);

    useEffect(() => {
        if (isShipmentSuccess) {
            const { shipment } = shipmentData.data;
            if (shipment && shipment.tagListFile) {
                setTagListFile(shipment.tagListFile);
            }
        }
    }, [isShipmentSuccess]);

    const columns = [
        {
            title: "Supply date",
            dataIndex: "supplyDate",
            key: "supplyDate",
            sorter: (a, b) => a.supplyDate.localeCompare(b.supplyDate),
            render: (_, record) => <span>{dayjs(record.supplyDate).format("YYYY-MM-DD")}</span>
        },
        {
            title: "Company Name",
            dataIndex: "companyName",
            key: "companyName",
            sorter: (a, b) => a.companyName.localeCompare(b.companyName),
        },
        {
            title: "Weight In (KG)",
            dataIndex: "weightIn",
            key: "weightIn",
            sorter: (a, b) => a.weightIn.localeCompare(b.weightIn),
        },
        {
            title: "Weight Out (KG)",
            dataIndex: "weightOut",
            key: "weightOut",
            sorter: (a, b) => a.weightOut.localeCompare(b.weightOut),
            render: (_, record) => {
                if (record) {
                    let weightOut = 0;
                    record.output.forEach(lot => {
                        weightOut += lot.weightOut;
                    })
                    return <span>{weightOut}</span>
                }
            }
        },
        {
            title: "Balance (KG)",
            dataIndex: "cumulativeAmount",
            key: "cumulativeAmount",
            sorter: (a, b) => a.cumulativeAmount.localeCompare(b.cumulativeAmount),
            render: (_, record) => {
                if (record) {
                    let balance = 0;
                    record.output.forEach(lot => {
                        balance += lot.cumulativeAmount;
                    })
                    return <span>{balance}</span>
                }
            }
        }
    ];

    useEffect(() => {
        if (isGenerateTagListSuccess) {
            return message.success("Tag list generated successfully");
        } else if (isGenerateTagListError) {
            const { message: errorMessage } = generateTagListError.data;
            return message.error(errorMessage);
        }
    }, [isGenerateTagListSuccess, isGenerateTagListError, generateTagListError]);

    useEffect(() => {
        if (isUpdateTagSuccess) {
            return message.success("Tag status updated successfully");
        } else if (isUpdateTagError) {
            const { message: errorMessage } = updateTagError.data;
            return message.error(errorMessage);
        }
    }, [isUpdateTagSuccess, isUpdateTagError, updateTagError]);

    const handleGenerateTagList = async () => {
        const response = await generateTagList({shipmentId});
        if (response.data) {
            const { tagListFile: tagFile } = response.data.data;
            setTagListFile(tagFile);
        }
    }

    const handleDownloadTagList = () => {
        navigate(`/${tagListFile}`);
    }

    return (
        <>
            <ListContainer
                title={'Prepare tags list'}
                subTitle={'Manage your contracts'}
                table={
                    <>
                        <Table
                            columns={columns}
                            dataSource={entries}
                            loading={isLoading}
                            expandable={{
                                expandedRowRender: record => {
                                    const handleChange = async (tag) => {
                                        let status;
                                        if (tag.status === "in store") {
                                            status = "out of store"
                                        } else if (tag.status === "out of store") {
                                            status = "in store";
                                        }
                                        const body = {status}
                                        await updateTag({body, tagNumber: tag.tagNumber});
                                    }
                                    if (record.mineTags || record.negociantTags) {
                                        return (
                                            <div className="w-full flex flex-col gap-3 bg-white rounded-md p-2">
                                                <div>
                                            <span className="grid grid-cols-4 items-center justify-between w-full md:w-1/2  rounded-sm">
                                              <p className=" font-medium col-span-1 p-2 w-full border ">#</p>
                                              <p className=" font-semibold col-span-1 p-2 w-full border-b border-t text-start bg-slate-50">Tag  Number</p>
                                              <p className=" font-medium col-span-1 p-2 w-full border ">Weight</p>
                                              <p className=" font-medium col-span-1 p-2 w-full border ">Status</p>
                                            </span>
                                                    {record.negociantTags?.map((negociantTag, index) => {
                                                        if (negociantTag) {
                                                            return (
                                                                <span key={index} className="grid grid-cols-4 items-center justify-between w-full md:w-1/2  rounded-sm">
                                                          <p className=" font-medium col-span-1 p-2 w-full border ">{index + 1}</p>
                                                          <p className=" font-semibold col-span-1 p-2 w-full border-b border-t text-start bg-slate-50">{negociantTag.tagNumber}</p>
                                                          <p className=" font-medium col-span-1 p-2 w-full border ">{negociantTag.weight}</p>
                                                          <select defaultValue={negociantTag.status} className=" font-medium col-span-1 p-2 w-full border" onChange={() => handleChange(negociantTag)}>
                                                              <option value="in store">In Store</option>
                                                              <option value="out of store">Out of Store</option>
                                                          </select>
                                                        </span>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                                <div>
                                                <span className="grid grid-cols-4 items-center justify-between w-full md:w-1/2  rounded-sm">
                                              <p className=" font-medium col-span-1 p-2 w-full border ">#</p>
                                              <p className=" font-semibold col-span-1 p-2 w-full border-b border-t text-start bg-slate-50">Tag  Number</p>
                                              <p className=" font-medium col-span-1 p-2 w-full border ">Weight</p>
                                              <p className=" font-medium col-span-1 p-2 w-full border ">Status</p>
                                            </span>
                                                    {record.mineTags?.map((mineTag, index) => {
                                                        if (mineTag) {
                                                            return (
                                                                <span key={index} className="grid grid-cols-4 items-center justify-between w-full md:w-1/2  rounded-sm">
                                                          <p className=" font-medium col-span-1 p-2 w-full border ">{index + 1}</p>
                                                          <p className=" font-semibold col-span-1 p-2 w-full border-b border-t text-start bg-slate-50">{mineTag.tagNumber}</p>
                                                          <p className=" font-medium col-span-1 p-2 w-full border ">{mineTag.weight}</p>
                                                          <select defaultValue={mineTag.status} className=" font-medium col-span-1 p-2 w-full border" onChange={() => handleChange(mineTag)}>
                                                              <option value="in store">In Store</option>
                                                              <option value="out of store">Out of Store</option>
                                                          </select>
                                                        </span>
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                        )
                                    }
                                },
                                rowExpandable: record => record
                            }}
                            rowKey="_id"
                        />
                        <div>
                            <button onClick={handleGenerateTagList} className="p-1 bg-blue-400 text-white border rounded-[4px]">Generate tag list</button>
                            <a target='_blank' className="text-white p-1 bg-amber-500 border rounded-[4px]" rel='noopener noreferrer'
                               href={tagListFile ? tagListFile : ""}>
                                Download tag list</a>
                        </div>
                    </>

                }

            />

        </>
    )
}

export default TagsList;