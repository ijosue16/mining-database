import React, { useState } from "react";
import { Table, Tooltip } from "antd";
import { Responsive, WidthProvider } from 'react-grid-layout';
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import { BsClipboard2MinusFill } from "react-icons/bs";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";

const ShipmentPage = () => {

    const [openBill, setOpenBill] = useState(false);

    const ResponsiveGridLayout = WidthProvider(Responsive);
    const layout = [
        { i: 'item1', x: 0, y: 0, w: 2, h: 2 },
        { i: 'item2', x: 2, y: 0, w: 2, h: 4 },
        // Add more items as needed
    ];
    const handleBillOpen = () => {
        setOpenBill(!openBill);
        console.log("koko corona!!!");
    }
    const columns = [
        {
            title: '#',
            dataIndex: 'lotNumber',
            key: 'lotNumber',
            sorter: (a, b) => a.lotNumber.localeCompare(b.lotNumber),
        },
        {
            title: 'date',
            dataIndex: 'supplyDate',
            key: 'supplyDate',
            sorter: (a, b) => a.supplyDate - b.supplyDate,
        },
        {
            title: 'supplier',
            dataIndex: 'supplier',
            key: 'supplier',
            editTable: true,

            sorter: (a, b) => a.supplier.localeCompare(b.supplier),
        },

        {
            title: 'grade',
            dataIndex: 'grade',
            key: 'grade',
            editTable: true,

            sorter: (a, b) => a.grade.localeCompare(b.grade),
        },
        {
            title: 'price',
            dataIndex: 'price',
            key: 'price',
            editTable: true,

            sorter: (a, b) => a.price.localeCompare(b.price),
        },
        {
            title: 'amount (weight)',
            dataIndex: 'amount',
            key: 'amount',
            editTable: true,

            sorter: (a, b) => a.amount.localeCompare(b.amount),
        },
        {
            title: 'tantalum',
            dataIndex: 'tantalum',
            key: 'tantalum',
            editTable: true,
            sorter: (a, b) => a.tantalum.localeCompare(b.tantalum),
        },
        {
            title: 'exported A',
            dataIndex: 'eportedA',
            key: 'eportedA',
            sorter: (a, b) => a.eportedA.localeCompare(b.eportedA),
        },
        {
            title: 'rmaFee',
            dataIndex: 'rmaFee',
            key: 'rmaFee',
            editTable: true,

            sorter: (a, b) => a.rmaFee - b.rmaFee,
        },
        {
            title: 'status',
            dataIndex: 'status',
            key: 'status',
            sorter: (a, b) => a.status.localeCompare(b.status),
        },

    ];
    return (
        <div>
            <ActionsPagesContainer title={'Coltan Shipments'}
                subTitle={'Make Coltan Shipments'}
                actionsContainer={
                    <div className="w-full space-y-2 grid grid-cols-1">
                        <div className="w-full space-y-2 relative">
                            <div className=" sm:flex sm:justify-between">
                                <span className="max-w-[220px] border rounded flex items-center p-1 justify-between gap-2">
                                    <PiMagnifyingGlassDuotone className="h-4 w-4" />
                                    <input type="text" className=" w-full focus:outline-none" name="tableFilter" id="tableFilter" placeholder="Search..." />

                                </span>
                                <Tooltip title="Shipment details">
                                    <span className=" p-2 bg-orange-500 rounded-md" onClick={handleBillOpen}>
                                        <BsClipboard2MinusFill className=" text-white text-lg" />
                                    </span>
                                </Tooltip>
                            </div>
                            {/* <ResponsiveGridLayout resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]} className="layout" layouts={{ lg: layout }}> */}
          <div key="item1" className=" bg-slate-100 space-y-3 w-full">
          <Table className=" overflow-x-auto"
                                columns={columns}
                                // dataSource={testInfo}
                                pagination={false}
                                rowKey={"lotNumber"} />
          </div>
        
        {/* </ResponsiveGridLayout> */}

                            <Table className=" overflow-x-auto"
                                columns={columns}
                                // dataSource={testInfo}
                                pagination={false}
                                rowKey={"lotNumber"} />
                        </div>
                        
                    </div>
                }
            />
        </div>
    )
};
export default ShipmentPage;