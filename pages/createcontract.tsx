import AddEdit   from '../components/AddEdit';
import Layout from '../components/Layout';
import Contract, { ContractProps } from '../components/Contract';

export default Add;

function Add() {
    let body: ContractProps  = {
        id: 0,
        title: "",
        content: "",
        summary: "",
        firstPartyName: "",
        firstPartyEmail: "",
        secondPartyName: "",
        secondPartyEmail: "",
        renderedContent: "",
        isTemplate: true,
        author: {
            name: '',
            email: ''
        },
        isPublished: false,
        isPublic: false,
        firstPartySignDate: undefined,
        secondPartySignDate: undefined,
        firstParty: {
            name: '',
            email: ''
        },
        secondParty: {
            name: '',
            email: ''
        }
    };
    return (
        <Layout>
            {/* <h1>Create Contract Template</h1> */}
            {body ? <AddEdit contract={body} /> : <h1>Loading...</h1> } 
        </Layout>
    );
}