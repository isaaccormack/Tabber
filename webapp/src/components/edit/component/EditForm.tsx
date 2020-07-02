import React from "react";
import {useForm} from "react-hook-form";

import "./EditForm.css";
import {Col, Container, Row} from "react-bootstrap";
import {LickInterface} from "../../common/lick/interface/LickInterface";

interface EditFormProps {
    formTitle: string
    onSubmit: Function
    defaultLick?: LickInterface
    disabled?: boolean
    tuningReadOnly: boolean
    showPublic: boolean
}

export interface LickFormInterface {
    lickname: string
    lickdescription: string
    licktuning: string
    lickpublic: boolean
}

export default function EditForm(props: EditFormProps) {
    const { register, handleSubmit, errors } = useForm({
        defaultValues: {
            lickname: props.defaultLick?.name,
            lickdescription: props.defaultLick?.description,
            licktuning: props.defaultLick?.tuning
        }
    });

    const onSubmit = (data: any) => {props.onSubmit(data);}


    // add props to this to hide public and make tuning read only
    return (
        <Container fluid className="edit-form-wrapper">
            <div className="form-title">
                {props.formTitle}
            </div>
            <br />
            <form onSubmit={handleSubmit(onSubmit)}>
                <fieldset disabled={props.disabled}>
                   <Row className="form-row">
                       <Col className="form-label" lg={2}>Lick Name</Col>
                       <Col>
                           <input className="form-input"
                                  name="lickname"
                                  ref={register({ required: true })}
                                  autoFocus
                           />
                           {errors.lickname &&
                           <span className="required-text">This field is required!</span>}
                       </Col>
                   </Row>
                   <Row className="form-row">
                       <Col className="form-label" lg={2}>Description</Col>
                       <Col>
                           <input className="form-input"
                                  name="lickdescription"
                                  ref={register}
                           />
                       </Col>
                   </Row>
                   <Row className="form-row">
                       <Col className="form-label" lg={2}>Tuning</Col>
                       <Col>
                           <input className="form-input"
                                  name="licktuning form-input"
                                  ref={register}
                                  readOnly={props.tuningReadOnly}
                           />
                       </Col>
                   </Row>
                   {props.showPublic && 
                   <Row className="form-row">
                       <Col className="form-label" lg={2}>Public</Col>
                       <Col>
                           <input type="checkbox"
                                  name="lickpublic"
                                  defaultChecked={props.defaultLick?.isPublic}
                                  ref={register} />
                       </Col>
                   </Row>
                    }
                    {!props.disabled &&
                    <Row className="form-row">
                        <input type="submit"/>
                    </Row>
                    }
                </fieldset>
            </form>
        </Container>
    )
}
