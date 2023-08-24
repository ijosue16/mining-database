import React, { useState,useEffect, useMemo } from 'react';
import { Table, Checkbox, Input, Form } from 'antd';
import { BiSolidEditAlt } from "react-icons/bi"
import { FaSave } from "react-icons/fa"
import { MdOutlineClose } from "react-icons/md"

const YourComponent = () => {
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

     
<div>
<p className=' overflow-y-auto max-h-[80vh]'>
os, in perfercabo modi harum suscipit commodi obcaecati quae beatae? Minima explicabo magni voluptate molestiae quisquam. Dolores, nulla perspiciatis inventore accusantium magnam illo quidem officia, ex sed natus modi libero suscipit sunt unde amet pariatur obcaecati quaerat, aspernatur provident magni laborum officiis cumque repudiandae voluptas. Magni fugit nihil ab saepe dignissimos quasi eius ipsa omnis praesentium iste, aliquid maiores. Laudantium, vitae quia iste natus ratione fugiat quisquam dolorum voluptatibus error cum enim cupiditate placeat, impedit labore harum animi asperiores magni eos officiis eveniet! Fugiat facilis non eius ex nam suscipit! Atque fugiat, nemo nam nihil ab, officia voluptatem officiis nisi ipsa iure hic consequatur qui dolorem. Dignissimos neque eos aliquam iure quasi in porro sequi fugit culpa ipsa. Veniam eaque aspernatur vel, hic dolorum dolorem itaque? Quis expedita mollitia doloremque odit provident sequi quos id neque nam velit facilis animi, quasi similique? Velit corporis deleniti iusto exercitationem dignissimos, quos beatae ipsa inventore explicabo distinctio pariatur sed, suscipit doloribus repudiandae. Porro, consequuntur. Laboriosam recusandae numquam, ad molestias dolorum ut sequi quasi omnis. Ipsam, illo provident expedita velit dolores aut quidem nisi tempore distinctio nihil eius, laboriosam neque voluptates suscipit tenetur fuga ullam modi dolore! Nobis alias in non incidunt veritatis temporibus quod voluptate ullam ab ex error officia magnam magni facilis sapiente officiis quaerat tenetur laboriosam, totam, accusamus fugiat facere! Iste quas doloribus earum doloremque dolores excepturi aliquam nostrum, fugit qui optio vel amet eaque incidunt error perspiciatis pariatur distinctio maxime corporis officia non ipsa dolorum veritatis sed harum! Autem aliquid, vero, illo fuga nam accusamus veritatis neque exercitationem reiciendis qui libero sit ducimus vitae repudiandae ut omnis voluptatum a sapiente ipsa. Similique repellendus impedit eum facilis recusandae officia. Debitis dolorem vitae mollitia ullam laudantium quidem sapiente animi. Commodi earum odit iure eveniet velit voluptatibus ratione similique quod, culpa ut in consectetur dolore impedit, facere provident consequatur? Officiis facilis impedit ipsam architecto laborum totam velit cumque veniam, fugiat excepturi, provident blanditiis. Enim commodi perferendis quod blanditiis maiores, incidunt error quisquam facere, at laborum eaque autem obcaecati aliquid, minus molestiae vel provident et dolorum nihil vitae. Illo asperiores qui neque sunt temporibus, perspiciatis sed unde. Repellat consequuntur exercitationem qui placeat quas id voluptatibus fuga vel enim. Facilis quasi voluptate harum quo alias repudiandae distinctio odio sint, deleniti unde, cum aperiam consectetur nulla exercitationem, quos ea. Non quam temporibus omnis dolores, odit necessitatibus iure similique vitae voluptas ab fugit totam, ea possimus quos voluptatum aliquam obcaecati accusamus, nulla pariatur. Deserunt omnis reprehenderit eligendi ratione illum sit sunt distinctio ipsa animi libero. Repellat beatae optio accusamus doloremque unde, quibusdam et quas, dolores corporis veniam alias. Dolorem corrupti voluptates culpa quas numquam, vel magnam itaque possimus recusandae explicabo nostrum praesentium. Omnis voluptatum asperiores eaque dignissimos sit praesentium, id earum a ab molestias in perferendis voluptate quos tenetur nemo esse beatae cumque tempora eius? Atque veniam, impedit natus molestias dolor nisi aperiam nemo sapiente animi similique optio qui inventore porro totam. Id, facilis aut! Pariatur optio quia magnam voluptates eveniet voluptatibus deserunt molestias necessitatibus ut amet voluptate sapiente aperiam ab nemo est omnis ratione fugiat minus, illum reprehenderit, sit tempore eum! Eum, cumque tempore. Optio id quo, dolorem tempora, voluptate eius, cumque deleniti dolores asperiores maiores nam rerum voluptatibus quibusdam officiis corrupti aperiam ullam quas maxime. Architecto nihil eligendi voluptatum blanditiis, consequuntur laborum perspiciatis hic unde doloremque, eaque omnis repellendus voluptas nam ad tempora a fuga sunt nisi molestias maxime ab. Sequi, rerum perferendis beatae culpa assumenda quam deleniti ipsa asperiores earum? Distinctio odit voluptatem nostrum quae repudiandae, animi enim consectetur commodi vero, facilis qui asperiores doloremque tempore beatae adipisci possimus, architecto eveniet. Aliquam totam repudiandae saepe velit. Velit facere maxime quas magnam vitae, quis deserunt, deleniti odit, numquam omnis minima ex quaerat illum odio cupiditate. Obcaecati, officia sit! Ipsum esse nulla eos facilis repudiandae, odio officiis tempore neque error doloribus aperiam, at alias ullam soluta repellendus aspernatur provident enim, obcaecati reprehenderit earum iste cumque. Quaerat laborum iste nisi maiores suscipit repellat, aut ipsa eos. Amet nisi, quisquam tenetur dolores illum dignissimos! Necessitatibus animi, dolorem explicabo ad laborum inventore modi hic ullam nam autem enim itaque! Sint vitae eveniet nisi assumenda velit eos? Dolores mollitia quaerat vel quae possimus? Illo, eveniet! Cupiditate nisi mollitia labore quis iste dignissimos fuga quaerat consequuntur id reprehenderit cum error quidem doloribus enim aperiam, illo quasi praesentium ea voluptatum odio delectus minus. Similique nihil hic officia, porro sunt optio enim animi. Dolor architecto dolorum debitis, sint minus amet, rerum vitae aliquam eligendi ipsam non ab quaerat! Magni perferendis obcaecati nam saepe aut quaerat optio, labore quis incidunt, minus dolore blanditiis illum quibusdam deleniti fugiat ducimus neque. Maxime atque cum, dicta at commodi reprehenderit labore minus doloribus voluptate. Fugit reiciendis molestias iste reprehenderit accusamus aliquam rerum, mollitia earum error voluptate dolorum sint animi dignissimos. Exercitationem deleniti ducimus tempore laudantium eligendi. Illum facilis nesciunt facere dolorum itaque rerum. Sunt quos sit necessitatibus ut tempora ipsa quisquam cum, similique quidem iusto vero culpa aperiam odio ab, quod itaque quam quibusdam voluptatibus at? Porro laudantium delectus veniam fugit ducimus natus, nam eveniet minima voluptate culpa perspiciatis voluptatum et quidem exercitationem quod accusamus quis libero! Eius consequuntur ut optio illo blanditiis incidunt dolor ipsam repudiandae, consectetur dolore, nobis doloremque hic quam dolorum molestiae unde. Ab officiis praesentium odit, distinctio inventore eos necessitatibus aliquam placeat repudiandae ratione laborum saepe architecto, error suscipit ipsam doloremque quaerat dolorum, obcaecati rem recusandae cupiditate culpa! Fugiat accusamus nihil, exercitationem tenetur nulla quisquam. Dignissimos numquam ullam sunt, molestiae repellendus exercitationem voluptatibus distinctio nam fuga accusantium, ab quia dicta tenetur ea commodi quod similique molestias repudiandae cum illum dolores excepturi! Iure dicta ex rem ab sapiente fuga blanditiis quos at sequi, assumenda repellendus nobis a veritatis amet, natus eius maiores. Saepe asperiores culpa doloremque commodi cumque suscipit reprehenderit ipsa, laborum eveniet accusamus fugiat dignissimos consectetur magnam? Voluptates iste repellat ipsam similique tenetur nostrum assumenda commodi fuga porro omnis! Quidem, neque inventore pariatur doloribus a vero magnam, voluptas nihil quasi magni architecto similique. Ipsam minus debitis reiciendis corporis, fugit odit dolores blanditiis laborum accusantium saepe. Dignissimos error aperiam repudiandae nam iure sapiente dolor exercitationem reiciendis voluptatem illo, accusantium saepe amet qui aliquid porro laboriosam blanditiis velit laborum, vel, dolore eos. Impedit accusantium veniam nihil dolor alias? Amet in ex nobis doloribus quia, explicabo voluptatum ad illo quidem totam. Consequuntur voluptate odio cumque enim? Asperiores sit incidunt voluptas quia laudantium provident ullam, minima hic ratione sed et ducimus impedit aspernatur accusantium esse quaerat sint adipisci veniam nisi quod. Repellat totam, non suscipit neque culpa error rem ratione, consequuntur velit quia eius porro obcaecati ut ab libero aperiam esse et doloremque? Iusto, facilis. Exercitationem optio aliquam vel. Libero blanditiis possimus velit eveniet quaerat, eos rerum fuga accusamus error ipsum, veritatis architecto amet autem ratione distinctio quasi aliquam soluta aspernatur itaque consequatur, maxime ipsa beatae impedit asperiores. Aut dolor molestiae nihil possimus dolorem fuga, quasi ipsam rem facere fugit est hic exercitationem eveniet sapiente amet voluptatem! Natus, sequi, soluta impedit eveniet nostrum neque assumenda laudantium omnis explicabo fuga beatae molestias quasi obcaecati ut distinctio adipisci quod consequatur minus magnam perferendis veniam, porro minima maiores? Fugiat, sunt quasi ullam debitis non iste libero deleniti omnis at aliquid pariatur numquam accusamus quaerat? Fugiat natus minus similique aut quod odit harum voluptates dolorum ipsum commodi! Suscipit modi molestias sint dolorum veritatis! Optio reiciendis pariatur dignissimos corrupti cum, iquisquam consequuntur iusto facilis modi aut exercitationem, ducimusminima non architecto natus officia voluptate. Dicta minus ad aliquid voluptate nam libero molestias necessitatibus, officiis hic atque minima similique eligendi! Illum explicabo unde temporibus porro ea, nemo voluptatum quae delectus omnis architecto perspiciatis aliquam blanditiis placeat quibusdam earum qui. Delectus illum veniam fugiat, nobis, accusamus placeat quam iste ratione dolorem nam temporibus laborum, aspernatur facere ducimus! Numquam vel autem architecto dolore labore aliquid ducimus exercitationem, perspiciatis ipsam ratione eum veritatis vitae fuga sequi quae provident ullam iste quas ut reprehenderit repellat dolores eaque necessitatibus. Atque blanditiis laudantium fugiat quia reiciendis quibusdam rerum temporibus minus maiores, repellat modi ea nam, ad asperiores praesentium consectetur laborum culpa. Totam vitae placeat, alias animi voluptatum dolores consequuntur veniam aliquid voluptate deserunt laboriosam quas earum enim sit soluta impedit libero, est iusto quis accusamus ducimus inventore! Sit quas dolores ex tempora dolorum debitis ea accusantium impedit. Voluptas cum molestias eum velit totam voluptatem quasi laboriosam natus! Totam, dolorum sequi! Dolor mollitia eius reiciendis pariatur accusantium possimus distinctio. Minus error perspiciatis exercitationem eum placeat. Amet aliquam sint suscipit voluptatibus sit velit architecto quis repellendus doloribus eveniet ratione atque molestias officiis nemo aut, at dolorem non, ipsum nisi, assumenda modi! Fugiat mollitia illo nemo aspernatur totam, pariatur obcaecati error, consequuntur sit, tempora similique cum aliquid non fugit earum incidunt quidem tenetur dolores voluptatum. Consectetur incidunt nihil numquam non laboriosam quod debitis ipsum recusandae est, similique eos expedita magni quos fugit cumque officiis ducimus? Cumque commodi rerum cupiditate porro nemo voluptatem architecto, numquam exercitationem reprehenderit veniam, minus inventore alias dolore. Odit sint non inventore qui dolores, nihil cupiditate dicta aliquam. Facere tenetur pariatur suscipit quisquam quaerat consectetur voluptate ipsa? Officiis repellat reiciendis, perferendis, cupiditate ullam nostrum suscipit sapiente quis dolor, quia possimus labore neque maiores? Animi nisi voluptas dicta voluptatem blanditiis vel corporis voluptate excepturi corrupti quis velit, dolor adipisci, fugit accusantium exercitationem ut expedita sint labore libero perspiciatis temporibus nihil quisquam 
</p>
</div>
<div className='w-full p-11 bg-gray-900'></div>
    </div>
    </>
  );
};

export default YourComponent;
