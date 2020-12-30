import React, { useEffect, useState } from "react";
import { LickInterface } from "../../common/lick/interface/LickInterface";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Table } from "react-bootstrap";
import { formatCapo, formatDate, formatLickLength } from "./FormattingHelpers";
import TurntableIcon from "../icons/turntable.svg"
import AscSortIcon from "../icons/desc-sort.svg"
import DescSortIcon from "../icons/asc-sort.svg"
import "./LibraryPage.css";
import { useHistory } from "react-router";

export default function LibraryPage() {
  const history = useHistory();


  const [licks, setLicks] = useState<LickInterface[]>([])
  const [sortColumn, setSortColumn] = useState<string>("dateUploaded")
  const [asc, setAsc] = useState<boolean>(false)

  const [selectedFile, setSelectedFile] = useState<Blob>()

  function getLibrary() {
    fetch("/api/user/licks", {
      method: "GET"
    }).then((response) => {
      if (response.status === 200) { //remove this later
        return response.json();
      }
    }).then((responseJson: LickInterface[]) => {
      if (responseJson) {
        // manually sort before setting
        setLicks(responseJson.sort((a, b) => a.dateUploaded > b.dateUploaded ? 1 : -1));
      }
    })
  }

  useEffect(() => {
    getLibrary();
  }, []) // state variable which should trigger change

  const handlePlayLick = (lickID: number) => {
    fetch("/api/licks/audio/" + lickID, {
      method: "GET"
    }).then((response) => {
      return response.blob();
    }).then((file: Blob) => {
      setSelectedFile(file);
    }).then(() => {console.log(selectedFile)})
  }

  const sortLicks = (field: string, asc: boolean) => {
    setLicks(licks => licks.sort((a, b) => {
      let aField = a[field as keyof LickInterface];

      if (typeof(aField) === 'string') {
        aField = aField as string;
        const bField = b[field as keyof LickInterface] as string;
        const comp = aField.toLocaleLowerCase() > bField.toLocaleLowerCase() ? 1 : -1;
        return asc ? comp : -1*comp;
      }
      aField = aField as number;
      const bField = b[field as keyof LickInterface] as number;
      const comp = aField > bField ? 1 : -1;
      return asc ? comp : -1*comp;
    }))
  }

  const sortByColumn = (thisColumn: string) => {
      if (sortColumn !== thisColumn) {
        sortLicks(thisColumn, true);
        setAsc(false); // set the value which should be used next time
      } else {
        sortLicks(thisColumn, asc);
        setAsc((asc) => !asc);
      }
      setSortColumn(thisColumn);
  }

  const renderTableHeader = () => {
    const headerKVs: {key: string, value: string}[] = [
      {key: 'Title', value: 'name'},
      {key: 'Length', value: 'audioLength'},
      {key: 'Date Uploaded', value: 'dateUploaded'},
      {key: 'Tuning', value: 'tuning'},
      {key: 'Capo', value: 'capo'}
    ];

    return (
      <thead>
        <tr>
          {headerKVs.map(({key, value}) => renderTableHeaderColumns(key, value))}
        </tr>
      </thead>
    );
  }

  const renderTableHeaderColumns = (name: string, columnName: string) => {
    const SortIcon = asc ? AscSortIcon : DescSortIcon;
    const renderSortIcon =
      (name === 'Title' && sortColumn === 'name') ||
      (name === 'Length' && sortColumn === 'audioLength') ||
      (name === 'Date Uploaded' && sortColumn === 'dateUploaded') ||
      (name === 'Tuning' && sortColumn === 'tuning') ||
      (name === 'Capo' && sortColumn === 'capo');

    return (
      <th onClick={() => sortByColumn(columnName)} style={{verticalAlign: 'middle'}}>
        <h3 style={{display: "inline"}}>{name}</h3>
        {renderSortIcon &&
        <img src={SortIcon} height={30} alt="sort icon"
             style={{opacity: 0.8, marginBottom: '5px', marginLeft: '10px'}}/>
        }
      </th>
    );
  }

  // TODO: break table off into its own component so it can be used between lib and share page
  // TODO: could make column width fixed so changing placement of icon doesn't mess everything up
  return (
    <Container>
      {/* TODO: add IconTitleBlock component */}
      <Row style={{marginTop: '40px'}}>
        <Col className="align-self-center">
          <Row className="justify-content-md-end">
            <img src={TurntableIcon} height={120} alt="record player lick" style={{marginRight: '20px'}}/>
          </Row>
        </Col>
        <Col className="align-self-center">
          <Row>
            <h1>Library</h1>
          </Row>
          <Row>
            <h3 style={{color: 'lightgrey', textAlign: 'center'}}>4 licks, 2m 30s</h3>
          </Row>
        </Col>
      </Row>
      <Table hover style={{marginTop: "20px"}}>
        {renderTableHeader()}
        <tbody>
        {licks.map((lick) => {
          return (
            <tr key={lick.id} onClick={() => history.push("/edit/" + lick.id)}>
              <td>{lick.name}</td>
              <td>{formatLickLength(lick.audioLength)}</td>
              <td>{formatDate(lick.dateUploaded)}</td>
              <td>{lick.tuning}</td>
              <td>{formatCapo(lick.capo)}</td>
            </tr>
          );
        })}
        </tbody>
      </Table>
    </Container>
  );
}