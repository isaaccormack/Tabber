import React, {useCallback, useEffect} from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';

import './Navigation.css';
import RootState from "../../../../store/root-state";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {DeleteUser} from "../../user/actions/UserActions";

import RecordIcon from "../icons/record.svg";
import UploadIcon from "../icons/upload.svg";
import {UserInterface} from "../../user/interface/UserInterface";

import UploadButton from "./UploadButton";

export default function Navigation() {

    const history = useHistory();
    const dispatch = useDispatch();

    const pathname = window.location.pathname;

    const logout = useCallback(() => {
        dispatch(DeleteUser());
        history.push("/login");
        localStorage.clear();
    }, [dispatch, history])

    // If No user
    const user: UserInterface | undefined = useSelector((state: RootState) => state.userState.user);
    if (pathname !== "/login" && !user) history.push("/login");

    //check on initial load
    if (user && user.identityToken) {
        if (Math.floor(Date.now() / 1000) > user.identityToken.exp) {
            logout();
        }
    }

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

    return (
        <Navbar bg="primary" variant="dark">
            <Container>
            <Navbar.Brand href="/" className="logo">
                Tabber
            </Navbar.Brand>
            {user &&
            <Nav className="ml-auto">
                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip id="button-tooltip">Record a Lick</Tooltip>}
                    >
                    <Nav.Link href="/create/record" bsPrefix="navItem">
                        <img src={RecordIcon} style={{height: 22}} alt="record"/>
                    </Nav.Link>
                </OverlayTrigger>
                <OverlayTrigger
                    placement="bottom"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip id="button-tooltip">Upload a Lick</Tooltip>}
                    >
                    <Nav.Link href="/" bsPrefix="navItem"> 
                        {/* <img src={UploadIcon} style={{height: 30}}/> */}
                        <UploadButton/>
                    </Nav.Link>
                </OverlayTrigger>
                <Nav.Link onClick={logout} bsPrefix="navItem" style={{display: "flex", alignItems: "center"}}>
                    <div className="sign-out">
                        Sign Out
                    </div>
                </Nav.Link>
            </Nav>
            }
            </Container>
      </Navbar>
    );
}