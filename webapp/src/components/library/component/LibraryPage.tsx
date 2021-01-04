import React, { useEffect, useState } from "react";
import { LickInterface } from "../../common/lick/interface/LickInterface";
import Container from "react-bootstrap/Container";
import { formatCapo, formatDate, formatLickLength } from "./FormattingHelpers";
import TurntableIcon from "../icons/turntable.svg"
import "./LibraryPage.css";
import IconTitleBlock from "./IconTitleBlock";
import LibraryTable from "./LibraryTable";
import { useHistory } from "react-router";
import { Alert } from "react-bootstrap";

// TODO: consolidate this somewhere
interface AlertInterface {
  msg: string,
  variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "dark" | "light" | undefined;
}

// TODO: make this handle no licks
export default function LibraryPage(props: any) {
  const history = useHistory();

  const [licks, setLicks] = useState<LickInterface[]>([])
  const [alert, setAlert] = useState<AlertInterface>();
  const [alertTimeout, setAlertTimeout] = useState();

  // TODO: refactor these into useCheckRedirect() and useClearAlert() after clean up some pages
  useEffect(() => {
    if (props.location.state && props.location.state.from === "delete") {
      setAlert({msg: props.location.state.lickName + " was deleted!", variant: "success"})
      history.push({ state: { from: '' } });
    }
  }, [])

  useEffect(() => {
    if (alert) {
      clearTimeout(alertTimeout);
      setAlertTimeout(setTimeout(() => { setAlert(undefined) }, 5000));
    }
  }, [alert])

  function getLibrary() {
    fetch("/api/user/licks", {
      method: "GET"
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      }
    }).then((responseJson: LickInterface[]) => {
      if (responseJson) {
        setLicks(responseJson.sort((a, b) => a.dateUploaded > b.dateUploaded ? 1 : -1));
      }
    })
  }

  useEffect(() => {
    getLibrary();
  }, [])

  const headerCols: {key: string, value: string}[] = [
    {key: 'Title', value: 'name'},
    {key: 'Length', value: 'audioLength'},
    {key: 'Date Uploaded', value: 'dateUploaded'},
    {key: 'Tuning', value: 'tuning'},
    {key: 'Capo', value: 'capo'}
  ];

  // bodyRows must match up with headerCols + lick.id as first entry
  // const getBodyRows = () => {
  //   {/* TODO: change dateUploaded -> dateShared */}
  //   return licks.map((lick) =>
  //     [lick.id, lick.name, formatLickLength(lick.audioLength), formatDate(lick.dateUploaded), lick.tuning, formatCapo(lick.capo)])
  // }

  const renderTableBody = () => {
    return (
      <tbody>
        {licks.map((lick) =>
          <tr key={lick.id} onClick={() => history.push("/edit/" + lick.id)}>
            <td>{lick.name}</td>
            <td>{formatLickLength(lick.audioLength)}</td>
            <td>{formatDate(lick.dateUploaded)}</td>
            <td>{lick.tuning}</td>
            <td>{formatCapo(lick.capo)}</td>
          </tr>
        )}
      </tbody>
    );
  }

  // TODO: break table off into its own component so it can be used between lib and share page
  // TODO: could make column width fixed so changing placement of icon doesn't mess everything up
  return (
    <Container>
      {alert &&
        <Alert
          style={{marginTop: '5px'}}
          dismissible
          variant={alert.variant}
          onClose={() => setAlert(undefined)}
        >
          {alert.msg}
        </Alert>
      }
      <IconTitleBlock icon={TurntableIcon} title="Library" lickLengthArr={licks.map((lick) => lick.audioLength)}/>
      <LibraryTable headerCols={headerCols} setLicks={setLicks} defaultSortColumn={"dateUploaded"} renderTableBody={renderTableBody}/>
    </Container>
  );
}