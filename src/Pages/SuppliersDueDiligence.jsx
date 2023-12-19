import {useEffect, useState} from "react";
import ViewDocumentEditor from "./ViewDocumentEditor";
import {message} from "antd";
import {useGetDueDiligenceQuery} from "../states/apislice";
import FetchingPage from "./FetchingPage";


const SuppliersDueDiligence = () => {
    const {data, isSuccess} = useGetDueDiligenceQuery();
    const [documentEditor, setDocumentEditor] = useState(null);
    const [sfdt, setSfdt] = useState(null);


    useEffect(() => {
        if (isSuccess) {
            const {sfdt} = data.data
            if (sfdt) {
                setSfdt(sfdt);
            }
        }
    }, [isSuccess, data]);

    const onSave = async () => {
        if (documentEditor.documentEditor) {
            message.success("Document saved successfully");
            // const file = await documentEditor.documentEditor.saveAsBlob('Docx');
            // const formData = new FormData();
            // formData.append('data', file, "Due Diligence Report.docx");
            // return formData;
        }
    }

    const onDownload = () => {
        if (documentEditor.documentEditor) {
            documentEditor.documentEditor.save("Advanced Payment Contract", 'Docx');
        }
    }

    return (
        <div>
            {!sfdt ? <FetchingPage/> : (
                <ViewDocumentEditor
                    setDocumentEditor={setDocumentEditor}
                    documentEditor={documentEditor}
                    sfdt={sfdt}
                    onSave={onSave}
                    onDownload={onDownload}
                />)}
        </div>
    )
}

export default SuppliersDueDiligence;