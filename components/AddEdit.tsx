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
import 'react-quill/dist/quill.bubble.css';

import { ContractProps } from './Contract';
import { getSession, useSession } from 'next-auth/react';
import prisma from '../lib/prisma';
import { GetServerSideProps } from 'next';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import parseISO from 'date-fns/parseISO'

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
    const [startDate, setStartDate] = useState(contract.startDate);
    const [endDate, setEndDate] = useState(contract.endDate);
    const [amount, setAmount] = useState(contract.amount);
    const [showAmount, setShowAmount] = useState(contract.showAmount);
    const [interestRate, setInterestRate] = useState(contract.interestRate);
    const [showInterestRate, setShowInterestRate] = useState(contract.showInterestRate);
    const [firstPartySignDate, setFirstPartySignDate] = useState(contract.firstPartySignDate);
    const [secondPartySignDate, setSecondPartySignDate] = useState(contract.secondPartySignDate);
    const [duration, setDuration] = useState(contract.duration);
    const [allowCustomContract, setAllowCustomContract] = useState(contract.allowCustomContract);
    const [showAccountTypes, setShowAccountTypes] = useState(contract.showAccountTypes);
    const [firstPartyAccountType, setFirstPartyAccountType] = useState(contract.firstPartyAccountType);
    const [firstPartyAccountId, setFirstPartyAccountId] = useState(contract.firstPartyAccountId);
    const [secondPartyAccountType, setSecondPartyAccountType] = useState(contract.secondPartyAccountType);
    const [secondPartyAccountId, setSecondPartyAccountId] = useState(contract.secondPartyAccountId);
    const [contractId, setContractId] = useState(contract.contractId);


    let myDuration = 0;
    let myMonthlyPayment = "";

    const [] = useState();
    let saveButtonLabel = "Save Contract";

    if (isTemplate) {
        saveButtonLabel = "Save Template";
    }




    const onSubmit = (data, e) => {
        if (session && session.user.email == props.contract.author.email) {
            try {
                const renderedContent = content
                    .split("{Summary}").join(summary)
                    .split("{FirstPartyName}").join(firstPartyName)
                    .split("{FirstPartyEmail}").join(firstPartyEmail)
                    .split("{SecondPartyName}").join(secondPartyName)
                    .split("{SecondPartyEmail}").join(secondPartyEmail)
                    .split("{Amount}").join(amount.toString())
                    .split("{InterestRate}").join(interestRate.toString())
                    .split("{StartDate}").join(new Date(startDate).toLocaleDateString())
                    .split("{EndDate}").join(new Date(endDate).toLocaleDateString())
                    .split("{Title}").join(title).toString()
                    .split("{Duration}").join(monthDiff(startDate, endDate).toString())
                    .split("{MonthlyPayment}").join(monthlyPayment(amount, monthDiff(startDate, endDate), interestRate / 100));



                const body = { title, content, summary, firstPartyName, firstPartyEmail, secondPartyName, secondPartyEmail, renderedContent, isTemplate, allowCustomContract, startDate, endDate, amount, showAmount, interestRate, showInterestRate, duration, showAccountTypes, firstPartyAccountType, firstPartyAccountId, secondPartyAccountType, secondPartyAccountId, contractId };

                return isAddMode
                    ? createContract(body)
                    : updateContract(contract.id, body);
            } catch (error) {
                console.error(error);
            }
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
            <form onSubmit={handleSubmit(onSubmit, onError)}>
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
                        <label>&#123;Title&#125;</label>

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
                            onChange={(e) => setFirstPartyEmail(e.target.value.toLowerCase())}
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
                            onChange={(e) => setSecondPartyEmail(e.target.value.toLowerCase())}
                            placeholder="Second Party Email"
                            type="text"
                            value={secondPartyEmail}
                        />
                        {
                            isTemplate == true && (
                                <div><i>Templates can use 1/1/2001 for &#123;StartDate&#125; and &#123;EndDate&#125; to make these dates dynamic based on contract creation date.</i></div>
                            )}
                        <label>&#123;StartDate&#125;</label>
                        <DatePicker selected={new Date(startDate)} onChange={(date) => date.getDate() > 28 ? setStartDate(new Date(date.getFullYear(), date.getMonth() + 1, 1)) : setStartDate(date)} />
                        <label>&#123;EndDate&#125;</label>
                        <DatePicker selected={new Date(endDate)} onChange={(date) => date.getDate() > 28 ? setEndDate(new Date(date.getFullYear(), date.getMonth() + 1, 1)) : setEndDate(date)} />
                        {/* <DatePicker selected={new Date(endDate)} onChange={(date) => setEndDate(date)} /> */}



                        {
                            isTemplate == true && (
                                <div>
                                    Show Amount field? <input type="checkbox" checked={showAmount} onChange={() => setShowAmount(!showAmount)} />
                                </div>
                            )
                        }
                        {
                            showAmount == true && (
                                <div>

                                    <label>&#123;Amount&#125;</label>
                                    <input
                                        onChange={(e) => setAmount(parseFloat(e.target.value))}
                                        placeholder="Amount"
                                        type="number"
                                        value={amount}
                                    />
                                </div>
                            )}
                        {
                            isTemplate == true && (
                                <div>
                                    Show Interest Rate field? <input type="checkbox" checked={showInterestRate} onChange={() => setShowInterestRate(!showInterestRate)} />
                                </div>
                            )
                        }
                        {
                            showInterestRate == true && (
                                <div>

                                    <label>&#123;InterestRate&#125; % (e.g., 8 for 8%)</label>
                                    <input
                                        onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                                        placeholder="Interest Rate"
                                        type="number"
                                        value={interestRate}
                                    />
                                </div>
                            )}
                        {
                            isTemplate == true && (
                                <div>
                                    Show accounts? <input type="checkbox" checked={showAccountTypes} onChange={() => setShowAccountTypes(!showAccountTypes)} />
                                </div>
                            )
                        }
                        {
                            showAccountTypes == true && (
                                <>
                                <div>
                                    <label>&#123;firstPartyAccountType&#125; (e.g., Ethereum, Polygon)</label>
                                    <input
                                        onChange={(e) => setFirstPartyAccountType(e.target.value)}
                                        placeholder="First Party Account Type"
                                        type="text"
                                        value={firstPartyAccountType}
                                    />
                                </div>
                                <div>
                                    <label>&#123;firstPartyAccountId&#125; (e.g., Wallet Address)</label>
                                    <input
                                        onChange={(e) => setFirstPartyAccountId(e.target.value)}
                                        placeholder="First Party Account Id"
                                        type="text"
                                        value={firstPartyAccountId}
                                    />
                                </div>
                                <div>
                                    <label>&#123;secondPartyAccountType&#125; (e.g., Ethereum, Polygon)</label>
                                     <input
                                        onChange={(e) => setSecondPartyAccountType(e.target.value)}
                                        placeholder="Second Party Account Type"
                                        type="text"
                                        value={secondPartyAccountType}
                                    />
                                </div>
                                <div>
                                    <label>&#123;secondPartyAccountId&#125; (e.g., Wallet Address)</label>
                                    <input
                                        onChange={(e) => setSecondPartyAccountId(e.target.value)}
                                        placeholder="Second Party Account Id"
                                        type="text"
                                        value={secondPartyAccountId}
                                    />
                                </div>
                                <div>
                                    <label>&#123;contractId&#125; (e.g., Contract Address)</label>
                                    <input
                                        onChange={(e) => setContractId(e.target.value)}
                                        placeholder="Contract Id"
                                        type="text"
                                        value={contractId}
                                    />
                                </div>
                                </>
                            )}

                        {
                            isTemplate == false && (
                                <div>
                                    Convert this to a Template? <input type="checkbox" checked={isTemplate} onChange={() => setIsTemplate(!isTemplate)} />
                                </div>
                            )
                        }
                        {
                            isTemplate == true && (
                                <div>
                                    Allow Custom Contracts? <input type="checkbox" checked={allowCustomContract} onChange={() => setAllowCustomContract(!allowCustomContract)} />
                                </div>
                            )
                        }
                        <h2>Calculated Fields</h2>
                        {
                            firstPartySignDate != null && (
                                <><div>&#123;FirstPartySignDate&#125;</div>
                                    <div>{firstPartySignDate}</div>
                                </>
                            )}
                        <div>
                        </div>
                        {
                            secondPartySignDate != null && (
                                <><div>&#123;SecondPartySignDate&#125;</div>
                                    <div>{secondPartySignDate}</div>
                                </>
                            )}
                        <div>&#123;Duration&#125;</div>
                        <div>
                            {
                                myDuration = monthDiff(startDate, endDate)
                            } Months
                        </div>
                        {
                            amount > 0 && interestRate > 0 && startDate != null && endDate != null && (
                                <><div>&#123;MonthlyPayment&#125;</div>
                                    <div>
                                        {
                                            myMonthlyPayment = monthlyPayment(amount, monthDiff(startDate, endDate), interestRate / 100)
                                        }
                                    </div>
                                    <div>
                                        {
                                            parse(generatePaymentSchedule(startDate, endDate, amount, myMonthlyPayment, firstPartyAccountType, firstPartyAccountId, secondPartyAccountType, secondPartyAccountId, contractId))
                                        }
                                    </div>
                                </>
                            )}
                        <div>
                            <br />
                            {session && (
                                <button disabled={!content || !title} type="submit" className="btn btn-primary btn-space" onSubmit={handleSubmit(onSubmit, onError)}>{saveButtonLabel}</button>
                            )}
                            <button className="back btn-space btn btn-secondary" onClick={() => Router.push('/')}>Cancel</button>
                            <br />
                            <br />
                        </div>

                    </div>
                    <div className="col-sm" >
                        {
                            (isTemplate == true || allowCustomContract == true) && (
                                <>
                                    <div>
                                        <h2>Template Body</h2>
                                        <br />
                                        <div className="white">
                                            <QuillNoSSRWrapper modules={modules} placeholder='compose here' value={content} onChange={setContent} formats={formats} theme="snow" />
                                        </div>
                                        <br /><i>&#123;ContractTerms&#125; above will be replaced by entered values as shown below.</i><br /><hr />
                                    </div>
                                </>
                            )
                        }
                        {/* <h2>Contract Preview</h2> */}
                        {parse(content
                            .split("{Summary}").join(summary ? summary : "<strong>{Summary}</strong>")
                            .split("{FirstPartyName}").join(firstPartyName ? firstPartyName : "<strong>{FirstPartyName}</strong>")
                            .split("{FirstPartyEmail}").join(firstPartyEmail ? firstPartyEmail : "<strong>{FirstPartyEmail}</strong>")
                            .split("{SecondPartyName}").join(secondPartyName ? secondPartyName : "<strong>{SecondPartyName}</strong>")
                            .split("{SecondPartyEmail}").join(secondPartyEmail ? secondPartyEmail : "<strong>{SecondPartyEmail}</strong>")
                            .split("{Title}").join(title ? title : "<strong>{Title}</strong>")
                            .split("{Amount}").join(amount ? amount?.toString() : "<strong>{Amount}</strong>")
                            .split("{InterestRate}").join(interestRate ? interestRate?.toString() : "<strong>{InterestRate}</strong>")
                            .split("{StartDate}").join(startDate ? startDate.toLocaleDateString() : "<strong>{StartDate}</strong>")
                            .split("{EndDate}").join(endDate ? endDate.toLocaleDateString() : "<strong>{EndDate}</strong>")
                            .split("{Duration}").join(myDuration ? myDuration.toString() : "<strong>{Duration}</strong>")
                            .split("{MonthlyPayment}").join(myMonthlyPayment ? myMonthlyPayment.toString() : "<strong>{MonthlyPayment}</strong>")

                            // xxx need to add these terms to the above so that they are persisted. 
                        )
                        }
                    </div>
                </div>
            </form>
            <style jsx>{`
            .page {
              background: var(--geist-background);
              padding: 3rem;
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .white, .quill, .ql-snow  {
                background: white;
            }
            
            .react-datepicker-ignore-onclickoutside, 
            .input,  
            input[type='text'],
            input[type='number'],
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
              width: auto; 
            }
    
            input[type='submit']:enabled {
              background: steelblue; 
              border: 0;
              width: 100%; 
            }
    
            .back {
              margin-left: 1rem;
            }
          `}</style>
        </div>
    );
}

export default AddEdit;

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}

function generatePaymentSchedule(d1, d2, amount, myMonthlyPayment, firstPartyAccountType, firstPartyAccountId, secondPartyAccountType, secondPartyAccountId, contractId) {
    let myDuration = monthDiff(d1, d2);
    const d00 = new Date('1/1/1970');
    let d0 = new Date(d1);
    // let myMonths = []; 
    let myMonths = "<table class='table table-striped table-hover table-bordered'>";
    if (firstPartyAccountType && secondPartyAccountType ){
        myMonths = "{FirstPartyAccountId} Lender: <br/>"+firstPartyAccountId+"<br/>{SecondPartyAccountId} Borrower: <br/>"+secondPartyAccountId+"<br/><br/>" + myMonths;
    }
    let isEvm = false; 
    if (firstPartyAccountType == secondPartyAccountType && (firstPartyAccountType== "Ethereum" || firstPartyAccountType== "Polygon")){
        isEvm = true;
    }
    let accounts = ""; 
    let unixdates = ""; 
    let dateString = ""; 
    for (let i = 0; i < myDuration; i++) {
        if (i==0) {
            accounts = "<td>lender -> borrower</td>";  
            if (isEvm) {
                myMonths += "<tr><th>Date</th><th>Unix Date</th><th>Amount</th><th>Operation</th></tr>"; 
                unixdates = "<td>" + String(Math.round((d1.getTime() - d00.getTime()) / 1000)) + "</td>"; 
            }
            else {
                myMonths += "<tr><th>Date</th><th>Amount</th><th>Operation</th></tr>"; 
            }
            myMonths += "<tr><td>" + d1.toLocaleDateString() + "</td>" + unixdates + "<td>$" + amount + "</td>"+accounts+"</tr>";
            accounts = "<td>borrower -> lender</td>";   
        }
        dateString = new Date(d0.setMonth(d0.getMonth() + 1)).toLocaleDateString(); 
        (isEvm) ? unixdates = "<td>" + String(Math.round((d0.getTime() - d00.getTime()) / 1000)) + "</td>": unixdates = ""; 
        myMonths += "<tr><td>" + dateString + "</td>" + unixdates + "<td>$" + myMonthlyPayment + "</td>"+accounts+"</tr>";
    }
    myMonths += "</table>";
    return myMonths;
}


//monthly mortgage payment


function monthlyPayment(amount: number, duration: number, interestRate: number) {
    return (amount * interestRate / 12 * Math.pow(1 + interestRate / 12, duration) / (Math.pow(1 + interestRate / 12, duration) - 1)).toFixed(2)
}