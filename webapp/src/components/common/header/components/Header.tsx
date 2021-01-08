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
import { useLoginURL } from "./useLoginURL";

export default function Header() {

  const recordPath = "/record";
  const uploadPath = "/upload";
  const libraryPath = "/library";
  const sharedPath = "/shared";

  const history = useHistory();
  const dispatch = useDispatch();

  const user: UserInterface | undefined = useSelector((state: RootState) => state.userState.user);
  const [loginURL, setLoginURL] = useState("");
  const [activeKey, setActiveKey] = useState(() => { return window.location.pathname });

  useLoginURL(setLoginURL);

  useEffect(() => {
    const path = window.location.pathname;

    if (path.includes('record')) {
      setActiveKey(recordPath);
    } else if (path.includes('upload')) {
      setActiveKey(uploadPath);
    } else if (path.includes('library') || path.includes('edit')) {
      setActiveKey(libraryPath);
    }  else if (path.includes('shared') || path.includes('view')) {
      setActiveKey(sharedPath);
    } else {
      setActiveKey('');
    }
  }, [window.location.pathname])

  const logout = useCallback(() => {
    dispatch(DeleteUser());
    history.push("/");
    // this is not removing token from client...
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

  // TODO: maybe wont need this if i can get modal logic down to hard refresh page before navigating away
  // used to still refresh the page even if currently on the given page
  const historyPushWrapper = (destURL: string) => {
    if (destURL === window.location.pathname) {
      window.location.reload();
    } else {
      history.push(destURL)
    }
  }

  // Note: href will re-render the entire app forcing all components to remount which resets state here
  const loggedInNavBar = () => {

    return (
      <div style={{backgroundColor: '#75a9f9', color: 'white'}}>
        <Container>
          <Navbar variant="dark">
            {tabberBrand()}
            <Nav variant="pills" className="ml-auto" activeKey={activeKey}>
              <Nav.Link eventKey={uploadPath} style={{color: 'white'}} onSelect={() => historyPushWrapper(uploadPath)}>
                Upload
              </Nav.Link>
              <Nav.Link eventKey={recordPath} style={{color: 'white'}} onSelect={() => historyPushWrapper(recordPath)}>
                Record
              </Nav.Link>
              <Nav.Link eventKey={libraryPath} style={{color: 'white'}} onSelect={() => historyPushWrapper(libraryPath)}>
                Library
              </Nav.Link>
              <Nav.Link eventKey={sharedPath} style={{color: 'white'}} onSelect={() => historyPushWrapper(sharedPath)}>
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
          <Nav className="ml-auto" activeKey={activeKey}>
            <Nav.Link eventKey={uploadPath} onSelect={() => historyPushWrapper(uploadPath)}>
              Upload
            </Nav.Link>
            <Nav.Link eventKey={recordPath} onSelect={() => historyPushWrapper(recordPath)}>
              Record
            </Nav.Link>
            <Nav.Link href={loginURL} style={{marginLeft: '20px'}}>
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