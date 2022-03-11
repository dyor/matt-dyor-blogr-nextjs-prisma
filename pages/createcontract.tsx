import { AddEdit }  from '../components/AddEdit';
import Layout from '../components/Layout';

export default Add;

function Add() {
    return (
        <Layout>
            <h1>Add Contract</h1>
            <AddEdit />
        </Layout>
    );
}