import AddEdit   from '../components/AddEdit';
import Layout from '../components/Layout';
import Contract, { ContractProps } from '../components/Contract';

export default Add;

function Add() {
    let body: ContractProps  = {
        id: 0,
        title: "My New Contract",
        content: "<h1>{Title}</h1><h2>{Summary}</h2><p>This Agreement is made between {FirstPartyName} with an email address of {FirstPartyEmail} and {SecondPartyName} with an email address of {SecondPartyEmail}. </p><h2>Term</h2><p>This agreement has an effective date of {StartDate} and will end {EndDate} for a total of {Duration} months. </p><p><br></p>",
        summary: "",
        firstPartyName: "",
        firstPartyEmail: "",
        secondPartyName: "",
        secondPartyEmail: "",
        renderedContent: "",
        isTemplate: true,
        allowCustomContract: false,
        author: {
            name: '',
            email: ''
        },
        isPublished: false,
        isPublic: false,
        firstPartySignDate: null,
        secondPartySignDate: null,
        firstParty: {
            name: '',
            email: ''
        },
        secondParty: {
            name: '',
            email: ''
        },
        startDate: new Date("1/1/2001"),
        duration: 0,
        endDate: new Date("1/1/2001"),//new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        amount: 0,
        showAmount: false, 
        interestRate: 0, 
        showInterestRate: false, 
        showAccountTypes: false, 
        firstPartyAccountType: '', 
        firstPartyAccountId: '', 
        secondPartyAccountType: '', 
        secondPartyAccountId: '', 
        contractId: '', 
    };
    return (
        <Layout>
            {/* <h1>Create Contract Template</h1> */}
            {body ? <AddEdit contract={body} /> : <h1>Loading...</h1> } 
        </Layout>
    );
}