import React, {useEffect, useState} from 'react';
import { BsFolderFill } from "react-icons/bs";
import { FaFolderOpen, FaRegFile, FaDownload} from "react-icons/fa";
import {HiChevronDown, HiChevronRight} from "react-icons/hi";
import { useDownloadFileMutation } from "../states/apislice";
import {toast} from "react-toastify";

const FileTree = ({ data }) => {
    const [downloadFile, {isSuccess, isLoading, isError, error}] = useDownloadFileMutation();
    const [openDirectories, setOpenDirectories] = useState([]);

    const toggleDirectory = (name) => {
        if (openDirectories.includes(name)) {
            // If the directory is open, close it
            setOpenDirectories(openDirectories.filter((dir) => dir !== name));
        } else {
            // If the directory is closed, open it
            setOpenDirectories([...openDirectories, name]);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("File Successfully downloaded");
        } else if (isError) {
            console.log(error)
            // const { message } = error.data;
            // toast.error(message);
        }
    }, [isSuccess, isError, error]);


    const handleDownloadFile = async ({ name, fullPath }) => {
        const response = await downloadFile({ name, fullPath });
        const contentType = response.headers['content-type'];

        // Check if the response contains a DOCX file
        if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
            window.open(url);
        } else {
            // Handle the case where the response is not a DOCX file
            console.error('Response is not a DOCX file');
        }
    };


    const isDirectoryOpen = (name) => openDirectories.includes(name);

    const renderNode = (node, level) => {
        const isDirectory = node.type === 'directory';

        return (
            <ul key={`${node.type}-${node.name}`}>
                <li>
          <span style={{ marginLeft: level * 20 }} className="flex items-center">
            {isDirectory && (
                <span
                    style={{ marginRight: 3 }}
                    onClick={() => toggleDirectory(node.name)}
                >
                {isDirectory && isDirectoryOpen(node.name) ? (
                    <HiChevronDown />
                ) : (
                    <HiChevronRight />
                )}
              </span>
            )}
              {isDirectory ? (
                  <BsFolderFill style={{ marginRight: 5 }} />
              ) : (
                  <FaRegFile style={{ marginRight: 5 }} />
              )}
              {node.name}
              {node.type === "file" && (
                  <FaDownload style={{marginLeft: 5}} onClick={() => handleDownloadFile(node)}/>
              )}
          </span>
                    {isDirectory && isDirectoryOpen(node.name) && node.content && (
                        renderChildren(node.content, level + 1)
                    )}
                </li>
            </ul>
        );
    };

    const renderChildren = (children, level) => {
        return (
            <ul>
                {children.map((child) => (
                    <li key={`${child.type}-${child.name}`}>
                        {renderNode(child, level)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            {renderChildren(data, 0)}
        </div>
    );
};

export default FileTree;
