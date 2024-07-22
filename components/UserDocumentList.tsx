"use client"
import React, { useState, useEffect } from 'react';

interface UserDocumentListProps {
  userId?: string;
}

const UserDocumentList: React.FC<UserDocumentListProps> = ({ userId }) => {
  const [documents, setDocuments] = useState<string[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  useEffect(() => {
    // Fetch user documents when the component mounts
    fetchUserDocuments();
  }, []);

  const fetchUserDocuments = async (): Promise<void> => {
    try {
    //   const response = await fetch(`/api/user-documents?userId=${userId}`);
    //   if (!response.ok) {
    //     throw new Error('Failed to fetch user documents');
    //   }
    //   const data: { userDocuments: string[] } = await response.json();
    //   setDocuments(data.userDocuments);
    } catch (error) {
      console.error('Error fetching user documents:', error);
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, document: string): void => {
    if (event.target.checked) {
      setSelectedDocuments([...selectedDocuments, document]);
    } else {
      setSelectedDocuments(selectedDocuments.filter(doc => doc !== document));
    }
  };

  return (
    <div>
      <h2>User Documents</h2>
      {documents.length === 0 ? (
        <p>No documents found.</p>
      ) : (
        <ul>
          {documents.map((document, index) => (
            <li key={index}>
              <label>
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckboxChange(e, document)}
                  checked={selectedDocuments.includes(document)}
                />
                {document}
              </label>
            </li>
          ))}
        </ul>
      )}
      <div>
        <h3>Selected Documents:</h3>
        <ul>
          {selectedDocuments.map((doc, index) => (
            <li key={index}>{doc}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserDocumentList;