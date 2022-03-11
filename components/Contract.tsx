import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";



export type ContractProps = {
  id: number;
  isTemplate: boolean;
  title: string;
  content: string; 
  author: {
    name: string;
    email: string;
  } | null;
  firstPartyName: string; 
  firstPartyEmail: string;
  secondPartyName: string;
  secondPartyEmail: string;
  renderedContent: string;
  isPublished: boolean;
  public: boolean;
  firstPartySignDate: Date;
  secondPartySignDate: Date;
  summary: string;
  //template: number; 
  
};




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
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

export default Contract;
