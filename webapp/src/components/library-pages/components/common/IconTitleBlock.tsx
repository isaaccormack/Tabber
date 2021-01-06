import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { formatSumOfLickLengths } from "../../../common/utils/formattingHelpers";
import React from "react";


export default function IconTitleBlock(props: any) {
  const lickLengths: number[] = props.lickLengthArr;

  const getLickLengths = () => {
    return lickLengths.reduce((prev, curr) => {return prev + curr}, 0)
  }

  return (
    <Row style={{marginTop: '20px'}}>
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
            {lickLengths.length > 0 &&
            <>
              {lickLengths.length}
              {lickLengths.length === 1 ?
                <>{' lick, '}</>
                :
                <>{' licks, '}</>
              }
              {formatSumOfLickLengths(getLickLengths())}</>
            }
          </h3>
        </Row>
      </Col>
    </Row>
  );
}
