import React from "react"
import { GetServerSideProps, GetStaticProps } from "next"
import Layout from "../components/Layout"
import Contract, { ContractProps } from "../components/Contract"
import prisma from '../lib/prisma';
import { useSession, getSession } from 'next-auth/react';
import { Col, Container, Row } from "react-bootstrap";
import Link from "next/link";
import Head from "next/head";
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
          <Link href="/api/auth/signin">Sign up or sign in</Link> to get started.</div>
      </Layout>
    );
  }
  return (
    <>
    <Layout> 
      <div className="page">
        {props.myTemplates?.length > 0 && (
          <>
          <br/>
            <h3>My Templates</h3>
            <main>
            <Container>
                <Row>
              {props.myTemplates.map((contract) => (
                
                // <Col xs={12} sm={12} md={6}  lg={4} className="align-items-stretch d-flex">
                  <Contract contract={contract} myEmail={session.user.email} />  
              ))}
              </Row>
</Container>
            </main>
          </>
        )}
        {props.publicTemplates?.length > 0 && (
          <>
          <br/>
            <h3>Public Templates</h3>
            <main>
            <Container>
                <Row>
              {props.publicTemplates.map((contract) => (
                  <Contract contract={contract} myEmail={session.user.email} />
              ))}
              </Row>
</Container>
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

        .contract {
          margin-top: 1rem;
        }
      `}</style>
    </Layout>
          <Head>
          <title>SparkContract: Templates</title>
          <meta
            name="description"
            content="Templates that you have created or that others have created and made public. "
          />
        </Head>
        </>
  )
}

export default ContractList
