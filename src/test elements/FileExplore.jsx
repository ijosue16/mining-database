import React, { useState } from "react";

// Sample file system structure
const fileSystem = {
  status: "Success",
  data: {
    files: [
      {
        type: "directory",
        name: "data",
        content: [
          {
            type: "directory",
            name: "DD Reports",
            content: [
              {
                type: "directory",
                name: "2023",
                content: [
                  {
                    type: "directory",
                    name: "August",
                    content: []
                  }
                ]
              }
            ]
          },
          {
            type: "directory",
            name: "shipment",
            content: [
              {
                type: "directory",
                name: "64e71ce5a932f1ac6fe490e1",
                content: []
              },
              {
                type: "directory",
                name: "64e71d076f9a0f8f07559c94",
                content: []
              },
              {
                type: "directory",
                name: "64e71d576f9a0f8f07559ca6",
                content: [
                  {
                    type: "file",
                    name: "Cover letter satago.docx"
                  },
                  {
                    type: "file",
                    name: "META BASIC INFO.docx"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        type: "directory",
        name: "stylesheets",
        content: [
          {
            type: "file",
            name: "style.css"
          }
        ]
      }
    ]
  }
};


const jsonData = {
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
  
  const hierarchyLevels = getHierarchyLevels(jsonData);
  
  console.log(hierarchyLevels);

const FileExplorer = ({ files }) => {
  const renderFilesystem = (items) => {
    return items.map((item, index) => (
      <div key={index}>
        {item.type === "directory" ? (
          <div className="directory">
            <span className="icon-folder"></span>
            {item.name}
            {item.content.length > 0 && (
              <div className="nested">
                {renderFilesystem(item.content)}
              </div>
            )}
          </div>
        ) : (
          <div className="file">
            <span className="icon-file"></span>
            {item.name}
          </div>
        )}
      </div>
    ));
  };

  return <div className="file-explorer">{renderFilesystem(files)}</div>;
};

function FileExplorerApp() {
  return (
    <div className="App">
      <FileExplorer files={fileSystem.data.files} />
    </div>
  );
}

export default FileExplorerApp;
