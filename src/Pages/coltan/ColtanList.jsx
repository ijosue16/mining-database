import React, { useState, useRef, useEffect,useMemo } from "react";
import dayjs from "dayjs";
import { Input, Modal, Spin, Table } from "antd";
import { motion } from "framer-motion";
import {
  PiMagnifyingGlassDuotone,
  PiDotsThreeVerticalBold,
} from "react-icons/pi";
import { BiSolidFilePdf, BiSolidEditAlt } from "react-icons/bi";
import { BsCardList } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import { RiFileEditFill, RiFileListFill } from "react-icons/ri";
import { HiOutlinePrinter } from "react-icons/hi";
import ListContainer from "../../components/Listcomponents/ListContainer";
import {
  useGetAllColtanEntriesQuery,
  useDeleteColtanEntryMutation,
} from "../../states/apislice";
import { useNavigate } from "react-router-dom";

const ColtanListPage = () => {
  let dataz = [];
  const { data, isLoading, isSuccess, isError, error } =
    useGetAllColtanEntriesQuery();
  const [
    deleteColtan,
    { isLoading: isDeleting, isSuccess: isdone, isError: isproblem },
  ] = useDeleteColtanEntryMutation();

  const navigate = useNavigate();
  const [searchText, SetSearchText] = useState("");
  const [showActions, SetShowActions] = useState(false);
  const [selectedRowInfo, SetSelectedRowInfo]=useState({ name:"",date:""});
  const [selectedRow, SetSelectedRow] = useState("");
  const [model, Setmodel] = useState(null);
  const [showmodal, setShowmodal] = useState(false);
  
//   let useClickOutside = (handler) => {
//     let domNode = useRef();
  
//     useEffect(() => {
//       let actionsContainerHandler = (event) => {
//         if (!domNode.current.contains(event.target)) {
//           handler();
//         }
//         else if(domNode.current.contains(event.target)){
//             console.log("uri ikibwa");
//             // handler();
//         }
//       };
  
//       document.addEventListener("mousedown", actionsContainerHandler);
  
//       return () => {
//         document.removeEventListener("mousedown", actionsContainerHandler);
//       };
//     });
  
//     return domNode;
//   };
let modalRef = useRef();
  // const handleClickOutside = useMemo(
  //   () => (event) => {
  //     if (!modalRef.current.contains(event.target)) {
  //       SetShowActions(false);
  //     }
  //   },
  //   [SetShowActions]
  // );

  // useEffect(() => {
  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, [handleClickOutside]);

  if (isSuccess) {
    const { data: dt } = data;
    const { entries: entrz } = dt;
    console.log(entrz);
    dataz = entrz;
  };

  const handleActions = (id) => {
    if(selectedRow === id){
        console.log("uri muduki sha");
        SetShowActions(!showActions);
    }else{
        SetShowActions(true);
        
    }
    SetSelectedRow(id);
    console.log("Clicked ID:", id);
  };  
  
  const handleDelete = async () => {
    const entryId = selectedRow;
    await deleteColtan({ entryId });
    SetSelectedRow("");
    setShowmodal(!showmodal);
  };
//   let domNode = useClickOutside(() => {
//     SetShowActions(false);
//   });

  const columns = [
    {
      title: "Supply date",
      dataIndex: "supplyDate",
      key: "supplyDate",
      sorter: (a, b) => a.supplyDate.localeCompare(b.supplyDate),
      render: (text) => {
        return (
          <>
            <p>{dayjs(text).format("MMM DD, YYYY")}</p>
          </>
        );
      },
    },
    {
      title: "Company name",
      dataIndex: "companyName",
      key: "companyName",
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
    },
    {
      title: "Beneficiary",
      dataIndex: "beneficiary",
      key: "beneficiary",
      sorter: (a, b) => a.beneficiary.localeCompare(b.beneficiary),
    },
    // {
    //     title: 'TINNumber',
    //     dataIndex: 'TINNumber',
    //     key: 'TINNumber',
    //     sorter: (a, b) => a.TINNumber.localeCompare(b.TINNumber),
    // },
    {
      title: "Mineral type",
      dataIndex: "mineralType",
      key: "mineralType",
      sorter: (a, b) => a.mineralType.localeCompare(b.mineralType),
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
                <span ref={modalRef} >
              <span className="relative" >
                <PiDotsThreeVerticalBold 
                  onClick={() => handleActions(record._id)}
                />
                {selectedRow === record._id ?
                  <motion.ul
                    animate={
                      showActions
                        ? { opacity: 1, x: -10, y:1, display: "block" }
                        : { opacity: 0, x: 0, y:0, display: "none" }
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
                      onClick={() => {navigate(`/edit/coltan/${record._id}`);
                      }}
                    >
                      <BiSolidEditAlt className=" text-lg" />
                      <p>edit</p>
                    </li>
                    <li
                      className="flex gap-4 p-2 items-center hover:bg-slate-100"
                      onClick={() => {
                        {
                          navigate(`/complete/coltan/${record._id}`);
                        }
                      }}
                    >
                      <RiFileEditFill className=" text-lg" />
                      <p>complete entry</p>
                    </li>
                    <li
                      className="flex gap-4 p-2 items-center hover:bg-slate-100"
                      onClick={() => {
                        console.log("Action 4 :", record._id);
                        SetShowActions(!showActions);
                      }}
                    >
                      <MdDelete className=" text-lg" />
                      <p>delete</p>
                    </li>
                  </motion.ul>:null
                }
              </span>
              </span>

              <span>
                <MdDelete
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
            </div>
          </>
        );
      },
    },
  ];

  return (
    <>
      <ListContainer
        title={"Coltan entries list"}
        subTitle={"Manage your coltan  entries"}
        navLinktext={"entry/add/coltan"}
        navtext={"Add new Entry"}
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
                loading={isLoading}
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
export default ColtanListPage;
