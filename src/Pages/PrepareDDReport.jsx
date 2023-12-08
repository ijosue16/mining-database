import React, {useEffect, useState} from 'react';

import { useGenerateDDReportMutation } from "../states/apislice";
import {useParams} from "react-router-dom";
import RichTextEditor from "./RichTextEditor";
import { message } from "antd";


const PrepareDDReport = () => {
    const [generateDDReport, {isSuccess, isLoading, isError, error}] = useGenerateDDReportMutation();
    const [htmlString, setHtmlString] = useState('');
    const [fileInfo, setFileInfo] = useState({fileId: "", filePath: ""});
    const { supplierId } = useParams();

    useEffect(() => {
        if (isSuccess) {
            return message.success("DD Report Generated Successfully");
        } else if (isError) {
            const { message: errorMessage } = error.data;
            return message.error(errorMessage);
        }
    }, [isSuccess, isError, error]);

    useEffect(() => {
        const fetchDDReport = async () => {
            const body = {supplierId};
            const response = await generateDDReport({body, supplierId});
            if (response.data) {
                const { htmlString, fileId, filePath } = response.data
                if (htmlString) {
                    setHtmlString(htmlString);
                }
                if (fileId || filePath) {
                    setFileInfo(prevState => ({...prevState, fileId, filePath}));
                }
            }
        }
        fetchDDReport();
    }, [supplierId]);

    return (
        <div>
            <RichTextEditor
                htmlString={htmlString}
                fileId={fileInfo.fileId}
                filePath={fileInfo.filePath}
                isLoading={isLoading}
            />
        </div>
    )

}

export default PrepareDDReport;