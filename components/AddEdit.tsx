import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Layout from '../components/Layout';
import Router from 'next/router';
import dynamic from 'next/dynamic'

import parse from 'html-react-parser';
import 'react-quill/dist/quill.snow.css';

import { ContractProps } from './Contract';
import { getSession, useSession } from 'next-auth/react';
import prisma from '../lib/prisma';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = await getSession({ req });
    if (!session) {
      res.statusCode = 403;
      return { props: { contracts: [] } };
    }
}



// import { Link } from 'components';
// import { userService, alertService } from 'services';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
    ssr: false,
    loading: () => <p>Loading ...</p>,
});

const modules = {
    toolbar: [
        [{ header: '1' }, { header: '2' }], //, { font: [] }],
        //[{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [
            { list: 'ordered' },
            { list: 'bullet' },
            { indent: '-1' },
            { indent: '+1' },
        ],
        //   ['link', 'image', 'video'],
        ['link']
        ['clean'],
    ],
    clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
    },
}
const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'indent',
    'link',
]

type Props = {
    contract: ContractProps;
  };

const AddEdit: React.FC<Props> = (props) => {
    const { data: session } = useSession();

    const contract = props.contract;
    const isAddMode = !(contract.id > 0);
    console.log("isAddMode");

    console.log(contract);
    const router = useRouter();
    // form validation rules 
    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required'),
        content: Yup.string()
            .required('Last Name is required'),
    });
    const { register, handleSubmit } = useForm();
    //const onSubmit = (data, e) => console.log(data, e);
    const onError = (errors, e) => console.log(errors, e);

    const formOptions = { resolver: yupResolver(validationSchema) };
    // get functions to build form with useForm() hook
    //const { register, handleSubmit, reset, formState } = useForm(formOptions);
    //const { errors } = formState;
    const [title, setTitle] = useState(contract.title);
    const [summary, setSummary] = useState(contract.summary);
    const [firstPartyName, setFirstPartyName] = useState(contract.firstPartyName);
    const [firstPartyEmail, setFirstPartyEmail] = useState(contract.firstPartyEmail);
    const [secondPartyName, setSecondPartyName] = useState(contract.secondPartyName);
    const [secondPartyEmail, setSecondPartyEmail] = useState(contract.secondPartyEmail);
    const [content, setContent] = useState(contract.content);
    const [isTemplate, setIsTemplate] = useState(contract.isTemplate);
    let saveButtonLabel = "Save Contract";
    if (isTemplate) {
        saveButtonLabel = "Save Template";
    }

    const onSubmit = (data, e) => {
        try {
            const renderedContent = content
                .split("{FirstPartyName}").join(firstPartyName)
                .split("{FirstPartyEmail}").join(firstPartyEmail)
                .split("{SecondPartyName}").join(secondPartyName)
                .split("{SecondPartyEmail}").join(secondPartyEmail)
                .split("{Summary}").join(summary)
                .split("{Title}").join(title).toString();
            const body = { title, content, summary, firstPartyName, firstPartyEmail, secondPartyName, secondPartyEmail, renderedContent, isTemplate };

            return isAddMode
                ? createContract(body)
                : updateContract(contract.id, body);
        } catch (error) {
            console.error(error);
        }
    }


    async function createContract(data) {
        try {
            const response = await fetch('/api/contract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),

            }).then(async (response) =>
                associateParties(await response.json(), session.user.email)
                ).then((response2) => Router.push(`/c/${response2}`));
        } catch (error) {
            console.error(error);
        }
    }

    //----------------------------------------------------------------

    async function updateContractParties(id, myEmail, myParty) {
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

    async function associateParties(contract: ContractProps, myEmail: string): Promise<number> {
        if (contract.firstPartyEmail == myEmail) {
            updateContractParties(contract.id, myEmail, 1);
        }
        if (contract.secondPartyEmail == myEmail) {
            updateContractParties(contract.id, myEmail, 2);
        }
        return contract.id;
    }

    //----------------------


    async function updateContract(id, data) {
        console.log('in update');
        console.log(data);
        const response = await fetch(`/api/contract/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).then(async (response) =>
            associateParties(await response.json(), session.user.email)
        ).then((response2) => Router.push(`/c/${response2}`));
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm">
                    {
                        isTemplate == true && (
                            <h2>Default Template Values </h2>
                        )}
                    {
                        isTemplate == false && (
                            <h2>Key Contract Terms</h2>
                        )}
                    {/* <form onSubmit={submitData}> */}
                    <label>&#123;Title&#125;</label>
                    <form onSubmit={handleSubmit(onSubmit, onError)}>
                        <input
                            autoFocus
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Title"
                            type="text"
                            value={title}
                        />

                        <label>&#123;Summary&#125;</label>
                        <input
                            onChange={(e) => setSummary(e.target.value)}
                            placeholder="Summary"
                            type="text"
                            value={summary}
                        />
                        <label>&#123;FirstPartyName&#125;</label>
                        <input
                            onChange={(e) => setFirstPartyName(e.target.value)}
                            placeholder="First Party Name"
                            type="text"
                            value={firstPartyName}
                        />
                        <label>&#123;FirstPartyEmail&#125;</label>
                        <input
                            onChange={(e) => setFirstPartyEmail(e.target.value)}
                            placeholder="First Party Email"
                            type="text"
                            value={firstPartyEmail}
                        />
                        <label>&#123;SecondPartyName&#125;</label>
                        <input
                            onChange={(e) => setSecondPartyName(e.target.value)}
                            placeholder="Second Party Name"
                            type="text"
                            value={secondPartyName}
                        />
                        <label>&#123;SecondPartyEmail&#125;</label>
                        <input
                            onChange={(e) => setSecondPartyEmail(e.target.value)}
                            placeholder="Second Party Email"
                            type="text"
                            value={secondPartyEmail}
                        />

                        <div>
                            <input disabled={!content || !title} type="submit" value={saveButtonLabel} className="btn btn-primary btn-space" />
                            <button className="back btn-space btn btn-secondary" onClick={() => Router.push('/')}>Cancel</button>   

                            {
                                isTemplate == false && (
                                    <div>
                                        Is this a Template? <input type="checkbox" checked={isTemplate} onChange={() => setIsTemplate(!isTemplate)} />
                                        </div>
                                )}

                        </div>
                    </form>
                </div>
                <div className="col-sm contract" >

                    {
                        isTemplate == true && (
                            <>
                                <h2>Template Body</h2>
                                <div>
                                    <br />
                                    <QuillNoSSRWrapper modules={modules} placeholder='compose here' value={content} onChange={setContent} formats={formats} theme="snow" />
                                    <br /><i>&#123;ContractTerms&#125; will be replaced.</i><br /><hr /><br />
                                </div>
                            </>
                        )
                    }


                    <h2>Contract Preview</h2>
                    {parse(content
                        .split("{FirstPartyName}").join(firstPartyName ? firstPartyName : "<strong>{FirstPartyName}</strong>")
                        .split("{FirstPartyEmail}").join(firstPartyEmail ? firstPartyEmail : "<strong>{FirstPartyEmail}</strong>")
                        .split("{SecondPartyName}").join(secondPartyName ? secondPartyName : "<strong>{SecondPartyName}</strong>")
                        .split("{SecondPartyEmail}").join(secondPartyEmail ? secondPartyEmail : "<strong>{SecondPartyEmail}</strong>")
                        .split("{Summary}").join(summary ? summary : "<strong>{Summary}</strong>")
                        .split("{Title}").join(title ? title : "<strong>{Title}</strong>")

                        )
                    }
                </div>


            </div>

            <style jsx>{`
            .page {
              background: var(--geist-background);
              padding: 3rem;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            input {
                display: inline;
            }
    
    
            input[type='text'],
            textarea {
              width: 100%;
              padding: 0.5rem;
              margin: 0.5rem 0;
              border-radius: 0.25rem;
              border: 0.125rem solid rgba(0, 0, 0, 0.2);
            }
            .btn-space {
                margin-left: 5px;
                vertical-align: unset; 
            }
            
    
            input[type='submit']:disabled {
              color: #ccc;
              cursor: no-drop;
            }
    
            input[type='submit']:enabled {
              background: steelblue; 
              border: 0;
              padding: 1rem 2rem;
            }
    
            .back {
              margin-left: 1rem;
            }
          `}</style>
        </div>
    );
}

export default AddEdit;