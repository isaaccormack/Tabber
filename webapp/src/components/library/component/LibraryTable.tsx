import React, { useState } from "react";
import { Table } from "react-bootstrap";
import AscSortIcon from "../icons/desc-sort.svg";
import DescSortIcon from "../icons/asc-sort.svg";
import { LickInterface } from "../../common/lick/interface/LickInterface";
import { useHistory } from "react-router";

export default function LibraryTable(props: any) {
  const history = useHistory();

  const [sortColumn, setSortColumn] = useState<string>(props.defaultSortColumn)
  const [asc, setAsc] = useState<boolean>(false)

  const renderTableHeader = (headerCols: {key: string, value: string}[]) => {
    return (
      <thead>
      <tr>
        {headerCols.map(({key, value}) => renderTableHeaderColumns(key, value))}
      </tr>
      </thead>
    );
  }

  const sortLicks = (field: string, asc: boolean) => {
    props.setLicks((licks: LickInterface[]) => licks.sort((a, b) => {
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

  const renderTableHeaderColumns = (name: string, columnName: string) => {
    const SortIcon = asc ? AscSortIcon : DescSortIcon;

    // If 'name' column is being rendered and the table is being sorted on that column
    const renderSortIcon =
      (name === 'Title' && sortColumn === 'name') ||
      (name === 'Length' && sortColumn === 'audioLength') ||
      (name === 'Author' && sortColumn === 'author') ||
      (name === 'Date Uploaded' && sortColumn === 'dateUploaded') ||
      (name === 'Date Shared' && sortColumn === 'dateSharedWithUser') ||
      (name === 'Tuning' && sortColumn === 'tuning') ||
      (name === 'Capo' && sortColumn === 'capo');

    // if desired, could have one conditional check to see if name is 'Length', if so, render icon instead of h3, everything else same
    return (
      <th onClick={() => sortByColumn(columnName)} style={{verticalAlign: 'middle'}} key={name}>
        <h3 style={{display: "inline"}}>{name}</h3>
        {renderSortIcon &&
        <img src={SortIcon} height={30} alt="sort icon"
             style={{opacity: 0.8, marginBottom: '5px', marginLeft: '10px'}}/>
        }
      </th>
    );
  }

  // TODO: fix this, doesn't sort for some reason
  const renderTableBody = (bodyVals: any[]) => {
    return (
      <tbody>
      {bodyVals.map((row) => {
        return (
          // /view/ will be hardcoded to always be view so don't worry about this for now
          <tr key={row[0]} onClick={() => history.push("/view/" + row[0])}>
            {row.slice(1).map((elem: any) => <td>{elem}</td>)}
          </tr>
        );
      })}
      </tbody>
    );
  }

  return (
    <Table hover style={{marginTop: "20px"}}>
      {renderTableHeader(props.headerCols)}
      {/*{renderTableBody(props.bodyRows)}*/}
      {props.renderTableBody()}
    </Table>
  );
}