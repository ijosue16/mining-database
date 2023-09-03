import React, { useState,useEffect, useMemo } from 'react';
import { Table, Checkbox, Input, Form } from 'antd';
import { BiSolidEditAlt } from "react-icons/bi"
import { FaSave } from "react-icons/fa"
import { MdOutlineClose } from "react-icons/md"
import { useMyContext } from '../context files/LoginDatacontextProvider';

const YourComponent = () => {
  const {loginData,updateLoginData}=useMyContext();
  const initialData = [
    { supplierName: 'COPEMINYA', companyRepresentative: 'Joseph M.', district:"KIREHE", TINNumber: 2231, weight:850, grade:23,supplyDate:"12/04/2023",lots:[{weight:400,paidStatus:'paid'},{weight:450,paidStatus:'paid'}],payDate:"14/04/2023",ascTags:2 },
    { supplierName: 'ABC GEMS', companyRepresentative: 'Ernest K.', district:"GICUMBI", TINNumber: 1001, weight:650, grade:19,supplyDate:"22/05/2023",lots:[{weight:500,paidStatus:'paid'},{weight:150,paidStatus:'paid'}],payDate:"25/05/2023",ascTags:2 },
    { supplierName: 'DEMIKARU', companyRepresentative: 'Laurent B.', district:"KARONGI", TINNumber: 8964, weight:500, grade:25,supplyDate:"07/06/2023",lots:[{weight:250,paidStatus:'paid'},{weight:250,paidStatus:'paid'}],payDate:"10/07/2023",ascTags:2 },
  ];
  const [totalWeight,setTotalWeight]=useState(null);
  const [avg,setAvg]=useState(null);

  const [sourceData, setSourceData] = useState(initialData);
  const [selectedData, setSelectedData] = useState([]);
  const [editRowKey, setEditRowKey] = useState("");
  const [form] = Form.useForm()

  useEffect(() => {
    const newTotalWeight = selectedData.reduce((total, item) => total + item.weight, 0);
    setTotalWeight(newTotalWeight);

    const averageGrade = () => {
      if (selectedData.length === 0) {
        return 0; 
      }
      const totalGrade = selectedData.reduce((total, item) => total + item.grade, 0);
      return (totalGrade / selectedData.length).toFixed(3);
    } ;
    setAvg(averageGrade);

  }, [selectedData]);


  const isEditing = (record) => {
    return record.TINNumber === editRowKey;
  }
  const edit = (record) => {
    form.setFieldsValue({
      supplierName: record.supplierName,
      companyRepresentative: record.companyRepresentative,
      TINNumber: record.TINNumber,
      weight: record.weight,
      ...record
    });
    setEditRowKey(record.TINNumber);
  };
  const save = async (key) => {
    const row = await form.validateFields();
    const newData = [...selectedData];
    const index = newData.findIndex((item) => key === item.TINNumber);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, ...row, weight: parseFloat(row.weight) });
      setSelectedData(newData);
      const newTotalWeight = newData.reduce((total, item) => total + item.weight, 0);
      const averageGrade = () => {
        if (selectedData.length === 0) {
          return 0; 
        }
        const totalGrade = selectedData.reduce((total, item) => total + item.grade, 0);
        return (totalGrade / selectedData.length).toFixed(3);
      };
      setTotalWeight(newTotalWeight);
      setAvg(averageGrade);
      setEditRowKey("");
    }
  };



  const columns = [
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      key: 'supplierName',
      editTable: true,
    },
    {
      title: 'Representative',
      dataIndex: 'companyRepresentative',
      key: 'companyRepresentative',
      editTable: true,
    },
    { title: 'TIN Number',
     dataIndex: 'TINNumber',
      key: 'TINNumber',
      editTable: true,
    },
    { title: 'weight',
     dataIndex: 'weight',
      key: 'weight',
      editTable: true,
     
    },
    { title: 'grade',
     dataIndex: 'grade',
      key: 'grade',
  
    },
    {
      title: 'Select',
      key: 'select',
      render: (_, record) => (
        <Checkbox
          checked={selectedData.length > 0 && selectedData.some((selected) => selected.TINNumber === record.TINNumber)}
          onChange={() => handleRowToggle(record)}

        />

      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_, record) => {
        const editable = isEditing(record);
        return (
          <>
            <div className="flex items-center gap-1">

              {editable ? (
                <div className="flex items-center gap-3">
                  <FaSave className=" text-xl" onClick={() => save(record.TINNumber)} />
                  <MdOutlineClose className=" text-xl" onClick={() => setEditRowKey("")} />

                </div>

              ) : (

                <BiSolidEditAlt className=" text-xl" onClick={() => edit(record)} />

              )}




            </div>


          </>
        )
      }
    },
  ];
  const columns2 = [
    {
      title: 'supplyDate',
      dataIndex: 'supplyDate',
      key: 'supplyDate',
     
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      key: 'supplierName',
      editTable: true,
    },
    {
      title: 'Representative',
      dataIndex: 'companyRepresentative',
      key: 'companyRepresentative',
      editTable: true,
    },
    { title: 'TIN Number',
     dataIndex: 'TINNumber',
      key: 'TINNumber',
      editTable: true,
    },
    { title: 'weight',
    dataIndex: 'weight',
     key: 'weight',
    
   },
   { title: 'grade',
    dataIndex: 'grade',
     key: 'grade',
 
   },
    {
      title: 'Select',
      key: 'select',
      render: (_, record) => (
        <Checkbox
          checked={selectedData.length > 0 && selectedData.some((selected) => selected.TINNumber === record.TINNumber)}
          onChange={() => handleRowToggle(record)}

        />

      ),
    },
    
    // {
    //   title: 'Action',
    //   dataIndex: 'action',
    //   key: 'action',
    //   render: (_, record) => {
    //     const editable = isEditing(record);
    //     return (
    //       <>
    //         <div className="flex items-center gap-1">
             
    //           {editable ? (
    //             <div className="flex items-center gap-3">
    //               <FaSave className=" text-xl" onClick={() => save(record.TINNumber)} />
    //               <MdOutlineClose className=" text-xl" onClick={() => setEditRowKey("")} />

    //             </div>

    //           ) : (

    //             <BiSolidEditAlt className=" text-xl" onClick={() => edit(record)} />

    //           )}




    //         </div>


    //       </>
    //     )
    //   }
    // },
  ];

  const subcolumnsLots = [
    {
      title: 'weight',
      dataIndex: 'weight',
      key: 'weight',
     
    },
    { title: 'paidStatus',
     dataIndex: 'paidStatus',
      key: 'paidStatus',
      render: (_,record) => (
        <p className=' bg-green-500 py-2 px-4 rounded-md text-white'>{record.paidStatus}</p>
        )
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

    }

  });


  const EditableCell = ({ editing, dataIndex, title, record, children, ...restProps }) => {
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
  }

  const handleRowToggle = (record) => {
    if (selectedData.some((selected) => selected.TINNumber === record.TINNumber)) {
      setSelectedData((prevSelectedData) =>
        prevSelectedData.filter((selected) => selected.TINNumber !== record.TINNumber)
      );
    } else {
      setSelectedData((prevSelectedData) => [...prevSelectedData, record]);
    }
  };

  return (
    <>
     <div className=' bg-red-500 w-14 h-11 fixed top-20 overflow-y-hidden'></div>
    <div className='w-full text-start'>

     
<div className=' space-y-4'>
<p className=' overflow-y-auto max-h-[80vh]'>
os, in perfercabo modi harum suscipit commodi obcaecati quae beatae? Minima explicabo magni voluptate molestiae quisquam. Dolores, nulla perspiciatis inventore accusantium magnam illo quidem officia, ex sed natus modi libero suscipit sunt unde amet pariatur obcaecati quaerat, aspernatur provident magni laborum officiis cumque repudiandae voluptas. Magni fugit nihil ab saepe dignissimos quasi eius ipsa omnis praesentium iste,</p>

<p className=' text-lg text-red-800 text-bold'>{loginData.accessibility}</p>
</div>
<div className='w-full p-11 bg-gray-900'></div>
    </div>
    </>
  );
};

export default YourComponent;
