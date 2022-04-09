import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import Link from "next/link";
import { Col } from "react-bootstrap";
import { useSession } from 'next-auth/react';



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
  startDate: Date;
  duration: number;
  endDate: Date;
  amount: number;
  showAmount: boolean;
  interestRate: number;
  showInterestRate: boolean;
  allowCustomContract: boolean;

  //template: number; 

};

async function createChildContract(body: ContractProps): Promise<void> {
  //populate the parent id
  var contract = {};
  var key;
  for (key in body) {
    if (key == "startDate") {
      contract[key] = new Date();
    }
    else if (key == "endDate") {
      contract[key] = new Date(new Date().setFullYear(new Date().getFullYear() + 1));
    }
    else {
      contract[key] = body[key];
    }
  }
  contract["isTemplate"] = false;
  contract["isPublished"] = false;
  if (new Date(contract["startDate"]) == new Date("1/1/2001")) {
    console.log('equals');
  }
  //contract["template"] = body.id; 
  const response = await fetch('/api/contract', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contract),
  }).then((response) => response.json());
  await Router.push("/editcontract/[id]", `/editcontract/${response.id}`);

}
async function signContract(id: number): Promise<void> {
  Router.push(`/sign/${id}`); 
}


const Contract: React.FC<{ contract: ContractProps, myEmail: string }> = ({ contract, myEmail }) => {
  const { data: session, status } = useSession();
  const authorName = contract.author ? contract.author.name : "Unknown author";
  // const cleanHTML = DOMPurify.sanitize(post.content, {
  //   USE_PROFILES: { html: true },
  // });


  return (
    <Col xs={12} sm={12} md={6} lg={4} className="align-items-stretch d-flex">
      <div onClick={() => Router.push("/c/[id]", `/c/${contract.id}`)} className="card border-dark rounded lightpurple m-1">
        <div className="card-body d-flex flex-column">
          <h4 className="card-title">{contract.title}</h4>
          <div className="card-text">
            {contract.summary}
            <span className="">Added by {authorName}.</span>
          </div>
          <div className="mt-auto align-self-end">
            {
              contract.isTemplate && (

                <>
                  <button onClick={() => createChildContract(contract)} className="btn card-link purple">Start</button>
                  <button onClick={() => Router.push("/c/[id]", `/c/${contract.id}`)} className="btn btn-secondary card-link">Template Details</button>
                </>
              )
            }


           

            {
          !contract.isTemplate && contract.firstPartyEmail == session.user.email && contract.firstPartySignDate==null && (
            <button onClick={() => signContract(contract.id)} className="btn purple btn-space">Sign</button> 
          )
        }
        {
          !contract.isTemplate && contract.secondPartyEmail == session.user.email && contract.secondPartySignDate==null &&  (
            <button onClick={() => signContract(contract.id)} className="btn btn-success btn-space">Sign</button> 
          )
        }



            {
              !contract.isTemplate && (!(contract.firstPartyEmail == myEmail)) && contract.firstPartySignDate == null && contract.firstPartyEmail != "" && (

                <button onClick={() => { window.location.href = `mailto://${contract.firstPartyEmail}?subject=Please Review Contract&body=https://matt-dyor-blogr-nextjs-prisma.vercel.app/sign/${contract.id}`; Router.push(`/sign/${contract.id}`) }} className="btn purple btn-space">Send</button>

              )
            }
            {
              (!contract.isTemplate) && (!(contract.secondPartyEmail == myEmail)) && contract.secondPartySignDate == null && contract.secondPartyEmail != "" && (

                <button onClick={() => { window.location.href = `mailto://${contract.secondPartyEmail}?subject=Please Review Contract&body=https://matt-dyor-blogr-nextjs-prisma.vercel.app/sign/${contract.id}`; Router.push(`/sign/${contract.id}`) }}  className="btn purple btn-space">Send</button>
              )
            }
             {
              !contract.isTemplate && (

                <button onClick={() => Router.push("/c/[id]", `/c/${contract.id}`)} className="btn btn-secondary btn-space">Details</button>

              )
            }
            
          </div>

        </div>
      </div>
    </Col>
  );
};

export default Contract;
