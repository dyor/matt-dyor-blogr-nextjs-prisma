import { AddEdit }  from '../../components/AddEdit';
import Layout from '../../components/Layout';
import { ContractProps } from '../../components/Contract';
import prisma from '../../lib/prisma';
import { GetServerSideProps } from 'next';



export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const contract = await prisma.contract.findUnique({
      where: {
        id: Number(params?.id) || -1,
      },
      include: {
        author: {
          select: { name: true, email: true },
        },
      },
    });
    return {
      props: contract,
    };
  };

const Edit: React.FC<ContractProps> = (props) => {

    var body = { 
        id: props.id,
        title: props.title, 
        content: props.content, 
        summary: props.summary, 
        firstPartyName: props.firstPartyEmail, 
        firstPartyEmail: props.firstPartyEmail, 
        secondPartyName: props.secondPartyName, 
        secondPartyEmail: props.secondPartyEmail, 
        renderedContent: props.renderedContent, 
        isTemplate: props.isTemplate};

    return (
        <Layout>
            <h1>Edit Contract</h1>
            {body ? <AddEdit contract={body} /> : <h1>Loading...</h1> } 
        </Layout>
    )
}

export default Edit;

