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

  const contracts = await prisma.contract.findMany({
    where: {
      // author: { email: session.user.email },xxx make a new page for if I am first or second signer and I need to sign
      isTemplate: false,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { contracts },
  };
};

type Props = {
  contracts: ContractProps[];
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
        <h1>Contracts</h1>
        <main>
          {props.contracts.map((contract) => (
            <div key={contract.id} className="contract">
              <Contract contract={contract} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
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

export default Contracts;