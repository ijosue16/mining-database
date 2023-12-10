import React from 'react';

import { PdfViewerComponent, Toolbar, Magnification, Navigation, LinkAnnotation, BookmarkView,
    ThumbnailView, Print, TextSelection, Annotation, TextSearch, FormFields, FormDesigner, Inject} from '@syncfusion/ej2-react-pdfviewer';





const PDFViewer = () => {

    const path = "http://localhost:5001/data/invoices/DEMIKARU/2023/October/DEMIKARU_000001_01-10-2023_Coltan.pdf"
    return (
        <div>
            <PdfViewerComponent
                id="container"
                documentPath="http://localhost:5001/data/invoices/DEMIKARU/2023/October/DEMIKARU_000001_01-10-2023_Coltan.pdf"
                resourceUrl="https://cdn.syncfusion.com/ej2/23.1.40/dist/ej2-pdfviewer-lib"
                style={{ 'height': '640px' }}>
                <Inject services={[ Toolbar, Magnification, Navigation, Annotation, LinkAnnotation, BookmarkView,
                    ThumbnailView, Print, TextSelection, TextSearch, FormFields, FormDesigner ]}/>
            </PdfViewerComponent>
        </div>
    )
}

export default PDFViewer;
