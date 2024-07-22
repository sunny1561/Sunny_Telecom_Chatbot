// 'use client';

// import { useCallback, useState } from 'react';
// import { useResizeObserver } from '@wojtekmaj/react-hooks';
// import { pdfjs, Document, Page } from 'react-pdf';
// import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
// import 'react-pdf/dist/esm/Page/TextLayer.css';
// import ConvertApi from 'convertapi-js';

// import './Sample.css';

// import type { PDFDocumentProxy } from 'pdfjs-dist';

// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   'pdfjs-dist/build/pdf.worker.min.mjs',
//   import.meta.url,
// ).toString();

// const options = {
//   cMapUrl: '/cmaps/',
//   standardFontDataUrl: '/standard_fonts/',
// };

// const resizeObserverOptions = {};

// const maxWidth = 800;

// type PDFFile = string | File | null;

// export default function Sample() {
// //   const [file, setFile] = useState<PDFFile>('./0216-720.pdf');
//   const [file, setFile] = useState<PDFFile>(null);
//   const [numPages, setNumPages] = useState<number>(1);
//   const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
//   const [containerWidth, setContainerWidth] = useState<number>();

// //   const onResize = useCallback<ResizeObserverCallback>((entries) => {
// //     const [entry] = entries;

// //     if (entry) {
// //       setContainerWidth(entry.contentRect.width);
// //     }
// //   }, []);

// //   useResizeObserver(containerRef, resizeObserverOptions, onResize);

//   async function onFileChange(event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
//     const { files } = event.target;

//     const nextFile = files?.[0];
    
//     if (nextFile) {
//       try {
//         let convertApi = ConvertApi.auth('qVrmqflunWw9aeHc');
//         let params = convertApi.createParams();
//         params.add('File', nextFile);

//         let result = await convertApi.convert('doc', 'pdf', params);
//         const convertedFileInfo = result.files[0];

//         if (convertedFileInfo) {
//           setFile(convertedFileInfo.Url);
//           console.log('Converted file URL:', convertedFileInfo.Url);
//         }
//       } catch (error) {
//         console.error('Error converting file:', error);
//       }
//     }
//   }

//   function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
//     setNumPages(nextNumPages);
//   }

//   return (
//     <div className="Example">
//       <header>
//         <h1>react-pdf sample page</h1>
//         <input type="number" onChange={(e) => setNumPages(Number(e.target.value))} value={numPages} />
//       </header>
//       <div className="Example__container">
//         <div className="Example__container__load">
//           <label htmlFor="file">Load from file:</label>{' '}
//           <input onChange={onFileChange} type="file" />
//         </div>

//         <div className="Example__container__document" ref={setContainerRef}>
//           {file && (
//             <Document file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
//               <Page
//                 pageNumber={numPages}
//                 width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
//               />
//             </Document>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }