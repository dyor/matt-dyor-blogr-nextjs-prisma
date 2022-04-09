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



const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <div className="layout">{props.children}</div>
   </div>
);

export default Layout;
