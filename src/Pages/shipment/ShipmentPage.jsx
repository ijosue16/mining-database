import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { Input, Modal, Spin, Table, Form } from "antd";
import { motion } from "framer-motion";
import {
  PiMagnifyingGlassDuotone,
  PiDotsThreeVerticalBold,
} from "react-icons/pi";
import { BiSolidFilePdf, BiSolidEditAlt } from "react-icons/bi";
import { BsCardList, BsDownload } from "react-icons/bs";
import { MdDelete, MdOutlineClose } from "react-icons/md";
import { FaSave } from "react-icons/fa";
import { RiFileEditFill, RiFileListFill } from "react-icons/ri";
import { HiOutlinePrinter } from "react-icons/hi";
import ListContainer from "../../components/Listcomponents/ListContainer";
import {
  useGetAllShipmentsQuery,
  useShipmentReportMutation,
} from "../../states/apislice";
import { useNavigate } from "react-router-dom";
import ListModalContainerHeader from "../../components/Listcomponents/ListModalContainerHeader";

const ShipmentPage = () => {
  const [form] = Form.useForm();
  const { data, isLoading, isSuccess, isError, error } =
    useGetAllShipmentsQuery();
  const [
    createShipmentReport,
    { isLoading: isDeleting, isSuccess: isdone, isError: isproblem },
  ] = useShipmentReportMutation();

  const navigate = useNavigate();
  const [searchText, SetSearchText] = useState("");
  const [dataz, SetDataz] = useState([]);
  const [mineralModal, SetMineralModal] = useState(false);
  const [showActions, SetShowActions] = useState(false);
  const [selectedRow, SetSelectedRow] = useState({
    id: null,
    name: "",
    date: "",
  });
  const [model, Setmodel] = useState(null);
  const [showmodal, setShowmodal] = useState(false);
  const [editRowKey, setEditRowKey] = useState("");

useEffect(()=>{
  if (isSuccess) {
    const { data: dt } = data;
    const { shipments: ships } = dt;
    console.log(ships);
    SetDataz(ships);
  }
},[isSuccess]);

  const handleActions = (id) => {
    SetShowActions(!showActions);
    SetSelectedRow(id);
    console.log("Deleted ID:", id);
  };

  const downloadReport = async (record) => {
    const shipmentId = record._id;
    await createShipmentReport({ shipmentId });
    console.log(shipmentId);
  };

  const handleDelete = async () => {
    const entryId = selectedRow.id;
    await deleteColtan({ entryId });
    SetSelectedRow({ id: null, name: "", date: "" });
    setShowmodal(!showmodal);
  };
  const columns = [
    {
      title: "Date Created",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) => a.createdAt.localeCompare(b.createdAt),
      render: (text) => <p>{dayjs(text).format("MMM DD,YYYY")}</p>,
    },
    {
      title: "T. Quantity",
      dataIndex: "totalShipmentQuantity",
      key: "totalShipmentQuantity",
      editTable: true,
      sorter: (a, b) =>
        a.totalShipmentQuantity - b.totalShipmentQuantity,
    },
    {
      title: "Avg.Grade",
      dataIndex: "averageGrade",
      key: "averageGrade",
      sorter: (a, b) => a.averageGrade - b.averageGrade,
    },
    {
      title: "status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status.localeCompare(b.status),
      render: (text) => {
        // "in stock", "fully exported", "rejected", "non-sell agreement", "partially exported"
        let color =
          text === "in stock"
            ? "bg-green-500"
            : text === "ordered"
            ? "bg-amber-500"
            : "bg-red-500";
        return (
          <p className={` px-3 py-1 ${color} w-fit text-white rounded`}>
            {text}
          </p>
        );
      },
    },
    {
      title: "model",
      dataIndex: "model",
      key: "model",
      sorter: (a, b) => a.model.localeCompare(b.model),
    },

    {
      title: "",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <BsDownload
            className=" text-lg"
            onClick={() => downloadReport(record)}
          />
        );
      },
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
              <span className="relative flex gap-2">
                {editable ? (
                  <>
                    <FaSave
                      className=" text-xl"
                      onClick={() => save(record._id)}
                    />
                    <MdOutlineClose
                      className=" text-xl"
                      onClick={() => setEditRowKey("")}
                    />
                  </>
                ) : (
                  <PiDotsThreeVerticalBold
                    className=" text-lg"
                    onClick={() => handleActions(record._id)}
                  />
                )}
                {selectedRow === record._id && (
                  <motion.ul
                    animate={
                      showActions
                        ? { opacity: 1, x: -10, display: "block" }
                        : { opacity: 0, x: 0, display: "none" }
                    }
                    className={` border bg-white z-20 shadow-md rounded absolute -left-[200px] w-[200px] space-y-2`}
                  >
                    <li
                      className="flex gap-4 p-2 items-center hover:bg-slate-100"
                      onClick={() => {
                        navigate(`/buyer/details/${record._id}`);
                      }}
                    >
                      <RiFileListFill className=" text-lg" />
                      <p>more details</p>
                    </li>
                    <li
                      className="flex gap-4 p-2 items-center hover:bg-slate-100"
                      onClick={() => {
                        edit(record), SetShowActions(!showActions);
                      }}
                    >
                      <BiSolidEditAlt className=" text-lg" />
                      <p>edit</p>
                    </li>
                    <li
                      className="flex gap-4 p-2 items-center hover:bg-slate-100"
                      onClick={() => {
                        navigate(`/shipment/complete`)
                      }}
                    >
                      <RiFileEditFill className=" text-lg" />
                      <p>complete entry</p>
                    </li>
                    <li
                      className="flex gap-4 p-2 items-center hover:bg-slate-100"
                      onClick={() => {
                        edit(record);
                      }}
                    >
                      <MdDelete className=" text-lg" />
                      <p>delete</p>
                    </li>
                  </motion.ul>
                )}
              </span>

              {/* <span>
                <MdDelete
                  className=" text-lg"
                  onClick={() => {
                    SetSelectedRow({
                      ...selectedRow,
                      id: record.id,
                      name: record.companyName,
                      date: record.supplyDate,
                    });
                    setShowmodal(!showmodal);
                  }}
                />
              </span> */}
            </div>
          </>
        );
      },
    },
  ];

  const handleSelect = (e) => {
    console.log(e.target.value);
    navigate(`/shipment/add/${e.target.value}`);
  };

  const isEditing = (record) => {
    return record._id === editRowKey;
  };

  const edit = (record) => {
    form.setFieldsValue({
      totalShipmentQuantity: record.totalShipmentQuantity,
      // companyRepresentative: record.companyRepresentative,
      // index: record.index,
      // weight: record.weight,
      ...record,
    });
    setEditRowKey(record._id);
  };

  const save = async (key) => {
    const shipmentId= key;
    const row = await form.validateFields();
    const newData = [...dataz];
    const index = newData.findIndex((item) => key === item._id);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...row });
      SetDataz(newData);
      setEditRowKey("");
      const info={ ...item, ...row, totalShipmentQuantity: parseFloat(row.totalShipmentQuantity), }
      console.log("Shipment Info After Update:", {
        info
      });
    }
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

  return (
    <>
      <ListModalContainerHeader
        title={"Shipment list"}
        subTitle={"Manage your shipments"}
        open={() => SetMineralModal(!mineralModal)}
        navtext={"New shipment"}
        table={
          <>
            <div className=" w-full overflow-x-auto h-full min-h-[320px]">
              <div className="w-full flex flex-col  sm:flex-row justify-between items-center mb-4 gap-3">
                <span className="max-w-[220px] border rounded flex items-center p-1 justify-between gap-2">
                  <PiMagnifyingGlassDuotone className="h-4 w-4" />
                  <input
                    type="text"
                    className=" w-full focus:outline-none"
                    name="tableFilter"
                    id="tableFilter"
                    placeholder="Search..."
                    onChange={(e) => SetSearchText(e.target.value)}
                  />
                </span>

                <span className="flex w-fit justify-evenly items-center gap-6 pr-1">
                  <BiSolidFilePdf className=" text-2xl" />
                  <BsCardList className=" text-2xl" />
                  <HiOutlinePrinter className=" text-2xl" />
                </span>
              </div>
              <Form form={form} component={false}>
                <Table
                  className=" w-full"
                  loading={isLoading}
                  dataSource={dataz}
                  columns={mergedColumns}
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
              open={showmodal}
              onOk={() => handleDelete(selectedRow)}
              onCancel={() => {
                setShowmodal(!showmodal);
                SetSelectedRow({ id: null, name: "", date: "" });
              }}
              destroyOnClose
              footer={[
                <span
                  key="actions"
                  className=" flex w-full justify-center gap-4 text-base text-white"
                >
                  {isDeleting ? (
                    <Spin className="bg-green-400 p-2 rounded-lg" />
                  ) : (
                    <button
                      key="back"
                      className=" bg-green-400 p-2 rounded-lg"
                      onClick={handleDelete}
                    >
                      Confirm
                    </button>
                  )}
                  <button
                    key="submit"
                    className=" bg-red-400 p-2 rounded-lg"
                    type="primary"
                    onClick={() => {
                      setShowmodal(!showmodal);
                      SetSelectedRow({ id: null, name: "", date: "" });
                    }}
                  >
                    Cancel
                  </button>
                </span>,
              ]}
            >
              <h2 className="modal-title text-center font-bold text-xl">
                Confirm Delete
              </h2>
              <p className=" text-lg">
                Are you sure you want to delete transaction with:
              </p>
              <li className=" text-lg">{`company name: ${selectedRow.name}`}</li>
              <li className=" text-lg">{`Supply date: ${dayjs(
                selectedRow.date
              ).format("MMM/DD/YYYY")}`}</li>
            </Modal>
            {/* select mineral type modal */}
            <Modal
              open={mineralModal}
              onOk={""}
              onCancel={() => {
                SetMineralModal(!mineralModal);
              }}
              destroyOnClose
              style={{ minHeight: "100%" }}
              footer={
                [
                  // <span
                  //   key="actions"
                  //   className=" flex w-full justify-center gap-4 text-base text-white"
                  // >
                  //   {isDeleting ? (
                  //     <Spin className="bg-green-400 p-2 rounded-lg" />
                  //   ) : (
                  //     <button
                  //       key="back"
                  //       className=" bg-green-400 p-2 rounded-lg"
                  //       onClick={handleDelete}
                  //     >
                  //       Confirm
                  //     </button>
                  //   )}
                  //   <button
                  //     key="submit"
                  //     className=" bg-red-400 p-2 rounded-lg"
                  //     type="primary"
                  //     onClick={() => {
                  //       setShowmodal(!showmodal);
                  //       SetSelectedRow({ id: null, name: "", date: "" });
                  //     }}
                  //   >
                  //     Cancel
                  //   </button>
                  // </span>,
                ]
              }
            >
              <div className="w-full p-2 text-center space-y-2 h-[280px]">
                <p className=" text-xl font-semibold">Select mineral type</p>

                <select
                  name="mineralType"
                  id="mineralType"
                  autoComplete="off"
                  className="focus:outline-none p-2 border rounded-md w-full"
                  defaultValue="mintype"
                  onChange={handleSelect}
                >
                  <option value="mintype" hidden>
                    Select a mineral type
                  </option>
                  <option value="coltan">Coltan</option>
                  <option value="cassiterite">Cassiterite</option>
                  <option value="beryllium">Beryllium</option>
                  <option value="lithium">Lithium</option>
                  <option value="wolframite">Wolframite</option>
                </select>
              </div>
            </Modal>
          </>
        }
      />
    </>
  );
};
export default ShipmentPage;