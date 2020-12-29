import React, { useCallback, useEffect, useState } from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

import './Navigation.css';
import RootState from "../../../../store/root-state";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { DeleteUser } from "../../user/actions/UserActions";

import CircleIcon from "../icons/circle.svg";
import UserIcon from "../icons/user.svg";
import LightUserIcon from "../icons/light-user.svg"

import UploadIcon from "../icons/upload.svg";
import { UserInterface } from "../../user/interface/UserInterface";

import UploadButton from "./UploadButton";
import GoogleLoginButton from "../../../login/component/GoogleLoginButton";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { FormControl, NavDropdown } from "react-bootstrap";

export default function Navigation() {

  const history = useHistory();
  const dispatch = useDispatch();

  const pathname = window.location.pathname;

  const logout = useCallback(() => {
    dispatch(DeleteUser());
    history.push("/");
    localStorage.clear();
  }, [dispatch, history])

  const user: UserInterface | undefined = useSelector((state: RootState) => state.userState.user);

  //check on initial load
  if (user && user.identityToken) {
    if (Math.floor(Date.now() / 1000) > user.identityToken.exp) {
      logout();
    }
  }

  const [loginUrl, setLoginURL] = useState("");

  useEffect(() => {
    fetch("/api/loginUrl")
      .then(response => response.text())
      .then(data => setLoginURL(data));
  }, [loginUrl])

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

  const loggedInNavBar = () => {
    return (
      <div style={{backgroundColor: '#75a9f9', color: 'white'}}>
        <Container>
          <Navbar variant="dark">
            {tabberBrand()}
            <Nav className="ml-auto">
              <Nav.Link href="/create/record" style={{color: 'white'}}>Record</Nav.Link>
              <Nav.Link href="/create/upload" style={{color: 'white'}}>Upload</Nav.Link>
              <Nav.Link href="/library" style={{color: 'white'}}>Library</Nav.Link>
              <Nav.Link href="/shared" style={{color: 'white'}}>Shared</Nav.Link>
              <NavDropdown title="Isaac Cormack" id="basic-nav-dropdown" style={{marginLeft: '10px'}}>
                <NavDropdown.Item onClick={logout}>
                  Sign Out
                  {/*<img src={LightUserIcon} height={22} alt="user icon" style={{marginLeft: '8px'}}/>*/}
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