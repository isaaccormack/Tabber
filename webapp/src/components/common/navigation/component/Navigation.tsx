import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './Navigation.css';
import RootState from "../../../../store/root-state";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router";
import {DeleteUser} from "../../user/actions/UserActions";

export default function Navigation() {

    const history = useHistory();
    const dispatch = useDispatch();

    const pathname = window.location.pathname;
    let createClassName = "";
    let listenClassName = "";
    if (pathname === "/") createClassName="selected";
    else listenClassName ="selected";

    let loginText = useSelector((state: RootState) => state.userState.user);
    if (loginText === undefined) loginText = "";

    // Simple redirection to login page, needs to be changed use cookies later
    if (pathname !== "/login" && loginText === "") history.push("/login");

    const logout = () => {
        dispatch(DeleteUser());
        history.push("/login");
        localStorage.clear();
    }

    return (
        <Container fluid>
            <Row className="topbarRow">
                <Col lg={{offset: 2, span: 1}}>
                    <div className="logo">
                        Tabber
                    </div>
                </Col>
                <Col xs={{offset: 7}}>
                    <a className="accountInfo" onClick={logout} href={""}>
                        {loginText}
                    </a>
                </Col>
            </Row>
            <br />
            <Row className="toolSelection">
                <Col lg={{offset: 2, span: 1}}>
                    <div className={createClassName}>
                        Create
                    </div>
                </Col>
                <Col lg={{span: 1}}>
                    <div className={listenClassName}>
                        Listen
                    </div>
                </Col>
            </Row>
        </Container>
    );
}