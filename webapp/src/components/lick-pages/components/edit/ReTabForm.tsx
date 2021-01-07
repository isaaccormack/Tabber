import React, { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { formatCapo, throwFormattedError } from "../../../common/utils/formattingHelpers";
import { useHistory } from "react-router";
import ReTabLickModal from "./ReTabLickModal";
import CapoFormControl from "./CapoFormControl";
import TuningFormControl from "./TuningFormControl";

export default function ReTabForm(props: any) {
  const history = useHistory();

  const [tuning, setTuning] = useState<string>(props.lickTuning);
  const [capo, setCapo] = useState<number>(props.lickCapo);
  const [showReTabModal, setShowReTabModal] = useState<boolean>(false);

  const reTabLick = () => {
    history.push('/uploading');

    fetch("/api/lick/re-tab/" + props.lickId, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tuning, capo })
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throwFormattedError('Lick could not be re-tabbed', response.status, response.statusText);
    })
    .then(() => {
      history.push({
        pathname: '/edit/' + props.lickId,
        state: {from: 'uploading', lickName: props.lickName}
      });
    })
    .catch(() => {
      history.push({
        pathname: '/edit/' + props.lickId,
        state: {from: 'error-re-tab', msg: 'Could not re-tab lick'}
      });
    })
  }

  return (
    <>
      <ReTabLickModal lickName={props.lickName}
                      showModal={showReTabModal}
                      handleCloseModal={() => setShowReTabModal(false)}
                      reTabLick={reTabLick}
      />
      <Form onSubmit={(e: any) => e.preventDefault()}>
        <Form.Row>
          <Form.Group as={Col} xs={5}>
            <Form.Label>
              <h3>Tuning</h3>
            </Form.Label>
            <TuningFormControl tuning={tuning} setTuning={setTuning} />
          </Form.Group>

          <Form.Group as={Col} className="align-self-end" xs={4}>
            <Form.Label>
              <h3>Capo</h3>
            </Form.Label>
            <CapoFormControl capo={capo} setCapo={setCapo} />
          </Form.Group>

          <Form.Group as={Col} className="align-self-end" xs={3}>
            <Button
              style={{color: 'white'}}
              variant="warning"
              type="submit"
              onClick={() => setShowReTabModal(true)}
              disabled={capo === props.lickCapo && tuning === props.lickTuning}
            >
              Re-Tab
            </Button>
          </Form.Group>
        </Form.Row>
      </Form>
    </>
  );
}
