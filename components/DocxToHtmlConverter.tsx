// import React, { useState, ChangeEvent } from 'react';
// import ConvertApi from 'convertapi-js';
// import dynamic from 'next/dynamic';
// import { useCallback } from 'react';
// import { useResizeObserver } from '@wojtekmaj/react-hooks';
// import { PDFDocumentProxy } from 'pdfjs-dist';

// const Document = dynamic(() => import('react-pdf').then(module => module.Document), {
//   ssr: false
// });

// const Page = dynamic(() => import('react-pdf').then(module => module.Page), {
//   ssr: false
// });

// interface ConvertedFile {
//   FileName: string;
//   FileExt: string;
//   FileSize: number;
//   FileId: string;
//   Url: string;
// }
// type PDFFile = string | File | null;
// const maxWidth = 800;
// const options = {
//     cMapUrl: '/cmaps/',
//     standardFontDataUrl: '/standard_fonts/',
//   };

// const DocxToPdfConverter: React.FC = () => {
// //   const [file, setFile] = useState<File | null>(null);
//   const [convertedFile, setConvertedFile] = useState<ConvertedFile | null>(null);
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [showPreview, setShowPreview] = useState<boolean>(false);
//   const [file, setFile] = useState<PDFFile>('./0216-720.pdf');
//   const [numPages, setNumPages] = useState<number>(1);
//   const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
//   const [containerWidth, setContainerWidth] = useState<number>();
//   const onResize = useCallback<ResizeObserverCallback>((entries) => {
//     const [entry] = entries;

//     if (entry) {
//       setContainerWidth(entry.contentRect.width);
//     }
//   }, []);
//   const resizeObserverOptions = {};

//   useResizeObserver(containerRef, resizeObserverOptions, onResize);

//   function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
//     const { files } = event.target;

//     const nextFile = files?.[0];

//     if (nextFile) {
//       setFile(nextFile);
//       console.log(nextFile);
      
//     }
//   }

//   function onDocumentLoadSuccess({ numPages: nextNumPages }: PDFDocumentProxy): void {
//     setNumPages(nextNumPages);
//   }


//   const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
//     if (event.target.files && event.target.files.length > 0) {
//       setFile(event.target.files[0]);
//     }
//   };

//   const convertToPdf = async () => {
//     if (!file) {
//       setError('Please select a file');
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const convertApi = ConvertApi.auth('qVrmqflunWw9aeHc');
//       const params = convertApi.createParams();
//       params.add('File', file);

//       const result = await convertApi.convert('docx', 'pdf', params);
//       const convertedFileInfo = result.files[0] as ConvertedFile;
//       setConvertedFile(convertedFileInfo);
//       setShowPreview(true);
//       console.log(convertedFileInfo);
//     } catch (err) {
//       setError(`Error converting file: ${(err as Error).message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       <div>
//         <input type="file" accept=".docx" onChange={handleFileChange} />
//         <button onClick={convertToPdf} disabled={isLoading}>
//           {isLoading ? 'Converting...' : 'Convert to PDF'}
//         </button>
//         {error && <p style={{ color: 'red' }}>{error}</p>}
//       </div>
//       {convertedFile && showPreview && (
//         <div>
//           <button onClick={() => setShowPreview(!showPreview)}>
//             {showPreview ? 'Hide Preview' : 'Show Preview'}
//           </button>
//           {showPreview && (
//             <div className="Example__container__document" ref={setContainerRef}>
//             <Document  file={file} onLoadSuccess={onDocumentLoadSuccess} options={options}>
//                 <Page
                  
//                   pageNumber={numPages}
//                   width={containerWidth ? Math.min(containerWidth, maxWidth) : maxWidth}
//                 />
//               {/* {Array.from(new Array(numPages), (el, index) => (
//               ))} */}
//             </Document>
//           </div>
//           )}
//           <p>
//             <a href={convertedFile.Url} target="_blank" rel="noopener noreferrer">
//               Download PDF
//             </a>
//           </p>
//         </div>
//       )}
//     </>
//   );
// };

// export default DocxToPdfConverter;