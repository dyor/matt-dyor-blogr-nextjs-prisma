import { useState } from 'react';

import { useFormik } from 'formik';
import type { NextPage } from 'next';
import * as yup from 'yup';
import { GetServerSideProps } from 'next';
import prisma from '../../lib/prisma';
import { ContractProps } from '../../components/Contract';


import 'bootstrap/dist/css/bootstrap.min.css';

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

const Sign: React.FC<ContractProps> = (props) => {
  const [message, setMessage] = useState(''); // This will be used to show a message if the submission is successful
  const [submitted, setSubmitted] = useState(false);
  const re = new RegExp(props.firstPartyName);
      
  const formik = useFormik({
    initialValues: {
      // email: 'matt',
      name: '',
      // message: '',
    },
    onSubmit: () => {
      setMessage('Form submitted');
      setSubmitted(true);
    },
    validationSchema: yup.object({
      name: yup.string().trim().required('Name is required').matches(re)
      // email: yup
      //   .string()
      //   .email('Must be a valid email')
      //   .required('Email is required'),
      // message: yup.string().trim().required('Message is required'),
    }),
  });

  return (
    <div className="vh-100 d-flex flex-column justify-content-center align-items-center">
      <div>
      <div dangerouslySetInnerHTML={{ __html: props.renderedContent }} />
        
      </div>
      <div hidden={!submitted} className="alert alert-primary" role="alert">
        {message}
      </div>

      <form className="w-50" onSubmit={formik.handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Enter your name ({props.firstPartyName}) below and click sign to sign this contract. 
          </label>
          <input
            type="text"
            name="name"
            className="form-control"
            placeholder={props.firstPartyName}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.name && (
            <div className="text-danger">{formik.errors.name}</div>
          )}
        </div>

        {/* <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            name="email"
            className="form-control"
            placeholder="john@example.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.email && (
            <div className="text-danger">{formik.errors.email}</div>
          )}
        </div> */}
{/* 
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Message
          </label>
          <textarea
            name="message"
            className="form-control"
            placeholder="Your message ..."
            value={formik.values.message}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.errors.message && (
            <div className="text-danger">{formik.errors.message}</div>
          )}
        </div> */}

        <button type="submit" className="btn btn-primary">
          Sign
        </button>
      </form>
    </div>
  );
};

export default Sign;