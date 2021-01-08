import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";

export default function CountDown(props: any) {

  const [countDownNumber, setCountDownNumber] = useState<number>(3);
  const [countDownTimeout, setCountDownTimeout] = useState();

  useEffect(() => {
    if (countDownNumber > 0) {
      setCountDownTimeout(setTimeout(() => {
        setCountDownNumber((curr) => curr - 1)
      }, 1000));
    } else {
      props.setRecording(true);
    }
    return clearTimeout(countDownTimeout)
  }, [countDownNumber]);

  return (
    <Row style={{marginTop: '250px'}} className="justify-content-md-center">
      <h1 id="countdown" style={{fontSize: '80px', color: '#444444', textAlign: 'center'}}>{countDownNumber}</h1>
    </Row>
  );
}
