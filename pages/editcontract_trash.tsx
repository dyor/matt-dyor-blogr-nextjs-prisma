import { useState, useEffect } from 'react';

import { AddEdit }  from '../components/AddEdit';
import Layout from '../components/Layout';
import { ContractProps } from '../components/Contract';
import prisma from '../lib/prisma';



// import { Spinner } from 'components';

export default Edit;

function Edit({ id }) {
    const [contract, setContract] = useState(null);

    var  body = { title: "title", content: "content", firstPartyName: "firstPartyName", firstPartyEmail: "firstPartyEmail", secondPartyName: "secondPartyName", secondPartyEmail: "secondPartyEmail", renderedContent: "renderedContent", isTemplate: false};
    //   const body = { fieldNames };
    console.log(body); 
    console.log("body")
    // fetch('/api/contract', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(body),
    //     });


    return (
        <Layout>
            <h1>Edit Contract</h1>
            {/* {contract ? <AddEdit contract={contract} /> : <h1>Loading...</h1> } */}
            <AddEdit></AddEdit>
        </Layout>

        
       

    )
    
    
}

export async function getServerSideProps({ params }) {
    return {
        props: { id: params.id }
    }
}




