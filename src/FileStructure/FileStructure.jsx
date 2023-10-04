import React, { useEffect, useState } from 'react';
import FileTree from './FileTree';

const FileStructure = () => {
    const data = [
        {
            "type": "directory",
            "name": "DD Reports",
            "fullPath": "DD Reports",
            "content": [
                {
                    "type": "directory",
                    "name": "2023",
                    "fullPath": "DD Reports\\2023",
                    "content": [
                        {
                            "type": "directory",
                            "name": "August",
                            "fullPath": "DD Reports\\2023\\August",
                            "content": []
                        },
                        {
                            "type": "directory",
                            "name": "September",
                            "fullPath": "DD Reports\\2023\\September",
                            "content": []
                        }
                    ]
                }
            ]
        },
        {
            "type": "directory",
            "name": "payment-in-advance-contracts",
            "fullPath": "payment-in-advance-contracts",
            "content": []
        },
        {
            "type": "directory",
            "name": "shipment",
            "fullPath": "shipment",
            "content": [
                {
                    "type": "directory",
                    "name": "64e71ce5a932f1ac6fe490e1",
                    "fullPath": "shipment\\64e71ce5a932f1ac6fe490e1",
                    "content": []
                },
                {
                    "type": "directory",
                    "name": "64e71d076f9a0f8f07559c94",
                    "fullPath": "shipment\\64e71d076f9a0f8f07559c94",
                    "content": []
                },
                {
                    "type": "directory",
                    "name": "64e71d576f9a0f8f07559ca6",
                    "fullPath": "shipment\\64e71d576f9a0f8f07559ca6",
                    "content": [
                        {
                            "type": "file",
                            "name": "Cover letter satago.docx",
                            "fullPath": "shipment\\64e71d576f9a0f8f07559ca6\\Cover letter satago.docx"
                        },
                        {
                            "type": "file",
                            "name": "META BASIC INFO.docx",
                            "fullPath": "shipment\\64e71d576f9a0f8f07559ca6\\META BASIC INFO.docx"
                        }
                    ]
                }
            ]
        }
    ]
    const [fileStructure, setFileStructure] = useState([]);

    useEffect(() => {
        setFileStructure(data);
        // async function fetchFileStructure() {
        //     try {
        //         const response = await axios.get('/file-structure');
        //         setFileStructure(response.data);
        //     } catch (error) {
        //         console.error(error);
        //     }
        // }
        //
        // fetchFileStructure();
    }, []);

    return (
        <div>
            <h2>File Structure</h2>
            <FileTree data={fileStructure} />
        </div>
    );
};

export default FileStructure;
