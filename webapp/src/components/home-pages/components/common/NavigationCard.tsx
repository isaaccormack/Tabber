import { Row } from "react-bootstrap";
import React from "react";

// TODO: make type interface for props
export default function NavigationCard(props: any) {
  return (
    <>
      <Row>
        <img src={props.icon} height={props.iconHeight} alt={props.name + " icon"}/>
      </Row>
      <Row style={{marginTop: '10px'}}>
        <h2>{props.name}</h2>
      </Row>
      <Row>
        <h4 style={{color: 'lightgrey', textAlign: 'center'}}>{props.desc}</h4>
      </Row>
      <Row style={{marginTop: '7px'}}>
        {props.button}
      </Row>
    </>
  );
}