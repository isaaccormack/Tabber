import React, { useEffect, useState } from "react";
import { LickInterface } from "../../common/lick/interface/LickInterface";
import { formatCapo, formatDate, formatLickLength } from "./FormattingHelpers";
import Container from "react-bootstrap/Container";
import IconTitleBlock from "./IconTitleBlock";
import DanceIcon from "../icons/dance.svg";
import LibraryTable from "./LibraryTable";
import { useHistory } from "react-router";

export default function SharedPage() {
  const history = useHistory();

  const [licks, setLicks] = useState<LickInterface[]>([])

  // TODO: edit backend so that there is a date shared field on the many-to-many relationship
  function getSharedLicks() {
    fetch("/api/user/licks-shared-with-me", {
      method: "GET"
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      }
    }).then((responseJson: LickInterface[]) => {
      if (responseJson) {
        setLicks(responseJson.sort((a, b) => a.name > b.name ? 1 : -1));
      }
    })
  }

  useEffect(() => {
    getSharedLicks();
  }, [])

  const headerCols: {key: string, value: string}[] = [
    {key: 'Title', value: 'name'},
    {key: 'Author', value: 'owner'},
    {key: 'Length', value: 'audioLength'},
    {key: 'Date Uploaded', value: 'dateUploaded'},
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
            <td>{formatDate(lick.dateUploaded)}</td>
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
      <IconTitleBlock icon={DanceIcon} title="Shared With You" lickLengthArr={licks.map((lick) => lick.audioLength)}/>
      <LibraryTable headerCols={headerCols} setLicks={setLicks} defaultSortColumn={"name"} renderTableBody={renderTableBody}/>
    </Container>
  );
}