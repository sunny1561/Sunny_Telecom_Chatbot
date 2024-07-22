// app/components/DocumentList.tsx

// "use client"
// import React from 'react';

// interface DocumentListProps {
//     Documents?: string[];
// }

// const DocumentList: React.FC<DocumentListProps> = ({ Documents }) => {
  
//   if(!Documents||!Documents.length  ){
//     return null
//   }
  
//   return (
//     <div className="bg-white shadow-md rounded-lg p-6 mt-6">
//       {Documents.length > 0 && (
//         <h2 className="text-2xl font-bold mb-4 text-purple-800">Related Documents</h2>
//       )}
//       <ul className="space-y-2">
//         {Documents.length>0&&Documents.map((item, index) => (
//           <li 
//             key={index}
//             className="bg-gray-50 hover:bg-gray-100 rounded-md p-3 transition duration-150 ease-in-out"
//           >
//             <a href="#" className="text-purple-600 hover:text-blue-800 hover:underline">
//               {item}
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default DocumentList;



"use client"
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DocumentListProps {
    Documents?: string[];
}

const DocumentList: React.FC<DocumentListProps> = ({ Documents }) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  if(!Documents || !Documents.length) {
    return null;
  }

  const handleDocumentClick = (document: string) => {
    setSelectedDocument(document);
  };

  const closePopup = () => {
    setSelectedDocument(null);
  };
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      {Documents.length > 0 && (
        <h2 className="text-2xl font-bold mb-4 text-purple-800">Related Documents</h2>
      )}
      <ul className="space-y-2">
        {Documents.length > 0 && Documents.map((item, index) => (
          <li 
            key={index}
            className="bg-gray-50 hover:bg-gray-100 rounded-md p-3 transition duration-150 ease-in-out"
          >
            <a 
              href="#" 
              className="text-purple-600 hover:text-blue-800 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                handleDocumentClick(item);
              }}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>

      <Dialog open={!!selectedDocument} onOpenChange={closePopup}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedDocument}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p>
              This is a sample paragraph for the document la la {selectedDocument} la la . 
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam 
              euismod, nisi vel consectetur interdum, nisl nunc egestas nunc, 
              vitae tincidunt nisl nunc euismod nunc.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentList;