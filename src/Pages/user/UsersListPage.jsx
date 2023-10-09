import React, { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import { Modal, Spin, Table } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../../context files/LoginDatacontextProvider";
import ListContainer from "../../components/Listcomponents/ListContainer";
import { useGetAllUsersQuery, useDeleteUserMutation } from "../../states/apislice";
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
import { toast } from "react-toastify";

const UsersListPage = () => {
  let dataz = [];
  const { loginData } = useMyContext();
  const { data, isLoading, isSuccess, isError, error } = useGetAllUsersQuery();
  const [
    deleteUser,
    { isLoading: isDeleting, isSuccess: isdone, isError: isproblem,error:problem },
  ] = useDeleteUserMutation();

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
  console.log(loginData);

  let modalRef = useRef();

  const handleClickOutside = (event) => {
    if (!modalRef.current || !modalRef.current.contains(event.target)) {
      SetShowActions(false);
    }
  };

  useEffect(() => {
    if (isdone) {
      toast.success("User deleted successfully");
    } else if (isproblem) {
      const { message } = problem.data;
      toast.error(message);
    }
  }, [isdone, isproblem, problem]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  if (isSuccess) {
    const { data: dt } = data;
    const { users:userz } = dt;
    console.log(userz);
    dataz = userz;
  }

  const handleActions = (id) => {
    if (selectedRow === id) {
      console.log("uri muduki sha");
      SetShowActions(false);
      SetSelectedRow("");
    } else {
      SetSelectedRow(id);
      SetShowActions(true);
      console.log("Clicked ID:", id);
    }
  };

  const handleDelete = async () => {
    const userId = selectedRow;
    await deleteUser( userId );
    SetSelectedRow("");
    setShowmodal(!showmodal);
  };

  const columns = [
    {
      title: "name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      
    },
    {
      title: "role",
      dataIndex: "role",
      key: "role",
      sorter: (a, b) => a.role.localeCompare(b.role),
      filteredValue: [searchText],
      onFilter: (value, record) => {
        return (
          String(record.name)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.role)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.email)
            .toLowerCase()
            .includes(value.toLowerCase()) ||
          String(record.phoneNumber).toLowerCase().includes(value.toLowerCase()) ||
          String(dayjs(record.supplyDate).format("MMM DD, YYYY"))
            .toLowerCase()
            .includes(value.toLowerCase())
        );
      },
    },
    {
      title: "email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: "phoneNumber",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      sorter: (a, b) => a.phoneNumber.localeCompare(b.phoneNumber),
    },
    {
      title: "active",
      dataIndex: "active",
      key: "active",
      sorter: (a, b) => a.active.localeCompare(b.active),
      render:(_,record)=>{
            return (
              <div className=" text-center">
                <label htmlFor={`check${record._id }`} className={`bg-gray-100 px-1 py-1 rounded-full flex flex-col justify-center w-12 ${record.active===true?'items-end':'items-start'}`}>
                <input type="checkbox" name="" id={`check${record._id }`} className=" sr-only peer" />
                <div className={`rounded-full p-[7.8px]  ${record.active===true?'bg-orange-400':' bg-slate-400'}`}></div>
                </label>
              {/* <div className={`bg-gray-100 px-1 py-1 rounded-full flex flex-col justify-center w-12 ${ghee===true?'items-end':'items-start'}`} onClick={()=>record.active=false}>
              <div className={`rounded-full p-[7.8px]  ${ghee===true?'bg-orange-400':' bg-slate-400'}`}></div>
              </div>
              
              */}
              </div>
            )
        
      }
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
                          navigate(`/user/edit/${record._id}`);
                        }}
                      >
                        <BiSolidEditAlt className=" text-lg" />
                        <p>edit</p>
                      </li>
                      {loginData !== "storekeeper" &&
                      "traceabilityOfficer" &&
                      "managingDirector" &&
                      "operationsManager " ? (
                        <>
                          {/* <li
                            className="flex gap-4 p-2 items-center hover:bg-slate-100"
                            onClick={() => {
                              {
                                navigate(`/complete/cassiterite/${record._id}`);
                              }
                            }}
                          >
                            <RiFileEditFill className=" text-lg" />
                            <p>complete entry</p>
                          </li> */}
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

              {loginData !== "storekeeper" &&
              "traceabilityOfficer" &&
              "managingDirector" &&
              "operationsManager " ? (
                <span>
                  <MdDelete
                    className="text-lg"
                    onClick={() => {
                      SetSelectedRow(record._id);
                      SetSelectedRowInfo({
                        ...selectedRowInfo,
                        name: record.name,
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
        title={"Users list"}
        subTitle={"Manage your users"}
        navLinktext={"add/user"}
        navtext={"Add new User"}
        isAllowed={true}
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
                <span
                  key="actions"
                  className=" flex w-full justify-center gap-4 text-base text-white"
                >
                  {isDeleting ? (
                    <button
                      key="back"
                      className=" bg-green-200 flex items-center gap-1 p-2 text-gray-500 rounded-lg"
                    >
                      <ImSpinner2 className="h-[20px] w-[20px] animate-spin text-gray-500" />
                      Deleting
                    </button>
                  ) : (
                    <button
                      key="back"
                      className=" bg-green-400 p-2 rounded-lg"
                      onClick={handleDelete}
                    >
                      Delete
                    </button>
                  )}
                  <button
                    key="submit"
                    className=" bg-red-400 p-2 rounded-lg"
                    type="primary"
                    onClick={() => {
                      setShowmodal(!showmodal);
                      SetSelectedRow("");
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
                rowKey="_id"
              />
            </div>
          </>
        }
      />
    </>
  );
};
export default UsersListPage;