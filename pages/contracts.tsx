// pages/contracts.tsx

import React from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import Layout from '../components/Layout';
import Contract, { ContractProps } from '../components/Contract';
import prisma from '../lib/prisma';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { contracts: [] } };
  }



  const toSignContracts = await prisma.contract.findMany({
    where: {
      AND: [{
        isTemplate: false, 
        OR: [{
          AND: [{
            firstPartySignDate: null, 
          }, 
          {
            firstPartyEmail: session.user.email
          }]
        },
        {
          AND: [{
            secondPartySignDate: null, 
          }, {
            secondPartyEmail: session.user.email
          }]
        },
        ],
      }]
    },
    select: {
      id: true, 
      title: true, 
      summary: true,  
      author: {
        select: { name: true },
      },
    },
  });//.then(() => createChildContract(contracts, session?.user?.email));
  





  const contracts = await prisma.contract.findMany({
    where: {
      // author: { email: session.user.email },xxx make a new page for if I am first or second signer and I need to sign
      isTemplate: false,
    },
    select: {
      id: true, 
      title: true, 
      summary: true, 
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { contracts, toSignContracts },
  };
  
};

type Props = {
  contracts: ContractProps[], 
  toSignContracts: ContractProps[];
};

const Contracts: React.FC<Props> = (props) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <h1>My Contracts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1>Contracts Needing My Signature</h1>
        <main>
          {props.toSignContracts.map((contract) => (
            <div key={contract.id} className="contract">
              <Contract contract={contract} />
            </div>
          ))}
        </main>
      </div>

      <div className="page">
        <h1>My Contracts</h1>
        <main>
          {props.contracts.map((contract) => (
            <div key={contract.id} className="contract">
              <Contract contract={contract} />
            </div>
          ))}
        </main>
      </div>
    </Layout>
  );
};

export default Contracts;