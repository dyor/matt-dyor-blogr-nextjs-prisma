import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import Link from "next/link";



export type ContractProps = {
  id: number;
  isTemplate: boolean;
  title: string;
  content: string; 
  author: {
    name: string;
    email: string;
  } | null;
  firstParty: {
    name: string;
    email: string;
  } | null;
  secondParty: {
    name: string;
    email: string;
  } | null;
  firstPartyName: string; 
  firstPartyEmail: string;
  secondPartyName: string;
  secondPartyEmail: string;
  renderedContent: string;
  isPublished: boolean;
  isPublic: boolean;
  firstPartySignDate: Date;
  secondPartySignDate: Date;
  summary: string;
  //template: number; 
  
};

async function createChildContract(body: ContractProps): Promise<void> {
  //populate the parent id
  var contract = {} ;
  var key ;
  for ( key in body )
  {
    // copy each property into the clone
    contract[ key ] = body[ key ] ;
  }
  contract["isTemplate"] = false;
  contract["isPublished"] = false; 
  //contract["template"] = body.id; 
  const response = await fetch('/api/contract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contract), 
  }).then((response) => response.json());
  await Router.push("/editcontract/[id]", `/editcontract/${response.id}`); 
  
}


const Contract: React.FC<{ contract: ContractProps }> = ({ contract }) => {
  const authorName = contract.author ? contract.author.name : "Unknown author";
  // const cleanHTML = DOMPurify.sanitize(post.content, {
  //   USE_PROFILES: { html: true },
  // });
  
  
  return (
    <div onClick={() => Router.push("/c/[id]", `/c/${contract.id}`)}>
      <h2>{contract.title}</h2>
      <small>By {authorName}</small>
      {/* <ReactMarkdown children={post.content} /> */}
      {/* <div dangerouslySetInnerHTML={{ __html: cleanHTML }} /> */}
      {/* <div dangerouslySetInnerHTML={{ __html: contract.renderedContent }} /> */}
      <div>
          {contract.summary}
      </div>
      {
          contract.isTemplate &&  (
      <>
        <button onClick={() => createChildContract(contract)} className="btn btn-success btn-space">Create Contract from Template
        </button>
        <button onClick={() => Router.push("/c/[id]", `/c/${contract.id}`)} className="btn btn-secondary btn-space">Template Details</button>
        </>
          )
      } 
      
      {
        !contract.isTemplate &&  (
    
          <button onClick={() => Router.push("/c/[id]", `/c/${contract.id}`)} className="btn btn-secondary btn-space">Contract Details</button>
      
        )
      }
      <style jsx>{`
        div {
          color: inherit;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default Contract;
