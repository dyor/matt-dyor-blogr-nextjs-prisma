// Header.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import Head from 'next/head'


const Header: React.FC = () => {
  const router = useRouter();
  const isActive: (pathname: string) => boolean = (pathname) =>
    router.pathname === pathname;

  const { data: session, status } = useSession();

  let left = (
    <div className="left">
      <style jsx>{`
        .bold {
          font-weight: bold;
        }

        a {
          text-decoration: none;
          color: var(--geist-foreground);
          display: inline-block;
        }

        .left a[data-active='true'] {
          color: gray;
        }

        a + a {
          margin-left: 1rem;
        }
      `}</style>
    </div>
  );

  let right = null;

  if (status === 'loading') {
    left = (
      <div className="left">
        <Link href="/">
          <a data-active={isActive('/')}>
            Templates
          </a>
        </Link>
        <style jsx>{`
          .bold {
            font-weight: bold;
          }

          a {
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
          }

          .left a[data-active='true'] {
            color: gray;
          }

          a + a {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        <p>Validating session ...</p>
        <style jsx>{`
          .right {
            margin-left: auto;
          }
        `}</style>
      </div>
    );
  }

  if (!session) {
    right = (
      <div className="right">
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="/api/auth/signin">
        <img src="/favicon-32x32.png" className='mynav'></img>
        sign in to SparkContract
      </Navbar.Brand>
      </Navbar>
        <style jsx>{`
        .mynav {
          padding-left: 0.5rem; 
          padding-right: 0.5rem; 
        }
          a {
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
          }

          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
          }

          .right a {
            border: 1px solid var(--geist-foreground);
            // padding: 0.5rem 1rem;
            border-radius: 3px;
          }
        `}</style>
      </div>
    );
  }

  if (session) {
    left = (
      <div className="left">
        {/* <Link href="/">
          <a data-active={isActive('/')}>
          <button className="btn btn-primary btn-space">Templates
            </button>
          </a>
        </Link> */}
        <Link href="/contracts">
          <a data-active={isActive('/contracts')}>
          <button className="btn btn-primary btn-space">My Contracts
            </button>
            </a>
        </Link>
        <style jsx>{`
        
          .bold {
            font-weight: bold;
          }

          a {
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
          }

          .left a[data-active='true'] {
            color: gray;
          }

          a + a {
            margin-left: 1rem;
          }
        `}</style>
      </div>
    );
    right = (
      <div className="right">
        {/* <Link href="/createcontract">
          <button className="btn btn-secondary btn-space">
            <a>+ New Template</a>
          </button>
        </Link> */}
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Navbar.Brand href="/contracts">
        <img src="/favicon-32x32.png" className='mynav'></img>
        SparkContract
      </Navbar.Brand>
      {/* <Navbar.Text>
          Hello {session.user.name} ({session.user.email})
      </Navbar.Text> */}
      <Navbar.Toggle aria-controls="responsive-navbar-nav" className="mx-3" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mx-3">
        
        <Navbar.Text >{session.user.name} ({session.user.email})</Navbar.Text>
          <Nav.Link href="/contracts">My Contracts</Nav.Link>
          <Nav.Link href="/">New Contract</Nav.Link>
          <Nav.Link href="/createcontract">New Template</Nav.Link>
          <Nav.Link href="#" onClick={() => signOut()}>Logout</Nav.Link>
          {/* <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              Another action
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
              Separated link
            </NavDropdown.Item>
          </NavDropdown> */}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
            <style jsx>{`
          .mynav {
            padding-left: 0.5rem; 
            padding-right: 0.5rem; 
          }
          .btn-space {
              margin-left: 5px;
              vertical-align: unset; 
          }
          a {
            text-decoration: none;
            color: var(--geist-foreground);
            display: inline-block;
          }

          p {
            display: inline-block;
            font-size: 13px;
            padding-right: 1rem;
          }

          a + a {
            margin-left: 1rem;
          }

          .right {
            margin-left: auto;
            padding-bottom: 25px; 
          }

          .right a {
            border: 1px solid var(--geist-foreground);
            // padding: 0.5rem 1rem;
            border-radius: 3px;
          }

        `}</style>
      </div>
    );
  }

  // return (
  //   <nav>
  //     {left}
  //     {right}
  //     <style jsx>{`
  //       nav {
  //         display: flex;
  //         padding: 2rem;
  //         align-items: center;
  //       }
  //     `}</style>
  //   </nav>
  // );
  return(
    <>
    <Head>
        <title>SparkContract: Smart Contract Authoring Service</title>
    </Head>
    {right}
    </>
  );
};

export default Header;