// pages/p/[id].tsx

import React from 'react';
import { GetServerSideProps } from 'next';
import ReactMarkdown from 'react-markdown';
import Router from 'next/router';
import Layout from '../../components/Layout';
import { ContractProps } from '../../components/Contract';
import { useSession } from 'next-auth/react';
import prisma from '../../lib/prisma';
import DOMPurify from "dompurify";
import parseISO from 'date-fns/parseISO'

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const contract = await prisma.contract.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });
  return {
    props: JSON.parse(JSON.stringify(contract)),
  };
};

async function publishContract(id: number): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: 'PUT',
  });
  await Router.push('/');
}

async function deleteContract(id: number): Promise<void> {
  await fetch(`/api/contract/${id}`, {
    method: 'DELETE',
  });
  Router.push('/');
}
async function editContract(id: number): Promise<void> {
  Router.push(`/editcontract/${id}`); 
}

async function signContract(id: number): Promise<void> {
  Router.push(`/sign/${id}`); 
}

//xxx NEED TO HAVE THS CREATE A CONTRACT WITH SAME VALUES AS PARENT - EXCEPT
//empty dates should be defaulted to today
//template id should be set to the template of the parent template
//isTemplate should be set to false

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



const Contract: React.FC<ContractProps> = (props) => {
  const { data: session, status } = useSession();
  if (status === 'loading') {
    return <div>Authenticating ...</div>;
  }
  const userHasValidSession = Boolean(session);
  const contractBelongsToUser = session?.user?.email === props.author?.email;
  let title = props.title;
  if (!props.isPublished) {
    title = `${title}`;
  }
  const cleanHTML = DOMPurify.sanitize(props.renderedContent, {
    USE_PROFILES: { html: true },
  });
  return (
    <Layout>
      <div>
      <div className="container border border-secondary contract">
        <div className="row">
          <div className="col-sm-6">
            <h2>Key Terms</h2>
            <table className="table table-striped table-hover table-bordered">
            <tbody>
            <tr>
                <th>
                    Term
                </th>
                <th>
                    Value
                </th>
              </tr>
              <tr>
                <td>
                    &#123;Title&#125;
                </td>
                <td>
                    {props.title}
                </td>
              </tr>
              <tr>
                <td>
                    &#123;Summary&#125;
                </td>
                <td>
                    {props.summary}
                </td>
              </tr>
              <tr>
                <td>
                    &#123;FirstPartyName&#125;
                </td>
                <td>
                    {props.firstPartyName}
                </td>
              </tr>
              <tr>
                <td>
                    &#123;FirstPartyEmail&#125;
                </td>
                <td>
                    {props.firstPartyEmail}
                </td>
              </tr>
              <tr>
                <td>
                    &#123;FirstPartySignDate&#125;
                </td>
                <td>
                    {props.firstPartySignDate}
                </td>
              </tr>
              <tr>
                <td>
                    &#123;SecondPartyName&#125;
                </td>
                <td>
                    {props.secondPartyName}
                </td>
              </tr>
              <tr>
                <td>
                    &#123;SecondPartyEmail&#125;
                </td>
                <td>
                    {props.secondPartyEmail}
                </td>
              </tr>
              <tr>
                <td>
                    &#123;SecondPartySignDate&#125;
                </td>
                <td>
                    {props.secondPartySignDate}
                </td>
              </tr>
              <tr>
                <td>
                    &#123;StartDate&#125;
                </td>
                <td>
                    {new Date(props.startDate).toDateString()}
                </td>
              </tr>
              <tr>
                <td>
                    &#123;EndDate&#125;
                </td>
                <td>
                  {new Date(props.endDate).toDateString()}
                </td>
              </tr>
              {
                props.showAmount && (
              <tr>
                <td>
                    &#123;Amount&#125;
                </td>
                <td>
                    {props.amount}
                </td>
              </tr>
                )}
                              {
                props.showInterestRate && (
              <tr>
                <td>
                    &#123;InterestRate&#125;
                </td>
                <td>
                    {props.interestRate}
                </td>
              </tr>
                )}

              </tbody>
            </table>
          </div>
          <div className="col-sm-6">
            <div dangerouslySetInnerHTML={{ __html: props.renderedContent }} />
          </div>
        </div>
      </div>
      <br/>
      <div className="jumbotron text-center">
        {
          userHasValidSession && contractBelongsToUser && props.firstPartySignDate==null && props.firstPartySignDate==null && (
          <button onClick={() => editContract(props.id)} className="btn btn-primary btn-space">Edit</button>
          )
        }
        {
          userHasValidSession && contractBelongsToUser && props.firstPartySignDate==null && props.firstPartySignDate==null && (
            <button onClick={() => deleteContract(props.id)} className="btn btn-danger btn-space">Delete</button>
          )
        }
        {
          props.isTemplate &&  (
            <button onClick={() => createChildContract(props)} className="btn btn-success btn-space">Create Child Contract</button> 
          )
        }
        {
          !props.isTemplate && props.firstPartyEmail == session.user.email && props.firstPartySignDate==null && (
            <button onClick={() => signContract(props.id)} className="btn btn-success btn-space">Sign Contract</button> 
          )
        }
        {
          !props.isTemplate && props.secondPartyEmail == session.user.email && props.secondPartySignDate==null && (
            <button onClick={() => signContract(props.id)} className="btn btn-success btn-space">Sign Contract</button> 
          )
        }
         {
          !props.isTemplate && !(props.firstPartyEmail == session.user.email) && props.firstPartySignDate==null && (
            <button onClick={() => {Router.push(`mailto://${props.firstPartyEmail}?subject=Please Review Contract&body=https://localhost:3000/sign/${props.id}`); Router.push(`/sign/${props.id}`)}} className="btn btn-success btn-space">Send to {props.firstPartyEmail}</button> 
          )
        }
        {
          !props.isTemplate && (!(props.secondPartyEmail == session.user.email)) && props.secondPartySignDate==null && (
            <button onClick={() => {Router.push(`mailto://${props.secondPartyEmail}?subject=Please Review Contract&body=https://localhost:3000/sign/${props.id}`); Router.push(`/sign/${props.id}`)}}  className="btn btn-success btn-space">Send to {props.secondPartyEmail}</button> 
          )
        }
        </div>
        <br/>
        <br/>
      </div>
      <style jsx>{`
        .btn-space {
            margin-left: 5px;
            vertical-align: unset; 
        }
        .page {
          background: var(--geist-background);
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }
        
        .contract {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .contract:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .contract + .contract {
          margin-top: 1rem;
        }

      `}</style>
    </Layout>
  );
};

export default Contract;