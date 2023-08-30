import React, { useState, useEffect, useMemo } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { PiMagnifyingGlassDuotone } from "react-icons/pi";
import { BsClipboard2MinusFill } from "react-icons/bs";
import ActionsPagesContainer from "../../components/Actions components/ActionsComponentcontainer";
import { Table, Tooltip, Checkbox, Input, Form, Modal, Spin } from "antd";
import { BiSolidEditAlt } from "react-icons/bi";
import { FaSave } from "react-icons/fa";
import { MdOutlineClose } from "react-icons/md";
import { useParams } from "react-router-dom";
import {
  useDetailedStockQuery,
  useAddShipmentMutation,
} from "../../states/apislice";
import dayjs from "dayjs";

const StockPage = () => {
  const { model } = useParams();
  const { data, isLoading, isSuccess, isError, error } = useDetailedStockQuery({
    model,
  });
  const [
    AddShipment,
    { isLoading: isSending, isError: isFailed, isSuccess: isSent, error: fail },
  ] = useAddShipmentMutation();
  const [openBill, setOpenBill] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  const [shipmentInfo, setShipmentInfo] = useState({
    entries: "",
    averageGrade: "",
    averagePrice: "",
    totalShipmentQuantity: "",
    model: model,
  });
  const [totalWeight, setTotalWeight] = useState(null);
  const [avg, setAvg] = useState(null);
  const [avgPrice, setAvgPrice] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [sourceData, setSourceData] = useState("");
  const [selectedData, setSelectedData] = useState([]);
  const [transformedData, setTransformedData] = useState([]);
  const [editRowKey, setEditRowKey] = useState("");
  const [emptyError, setEmptyError] = useState("");
  const [form] = Form.useForm();
  let initialData = [];

  // useEffect(() => {
  if (isSuccess) {
    const { data: dt } = data;
    const { detailedStock: dtStk } = dt;
    console.log(dtStk);
    initialData = dtStk;
  }
  // },[isSuccess]);

  const handleBillOpen = () => {
    setOpenBill(!openBill);
    console.log("koko corona!!!");
  };

  useMemo(() => {
    const newTransformedData = selectedData.map((item) => ({
      entryId: item._id,
      lotNumber: item.lotNumber,
      quantity: item.cumulativeAmount,
    }));

    const newTotalWeight = selectedData.reduce(
      (total, item) => total + item.cumulativeAmount,
      0
    );
    setTotalWeight(newTotalWeight);

    const totalGrade = selectedData.reduce(
      (total, item) => total + item.cumulativeAmount * item.mineralGrade,
      0
    );
    const averagegrade =
      newTotalWeight > 0 ? (totalGrade / newTotalWeight).toFixed(3) : "0.000";

    setAvg(averagegrade);
    console.log(avg);
    setAvgPrice(newTotalWeight); //TO ADD  AVG PRICE FORMULA
    setTransformedData(newTransformedData);
    setShipmentInfo((prevState) => ({
      ...prevState,
      entries: newTransformedData,
      averageGrade: averagegrade,
      averagePrice: "22",
      totalShipmentQuantity: newTotalWeight,
    }));
  }, [selectedData]);

  const handleOpenModal = () => {
    setOpenModal(!openModal);
  };

  const handleConfirmModal = () => {
    setConfirmModal(!confirmModal);
    setEmptyError("");
  };

  const isEditing = (record) => {
    return record.index === editRowKey;
  };

  const edit = (record) => {
    form.setFieldsValue({
      cumulativeAmount: record.cumulativeAmount,
      // companyRepresentative: record.companyRepresentative,
      // index: record.index,
      // weight: record.weight,
      ...record,
    });
    setEditRowKey(record.index);
  };

  const save = async (key) => {
    const row = await form.validateFields();
    const newData = [...selectedData];
    const index = newData.findIndex((item) => key === item.index);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, {
        ...item,
        ...row,
        cumulativeAmount: parseFloat(row.cumulativeAmount),
      });
      // setSelectedData(newData);
      const newTotalWeight = newData.reduce(
        (total, item) => total + item.cumulativeAmount,
        0
      );

      const totalGrade = newData.reduce(
        (total, item) => total + item.cumulativeAmount * item.mineralGrade,
        0
      );

      const averagegrade =
        newTotalWeight > 0 ? (totalGrade / newTotalWeight).toFixed(3) : "0.000";

      setTotalWeight(newTotalWeight);
      setAvg(averagegrade);
      setEditRowKey("");
      setSelectedData(newData);
      const newTransformedData = newData.map((item) => ({
        entryId: item._id,
        lotNumber: item.lotNumber,
        quantity: item.cumulativeAmount,
      }));
      setTransformedData(newTransformedData);
      setShipmentInfo((prevState) => ({
        ...prevState,
        entries: newTransformedData,
        averageGrade: averagegrade,
        averagePrice: "22",
        totalShipmentQuantity: newTotalWeight,
      }));
    }

    console.log(newData);
  };

  const columns = [
    {
      title: "supplyDate",
      dataIndex: "supplyDate",
      key: "supplyDate",
      sorter: (a, b) => a.supplyDate.localeCompare(b.supplyDate),
      render: (text) => <p>{dayjs(text).format("MMM DD,YYYY")}</p>,
    },
    { title: "supplierName", dataIndex: "supplierName", key: "supplierName" },
    {
      title: "cumulativeAmount",
      dataIndex: "cumulativeAmount",
      key: "cumulativeAmount",
      editTable: true,
    },
    {
      title: "mineralGrade",
      dataIndex: "mineralGrade",
      key: "mineralGrade",
    },
    {
      title: "Select",
      key: "select",
      render: (_, record) => (
        <Checkbox
          name="checkbox"
          checked={
            selectedData.length > 0 &&
            selectedData.some((selected) => selected.index === record.index)
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
                    onClick={() => save(record.index)}
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
      sorter: (a, b) => a.supplyDate.localeCompare(b.supplyDate),
      render: (text) => <p>{dayjs(text).format("MMM DD,YYYY")}</p>,
    },
    { title: "supplierName", dataIndex: "supplierName", key: "supplierName" },
    {
      title: "cumulativeAmount",
      dataIndex: "cumulativeAmount",
      key: "cumulativeAmount",
    },
    {
      title: "mineralGrade",
      dataIndex: "mineralGrade",
      key: "mineralGrade",
    },
    {
      title: "Select",
      key: "select",
      render: (_, record) => (
        <Checkbox
          name="checkbox"
          checked={
            selectedData.length > 0 &&
            selectedData.some((selected) => selected.index === record.index)
          }
          onChange={() => handleRowToggle(record)}
        />
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
    if (selectedData.some((selected) => selected.index === record.index)) {
      setSelectedData((prevSelectedData) =>
        prevSelectedData.filter((selected) => selected.index !== record.index)
      );
    } else {
      setSelectedData((prevSelectedData) => [...prevSelectedData, record]);
    }
  };

  const handleShipmentSubmit = async () => {
    if (
      shipmentInfo.totalShipmentQuantity !== 0 &&
      shipmentInfo.totalShipmentQuantity !== null &&
      shipmentInfo.entries.length > 0
    ) {
      const body = shipmentInfo;
      await AddShipment({ body });
      setSelectedData([]);
      console.log("Shipment Info After Update:", { body });
      setConfirmModal(!confirmModal);
    } else {
      setEmptyError("you can not send empty shipment slip");
    }
  };
  return (
    <ActionsPagesContainer
      title={`${model} stock`}
      subTitle={`Manage ${model} stock`}
      actionsContainer={
        <div className="w-full space-y-2 flex items-start gap-3 px-2 py-2 bg-slate-50 justify-end rounded-lg">
          {/* <div className='w-full flex items-center justify-end'> */}

          <div className=" space-y-2 w-full block">
            {/* <Tooltip title="Shipment details">
              <div
                className=" w-fit p-2 bg-orange-500 rounded-md"
                onClick={handleOpenModal}
              >
                <BsClipboard2MinusFill className=" text-white text-lg" />
              </div>
            </Tooltip> */}
            <Table
              className=" overflow-x-auto w-full"
              dataSource={initialData}
              loading={isLoading}
              columns={columns2}
              rowKey="index"
            />
            <div
              className=" w-full p-2 bg-orange-500 rounded-md flex justify-center"
              onClick={handleOpenModal}
            >
              <BsClipboard2MinusFill className=" text-white text-lg" />
            </div>
          </div>

          <Modal
            open={openModal}
            onCancel={handleOpenModal}
            destroyOnClose
            width={"100%"}
            closable={false}
            style={{ top: 0, padding: "0px 0px", height: "100%" }}
            footer={[
              <span
                key="actions"
                className=" flex w-full justify-center gap-4 text-base text-white"
              >
                {/* <button
                  key="back"
                  className=" bg-green-400 p-2 rounded-lg"
                  onClick={handleOpenModal}
                >
                  Confirm
                </button> */}
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
                Shipment details
              </h2>
              <p className="text-center text-lg">
                slots detailed information. Make sure to confirm shipment.
              </p>

              <div className="w-full py-4 space-y-3 text-end">
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
                                  Exported amount: {record.exportedAmount}
                                </p>
                                <p className="text-md font-semibold">
                                  Mineral price: {record.mineralPrice}
                                </p>
                              </span>
                              <span className=" space-y-2">
                                <p className="text-md font-semibold">
                                  Price per unit: {record.pricePerUnit}
                                </p>
                              </span>
                            </div>
                          </div>
                        ),
                        rowExpandable: (record) =>
                          record.supplierName !== "not expandale",
                      }}
                      rowKey="index"
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
                      <p className=" font-medium">{avgPrice}$</p>
                    </span>
                  </div>
                  <button
                    className=" bg-orange-500 text-white py-2 px-4 rounded-md"
                    onClick={() => {
                      handleConfirmModal();
                    }}
                  >
                    submit
                  </button>
                </div>
              </div>
            </div>
          </Modal>
          <Modal
            open={confirmModal}
            onCancel={handleConfirmModal}
            destroyOnClose
            footer={[
              <span
                key="actions"
                className=" flex w-full justify-center gap-4 text-base text-white"
              >
                <button
                  key="back"
                  disabled={isSending}
                  className=" bg-green-400 p-2 rounded-lg flex items-center gap-2 justify-center"
                  onClick={handleShipmentSubmit}
                >
                  {isSending ? <Spin /> : "Confirm"}
                </button>
                <button
                  key="submit"
                  className=" bg-red-400 p-2 rounded-lg"
                  type="primary"
                  onClick={handleConfirmModal}
                >
                  Cancel
                </button>
              </span>,
            ]}
          >
            <div className=" p-2">
              <h2 className="modal-title text-center font-bold text-xl">
                Confirm Shipment
              </h2>
              <p className="text-center text-lg">
                {`Are you sure you want to confirm this Shipment transaction `}.
              </p>
              {emptyError!==""?<p className=" text-red-400 text-center text-md">{emptyError}</p>:null}
            </div>
          </Modal>
        </div>
      }
    />
  );
};

export default StockPage;
