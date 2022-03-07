// pages/create.tsx

import React, { useState } from 'react';
import Layout from '../components/Layout';
import Router from 'next/router';
import ReactQuill from 'react-quill';
import dynamic from 'next/dynamic'
import 'react-quill/dist/quill.snow.css';

import parse from 'html-react-parser';

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
  /*
   * Quill editor formats
   * See https://quilljs.com/docs/formats/
   */
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
    // 'image',
  ]



const Draft: React.FC = () => {
    
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [firstPartyName, setFirstPartyName] = useState('');
  const [firstPartyEmail, setFirstPartyEmail] = useState('');
  const [secondPartyName, setSecondPartyName] = useState('');
  const [secondPartyEmail, setSecondPartyEmail] = useState('');
  const [content, setContent] = useState('');
  //const [renderedContent, setRenderedContent] = useState('');
  const fieldNames = [title, content, firstPartyName, firstPartyEmail, secondPartyName, secondPartyEmail]
  
  



  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const renderedContent = content
        .split("{FirstPartyName}").join(firstPartyName)
        .split("{FirstPartyEmail}").join(firstPartyEmail)
        .split("{SecondPartyName}").join(secondPartyName)
        .split("{SecondPartyEmail}").join(secondPartyEmail)
        .split("{Title}").join(title).toString();
      const body = { title, content, firstPartyName, firstPartyEmail, secondPartyName, secondPartyEmail, renderedContent};
    //   const body = { fieldNames };
      console.log(body); 
      await fetch('/api/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      await Router.push('/drafts');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Layout>
      <div className="container">
          <div className="row">
        <div className="col-sm">
        <h2>Default Template Values</h2>
        <form onSubmit={submitData}>
        <input
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
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
          <QuillNoSSRWrapper modules={modules} placeholder='compose here' value={content} onChange={setContent} formats={formats} theme="snow"  />
          <input disabled={!content || !title} type="submit" value="Create" className="mr-1" />
          <a className="back" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
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
            .split("{Title}").join(title))
            }
      
          

            </div>
          
        
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
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type='submit'] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Draft;