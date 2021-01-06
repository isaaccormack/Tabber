import React, { useState } from "react";
import { LickInterface } from "../../common/lick/interface/LickInterface";
import { formatCapo, formatLickLength } from "../../common/utils/formattingHelpers";
import Container from "react-bootstrap/Container";
import IconTitleBlock from "./common/IconTitleBlock";
import DanceIcon from "../icons/dance.svg";
import LibraryTable from "./common/LibraryTable";
import { useHistory } from "react-router";
import { useGetLibrary } from "../utils/useGetLibrary";
import { AlertInterface, useAlertTimeouts } from "../../common/utils/useAlertTimeouts";
import { useRedirectAlerts } from "../../common/utils/useRedirectAlerts";
import renderAlert from "../../common/utils/renderAlert";

export default function SharedPage() {
  const history = useHistory();

  const [licks, setLicks] = useState<LickInterface[]>([]);
  const [alert, setAlert] = useState<AlertInterface>();
  const [alertTimeout, setAlertTimeout] = useState();

  useGetLibrary("/api/user/licks-shared-with-me", setLicks, setAlert);
  useAlertTimeouts(alert, setAlert, alertTimeout, setAlertTimeout);
  useRedirectAlerts(setAlert, "unfollow", " was unfollowed", "success");

  const headerCols: {key: string, value: string}[] = [
    {key: 'Title', value: 'name'},
    {key: 'Author', value: 'owner'},
    {key: 'Length', value: 'audioLength'},
    // {key: 'Date Uploaded', value: 'dateUploaded'},
    {key: 'Tuning', value: 'tuning'},
    {key: 'Capo', value: 'capo'}
  ];

  // bodyRows must match up with headerCols + lick.id as first entry
  // const getBodyRows = () => {
  //   {/* TODO: change dateUploaded -> dateShared */}
  //   return licks.map((lick) => [lick.id, lick.name, lick.owner.name, formatLickLength(lick.audioLength), formatDate(lick.dateUploaded)])
  // }

  const renderTableBody = () => {
    return (
      <tbody>
        {licks.map((lick) =>
          <tr key={lick.id} onClick={() => history.push("/view/" + lick.id)}>
            <td>{lick.name}</td>
            <td>{lick.owner.name}</td>
            <td>{formatLickLength(lick.audioLength)}</td>
            {/*<td>{formatDate(lick.dateUploaded)}</td>*/}
            <td>{lick.tuning}</td>
            <td>{formatCapo(lick.capo)}</td>
          </tr>
        )}
      </tbody>
    );
  }

  // TODO: sort by owner is broken, as the owner which is returned is an object of type User -> a lick probably needs a
  //   simple ownerName field rather than an owner: User so that the owner name can easily be displayed. Do this at the
  //   same time as fixing table relation for date shared
  return (
    <Container>
      {renderAlert(alert, setAlert)}
      <IconTitleBlock icon={DanceIcon} title="Shared With You" lickLengthArr={licks.map((lick) => lick.audioLength)}/>
      <LibraryTable headerCols={headerCols} setLicks={setLicks} defaultSortColumn={"name"} renderTableBody={renderTableBody}/>
    </Container>
  );
}