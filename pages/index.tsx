import React from "react"
import { GetStaticProps } from "next"
import Layout from "../components/Layout"
import Contract, { ContractProps } from "../components/Contract"
import prisma from '../lib/prisma';
// import './src/styles.css';

export const getServerSideProps: GetStaticProps = async () => {
  const feed = await prisma.contract.findMany({
    where: { isPublished: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  });
  return { props: { feed } };
};

type Props = {
  feed: ContractProps[]
}

const ContractList: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>My Contracts</h1>
        <main>
          {props.feed.map((contract) => (
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
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default ContractList
