import React, { ReactNode } from "react";
import Header from "./Header";
// import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';


// import ButtonsShowcase from './showcases/Buttons';
// import ToastsShowcase from './showcases/Toasts';


type Props = {
  children: ReactNode;
};

{/* <link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
  integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
/> */}

const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <div className="layout">{props.children}</div>
    {/* <style jsx global>{`
      html {
        box-sizing: border-box;
      }

      *,
      *:before,
      *:after {
        box-sizing: inherit;
      }

      body {
        margin: 0;
        padding: 0;
        font-size: 16px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
          Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
          "Segoe UI Symbol";
        background: rgba(0, 0, 0, 0.05);
      }

      input,
      textarea {
        font-size: 16px;
      }

      
      .layout {
        padding: 0 2rem;
      }
      textarea, input {
        display: block;
        width: 100%;
        border-radius: 0.25rem;
        border: 0.125rem solid rgba(0, 0, 0, 0.2);
        padding: 0.5rem;
        margin: 0.5rem 0;
      }
      input[type="checkbox"] {
        display: inline;
        width: auto;
        border-radius: 0.25rem;
        border: 0.125rem solid rgba(0, 0, 0, 0.2);
        padding: 0.5rem;
        margin: 0.5rem 0;
      }
      button {
        cursor: pointer;
        width: auto; 
      }
    `}</style> */}
  </div>
);

export default Layout;
