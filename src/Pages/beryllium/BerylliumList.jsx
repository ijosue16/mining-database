import React, { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import {DatePicker, message, Modal, Space, Spin, Table} from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../../context files/LoginDatacontextProvider";
import ListContainer from "../../components/Listcomponents/ListContainer";
import {
  useGetAllBerylliumEntriesQuery,
  useDeleteBerylliumEntryMutation,
} from "../../states/apislice";
import {
  PiMagnifyingGlassDuotone,
  PiDotsThreeVerticalBold,
} from "react-icons/pi";
import { BiSolidFilePdf, BiSolidEditAlt } from "react-icons/bi";
import { ImSpinner2 } from "react-icons/im";
import { BsCardList } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { RiFileEditFill } from "react-icons/ri";
import { HiOutlinePrinter } from "react-icons/hi";
import {useSelector} from "react-redux";
import isBetween from "dayjs/plugin/isBetween"
import BerylliumEntryCompletePage from "./entry/BerylliumEntryCompletePage";
import {FaFileInvoiceDollar} from "react-icons/fa";
import DeleteFooter from "../../components/modalsfooters/DeleteFooter";
dayjs.extend(isBetween);

const BerylliumListPage = () => {
  // const { loginData } = useMyContext();
  // const{profile,permissions}=loginData;
  const { permissions } = useSelector(state => state.persistedReducer.global);
  const { data, isLoading, isSuccess, isError, error } =
  useGetAllBerylliumEntriesQuery("", {
    refetchOnMountOrArgChange: true,
    refetchOnReconnect: true
  });
  const [dataz, setDataz] = useState([]);
  const [
    deleteBeryllium,
    { isLoading: isDeleting, isSuccess: isdone, isError: isproblem },
  ] = useDeleteBerylliumEntryMutation();

  const navigate = useNavigate();
  const [searchText, SetSearchText] = useState("");
  const [showActions, SetShowActions] = useState(false);
  const [selectedRowInfo, SetSelectedRowInfo] = useState({
    name: "",
    date: "",
  });
  const [selectedRow, SetSelectedRow] = useState("");
  const [model, Setmodel] = useState(null);
  const [showmodal, setShowmodal] = useState(false);

  let modalRef = useRef();

  const { RangePicker } = DatePicker;

  const handleClickOutside = (event) => {
    if (!modalRef.current || !modalRef.current.contains(event.target)) {
      SetShowActions(false);
    }
  };


  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      const { data: dt } = data;
      const { entries: entrz } = dt;
      setDataz(entrz);
    }
  }, [isSuccess]);


  const handleActions = (id) => {
    if (selectedRow === id) {
      SetShowActions(false);
      SetSelectedRow("");
    } else {
      SetSelectedRow(id);
      SetShowActions(true);
    }
  };

  const handleDelete = async () => {
    const entryId = selectedRow;
    await deleteBeryllium({ entryId });
    SetSelectedRow("");
    setShowmodal(!showmodal);
  };

  const columns = [
    {
      title: "Supply date",
      dataIndex: "supplyDate",
      key: "supplyDate",
      sorter: (a, b) => a.supplyDate.localeCompare(b.supplyDate),
      render: (text) => (
          <p>{dayjs(text).format("MMM DD, YYYY")}</p>
      ),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
          <div style={{ padding: 8 }}>
            <Space>
              <RangePicker
                  value={selectedKeys}
                  onChange={(dates) => setSelectedKeys(dates)}
              />
              <button
                  className="px-6 py-1 bg-orange-300 rounded-md"
                  type= "button"
                  onClick={() => {
                    if (isSuccess && selectedKeys.length > 0) {
                      const {data: dt} = data;
                      const {entries: entrz} = dt;
                      if (entrz) {
                        setDataz(entrz);
                      }
                      const startDate = selectedKeys[0] || dayjs();
                      const endDate = selectedKeys[1] || dayjs();
                      const sortedData = entrz.filter(dt => dayjs(dt.supplyDate).isBetween(startDate, endDate, null, '[]'))
                      setDataz(sortedData);
                    }
                    confirm();
                  }}
              >
                OK
              </button>
              <button
                  className="px-6 py-1 bg-red-300 rounded-md"
                  type= "button"
                  onClick={() => {
                    if (isSuccess) {
                      const {data: dt} = data;
                      const {entries: entrz} = dt;
                      if (entrz) {
                        setDataz(entrz);
                      }
                    }
                    clearFilters()
                  }}>
                Reset
              </button>
            </Space>
          </div>
      ),
      onFilter: (value, record) => {
        const startDate = value[0];
        const endDate = value[1];
        return dayjs(record.supplyDate).isBetween(startDate, endDate, null, '[]');
      },
      filterIcon: (filtered) => (
          <span>{filtered ? '📅' : '📅'}</span>
      ),
    },
    {
      title: "Supplier",
      dataIndex: "supplierName",
      key: "supplierName",
      sorter: (a, b) => a.supplier.localeCompare(b.supplier),
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.supplier)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.beneficiary)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.mineralType)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.weightIn).toLowerCase().includes(value.toLowerCase()) ||
          String(dayjs(record.supplyDate).format("MMM DD, YYYY"))
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
    },
    {
      title: "Phone number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
    },
    {
      title: "Weight in",
      dataIndex: "weightIn",
      key: "weightIn",
      sorter: (a, b) => a.weightIn - b.weightIn,
    },

    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <>
            <div className="flex items-center gap-4">
              <span>
                <span className="relative">
                  <PiDotsThreeVerticalBold
                    className="text-lg"
                    onClick={() => handleActions(record._id)}
                  />
                  {selectedRow === record._id ? (
                    <motion.ul
                      ref={modalRef}
                      animate={
                        showActions
                          ? { opacity: 1, x: -10, y: 1, display: "block" }
                          : { opacity: 0, x: 0, y: 0, display: "none" }
                      }
                      className={` border bg-white z-20 shadow-md rounded absolute -left-[200px] w-[200px] space-y-2`}
                    >
                      <li
                        className="flex gap-4 p-2 items-center hover:bg-slate-100"
                        onClick={() => {
                          navigate(`/entry/edit/beryllium/${record._id}`);
                        }}
                      >
                        <BiSolidEditAlt className=" text-lg" />
                        <p>edit</p>
                      </li>
                      {/* TODO 13: SHOW MENU BASED ON PERMISSIONS*/}

                      <li
                          className="flex gap-2 p-2 items-center hover:bg-slate-100"
                          onClick={() => {
                            if (record.supplierId) {
                              navigate(`/add/invoice/${record.supplierId}/beryllium/${record._id}`);
                            } else {
                              return message.warning("You have assign supplier to this entry");
                            }
                          }}
                      >
                        <FaFileInvoiceDollar className=" text-xl" />
                        <p>Make invoice</p>
                      </li>

                      {permissions.entry?.edit ? (
                        <>
                          {/*<li*/}
                          {/*  className="flex gap-4 p-2 items-center hover:bg-slate-100"*/}
                          {/*  onClick={() => {*/}
                          {/*    {*/}
                          {/*      navigate(`/complete/beryllium/${record._id}`);*/}
                          {/*    }*/}
                          {/*  }}*/}
                          {/*>*/}
                          {/*  <RiFileEditFill className=" text-lg" />*/}
                          {/*  <p>complete entry</p>*/}
                          {/*</li>*/}
                          <li
                            className="flex gap-4 p-2 items-center hover:bg-slate-100"
                            onClick={() => {
                              SetSelectedRow(record._id);
                              SetSelectedRowInfo({
                                ...selectedRowInfo,
                                name: record.companyName,
                                date: record.supplyDate,
                              });
                              setShowmodal(!showmodal);
                            }}
                          >
                            <MdDelete className=" text-lg" />
                            <p>delete</p>
                          </li>
                        </>
                      ) : null}
                    </motion.ul>
                  ) : null}
                </span>
              </span>

              {permissions.entry?.delete ? (
                <span>
                  <MdDelete
                    className="text-lg"
                    onClick={() => {
                      SetSelectedRow(record._id);
                      SetSelectedRowInfo({
                        ...selectedRowInfo,
                        name: record.companyName,
                        date: record.supplyDate,
                      });
                      setShowmodal(!showmodal);
                    }}
                  />
                </span>
              ) : null}
            </div>
          </>
        );
      },
    },
  ];

  return (
    <>
      <ListContainer
        title={"Beryllium entries list"}
        subTitle={"Manage your beryllium  entries"}
        navLinktext={"entry/add/beryllium"}
        navtext={"Add new Entry"}
        isAllowed={permissions.entry?.create}
        table={
          <>
            <Modal
              open={showmodal}
              onOk={() => handleDelete()}
              onCancel={() => {
                setShowmodal(!showmodal);
                SetSelectedRow("");
              }}
              destroyOnClose
              footer={[
                <DeleteFooter key={"actions"} isDeleting={isDeleting} defText={"Delete"} dsText={"Deleting"} handleCancel={() => {
                  setShowmodal(!showmodal);
                  SetSelectedRow("");
                }} handleDelete={handleDelete}/>

              ]}
            >
              <h2 className="modal-title text-center font-bold text-xl">
                Confirm Delete
              </h2>
              <p className=" text-lg">
                Are you sure you want to delete transaction with:
              </p>
              <li className=" text-lg">{`company name: ${selectedRowInfo.name}`}</li>
              <li className=" text-lg">{`Supply date: ${dayjs(
                selectedRowInfo.date
              ).format("MMM/DD/YYYY")}`}</li>
            </Modal>
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
              <Table
                className=" w-full"
                loading={{
                  indicator: (
                    <ImSpinner2
                      style={{ width: "60px", height: "60px" }}
                      className="animate-spin text-gray-500"
                    />
                  ),
                  spinning: isLoading,
                }}
                dataSource={dataz}
                columns={columns}
                expandable={{
                  expandedRowRender: (record) => <BerylliumEntryCompletePage entryId={record._id}/>,
                  rowExpandable: (record) => record.supplierName !== "Not Expandable",
                }}
                rowKey="_id"
              />
            </div>
          </>
        }
      />
    </>
  );
};
export default BerylliumListPage;
