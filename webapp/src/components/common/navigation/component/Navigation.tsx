import React, {useCallback, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './Navigation.css';
import RootState from "../../../../store/root-state";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {DeleteUser} from "../../user/actions/UserActions";

import AccountIcon from "../icons/account.svg";
import CreateIcon from "../icons/create.svg";
import LibraryIcon from "../icons/library.svg";
import SharedIcon from "../icons/shared.svg";
import LogoutIcon from "../icons/logout.svg";
import {UserInterface} from "../../user/interface/UserInterface";

interface SelectorInterface {
    accountSelector: string
    createSelector: string
    librarySelector: string
    sharedSelector: string
}

export default function Navigation() {

    const history = useHistory();
    const dispatch = useDispatch();

    const pathname = window.location.pathname;

    const {
        accountSelector,
        createSelector,
        librarySelector,
        sharedSelector } = getSelector(pathname);

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
        <Container>
            <Row>
                <Col xs={{offset: 2}}>
                    <Row className="logo">
                        Tabber
                    </Row>
                    <Row className="nav-selection" id={accountSelector} onClick={()=>{history.push("/account")}}>
                        <img src={AccountIcon} className="icon" alt="account" /> Account
                    </Row>
                    <Row className="nav-selection" id={createSelector} onClick={()=>{history.push("/create")}}>
                        <img src={CreateIcon} className="icon" alt="create" /> Create
                    </Row>
                    <Row className="nav-selection" id={librarySelector} onClick={()=>{history.push("/library")}}>
                        <img src={LibraryIcon} className="icon" alt="library" /> Library
                    </Row>
                    <Row className="nav-selection bottom" id={sharedSelector} onClick={()=>{history.push("/shared")}}>
                        <img src={SharedIcon} className="icon" alt="shared" /> Shared
                    </Row>
                    <Row className="nav-selection" onClick={logout}>
                        <img src={LogoutIcon} className="icon" alt="logout" /> Logout
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

function getSelector(pathname: String): SelectorInterface {
    const selector: SelectorInterface = {
        accountSelector: "",
        createSelector: "",
        librarySelector: "",
        sharedSelector: "",
    }
    if (pathname.startsWith("/account")) {
        selector.accountSelector = "selected";
    } else if (pathname.startsWith("/create")) {
        selector.createSelector = "selected";
    } else if (pathname.startsWith("/library")) {
        selector.librarySelector = "selected";
    } else if (pathname.startsWith(("/shared"))) {
        selector.sharedSelector = "selected";
    }
    return selector;
}
