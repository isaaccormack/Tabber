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
    uploading: boolean
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

                    {/* if uploading, show upload option, else just display tuning */}
                    {props.uploading ? 
                        <Row className="form-row">
                            <Col className="form-label" lg={2}>Tuning</Col>
                            <Col>
                                <select name="licktuning" id="licktuning" ref={register}>
                                    <option value="Standard">Standard</option>
                                    <option value="Drop D">Drop D</option>
                                    <option value="Open G">Open G</option>
                                </select>
                            </Col>
                            <Col className="form-label" lg={2}>Privacy</Col>
                            <Col>
                                <select name="lickpublic" id="lickpublic" ref={register}>
                                    <option value="Private">Private</option>
                                    <option value="Public">Public</option>
                                </select>
                            </Col>
                        </Row>
                    :
                    <Row className="form-row">
                        <Col className="form-label" lg={2}>Tuning</Col>
                        <Col>
                            <input className="form-input"
                                    name="licktuning"
                                    ref={register}
                                    readOnly={true}
                            />
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
