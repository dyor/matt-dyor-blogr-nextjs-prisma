import React from 'react';
import { GetServerSideProps } from 'next';
import { useSession, getSession } from 'next-auth/react';
import LayoutSkinny from '../components/LayoutSkinny';
import Contract, { ContractProps } from '../components/Contract';
import prisma from '../lib/prisma';
import Router from 'next/router';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 403;
    return { props: { contracts: [] } };
  }
  if (session.user.email.toLocaleLowerCase() != session.user.email){
    console.log('need to lowercase'); 

    
    const contract = await prisma.user.update({
      where: { email:  session.user.email},
       data: 
          {
            email: session.user.email.toLocaleLowerCase() 
          },
      },
    );
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
    props: JSON.parse(JSON.stringify({ contracts })),
   
  };
};

async function updateContract(id, myEmail, myParty) {
  let data = {}
  if (myParty == 1) {
    data = {
      firstParty: { email: myEmail },
    };
  }
  else {
    data = {
      secondParty: { email: myEmail },
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
    if (contract.firstPartyEmail == myEmail) {
      console.log('inside hitting');
      await updateContract(contract.id, myEmail, 1);
    }
    if (contract.secondPartyEmail == myEmail) {
      console.log('inside hitting2 ');
      await updateContract(contract.id, myEmail, 2);
    }
  }
  Router.push("/contracts")
}

type Props = {
  contracts: ContractProps[];
};

const Signatures: React.FC<Props> = (props) => {
  const { data: session } = useSession();


  return (
    <LayoutSkinny>
    <div className="page jumbotron text-center">
      <h1>Contracts for You</h1>
      <main>
        {
          props.contracts.length > 0 && (
            <>
              <div>You have contracts to review...</div>
              <br />
              <button onClick={() => associateParties(props.contracts, session?.user?.email)} className="btn btn-success btn-space">Review Your Contracts</button>
            </>
          )
        }
        {
          props.contracts.length == 0 && (
            <>
              <div>You do not have any contracts yet. </div>
              <br />
              <button onClick={() => Router.push("/")} className="btn btn-success btn-space">Create a Contract from a Template</button>
            </>
          )
        }
      </main>
    </div>
    </LayoutSkinny>
  );
};

export default Signatures;