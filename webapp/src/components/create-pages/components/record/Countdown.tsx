import React, { useEffect, useState } from "react";

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
    <h1>{countDownNumber}</h1>
  );
}
