import React from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import Layout from '../components/Layout';
import Contract, { ContractProps } from '../components/Contract';
import prisma from '../lib/prisma';
import Router from 'next/router';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { contracts: [] } };
  }

  //query for contracts assigned to user
  //   const contracts = await prisma.contract.findMany({
  //     where: {
  //       OR: [
  //       {
  //         firstParty: {
  //           email: session.user.email,
  //         },
  //       },
  //       { secondParty: { 
  //           email: session.user.email 
  //       } },
  //     ],
  //       isTemplate: false,
  //     },
  //     include: {
  //       author: {
  //         select: { name: true },
  //       },
  //     },
  //   });
  //   return {
  //     props: { contracts },
  //   };
  // };

  //query for contracts that need to get associated with me
  const contracts = await prisma.contract.findMany({
    where: {
      OR: [{
        AND: [{
          firstPartyId: null, 
        }, 
        {
          firstPartyEmail: session.user.email
        }]
      },
      {
        AND: [{
          secondPartyId: null, 
        }, {
          secondPartyEmail: session.user.email
        }]
      },
      ],
    },
  });//.then(() => createChildContract(contracts, session?.user?.email));
  
  return {
    props: { contracts },
  };
  
};

async function updateContract(id, myEmail, myParty) {
  let data = {}
  if (myParty == 1){
    data =  {
      firstParty: {  email: myEmail  }, 
    }; 
  }
  else{
    data =  {
      secondParty: {  email: myEmail  }, 
    }; 
  }
  const response = await fetch(`/api/contract/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
  }).then((response) => response.json());
}

async function associateParties(props: ContractProps[], myEmail: string): Promise<void> {
  console.log('hitting'); 
  for (let contract of props) {
    if (contract.firstPartyEmail == myEmail){
      console.log('inside hitting');
      await updateContract(contract.id, myEmail, 1); 
    }
    if (contract.secondPartyEmail == myEmail){
      console.log('inside hitting2 ');
      await updateContract(contract.id, myEmail, 2); 
    }
  }
  Router.push("/")
}

type Props = {
  contracts: ContractProps[];
};

const Signatures: React.FC<Props> = (props) => {
  const { data: session } = useSession();


  return (
    <Layout>
      <div className="page">
        <h1>Contracts for You</h1>
        <main>
          <button onClick={() => associateParties(props.contracts, session?.user?.email)}>Review These Contract</button>
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

export default Signatures;