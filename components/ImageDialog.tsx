"use client"

import Image from 'next/image';
import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ImageData {
  metadata: {
    description: string;
    title: string;
    id: string;
    image_path: string;
  };
}

interface ImageDialogProps {
  imageData: ImageData[];
  content: string;
}

const ImageDialog: React.FC<ImageDialogProps> = ({ imageData, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  const handleImageClick = (image: ImageData) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const formatContent = (content: string) => {
    const lines = content.split("\n");
    return lines.map((line, index) => {
      if (line.match(/^\d+\./)) {
        return (
          <li key={index} className="mb-4 list-decimal">
            {line.replace(/^\d+\./, "").trim()}
          </li>
        );
      } else if (line.trim().startsWith("-")) {
        return (
          <li key={index} className="mb-4 list-disc">
            {line.replace(/^-/, "").trim()}
          </li>
        );
      }
      return <p key={index} className="mb-4">{line}</p>;
    });
  };

  return (
    <>
      <div className="p-8">
  <h2 className="text-3xl font-bold mb-8 text-center text-purple-800">Images</h2>
  {imageData.length > 0 ? (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {imageData.map((image) => (
        <div
          key={image.metadata.id}
          className="cursor-pointer transition-all duration-300 hover:-translate-y-1"
          onClick={() => handleImageClick(image)}
        >
          <div className="relative h-40 w-full overflow-hidden rounded-lg shadow-md">
            <Image
              src={`/diagrams/${image.metadata.image_path}`}
              alt={image.metadata.description}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 hover:scale-105"
            />
          </div>
          <h3 className="mt-2 font-semibold text-sm text-gray-800 truncate">{image.metadata.title}</h3>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center text-gray-500 py-10">
      <p className="text-xl">No images available</p>
    </div>
  )}
</div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/70" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="absolute top-4 right-4 z-10">
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <span className="sr-only">Close</span>
                <XMarkIcon className="h-8 w-8" aria-hidden="true" />
              </button>
            </div>

            <div className="flex flex-col md:flex-row h-full">
              <div className="md:w-1/2 p-8 flex items-center justify-center bg-gradient-to-br from-yellow-200 to-blue-500">
                {selectedImage && (
                  <div className="relative w-full h-[400px]">
                    <Image
                      src={`/diagrams/${selectedImage.metadata.image_path}`}
                      alt={selectedImage.metadata.description}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                )}
              </div>

              <div className="md:w-1/2 p-8 overflow-y-auto bg-gradient-to-br from-purple-600 to-blue-500">
                <div className="prose prose-sm max-w-none text-white">
                  <h2 className="text-3xl font-bold mb-6">{selectedImage?.metadata.title}</h2>
                  <div className="space-y-4 max-h-[calc(90vh-8rem)] overflow-y-auto pr-4">
                    {formatContent(content)}
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
};

export default ImageDialog;

 