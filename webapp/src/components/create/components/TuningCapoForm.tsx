import { Col, Form, Row } from "react-bootstrap";
import TuningFormControl from "../../lick-pages/components/edit/TuningFormControl";
import CapoFormControl from "../../lick-pages/components/edit/CapoFormControl";
import NavigationButton from "../../home-pages/components/common/NavigationButton";
import React, { useState } from "react";
import { throwFormattedError } from "../../common/utils/formattingHelpers";
import { LickInterface } from "../../common/lick/interface/LickInterface";
import { useHistory } from "react-router";
import { UserInterface } from "../../common/user/interface/UserInterface";
import { useSelector } from "react-redux";
import RootState from "../../../store/root-state";


export default function TuningCapoForm(props: any) {

  const history = useHistory();

  const user: UserInterface | undefined = useSelector((state: RootState) => state.userState.user);

  const [tuning, setTuning] = useState<string>("Standard");
  const [capo, setCapo] = useState<number>(0);

  const handleTabLick = () => {
    if (!props.file) return;
    history.push('/uploading')

    // pass route in here etc.
    if (user) {
      tabLick();
    } else {
      tabLick();
    }
  }

  const tabLick = () => {
    // must use FormData to send file
    const form = new FormData();
    form.append("file", props.file);
    form.append("tuning", tuning);
    form.append("capo", capo.toString());
    form.append("name", props.file.name);
    fetch("/api/lick",{
      method: "POST",
      body: form
    }).then((response) => {
      if (response.status === 201) {
        return response.json()
      }
      throwFormattedError('Lick could not be tabbed', response.status, response.statusText);
    }).then((responseJson: LickInterface) => {
        history.push("/edit/" + responseJson.id);
    }).catch((error) => {
      history.push({ pathname: "/upload",  state: { from: 'uploading' , lickName: props.file.name, msg: error.message } });
    })
  }

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
          <NavigationButton variant="success" desc="Get Tabs" onClick={handleTabLick}/>
        </Form.Row>
      </Form>
    </Row>
  );
}