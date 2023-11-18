import React, {useEffect, useState} from "react";
import ListContainer from "../../components/Listcomponents/ListContainer";
import { useGetTagsListQuery, useUpdateTagMutation } from "../../states/apislice";
import { Table, message } from "antd";
import { useParams } from "react-router-dom";
import dayjs from "dayjs";


const TagsList = () => {
    const { shipmentId } = useParams();
    const { data, isLoading, isSuccess } = useGetTagsListQuery({shipmentId}, {refetchOnMountOrArgChange: true, refetchOnReconnect: true});
    const [updateTag, {isSuccess: isUpdateTagSuccess, isError: isUpdateTagError, error: updateTagError}] = useUpdateTagMutation();
    const [entries, setEntries] = useState([]);


    useEffect(() => {
        if (isSuccess) {
            const { entries } = data.data;
            setEntries(entries);
        }
    }, [isSuccess]);

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
                if (record.weightOut) {
                    return <span>{record.weightOut}</span>
                }
            }
        }
    ];

    useEffect(() => {
        if (isUpdateTagSuccess) {
            return message.success("Tag status updated successfully");
        } else if (isUpdateTagError) {
            const { message: errorMessage } = updateTagError.data;
            return message.error(errorMessage);
        }
    }, [isUpdateTagSuccess, isUpdateTagError, updateTagError]);


    return (
        <>
            <ListContainer
                title={'Prepare tags list'}
                subTitle={'Manage your contracts'}
                table={
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
                }

            />

        </>
    )
}

export default TagsList;