import React from "react";
import { Button, Col, Form, FormControl, InputGroup, Row, Table } from "react-bootstrap";
import RemoveIcon from "../icons/remove.svg";

export default function ShareForm(props: any) {
  return (
    <>
    <Form>
      <Form.Group controlId="formBasicEmail">
        <Form.Label><h3>Share</h3></Form.Label>
        <InputGroup className="mb-3">
          <FormControl
            placeholder="Enter users email address"
            aria-describedby="basic-addon2"
          />
          <InputGroup.Append>
            <Button variant="success">Share</Button>
          </InputGroup.Append>
        </InputGroup>
      </Form.Group>
    </Form>
      <Table borderless>
        <tbody style={{display: "block", maxHeight: "100px", overflowY: "scroll"}}>
        <tr style={{paddingTop: '0px', paddingBottom: '5px'}}>
          <td style={{paddingTop: '0px', paddingBottom: '5px'}}>
            <span style={{fontWeight: "bold"}}>Jim James</span> jim@google.com
            <img style={{textAlign: "right"}} src={RemoveIcon} height={25} alt="singer icon"/>
          </td>
        </tr>
        <tr>
          <td style={{paddingTop: '0px', paddingBottom: '5px'}}>
            <span style={{fontWeight: "bold"}}>Jim James</span> jim@google.com
            <img style={{textAlign: "right"}} src={RemoveIcon} height={25} alt="singer icon"/>
          </td>
        </tr>
        </tbody>
      </Table>
    </>
  );
}
