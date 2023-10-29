import React, { useEffect, useState } from 'react';
import FileTree from './FileTree';
import { useGetFileStructureQuery } from "../states/apislice";
import {message} from "antd";

const FileStructure = () => {
    const { data, isSuccess, isLoading, isError, error } = useGetFileStructureQuery();
    const [fileStructure, setFileStructure] = useState([]);

    useEffect(() => {
        if (isSuccess) {
            const { files } = data.data;
            setFileStructure(files);
        } else if (isError) {
            const { message: fetchError } = error.data;
            message.error(fetchError);
        }
    }, [isSuccess, isError, error]);

    return (
        <div>
            <h2>File Structure</h2>
            <FileTree data={fileStructure} />
        </div>
    );
};

export default FileStructure;
