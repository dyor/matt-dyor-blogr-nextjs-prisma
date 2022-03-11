
import Layout from '../components/Layout';
import Router from 'next/router';
import ReactQuill from 'react-quill';



import { propTypes } from 'react-bootstrap/esm/Image';



const Draft: React.FC = () => {
    
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [firstPartyName, setFirstPartyName] = useState('');
  const [firstPartyEmail, setFirstPartyEmail] = useState('');
  const [secondPartyName, setSecondPartyName] = useState('');
  const [secondPartyEmail, setSecondPartyEmail] = useState('');
  const [content, setContent] = useState('');
  const [isTemplate, setIsTemplate] = useState('');
  

  
  


  const submitData = async (e: React.SyntheticEvent) => {
    e.preventDefault();
   
    //   const body = { fieldNames };
      console.log(body); 
      
  };
  xxx
};

export default Draft;