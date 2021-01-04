import React, { useState } from "react";
import { Button, Col, Form } from "react-bootstrap";
import { formatCapo, throwFormattedError } from "../../../common/utils/formattingHelpers";
import { useHistory } from "react-router";
import ReTabLickModal from "./ReTabLickModal";

export default function ReTabForm(props: any) {
  const history = useHistory();

  const [tuning, setTuning] = useState<string>(props.lickTuning);
  const [capo, setCapo] = useState<number>(props.lickCapo);
  const [showReTabModal, setShowReTabModal] = useState<boolean>(false);

  // TODO: clean this up between front and back end for less bugs..
  const tunings = ['Standard', 'Drop D', 'Open G'];
  // TODO: create capo positions from calling formatCapo() on 0 to 9 int array
  const capoPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => formatCapo(num));

  const reTabLick = () => {
    history.push('/404'); // redirect to upload page instead

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
    .then((responseJson) => {
      history.push({
        pathname: '/edit/' + responseJson.id,
        state: {from: '404', lickName: props.lickName}
      });
    })
    .catch((err: Error) => {
      // TODO: redirect to error page eventually -- probably want to send err.message via history.state too
      history.push('/');
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

            <Form.Control as="select" onChange={event => setTuning(event.target.value)}>
              {tunings.map((dispTuning: string) => {
                return (
                  <option
                    key={dispTuning}
                    selected={tuning === dispTuning}
                    value={dispTuning}
                  >
                    {dispTuning}
                  </option>
                );
              })}
            </Form.Control>
          </Form.Group>

          <Form.Group as={Col} className="align-self-end" xs={4}>
            <Form.Label><h3>Capo</h3></Form.Label>

            <Form.Control as="select" onChange={event => setCapo(parseInt(event.target.value))}>
              {capoPositions.map((capoPosition: string, index) => {
                return (
                  <option
                    key={index}
                    selected={formatCapo(capo) === capoPosition}
                    value={index.toString()}
                  >
                    {capoPosition}
                  </option>
                );
              })}
            </Form.Control>
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
