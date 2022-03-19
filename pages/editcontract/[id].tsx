import AddEdit   from '../../components/AddEdit';
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
      props: JSON.parse(JSON.stringify(contract)),
    };
  };

const Edit: React.FC<ContractProps> = (props) => {
    console.log("props");
    console.log(props);
    let body: ContractProps  = {
      id: props.id,
      title: props.title,
      content: props.content,
      summary: props.summary,
      firstPartyName: props.firstPartyName,
      firstPartyEmail: props.firstPartyEmail,
      secondPartyName: props.secondPartyName,
      secondPartyEmail: props.secondPartyEmail,
      renderedContent: props.renderedContent,
      isTemplate: props.isTemplate,
      author: {
        name: '',
        email: ''
      },
      isPublished: props.isPublished,
      isPublic: props.isPublic,
      firstPartySignDate: props.firstPartySignDate,
      secondPartySignDate: props.secondPartySignDate,
      firstParty: {
        name: '',
        email: ''
      },
      secondParty: {
        name: '',
        email: ''
      },
      startDate: props.startDate,
      duration: 0,
      endDate: props.endDate,
      amount: props.amount,
      showAmount: props.showAmount
    };

    return ( 
        <Layout>
            {/* <h1>Edit Contract</h1> */}
            {body ? <AddEdit contract={body} /> : <h1>Loading...</h1> } 
        </Layout>
    )
}

export default Edit;

