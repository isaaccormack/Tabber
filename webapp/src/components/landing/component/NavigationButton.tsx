import { Button } from "react-bootstrap";
import ArrowTipLightIcon from "../icons/arrow-tip-light.svg";
import React from "react";

export default function NavigationButton(props: any) {

  {/* TODO: doesn't work on mobile */}
  return (
    <Button variant={props.variant} style={{borderRadius: '20px', color: "white"}} onClick={props.onClick}>
      <span style={{marginLeft: '55px'}}> </span>
      {props.desc}
      <img src={ArrowTipLightIcon} height={15} alt="little arrow icon" style={{marginLeft: '35px'}}/>
    </Button>
  );
}