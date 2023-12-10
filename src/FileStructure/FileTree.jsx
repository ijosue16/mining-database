import React, {useEffect, useState} from 'react';
import { BsFolderFill, BsFillFileEarmarkWordFill, BsFillFileEarmarkPdfFill, BsImageFill } from "react-icons/bs";
import { FaFolderOpen, FaRegFile, FaDownload} from "react-icons/fa";
import {HiChevronDown, HiChevronRight} from "react-icons/hi";
import { useDownloadFileMutation } from "../states/apislice";
import {toast} from "react-toastify";
import {Link} from 'react-router-dom'
import {FcDownload, FcFolder} from "react-icons/fc";
import {ImDownload3} from "react-icons/im";
import { useNavigate } from "react-router-dom";

const FileTree = ({ data, getFileStructure, setFileStructure }) => {
    const [downloadFile, {isSuccess, isLoading, isError, error}] = useDownloadFileMutation();
    const [openDirectories, setOpenDirectories] = useState([]);
    const navigate = useNavigate();
    // TODO 5: ADD EDIT BUTTON ON WORD DOCUMENTS -> DONE

    const toggleDirectory = async (directory, fileId) => {
        const findAndUpdateDirectory = (files, fileIdToUpdate, updatedFiles) => {
            return files.map((file) => {
                if (file.fileId === fileIdToUpdate) {
                    return { ...file, content: updatedFiles };
                } else if (file.content) {
                    return { ...file, content: findAndUpdateDirectory(file.content, fileIdToUpdate, updatedFiles) };
                } else {
                    return file;
                }
            });
        };

        if (directory) {
            const response = await getFileStructure({ body: { directory } });
            if (response.data) {
                const { files } = response.data?.data;
                if (files?.length === 0) return;
                setFileStructure((prevState) => {
                    return findAndUpdateDirectory(prevState, fileId, files);
                });
            }
        }



        if (openDirectories.includes(fileId)) {
            // If the directory is open, close it
            setOpenDirectories(openDirectories.filter((dir) => dir !== fileId));
        } else {
            // If the directory is closed, open it
            setOpenDirectories([...openDirectories, fileId]);
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

        // console.log(fullPath);
        // const body = {filename: name, fullPath}
        // const response = await downloadFile({body});
        // // const response = await fetch("https://mining-company-management-system.onrender.com/data/DD%20Reports/2023/August/dd%20template.docx");
        // const blob = await response.blob();
        // const url = window.URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = name;
        // document.body.appendChild(a);
        // a.click();
        // window.URL.revokeObjectURL(url);
        const link = "https://docs.google.com/viewerng/viewer?url=https://mining-company-management-system.onrender.com/data/DD+Reports/2023/August/dd+template.docx"

        // const contentType = response.headers['content-type'];
        // <Link to="route" target="_blank" rel="noopener noreferrer" />
        // // Check if the response contains a DOCX file
        // if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        //     const url = window.URL.createObjectURL(new Blob([response.data], { type: contentType }));
        //     window.open(url);
        // } else {
        //     // Handle the case where the response is not a DOCX file
        //     console.error('Response is not a DOCX file');
        // }
    };

    const getFileIcon = (name) => {
        const ext = name.split('.').pop();
        if (ext.toLowerCase() === "png" || ext.toLowerCase() === "jpg" || ext.toLowerCase() === "jpeg") {
            return <BsImageFill color="#28aae5" size={25} style={{ marginRight: 5, marginLeft: 10}}/>
        } else if (ext.toLowerCase() === "docx" || ext.toLowerCase() === "doc") {
            return <BsFillFileEarmarkWordFill color="#2b579a" size={25} style={{ marginRight: 5, marginLeft: 10}}/>
        } else if (ext.toLowerCase() === "pdf") {
            return <BsFillFileEarmarkPdfFill color="#c20a0a" size={25} style={{ marginRight: 5, marginLeft: 10}}/>
        }
    }

    const getDocxFile = (node) => {
        if(node.type === "file") {
            const ext = node.name.split('.').pop();
            if (ext.toLowerCase() === "docx" || ext.toLowerCase() === "doc") {
                return true;
            }
        }
    }

    const handleEditFile = async (url, filePath, fileId, name) => {
        localStorage.setItem("url", url);
        localStorage.setItem("filePath", filePath);
        localStorage.setItem("fileId", fileId);
        navigate(`/structure/file`);
    }


    const isDirectoryOpen = (fileId) => openDirectories.includes(fileId);

    const renderNode = (node, level) => {
        const isDirectory = node.type === 'folder';
        const isOpen = isDirectory && isDirectoryOpen(node.fileId);

        const fileIcon = getFileIcon(node.name);

        return (
            <ul key={node.fileId}>
                <li>
                <span style={{ marginLeft: level * 20 }} className="flex items-center">
                    {isDirectory && (
                        <span
                            style={{ marginRight: 3 }}
                            onClick={() => toggleDirectory(node.filePath, node.fileId)}
                        >
                            {isOpen ? (
                                <HiChevronDown />
                            ) : (
                                <HiChevronRight />
                            )}
                        </span>
                    )}
                    {isDirectory ? (
                        isOpen ? (
                            <FaFolderOpen color="#ffca28" size={40} style={{ marginRight: 5 }} />
                        ) : (
                            <FcFolder color="#ffca28" size={40} style={{ marginRight: 5, }} />
                        )
                    ) : fileIcon
                    }
                    {node.name.replace(/_/g, ' ')}
                    {node.type === "file" && (
                        <Link to={node.url} target="_blank" rel="noopener noreferrer" download>
                            <ImDownload3 color="#2b579a" style={{ marginLeft: 8 }} className="text-lg text-[#7393B3" />
                        </Link>
                    )}
                    {getDocxFile(node) && (
                        <button onClick={() => handleEditFile(node.url, node.filePath, node.fileId, node.name.replace(/_/g, ' '))}>Edit</button>
                    )}

                </span>
                    {isDirectory && isOpen && node.content && (
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
