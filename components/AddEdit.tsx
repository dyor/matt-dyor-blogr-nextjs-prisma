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
import { useSession } from 'next-auth/react';
import prisma from '../lib/prisma';



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

export { AddEdit };

function AddEdit(props) {
    console.log("yes");
    console.log(props);

    const contract = props?.contract;
    const isAddMode = !contract;
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


    function checkValue(e) {
        setIsTemplate(String(e.target.checked));
    }

    // const submitDatas = async (e: React.SyntheticEvent) => {
    //     alert();
    //     // e.preventDefault();
       // }
    const onSubmit = (data, e) => 
    {
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
    function onSubmits(data) {
        // display form data on success
        alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
        return false;
    }

    function createContract(data) {
        try {
            fetch('/api/contract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            //xxx probably need to look up latest created by
            Router.push(`/c/${contract.id}`);
        } catch (error) {
            console.error(error);
        }
    }


    function updateContract(id, data) {
        console.log('in update');
        console.log(data);
        fetch(`/api/contract/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        Router.push(`/c/${contract.id}`);
    }

    return (
            <div className="container">
                <div className="row">
                    <div className="col-sm">
                        <h2>Default Template Values or Key Contract Terms</h2>
                        {/* <form onSubmit={submitData}> */}
                        <form onSubmit={handleSubmit(onSubmit, onError)}>
                            <input
                                autoFocus
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                                type="text"
                                value={title}
                            />
                            {/* <div className="form-group form-check">
                                <input name="isTemplate" type="checkbox" {...register('isTemplate')} id="isTemplate" className={`form-check-input ${errors.isTemplate ? 'is-invalid' : ''}`} />
                                <label htmlFor="isTemplate" className="form-check-label">Is Template</label>
                            </div> */}
                            {/* Is this a Template? <input id="box1" onChange={checkValue} type="checkbox" value="True" onLoad={checkValue} /> */}
                            Is this a Template? <input type="checkbox" checked={isTemplate} onChange={() => setIsTemplate(!isTemplate)} />
                            
                            <input
                                onChange={(e) => setSummary(e.target.value)}
                                placeholder="Summary"
                                type="text"
                                value={summary}
                            />
                            <input
                                onChange={(e) => setFirstPartyName(e.target.value)}
                                placeholder="First Party Name"
                                type="text"
                                value={firstPartyName}
                            />
                            <input
                                onChange={(e) => setFirstPartyEmail(e.target.value)}
                                placeholder="First Party Email"
                                type="text"
                                value={firstPartyEmail}
                            />
                            <input
                                onChange={(e) => setSecondPartyName(e.target.value)}
                                placeholder="Second Party Name"
                                type="text"
                                value={secondPartyName}
                            />
                            <input
                                onChange={(e) => setSecondPartyEmail(e.target.value)}
                                placeholder="Second Party Email"
                                type="text"
                                value={secondPartyEmail}
                            />
                            {isTemplate}
                            {
                                isTemplate == true && (
                                    <div>
                                        <QuillNoSSRWrapper modules={modules} placeholder='compose here' value={content} onChange={setContent} formats={formats} theme="snow" />
                                    </div>
                                )
                            }
                            <div>
                                <input disabled={!content || !title} type="submit" value="Save Contract" />
                                <a className="back" href="#" onClick={() => Router.push('/')}>
                                    or Cancel
                                </a>
                            </div>
                        </form>
                    </div>
                    <div className="col-sm">
                        {/* <p>{value}</p> */}
                        <h2>Contract Appearance</h2>
                        {parse(content
                            .split("{FirstPartyName}").join(firstPartyName)
                            .split("{FirstPartyEmail}").join(firstPartyEmail)
                            .split("{SecondPartyName}").join(secondPartyName)
                            .split("{SecondPartyEmail}").join(secondPartyEmail)
                            .split("{Summary}").join(summary)
                            .split("{Title}").join(title))
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
    
    
            input[type='text'],
            input[type='submit'],
            textarea {
              width: 100%;
              padding: 0.5rem;
              margin: 0.5rem 0;
              border-radius: 0.25rem;
              border: 0.125rem solid rgba(0, 0, 0, 0.2);
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