"use client"
import FeedbackDialog from '@/components/FeedbackDialog';
import { useState } from 'react';

const Page = () => {
  const [docs,setdocs]=useState<string[]>();
  return (
    <div>
      <FeedbackDialog message_id='dsdsd'/>
      {/* <DocxToHtmlConverter/> */}
      {/* <PDFViewer/>   */}
        {/* <button onClick={async()=>{
            console.log("feach user documents called")
           await getUserDocuments().then((res)=>{
             console.log(res)
             if(res){
              setdocs(res)
             }
           }).catch((err)=>{
             console.log(err)
           })
        }}>
            feach user documents
        </button>
        <br />
        <button onClick={async()=>{
            console.log("feach user documents called")
            const documentString="abc.docx"
           await addDocumentToUser(documentString).then((res)=>{
             console.log(res)
           }).catch((err)=>{
             console.log(err)
           })
        }}>
            Add user document to db
        </button> */}
        {docs?.map((doc,index)=>{
          return <div key={index}>{`${index+1} : ${doc}`}</div>
        })}
        
    </div>
  )
}

export default Page