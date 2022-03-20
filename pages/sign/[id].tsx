import { useState } from 'react';

import { useFormik } from 'formik';
import type { NextPage } from 'next';
import * as yup from 'yup';
import { GetServerSideProps } from 'next';
import prisma from '../../lib/prisma';
import { ContractProps } from '../../components/Contract';
import Router from 'next/router';
import parseISO from 'date-fns/parseISO'


import 'bootstrap/dist/css/bootstrap.min.css';
import { useSession } from 'next-auth/react';

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

const Sign: React.FC<ContractProps> = (props) => {
  const { data: session } = useSession();
  const [message, setMessage] = useState(''); // This will be used to show a message if the submission is successful
  const [submitted, setSubmitted] = useState(false);
  const re = new RegExp(props.firstPartyName);
  let data = {};

  const formik = useFormik({
    initialValues: {
      // email: 'matt',
      name: '',
      // message: '',
    },
    onSubmit: async () => {
      //if session.user.email == props.firstPartyEmail then update firstPartySignDate to today
      //else if 

      if (session.user.email == props.firstPartyEmail) {
        data = {
          firstPartySignDate: new Date(),
        }
      }
      else if (session.user.email == props.secondPartyEmail) {
        data = {
          secondPartySignDate: new Date(),
        }
      }
      const response = await fetch(`/api/contract/${props.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((response2) => Router.push(`/c/${props.id}`));
    },
    //   setMessage('Form submitted');
    //   setSubmitted(true);
    // },
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
    <>
      <div className="jumbotron text-center">
        <h1>Review and Sign Contract</h1>
        <p>Review contract then type your name in the box below + click "Sign" button to sign contract.  </p>
      </div>

      <div className="container border border-secondary">
        <div className="row">
          <div className="col-sm-6">
            <h2>Key Terms</h2>
            <table className="table table-striped table-hover table-bordered">
              <tbody>
                <tr>
                  <th>
                    Term
                  </th>
                  <th>
                    Value
                  </th>
                </tr>
                <tr>
                  <td>
                    &#123;Title&#125;
                  </td>
                  <td>
                    {props.title}
                  </td>
                </tr>
                <tr>
                  <td>
                    &#123;Summary&#125;
                  </td>
                  <td>
                    {props.summary}
                  </td>
                </tr>
                <tr>
                  <td>
                    &#123;FirstPartyName&#125;
                  </td>
                  <td>
                    {props.firstPartyName}
                  </td>
                </tr>
                <tr>
                  <td>
                    &#123;FirstPartyEmail&#125;
                  </td>
                  <td>
                    {props.firstPartyEmail}
                  </td>
                </tr>
                <tr>
                  <td>
                    &#123;FirstPartySignDate&#125;
                  </td>
                  <td>
                    {props.firstPartySignDate}
                  </td>
                </tr>
                <tr>
                  <td>
                    &#123;SecondPartyName&#125;
                  </td>
                  <td>
                    {props.secondPartyName}
                  </td>
                </tr>
                <tr>
                  <td>
                    &#123;SecondPartyEmail&#125;
                  </td>
                  <td>
                    {props.secondPartyEmail}
                  </td>
                </tr>
                <tr>
                  <td>
                    &#123;SecondPartySignDate&#125;
                  </td>
                  <td>
                    {props.secondPartySignDate}
                  </td>
                </tr>
                <tr>
                  <td>
                    &#123;StartDate&#125;
                  </td>
                  <td>
                    {new Date(props.startDate).toDateString()}
                  </td>
                </tr>
                <tr>
                  <td>
                    &#123;EndDate&#125;
                  </td>
                  <td>
                    {new Date(props.endDate).toDateString()}
                  </td>
                </tr>
                {
                  props.showAmount && (
                    <tr>
                      <td>
                        &#123;Amount&#125;
                      </td>
                      <td>
                        {props.amount}
                      </td>
                    </tr>
                  )}
                  {
                  props.showInterestRate && (
                    <tr>
                      <td>
                        &#123;InterestRate&#125;
                      </td>
                      <td>
                        {props.interestRate}
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>
          <div className="col-sm-6">
            <div dangerouslySetInnerHTML={{ __html: props.renderedContent }} />
          </div>
        </div>
      </div>
      <div className="jumbotron text-center">
        <h1>Review and Sign Contract</h1>
        <div hidden={!submitted} className="alert alert-primary" role="alert">
          {message}
        </div>
        <div>
          <form onSubmit={formik.handleSubmit} className="form-inline">
            {formik.errors.name && (
              <div className="text-danger">{formik.errors.name}</div>
            )}
            <div className="form-group">
              <input
                type="text"
                name="name"
                className="form-control btn-space"
                placeholder={props.firstPartyName}
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button type="submit" className="btn btn-primary btn-space">
                Sign
              </button>

              {/* <input disabled={!content || !title} type="submit" value={saveButtonLabel} className="btn btn-primary btn-space" /> */}


              <button className="back btn-space btn btn-secondary" onClick={() => Router.push(`/c/${props.id}`)}>Cancel</button>

            </div>
            <div><em> Enter your name ({props.firstPartyName}) + click sign</em></div>

            <div>{props.firstPartyName} {props.firstPartyEmail} signed {props.firstPartySignDate ? props.firstPartySignDate : "not yet"}</div>
            <div>{props.secondPartyName} {props.secondPartyEmail} signed {props.secondPartySignDate ? props.secondPartySignDate : "not yet"}</div>


          </form>
          <style jsx>{`
            .form-control {
              display:inline; 
            }
            .back {
              bgcolor: red; 
            }
            .btn-space {
              margin-left: 5px;
              vertical-align: unset; 
          }
            input[type='text'],
            textarea {
              width: auto;
              padding: 0.5rem;
              margin: 0.5rem 0;
              border-radius: 0.25rem;
              border: 0.125rem solid rgba(0, 0, 0, 0.2);
            }
            `}
          </style>
        </div>
      </div>
    </>
  );
};

export default Sign;