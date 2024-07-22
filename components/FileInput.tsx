//components/FileInput.tsx

import React, { useState } from 'react';
import { PaperClipIcon, DocumentIcon, XCircleIcon } from '@heroicons/react/24/solid';

interface FileInputProps {
  onFileSelect: (file: File | null) => void;
}

const FileInput: React.FC<FileInputProps> = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    onFileSelect(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    onFileSelect(null);
  };

  return (
    <div className="relative flex items-center">
      <input
        type="file"
        onChange={handleFileChange}
        accept=".doc,.docx,.pdf,.json,.pcap"
        className="hidden"
        id="file-input"
      />
      <label
        htmlFor="file-input"
        className="cursor-pointer text-purple-300 hover:text-purple-100 transition-colors duration-200 mr-2"
      >
        <PaperClipIcon className="h-6 w-6" />
      </label>
      {selectedFile && (
        <div className="flex items-center bg-purple-700 text-white text-xs rounded-full py-1 px-3">
          <DocumentIcon className="h-4 w-4 mr-1" />
          <span className="truncate max-w-[100px]">{selectedFile.name}</span>
          <button onClick={removeFile} className="ml-1">
            <XCircleIcon className="h-4 w-4 text-purple-300 hover:text-purple-100" />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileInput;