import React, {useContext, useEffect, useState} from "react";
import {useGetAllEditRequestsQuery, useUpdateEditRequestMutation} from "../states/apislice";
import ListContainer from "../components/Listcomponents/ListContainer";
import {ImSpinner2} from "react-icons/im";
import Countdown from "react-countdown";
import {Table, message} from "antd";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {toast} from "react-toastify";
import { SocketContext } from "../context files/socket";

dayjs.extend(localizedFormat);


const EditRequests = () => {
    const socket = useContext(SocketContext);
    const {data, isSuccess, isLoading} = useGetAllEditRequestsQuery("", {
        refetchOnMountOrArgChange: true,
        refetchOnReconnect: true
    });
    const [updateEditRequest, {
        isSuccess: isUpdateSuccess,
        isError: isUpdateError,
        error: updateError
    }] = useUpdateEditRequestMutation();
    const [editRequests, setEditRequests] = useState([]);
    const [userName, setUserName] = useState("");

    useEffect(() => {
        if (isSuccess) {
            const {editRequests} = data.data;
            setEditRequests(editRequests);
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (isUpdateSuccess) {
            message.success("Edit request updated successfully");
        } else if (isUpdateError) {
            const {message: errorMessage} = updateError.data;
            message.error(errorMessage);
        }
    }, [isUpdateSuccess, isUpdateError, updateError]);

    useEffect(() => {
        socket.on("new-edit-request", data => {

        })
    })

    const handleUpdate = async (body, record) => {
        setUserName(record.username);
        await updateEditRequest({body, requestId: record._id});
        socket.emit("request-decision", {decision: body.decision, userName});
        // if (isUpdateSuccess && body.decision) {
        //     socket.emit("request-authorized", userName);
        // } else if (isUpdateSuccess && body.decision === false) {
        //     socket.emit("request-rejected", userName);
        // }
    }

    const columns = [
        {
            title: "username",
            dataIndex: "username",
            key: "username",
            sorter: (a, b) => a.username.localeCompare(b.username),
        },
        {
            title: "Requested At",
            dataIndex: "editRequestedAt",
            // key: "username",
            sorter: (a, b) => a.editRequestedAt.localeCompare(b.editRequestedAt),
            render: (_, record) => <span>{dayjs(record.editRequestedAt).format("llll")}</span>
        },
        {
            title: "Expires At",
            dataIndex: "editExpiresAt",
            // key: "edit",
            sorter: (a, b) => a.username.localeCompare(b.username),
            render: (_, record) => <span>{record.editExpiresAt ? dayjs(record.editExpiresAt).format("llll"): null}</span>

        },
        {
            title: "Time Rem.",
            dataIndex: "editExpiresAt",
            // key: "edit",
            sorter: (a, b) => a.username.localeCompare(b.username),
            render: (_, record) => {
                return (
                    <>
                        {record.requestStatus === "authorized" || record.requestStatus === "expired" ?
                            <Countdown
                                date={dayjs(record.editExpiresAt).valueOf()}
                                // onComplete={() => {
                                //     if (record.requestStatus === "pending") {
                                //         handleUpdate({ requestStatus: "expired" }, record._id);
                                //     }
                                // }}
                                renderer={({hours, minutes, seconds, completed}) => {
                                    if (completed) {
                                        return <span>Timeout</span>
                                    } else {
                                        return (
                                            <span>
                                                {String(hours).padStart(2, "0")}:
                                                {String(minutes).padStart(2, "0")}:
                                                {String(seconds).padStart(2, "0")}
                                            </span>
                                        )
                                    }
                                }}
                            /> :
                            null
                        }
                    </>
                )
            }
        },
        {
            title: "Status",
            dataIndex: "requestStatus",
            key: "requestStatus",
            sorter: (a, b) => a.username.localeCompare(b.username),
            render: (_, record) => {
                let item;
                if (record.requestStatus === "pending") {
                    item = <span className="bg-blue-500 rounded-[4px] p-1 text-white">{record.requestStatus}</span>
                } else if (record.requestStatus === "authorized") {
                    item = <span className="bg-green-500 rounded-[4px] p-1 text-white">{record.requestStatus}</span>
                } else if (record.requestStatus === "rejected") {
                    item = <span className="bg-red-400 rounded-[4px] p-1 text-white">{record.requestStatus}</span>
                } else {
                    item = <span className="bg-gray-400 rounded-[4px] p-1 text-white">{record.requestStatus}</span>
                }
                return item;
            }
        },
        {
            title: "Decision",
            dataIndex: "editExpiresAt",
            // key: "edit",
            // sorter: (a, b) => a.username.localeCompare(b.username),
            render: (_, record) => {
                return (
                    <span className="flex gap-1">
                        <button
                            disabled={record.requestStatus !== "pending"}
                            className="bg-green-300 p-1 pl-2 pr-2 rounded-[4px]"
                            onClick={() => handleUpdate({decision: true}, record)}
                        >
                            Authorize
                        </button>
                        <button
                            disabled={record.requestStatus !== "pending"}
                            className="bg-red-400 p-1 pl-2 pr-2 rounded-[4px]"
                            onClick={() => handleUpdate({decision: false}, record)}
                        >
                            Reject
                        </button>
                    </span>
                )
            }
        },

    ]



    return (
        <>
            <ListContainer
                title={"Edit Requests"}
                table={
                    <>
                        <Table
                            className="w-full overflow-x-auto"
                            loading={{
                                indicator: (
                                    <ImSpinner2
                                        style={{width: "60px", height: "60px"}}
                                        className="animate-spin text-gray-500"
                                    />
                                ),
                                spinning: isLoading,
                            }}
                            dataSource={editRequests}
                            columns={columns}
                            rowKey="_id"
                        />
                    </>
                }
            />
        </>
    )
}

export default EditRequests;