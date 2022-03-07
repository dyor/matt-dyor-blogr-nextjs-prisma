// pages/drafts.tsx

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
    return { props: { drafts: [] } };
  }

  const drafts = await prisma.contract.findMany({
    where: {
      author: { email: session.user.email },
      isPublished: false,
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return {
    props: { drafts },
  };
};

type Props = {
  drafts: ContractProps[];
};

const Drafts: React.FC<Props> = (props) => {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Drafts</h1>
        <main>
          {props.drafts.map((contract) => (
            <div key={contract.id} className="contract">
              <Contract contract={contract} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .contract {
          background: var(--geist-background);
          transition: box-shadow 0.1s ease-in;
        }

        .contract:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .contract + .contract {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Drafts;