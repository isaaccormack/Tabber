import React, { useCallback, useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';

import './Header.css';
import RootState from "../../../../store/root-state";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { DeleteUser } from "../../user/actions/UserActions";

import CircleIcon from "../icons/circle.svg";
import UserIcon from "../icons/user.svg";
import { UserInterface } from "../../user/interface/UserInterface";
import { NavDropdown } from "react-bootstrap";

export default function Header() {

  const history = useHistory();
  const dispatch = useDispatch();

  const user: UserInterface | undefined = useSelector((state: RootState) => state.userState.user);
  const [loginUrl, setLoginURL] = useState("");
  const [activeKey, setActiveKey] = useState(() => { return window.location.pathname });

  useEffect(() => {
    fetch("/api/loginUrl")
      .then(response => response.text())
      .then(data => setLoginURL(data));
  }, [loginUrl])

  const logout = useCallback(() => {
    dispatch(DeleteUser());
    history.push("/");
    localStorage.clear();
  }, [dispatch, history])

  // TODO: not sure if this should be here...
  useEffect(() => {
    // Checks if token has expired every 30 seconds
    const timer = setInterval(() => {
      if (user && user.identityToken) {
        if (Math.floor(Date.now() / 1000) > user.identityToken.exp) {
          logout();
        }
      }
    }, 30000);
    return () => clearInterval(timer);
  }, [logout, user])

  //check on initial load
  if (user && user.identityToken) {
    if (Math.floor(Date.now() / 1000) > user.identityToken.exp) {
      logout();
    }
  }

  const tabberBrand = () => {
    return (
      <Navbar.Brand href="/">
        <img src={CircleIcon} height={35} alt="tabber icon" style={{marginBottom: '5px'}}/>
        {' '}
        <p style={{display: 'inline', color: user ? 'white' : '#606060'}}>
          Tabber
        </p>
      </Navbar.Brand>
    );
  }

  // Note: href will re-render the entire app forcing all components to remount which resets state here
  const loggedInNavBar = () => {
    const recordPath = "/create/record";
    const uploadPath = "/create/upload";
    const libraryPath = "/library";
    const sharedPath = "/shared";

    const handleSelect = (setActiveKey: Function, path: string) => {
      setActiveKey(path)
      history.push(path)
    }

    return (
      <div style={{backgroundColor: '#75a9f9', color: 'white'}}>
        <Container>
          <Navbar variant="dark">
            {tabberBrand()}
            {/* TODO: figure out how to display which page is selected */}
            {/*  see for how to do: https://stackoverflow.com/questions/36342220/tabs-in-react-bootstrap-navbar */}
            <Nav variant="pills" className="ml-auto" activeKey={activeKey}>
              <Nav.Link eventKey={recordPath} onSelect={() => {handleSelect(setActiveKey, recordPath)}}>
                Record
              </Nav.Link>
              <Nav.Link eventKey={uploadPath} onSelect={() => {handleSelect(setActiveKey, uploadPath)}}>
                Upload
              </Nav.Link>
              <Nav.Link eventKey={libraryPath} onSelect={() => {handleSelect(setActiveKey, libraryPath)}}>
                Library
              </Nav.Link>
              <Nav.Link eventKey={sharedPath} onSelect={() => {handleSelect(setActiveKey, sharedPath)}}>
                Shared
              </Nav.Link>
              <NavDropdown title={user && user.name} id="basic-nav-dropdown" style={{marginLeft: '10px'}}>
                <NavDropdown.Item onClick={logout}>
                  Sign Out
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar>
        </Container>
      </div>
    );
  }

  const notLoggedInNavBar = () => {
    return (
      <Container>
        <Navbar variant="light">
          {tabberBrand()}
          <Nav className="ml-auto">
            <Nav.Link href={loginUrl} style={{marginLeft: '20px'}}>
              Sign In
              <img src={UserIcon} height={22} alt="user icon" style={{marginLeft: '8px', opacity: 0.6}}/>
            </Nav.Link>
          </Nav>
        </Navbar>
      </Container>
    );
  }

  return (
    <>
      {user ?
        <>{loggedInNavBar()}</>
        :
        <>{notLoggedInNavBar()}</>
      }
    </>
  );
}