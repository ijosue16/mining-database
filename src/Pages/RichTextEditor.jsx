import React, {useEffect, useRef, useState} from 'react';
import {
    HtmlEditor,
    Image,
    Inject,
    Link,
    RichTextEditorComponent,
    Table,
    Toolbar
} from '@syncfusion/ej2-react-richtexteditor';
import ReactHtmlParser from 'html-react-parser';
import { useSaveFileMutation } from "../states/apislice";
import { message } from "antd";
import LoadingButton from "./LoadingButton";
import { useNavigate } from "react-router-dom";
import * as cheerio from 'cheerio';


const RichTextEditor = ({isLoading, isSuccess, htmlString, fileId, filePath}) => {
    const [saveFile, {isSuccess: saveSuccess, isLoading: isSaving, isError, error}] = useSaveFileMutation();
    // const [htmlContent, setHtmlContent] = useState('');
    const rteRef = useRef();
    const navigate = useNavigate();

    const toolbarSettings = {
        items: ['Bold', 'Italic', 'Underline', 'StrikeThrough',
            'createTable',
            'FontName', 'FontSize', 'FontColor', 'BackgroundColor',
            'LowerCase', 'UpperCase', '|',
            'Formats', 'Alignments', 'OrderedList', 'UnorderedList',
            'Outdent', 'Indent', '|',
            'CreateLink', 'Image', '|', 'ClearFormat', 'Print',
            'SourceCode', 'FullScreen', '|', 'Undo', 'Redo']
    };
    // const handleGetHtmlContent = () => {
    //     if (rteRef.current) {
    //         setHtmlContent(rteRef.current.getHtml());
    //     }
    // }


    useEffect(() => {
        if (saveSuccess) {
            message.success("File Saved Successfully");
            return navigate(-1);
        } else if (isError) {
            const { message: errorMessage } = error.data;
            return message.error(errorMessage);
        }
    }, [isSuccess, isError, error]);

    const handleSaveFile = async () => {
        // handleGetHtmlContent();
        let htmlContent = "";
        if (rteRef.current) {
            htmlContent = rteRef.current.getHtml();
        }
        // console.log($('table').length)
        const body = {htmlString: htmlContent, fileId, filePath};
        // console.log(body);
        const response = await saveFile({body});
        if (response.data) {
            const { url, filePath, fileId } = response.data.data;
            localStorage.setItem('url', url);
            localStorage.setItem('filePath', filePath);
            localStorage.setItem('fileId', fileId);
        }

        // console.log(body);
    }


    return (
        <div>
            {!htmlString ? <div>Loading...</div>
                : (
                    <>
                        <LoadingButton isProcessing={isSaving} onClickFunction={handleSaveFile} name={"Save"}/>
                        <RichTextEditorComponent ref={rteRef} height={600} toolbarSettings={toolbarSettings}>
                            <p>The Rich Text Editor component is WYSIWYG ("what you see is what you get") editor that provides the best user
                                experience to create and update the content.
                                Users can format their content using standard toolbar commands.</p>
                            <p><b>Key features:</b></p>
                            <div>{ReactHtmlParser(htmlString)}</div>
                            <Inject services={[Toolbar, HtmlEditor, Image, Link, Table]}/>
                        </RichTextEditorComponent>
                    </>
                )
            }
        </div>
    )
}

export default RichTextEditor;

