import React, { useState, useEffect, useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import { BsClipboard2MinusFill } from "react-icons/bs";
import ActionsPagesContainer from "../components/Actions components/ActionsComponentcontainer";
import { Table, Tooltip, Checkbox, Input, Form, Modal } from "antd";
import { BiSolidEditAlt } from "react-icons/bi";
import { FaSave } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";

const ShipmentPage = () => {
  const [openBill, setOpenBill] = useState(false);
  const handleBillOpen = () => {
    setOpenBill(!openBill);
    console.log("koko corona!!!");
  };
  const ResponsiveGridLayout = WidthProvider(Responsive);
  const layout = [
    { i: "item1", x: 0, y: 0, w: 2, h: 2 },
    { i: "item2", x: 2, y: 0, w: 2, h: 4 },
  ];
  const [item1Size, setItem1Size] = useState({ w: 2, h: 2 }); // Initial size

  // const handleResizeStop = (layout, layouts) => {
  //   const item1Layout = layout.find((item) => item.i === "item1");
  //   if (item1Layout) {
  //     const newHeight = Math.max(item1Layout.h, item1Size.h);
  //     setItem1Size({ w: item1Layout.w, h: newHeight });
  //   }
  // };

  const initialData = [
    {
      supplierName: "COPEMINYA",
      companyRepresentative: "Joseph M.",
      district: "KIREHE",
      TINNumber: 2231,
      weight: 850,
      grade: 23,
      supplyDate: "12/04/2023",
      lots: [
        { weight: 400, paidStatus: "paid" },
        { weight: 450, paidStatus: "paid" },
      ],
      payDate: "14/04/2023",
      ascTags: 2,
    },
    {
      supplierName: "ABC GEMS",
      companyRepresentative: "Ernest K.",
      district: "GICUMBI",
      TINNumber: 1001,
      weight: 650,
      grade: 19,
      supplyDate: "22/05/2023",
      lots: [
        { weight: 500, paidStatus: "paid" },
        { weight: 150, paidStatus: "paid" },
      ],
      payDate: "25/05/2023",
      ascTags: 2,
    },
    {
      supplierName: "DEMIKARU",
      companyRepresentative: "Laurent B.",
      district: "KARONGI",
      TINNumber: 8964,
      weight: 500,
      grade: 25,
      supplyDate: "07/06/2023",
      lots: [
        { weight: 250, paidStatus: "paid" },
        { weight: 250, paidStatus: "paid" },
      ],
      payDate: "10/07/2023",
      ascTags: 2,
    },
  ];
  const [totalWeight, setTotalWeight] = useState(null);
  const [avg, setAvg] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [sourceData, setSourceData] = useState(initialData);
  const [selectedData, setSelectedData] = useState([]);
  const [editRowKey, setEditRowKey] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    const newTotalWeight = selectedData.reduce(
      (total, item) => total + item.weight,
      0
    );
    setTotalWeight(newTotalWeight);

    const averageGrade = () => {
      if (selectedData.length === 0) {
        return 0;
      }
      const totalGrade = selectedData.reduce(
        (total, item) => total + item.grade,
        0
      );
      return (totalGrade / selectedData.length).toFixed(3);
    };
    setAvg(averageGrade);
  }, [selectedData]);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const isEditing = (record) => {
    return record.TINNumber === editRowKey;
  };

  const edit = (record) => {
    form.setFieldsValue({
      supplierName: record.supplierName,
      companyRepresentative: record.companyRepresentative,
      TINNumber: record.TINNumber,
      weight: record.weight,
      ...record,
    });
    setEditRowKey(record.TINNumber);
  };

  const save = async (key) => {
    const row = await form.validateFields();
    const newData = [...selectedData];
    const index = newData.findIndex((item) => key === item.TINNumber);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
        weight: parseFloat(row.weight),
      });
      setSelectedData(newData);
      const newTotalWeight = newData.reduce(
        (total, item) => total + item.weight,
        0
      );
      const averageGrade = () => {
        if (selectedData.length === 0) {
          return 0;
        }
        const totalGrade = selectedData.reduce(
          (total, item) => total + item.grade,
          0
        );
        return (totalGrade / selectedData.length).toFixed(3);
      };
      setTotalWeight(newTotalWeight);
      setAvg(averageGrade);
      setEditRowKey("");
    }
  };

  const columns = [
    {
      title: "Supplier Name",
      dataIndex: "supplierName",
      key: "supplierName",
      editTable: true,
    },
    // {
    //   title: "Representative",
    //   dataIndex: "companyRepresentative",
    //   key: "companyRepresentative",
    //   editTable: true,
    // },
    // {
    //   title: "TIN Number",
    //   dataIndex: "TINNumber",
    //   key: "TINNumber",
    //   editTable: true,
    // },
    { title: "weight", dataIndex: "weight", key: "weight", editTable: true },
    { title: "grade", dataIndex: "grade", key: "grade" },
    {
      title: "Select",
      key: "select",
      render: (_, record) => (
        <Checkbox
          name="checkbox"
          checked={
            selectedData.length > 0 &&
            selectedData.some(
              (selected) => selected.TINNumber === record.TINNumber
            )
          }
          onChange={() => handleRowToggle(record)}
        />
      ),
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <>
            <div className="flex items-center gap-1">
              {editable ? (
                <div className="flex items-center gap-3">
                  <FaSave
                    className=" text-xl"
                    onClick={() => save(record.TINNumber)}
                  />
                  <MdOutlineClose
                    className=" text-xl"
                    onClick={() => setEditRowKey("")}
                  />
                </div>
              ) : (
                <BiSolidEditAlt
                  className=" text-xl"
                  onClick={() => edit(record)}
                />
              )}
            </div>
          </>
        );
      },
    },
  ];

  const columns2 = [
    {
      title: "supplyDate",
      dataIndex: "supplyDate",
      key: "supplyDate",
    },
    {
      title: "Supplier Name",
      dataIndex: "supplierName",
      key: "supplierName",
      editTable: true,
    },
    // {
    //   title: "Representative",
    //   dataIndex: "companyRepresentative",
    //   key: "companyRepresentative",
    //   editTable: true,
    // },
    // {
    //   title: "TIN Number",
    //   dataIndex: "TINNumber",
    //   key: "TINNumber",
    //   editTable: true,
    // },
    { title: "weight", dataIndex: "weight", key: "weight" },
    { title: "grade", dataIndex: "grade", key: "grade" },
    {
      title: "Select",
      key: "select",
      render: (_, record) => (
        <Checkbox
          name="checkbox"
          checked={
            selectedData.length > 0 &&
            selectedData.some(
              (selected) => selected.TINNumber === record.TINNumber
            )
          }
          onChange={() => handleRowToggle(record)}
        />
      ),
    },
  ];

  const subcolumnsLots = [
    {
      title: "weight",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "paidStatus",
      dataIndex: "paidStatus",
      key: "paidStatus",
      render: (_, record) => (
        <p className=" bg-green-500 py-2 px-4 rounded-md text-white">
          {record.paidStatus}
        </p>
      ),
    },
  ];

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
    const input = <Input style={{ margin: 0 }} type="text" />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item name={dataIndex} style={{ margin: 0 }}>
            {input}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const handleRowToggle = (record) => {
    if (
      selectedData.some((selected) => selected.TINNumber === record.TINNumber)
    ) {
      setSelectedData((prevSelectedData) =>
        prevSelectedData.filter(
          (selected) => selected.TINNumber !== record.TINNumber
        )
      );
    } else {
      setSelectedData((prevSelectedData) => [...prevSelectedData, record]);
    }
  };

  return (
    <ActionsPagesContainer
      title={"Coltan Shipments"}
      subTitle={"Make Coltan Shipments"}
      actionsContainer={
        <div className="w-full space-y-2 flex items-start gap-3 px-2 py-2 bg-slate-50 justify-end rounded-lg">
          {/* <div className='w-full flex items-center justify-end'> */}

          <div className=" space-y-2 w-full block">
            <Tooltip title="Shipment details">
              <div
                className=" w-fit p-2 bg-orange-500 rounded-md"
                onClick={handleBillOpen}
              >
                <BsClipboard2MinusFill className=" text-white text-lg" />
              </div>
            </Tooltip>
            <Table
              className=" overflow-x-auto w-full"
              dataSource={sourceData}
              columns={columns2}
              rowKey="TINNumber"
            />
          </div>

          {openBill ? (
            <>
              <div className="w-full py-4 space-y-3 text-end">
                {/* <ResponsiveGridLayout
                   resizeHandles={["s", "w", "e", "n", "sw", "nw", "se", "ne"]}
                   className="layout"
                   layouts={{
                     lg: layout.map(item => ({
                       ...item,
                       w: item.i === 'item1' ? item1Size.w : item.w, // Use the stored size for "item1"
                       h: item.i === 'item1' ? item1Size.h : item.h, // Use the stored size for "item1"
                     }))
                   }}
                   onResizeStop={handleResizeStop}
                > */}
                <div className=" w-full space-y-2 overflow-y-auto" key="item1">
                  <Form form={form} component={false}>
                    <Table
                      className=" overflow-x-auto w-full bg-white rounded-lg"
                      dataSource={selectedData}
                      columns={mergedColumns}
                      components={{
                        body: {
                          cell: EditableCell,
                        },
                      }}
                      pagination={false}
                      expandable={{
                        expandedRowRender: (record) => (
                          <div className=" space-y-3 w-full">
                            <p className=" text-lg font-bold">More Details</p>
                            <div className=" w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              <span className=" space-y-2">
                                <p className="text-md font-semibold">
                                  Supply Date {record.supplyDate}
                                </p>
                                <p className="text-md font-semibold">
                                  From {record.district}
                                </p>
                              </span>
                              <span className=" space-y-2">
                                <p className="text-md font-semibold">
                                  Tags {record.ascTags}
                                </p>
                                <p className="text-md font-semibold">
                                  Pay Date {record.payDate}
                                </p>
                              </span>
                            </div>
                          </div>
                        ),
                        rowExpandable: (record) =>
                          record.supplierName !== "not expandale",
                      }}
                      rowKey="TINNumber"
                    />
                  </Form>

                  <div className="w-full flex flex-col items-end bg-white rounded-md p-2 space-y-2">
                    <span className="flex gap-1 items-center md:w-1/2 justify-end">
                      <p className=" font-semibold">Weight:</p>
                      <p className=" font-medium">{totalWeight} Kgs</p>
                    </span>
                    <span className="flex gap-1 items-center md:w-1/2 justify-end border-b-2">
                      <p className=" font-semibold">Avg:</p>
                      <p className=" font-medium">{avg}</p>
                    </span>
                    <span className="flex gap-1 items-center md:w-1/2 justify-end">
                      <p className=" font-semibold">Total:</p>
                      <p className=" font-medium">{totalWeight * avg}$</p>
                    </span>
                  </div>
                  <button
                    className=" bg-orange-500 text-white py-2 px-4 rounded-md"
                    onClick={() => {
                      console.log(selectedData);
                      console.log("total Weight:" + totalWeight);
                      console.log("average grade:" + avg);
                      console.log("total:" + totalWeight * avg);
                      handleOpenModal();
                    }}
                  >
                    submitt
                  </button>
                </div>

                {/* </ResponsiveGridLayout> */}
              </div>
            </>
          ) : null}

          <Modal
            open={openModal}
            onCancel={handleOpenModal}
            destroyOnClose
            width={"100%"}
            closable={false}
            style={{ top: 0, padding: "0px 0px", minHeight: "100%" }}
            footer={[
              <span
                key="actions"
                className=" flex w-full justify-center gap-4 text-base text-white"
              >
                <button
                  key="back"
                  className=" bg-green-400 p-2 rounded-lg"
                  onClick={handleOpenModal}
                >
                  Confirm
                </button>
                <button
                  key="submit"
                  className=" bg-red-400 p-2 rounded-lg"
                  type="primary"
                  onClick={handleOpenModal}
                >
                  Cancel
                </button>
              </span>,
            ]}
          >
            <div className=" bg-slate-100 p-2">
              <h2 className="modal-title text-center font-bold text-xl">
                Confirm Shipment
              </h2>
              <p className="text-center text-lg">
                {`Are you sure you want to confirm this Shipment transaction `}.
              </p>

              <div className="w-full py-4 space-y-3 text-end">
                {/* <div className=" w-full space-y-2 overflow-y-auto" key="item1">
                  <Form form={form} component={false}>
                    <Table
                      className=" overflow-x-auto w-full bg-white rounded-lg"
                      dataSource={selectedData}
                      columns={mergedColumns}
                      components={{
                        body: {
                          cell: EditableCell,
                        },
                      }}
                      pagination={false}
                      expandable={{
                        expandedRowRender: (record) => (
                          <div className=" space-y-3 w-full">
                            <p className=" text-lg font-bold">More Details</p>
                            <div className=" w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                              <span className=" space-y-2">
                                <p className="text-md font-semibold">
                                  Supply Date {record.supplyDate}
                                </p>
                                <p className="text-md font-semibold">
                                  From {record.district}
                                </p>
                              </span>
                              <span className=" space-y-2">
                                <p className="text-md font-semibold">
                                  Tags {record.ascTags}
                                </p>
                                <p className="text-md font-semibold">
                                  Pay Date {record.payDate}
                                </p>
                              </span>
                            </div>
                          </div>
                        ),
                        rowExpandable: (record) =>
                          record.supplierName !== "not expandale",
                      }}
                      rowKey="TINNumber"
                    />
                  </Form>

                  <div className="w-full flex flex-col items-end bg-white rounded-md p-2 space-y-2">
                    <span className="flex gap-1 items-center md:w-1/2 justify-end">
                      <p className=" font-semibold">Weight:</p>
                      <p className=" font-medium">{totalWeight} Kgs</p>
                    </span>
                    <span className="flex gap-1 items-center md:w-1/2 justify-end border-b-2">
                      <p className=" font-semibold">Avg:</p>
                      <p className=" font-medium">{avg}</p>
                    </span>
                    <span className="flex gap-1 items-center md:w-1/2 justify-end">
                      <p className=" font-semibold">Total:</p>
                      <p className=" font-medium">{totalWeight * avg}$</p>
                    </span>
                  </div>
                  <button
                    className=" bg-orange-500 text-white py-2 px-4 rounded-md"
                    onClick={() => {
                      console.log(selectedData);
                      console.log("total Weight:" + totalWeight);
                      console.log("average grade:" + avg);
                      console.log("total:" + totalWeight * avg);
                      handleOpenModal();
                    }}
                  >
                    submitt
                  </button>
                </div> */}
              </div>
            </div>
          </Modal>
        </div>
      }
    />
  );
};

export default ShipmentPage;
