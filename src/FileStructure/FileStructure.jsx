import React, { useEffect, useState } from 'react';
import FileTree from './FileTree';
import { useGetFileStructureQuery } from "../states/apislice";
import {message} from "antd";
import FetchingPage from "../Pages/FetchingPage";

const FileStructure = () => {
    const { data, isSuccess, isLoading, isError, error } = useGetFileStructureQuery("",
        { refetchOnMountOrArgChange: true, refetchOnReconnect: true }
    );
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
        <div className="h-full w-full">
            {isLoading ? <FetchingPage/> : <FileTree data={fileStructure} />}
        </div>
    );
};

export default FileStructure;
