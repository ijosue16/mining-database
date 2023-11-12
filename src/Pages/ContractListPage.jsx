import React, {useEffect, useState} from "react";
import PurchasesListContainer from "../components/Listcomponents/PurchasesListContainer";
import dayjs from "dayjs";
import {Table, Button, message} from "antd";
import {useGetAllContractsQuery} from "../states/apislice";
import ListContainer from "../components/Listcomponents/ListContainer";
import {useSelector} from "react-redux";
import {HiMiniViewfinderCircle} from "react-icons/hi2";
import {RiFolderDownloadFill} from "react-icons/ri";
import PdfView from "../components/PdfView";

const ContractsistPage = () => {
    const {permissions} = useSelector(state => state.global);
    const {data, isLoading, isSuccess} = useGetAllContractsQuery();
    const [contracts, setContracts] = useState([]);
    const [pdfUrl, setPdfUrl] = useState("");
    const [showPdf, setShowPdf] = useState(false);

    useEffect(() => {
        if (isSuccess) {
            const {contracts} = data.data;
            setContracts(contracts);
        }
    }, [isSuccess]);

    const handlePreview = (url) => {
        if (url.split('.').pop() !== 'pdf') {
            return message.error("Only pdf files are supported");
        }
        setPdfUrl(url);
        setShowPdf(true);
    }

    const columns = [
        {
            title: "Buyer name",
            dataIndex: "buyerName",
            key: "buyerName",
            sorter: (a, b) => a.buyerName.localeCompare(b.buyerName),
        },
        {
            title: "Mineral type",
            dataIndex: "minerals",
            key: "minerals",
            sorter: (a, b) => a.buyerName.localeCompare(b.buyerName),
            // render: (_, record) => <span>{dayjs(record.).format("llll")}</span>
        },
        {
            title: "Start date",
            dataIndex: "contractStartDate",
            // key: "edit",
            sorter: (a, b) => a.username.localeCompare(b.username),
            render: (_, record) =>
                <span>{record.contractStartDate ? dayjs(record.contractStartDate).format("YYYY-MM-DD") : null}</span>

        },
        {
            title: "End date",
            dataIndex: "contractExpiryDate",
            // key: "edit",
            sorter: (a, b) => a.username.localeCompare(b.username),
            render: (_, record) =>
                <span>{record.contractExpiryDate ? dayjs(record.contractExpiryDate).format("YYYY-MM-DD") : null}</span>
        },
        {
            title: "action",
            dataIndex: "action",
            key: "action",
            // sorter: (a, b) => a.username.localeCompare(b.username),
            render: (_, record) => {
                return (
                    <div className="flex gap-1">
                        <Button onClick={() => handlePreview(record.filePath)} icon={<HiMiniViewfinderCircle size={20}/>}/>
                        <Button onClick={() => console.log("download clicked")} icon={<RiFolderDownloadFill size={20}/>}/>
                    </div>
                )
            }
        },
        // {
        //     title: "Decision",
        //     dataIndex: "editExpiresAt",
        //     // key: "edit",
        //     // sorter: (a, b) => a.username.localeCompare(b.username),
        //     render: (_, record) => {
        //         return (
        //             <span className="flex gap-1">
        //                 <button
        //                     disabled={record.requestStatus !== "pending"}
        //                     className="bg-green-300 p-1 pl-2 pr-2 rounded-[4px]"
        //                     onClick={() => handleUpdate({decision: true}, record)}
        //                 >
        //                     Authorize
        //                 </button>
        //                 <button
        //                     disabled={record.requestStatus !== "pending"}
        //                     className="bg-red-400 p-1 pl-2 pr-2 rounded-[4px]"
        //                     onClick={() => handleUpdate({decision: false}, record)}
        //                 >
        //                     Reject
        //                 </button>
        //             </span>
        //         )
        //     }
        // },

    ]


    return (
        <>
            <ListContainer
                title={'Contracts list'}
                subTitle={'Manage your contracts'}
                navLinktext={'add/contract'}
                navtext={'add new contract'}
                isAllowed={true}
                table={
                    <div>
                        <Table
                            columns={columns}
                            dataSource={contracts}
                            rowKey="_id"
                        />
                        {showPdf && <PdfView pdfUrl={pdfUrl}/>}
                    </div>
                }
            />
        </>
    )
}

export default ContractsistPage;