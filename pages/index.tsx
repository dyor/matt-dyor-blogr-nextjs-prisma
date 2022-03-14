import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Contract, { ContractProps } from "../components/Contract"
import prisma from '../lib/prisma';
// import './src/styles.css';

export const getServerSideProps: GetStaticProps = async () => {
  const templates = await prisma.contract.findMany({
    where: { isTemplate: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return { props: { templates } };
};

type Props = {
  templates: ContractProps[]
}

const ContractList: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Templates</h1>
        <main>
          {props.templates.map((contract) => (
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
  )
}

export default ContractList
