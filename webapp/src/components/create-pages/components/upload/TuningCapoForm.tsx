import { Col, Form, Row } from "react-bootstrap";
import TuningFormControl from "../../../lick-pages/components/edit/TuningFormControl";
import CapoFormControl from "../../../lick-pages/components/edit/CapoFormControl";
import NavigationButton from "../../../home-pages/components/common/NavigationButton";
import React, { useState } from "react";
import { throwFormattedError } from "../../../common/utils/formattingHelpers";
import { LickInterface } from "../../../common/lick/interface/LickInterface";
import { useHistory } from "react-router";
import { UserInterface } from "../../../common/user/interface/UserInterface";
import { useSelector } from "react-redux";
import RootState from "../../../../store/root-state";
import { tabLick } from "../common/tabLick";


export default function TuningCapoForm(props: any) {
  const history = useHistory();

  const user: UserInterface | undefined = useSelector((state: RootState) => state.userState.user);

  const [tuning, setTuning] = useState<string>("Standard");
  const [capo, setCapo] = useState<number>(0);

  return (
    <Row style={{marginTop: '80px'}}  className="justify-content-md-center">
      <Form onSubmit={(e: any) => e.preventDefault()}>
        <Form.Row>
          <Form.Group as={Col} style={{marginRight: '100px'}}>
            <Form.Label as={Row} className="justify-content-md-center">
              <h3>Tuning</h3>
            </Form.Label>
            <TuningFormControl tuning={tuning} setTuning={setTuning} />
          </Form.Group>

          <Form.Group as={Col} style={{width: '300px'}}>
            <Form.Label as={Row} className="justify-content-md-center">
              <h3>Capo</h3>
            </Form.Label>
            <CapoFormControl capo={capo} setCapo={setCapo} />
          </Form.Group>
        </Form.Row>
        <Form.Row style={{marginTop: '80px'}} className="justify-content-md-center">
          <NavigationButton
            variant="success"
            desc="Get Tabs"
            onClick={() => tabLick(history, props.file, capo, tuning, user as boolean, '/upload')}
          />
        </Form.Row>
      </Form>
    </Row>
  );
}