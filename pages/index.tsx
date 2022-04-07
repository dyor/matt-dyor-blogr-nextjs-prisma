import React from "react"
import { GetServerSideProps, GetStaticProps } from "next"
import Layout from "../components/Layout"
import Contract, { ContractProps } from "../components/Contract"
import prisma from '../lib/prisma';
import { useSession, getSession } from 'next-auth/react';
// import './src/styles.css';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { contracts: [] } };
  }

  const publicTemplates = await prisma.contract.findMany({
    where:
    {
      isPublic: true,
      isTemplate: true
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  const myTemplates = await prisma.contract.findMany({
    where:
    {
      author: { email: session.user.email },
      isTemplate: true,
    },
    include: {
      author: {
        select: { name: true, email: true },
      },
    },
  });

return { props: JSON.parse(JSON.stringify({ publicTemplates, myTemplates })) };
};

type Props = {
  publicTemplates: ContractProps[],
  myTemplates: ContractProps[],
}

const ContractList: React.FC<Props> = (props) => {
  const { data: session } = useSession();
  if (!session) {
    return (
      <Layout>
        <div className="page jumbotron text-center">
          <h1>You need to be authenticated to view this page</h1>
          Sign up or sign in using the Log in button in the top right.</div>
      </Layout>
    );
  }
  return (
    <Layout>
      <div className="page">
        {props.myTemplates?.length > 0 && (
          <>
            <h1>My Templates</h1>
            <main>
              {props.myTemplates.map((contract) => (
                <div key={contract.id} className="contract">
                  <Contract contract={contract} myEmail={session.user.email} />
                </div>
              ))}
            </main>
          </>
        )}
        {props.publicTemplates?.length > 0 && (
          <>
            <h1>Public Templates</h1>
            <main>
              {props.publicTemplates.map((contract) => (
                <div key={contract.id} className="contract">
                  <Contract contract={contract} myEmail={session.user.email} />
                </div>
              ))}
            </main>
          </>
        )}
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
  )
}

export default ContractList
