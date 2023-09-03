import React, { useContext, useState } from "react";
import { BsFolderFill } from "react-icons/bs";
import { FaFolderOpen, FaRegFile } from "react-icons/fa";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import { useMyContext } from "../context files/LoginDatacontextProvider";

const FilesytemMangerSample = () => {
  const [open, setOpen] = useState(false);
  const {loginData,updateLoginData}=useMyContext();
  const data = {
    "status": "Success",
    "data": {
      "files": [
        {
          "type": "directory",
          "name": "data",
          "content": [
            {
              "type": "directory",
              "name": "DD Reports",
              "content": [
                {
                  "type": "directory",
                  "name": "2023",
                  "content": [
                    {
                      "type": "directory",
                      "name": "August",
                      "content": []
                    }
                  ]
                }
              ]
            },
            {
              "type": "directory",
              "name": "shipment",
              "content": [
                {
                  "type": "directory",
                  "name": "64e71ce5a932f1ac6fe490e1",
                  "content": []
                },
                {
                  "type": "directory",
                  "name": "64e71d076f9a0f8f07559c94",
                  "content": []
                },
                {
                  "type": "directory",
                  "name": "64e71d576f9a0f8f07559ca6",
                  "content": [
                    {
                      "type": "file",
                      "name": "Cover letter satago.docx"
                    },
                    {
                      "type": "file",
                      "name": "META BASIC INFO.docx"
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "type": "directory",
          "name": "stylesheets",
          "content": [
            {
              "type": "file",
              "name": "style.css"
            }
          ]
        }
      ]
    }
  };
  function getHierarchyLevels(data, currentLevel = 0) {
    if (Array.isArray(data)) {
      return data.map((item) => getHierarchyLevels(item, currentLevel));
    } else if (typeof data === "object") {
      const levels = {};
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          levels[key] = {
            level: currentLevel,
            children: getHierarchyLevels(data[key], currentLevel + 1),
          };
        }
      }
      return levels;
    }
    return data;
  }
  
  const hierarchyLevels = getHierarchyLevels(data);
  
  console.log(JSON.stringify(hierarchyLevels, null, 2));
  


  const Dir = ({level,text,type}) => {
    const elements = [];

    for (let i = 0; i < level; i++) {
      elements.push(<span key={i} className="h-full px-[6px]"></span>);
    };

    let Icon;
    let IconOpen;
    switch(type){
        case 'directory':{
            Icon=BsFolderFill;
            IconOpen=FaFolderOpen;
            break;
        }
        case 'file':{
            Icon=FaRegFile;
            IconOpen=FaRegFile;
            break;
        }
            default:{
                Icon=FaRegFile;
            }
                

    }
    return(
        <div
        className="flex h-[36px] items-center rounded-md hover:bg-slate-200 hover:text-gray-900 pl-2"
        onDoubleClick={() => setOpen(!open)}
      >
        {elements}
{type==='directory'? <span className=" items-center flex">
          <FiChevronRight
            className={`${open ? "rotate-90 duration-200" : ""}`}
            onClick={() => setOpen(!open)}
          />
        </span>:null}
        <span className={`${type==='directory'? 'pl-[16px] flex items-center gap-2 w-full':'pl-[31px] flex items-center gap-2 w-full h-full'}`}>
          {open ? (
            <IconOpen  className=" text-lg"/>
          ) : (
            <Icon  className=" text-lg"/>
          )}
          <p className="w-full no-select">{text}</p>
        </span>
      </div> 
    )
  };
  return (
    <nav className="h-full bg-white w-80 p-2">
  <Dir text={'Assets'} level={0} type={'directory'}/>

      {open ? (
        <>

          <Dir text={'Reports'} level={1} type={'directory'}/>

          <Dir text={'2023'} level={1} type={'directory'}/>

          <Dir text={'January'} level={2} type={'directory'}/>

          <Dir text={'January report term 1'} level={1} type={'directory'}/>

          <Dir text={'January report 1'} level={2} type={'file'}/>

          <Dir text={'January report 1'} level={2} type={'file'}/>

          <Dir text={'January report 1st quarter'} level={2} type={'directory'}/>

          <Dir text={'1st Q report'} level={3} type={'file'}/>

          <Dir text={'Quarter deffects'} level={3} type={'directory'}/>

          <Dir text={'January report 2'} level={4} type={'file'}/>

          <Dir text={'february report'} level={4} type={'file'}/>

          <Dir text={'Contracts'} level={1} type={'directory'}/>
        </>
      ) : null}
  <p>{loginData.accessibility}</p>
  <button className=" p-3 bg-blue-300" onClick={()=>updateLoginData('weee')}>Change Context</button>
    </nav>
  );
};
export default FilesytemMangerSample;
