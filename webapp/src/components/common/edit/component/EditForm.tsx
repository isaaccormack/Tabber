import React from "react";
import {useForm} from "react-hook-form";

import "./EditForm.css";
import {Col, Container, Row} from "react-bootstrap";
import {LickInterface} from "../../../library/component/LibraryTable";
import {Lick} from "../../../../../../server/src/entity/lick";

interface EditFormProps {
    formTitle: string
    onSubmit: Function
    defaultLick?: LickInterface
}

export interface LickFormInterface {
    lickname: string
    lickdescription: string
    licktuning: string
    lickpublic: boolean
}

export default function EditForm(props: EditFormProps) {
    const { register, handleSubmit, errors } = useForm();
    const onSubmit = (data: any) => props.onSubmit(data);


    return (
        <Container fluid className="edit-form-wrapper">
            <div className="form-title">
                {props.formTitle}
            </div>
            <br />
            <form onSubmit={handleSubmit(onSubmit)}>
               <Row className="form-row">
                   <Col className="form-label" xs={2}>Lick Name</Col>
                   <Col>
                       <input className="form-input"
                              name="lickname"
                              value={props.defaultLick?.name}
                              ref={register({ required: true })}
                              autoFocus
                       />
                       {errors.lickname &&
                       <span className="required-text">This field is required!</span>}
                   </Col>
               </Row>
               <Row className="form-row">
                   <Col className="form-label" xs={2}>Description</Col>
                   <Col>
                       <input className="form-input"
                              name="lickdescription"
                              value={props.defaultLick?.description}
                              ref={register}
                       />
                   </Col>
               </Row>
               <Row className="form-row">
                   <Col className="form-label" xs={2}>Tuning</Col>
                   <Col>
                       <input className="form-input"
                              name="licktuning form-input"
                              value={props.defaultLick?.tuning}
                              ref={register}
                       />
                   </Col>
               </Row>
               <Row className="form-row">
                   <Col className="form-label" xs={2}>Public</Col>
                   <Col>
                       <input type="checkbox"
                              name="lickpublic"
                              ref={register} />
                   </Col>
               </Row>
               <br />
               <Row className="form-row">
                   <input type="submit" />
               </Row>
            </form>
        </Container>
    )
}
