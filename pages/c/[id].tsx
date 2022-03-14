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
        <h2>{title}</h2>
        <p>By {props?.author?.name || 'Unknown author'}</p>
        <div>{props.summary}</div>
        <hr/>
        <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />
        {/* <ReactMarkdown children={props.content} /> */}
        
        {
          userHasValidSession && contractBelongsToUser && (
          <button onClick={() => editContract(props.id)}>Edit</button>
          )
        }
        {
          userHasValidSession && contractBelongsToUser && (
            <button onClick={() => deleteContract(props.id)}>Delete</button>
          )
        }
        {
          props.isTemplate &&  (
            <button onClick={() => createChildContract(props)}>Create Child Contract</button> 
          )
        }
        {
          !props.isTemplate &&  (
            <button onClick={() => signContract(props.id)}>Sign Contract</button> 
          )
        }
      </div>
      <style jsx>{`
        .page {
          background: var(--geist-background);
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Contract;