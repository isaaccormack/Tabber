import React, { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { formatCapo } from "../../library/component/FormattingHelpers";
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

  // TODO: move this into component which is only rendered when lick exists so dont need lick!.id
  const reTabLick = () => {
    history.push('/404'); // redirect to upload page instead

    fetch("/api/lick/re-tab/" + props.lickId, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newTuning: tuning,
        newCapo: capo
      })
    })
      // TODO: set alert that says cant update lick for some reason, ie. bad req, server error (maybe?)
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Couldn\'t update lick');
        }
      })
      .then((responseJson) => {
        history.push({
          pathname: '/edit/' + responseJson.id,
          state: {
            from: '404'
          }
        });
      })
      .catch((error) => {
        history.push('/'); // redirect to error page eventually
        console.error(error)
      })
  }


  return (
    <>
    <ReTabLickModal lickName={props.lickName}
                    showModal={showReTabModal}
                    handleCloseModal={() => setShowReTabModal(false)}
                    reTabLick={reTabLick}
    />
    <Form onSubmit={(e: any) => {e.preventDefault()}}>
      <Form.Row>
        <Form.Group as={Col} controlId="formGridState" xs={5}>
          <Form.Label><h3>Tuning</h3></Form.Label>

          <Form.Control as="select" onChange={(event => {
            console.log(event.target.value)
            setTuning(event.target.value)
          })}>
            {tunings.map((tuning: string) => {
              return <option key={tuning} selected={tuning === tuning} value={tuning}>{tuning}</option>;
            }) }
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} className="align-self-end" xs={4}>
          <Form.Label><h3>Capo</h3></Form.Label>

          <Form.Control as="select" onChange={(event => {
            console.log(event.target.value);
            setCapo(parseInt(event.target.value))
          })}>
            {capoPositions.map((capoPosition: string, index) => {
              return <option key={index} selected={formatCapo(capo) === capoPosition} value={index.toString()}>{capoPosition}</option>;
            }) }
          </Form.Control>
        </Form.Group>

        <Form.Group as={Col} controlId="formGridState" className="align-self-end" xs={3}>
          <Button
            id="re-tab-button"
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
