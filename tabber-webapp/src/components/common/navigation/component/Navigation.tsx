import React, {useEffect, useState} from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import './Navigation.css';
import RootState from "../../../../store/root-state";
import {useSelector} from "react-redux";


export default function Navigation() {

    const pathname = window.location.pathname;
    let createClassName = "";
    let listenClassName = "";
    if (pathname === "/") createClassName="selected";
    else listenClassName ="selected";

    let loginText = useSelector((state: RootState) => state.navigationState.user);
    if (loginText === undefined) loginText = "Login";
    console.log(loginText)
    const [loginUrl, setLoginURL] = useState("");
    useEffect(() => {
        fetch("/login/url")
            .then(response => response.text())
            .then(data => setLoginURL(data));
    }, [loginUrl])

    return (
        <Container fluid>
            <Row className="topbarRow">
                <Col lg={{offset: 2, span: 1}}>
                    <div className="logo">
                        Tabber
                    </div>
                </Col>
                <Col xs={{offset: 7}}>
                    <a className="accountInfo" href={loginUrl}>
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