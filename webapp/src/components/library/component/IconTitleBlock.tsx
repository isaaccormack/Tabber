import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import TurntableIcon from "../icons/turntable.svg";
import { formatSumOfLickLengths } from "./FormattingHelpers";
import Container from "react-bootstrap/Container";
import React from "react";


export default function IconTitleBlock(props: any) {
  const lickLengths: number[] = props.lickLengthArr;

  const getLickLengths = () => {
    return lickLengths.reduce((prev, curr) => {return prev + curr}, 0)
  }

  return (
    <Row style={{marginTop: '40px'}}>
      <Col className="align-self-center">
        <Row className="justify-content-md-end">
          <img src={props.icon} height={120} alt="" style={{marginRight: '20px'}}/>
        </Row>
      </Col>
      <Col className="align-self-center">
        <Row>
          <h1>{props.title}</h1>
        </Row>
        <Row>
          <h3 style={{color: 'lightgrey', textAlign: 'center'}}>
            {/* put this here for now to fix 0 - 0 problem... */}
            {lickLengths.length > 0 &&
            <>{lickLengths.length} licks, {formatSumOfLickLengths(getLickLengths())}</>
            }
          </h3>
        </Row>
      </Col>
    </Row>
  );
}
