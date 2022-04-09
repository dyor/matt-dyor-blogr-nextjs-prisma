// pages/contracts.tsx

import React from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import Layout from '../components/Layout';
import Contract, { ContractProps } from '../components/Contract';
import prisma from '../lib/prisma';
import { Container, Row, Col } from 'react-bootstrap';

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
      firstPartyEmail: true, 
      secondPartyEmail: true,
      firstPartySignDate: true, 
      secondPartySignDate: true, 
    },
  });

  const toSignByOthersContracts = await prisma.contract.findMany({
    where: {
      AND: [{
        isTemplate: false,
        author: { email: session.user.email },
        OR: [{
          AND: [{
            firstPartySignDate: null,
          },
          {
            NOT: {
              firstPartyEmail: session.user.email
            }
          }]
        },
        {
          AND: [{
            secondPartySignDate: null,
          }, {
            NOT: {
              secondPartyEmail: session.user.email
            }
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
      firstPartyEmail: true, 
      secondPartyEmail: true,
      firstPartySignDate: true, 
      secondPartySignDate: true, 
    },
  });

  const contracts = await prisma.contract.findMany({
    where: {
      isTemplate: false,
      OR: [
        { author: { email: session.user.email }, }, 
        { firstPartyEmail: session.user.email, },
        { secondPartyEmail: session.user.email, },
      ],
      
    },
    select: {
      id: true,
      title: true,
      summary: true,
      author: {
        select: { name: true },
      },
      firstPartyEmail: true, 
      secondPartyEmail: true,
      firstPartySignDate: true, 
      secondPartySignDate: true, 
    },
  });
  return {
    props: JSON.parse(JSON.stringify({ contracts, toSignContracts, toSignByOthersContracts })),
  };

};

type Props = {
  contracts: ContractProps[],
  toSignContracts: ContractProps[],
  toSignByOthersContracts: ContractProps[];
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
      {props.toSignContracts.length > 0 && (
        <div className="page">
          <h1>Contracts Needing My Signature</h1>
          <main>
          <Container>
            <Row>
            {props.toSignContracts.map((contract) => (
              <Col xs={12} sm={12} md={6}>
              <div key={contract.id} className="contract">
                <Contract contract={contract} myEmail={session.user.email} />
              </div>
              </Col>
            ))}
            </Row>
          </Container>
          </main>
        </div>
      )

      }
      {props.toSignByOthersContracts.length > 0 && (
        <div className="page">
          <h1>Contracts Needing Signatures from Others</h1>
          <main>
          <Container>
            <Row>
            {props.toSignByOthersContracts.map((contract) => (
              <Col xs={12} sm={12} md={6}>
              <div key={contract.id} className="contract">
                <Contract contract={contract} myEmail={session.user.email} />
              </div>
              </Col>
            ))}
            </Row>
          </Container>
          </main>
        </div>
      )

      }
      <br/>
      <div className="page">
        <h1>My Contracts</h1>
        <main>
        <Container>
         <Row>
          {props.contracts.map((contract) => (
            <Col xs={12} sm={12} md={6}>
            <div key={contract.id} className="contract">
              <Contract contract={contract} myEmail={session.user.email}/>
            </div>
            </Col>
          ))}
            </Row>
        </Container>
        </main>
      </div>
    </Layout>
  );
};

export default Contracts;