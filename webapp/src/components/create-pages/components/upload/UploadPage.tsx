import React, { useState } from "react";
import { Container } from "react-bootstrap";
import "./UploadPage.css"
import TitleBlock from "./TitleBlock";
import ReactDropzone from "./ReactDropzone";
import { AlertInterface, useAlertTimeouts } from "../../../common/utils/useAlertTimeouts";
import { useRedirectAlerts } from "../../../common/utils/useRedirectAlerts";
import renderAlert from "../../../common/utils/renderAlert";
import UploadFileCard from "./UploadFileCard";
import TuningCapoForm from "./TuningCapoForm";
import UploadFileIcon from "../../icons/upload-file.svg";


export default function UploadPage() {

  // probably actually want to put file into redux for the simple case of if upload fails and user is redirected back
  // to upload page, their file is saved, useful for upload but (essential?) for record
  const [file, setFile] = useState<File>();
  const [alert, setAlert] = useState<AlertInterface>();
  const [alertTimeout, setAlertTimeout] = useState();

  useAlertTimeouts(alert, setAlert, alertTimeout, setAlertTimeout);
  useRedirectAlerts(setAlert, "uploading", "", "danger");

  return (
    <Container>
      {renderAlert(alert, setAlert)}
      <TitleBlock
        title="Upload a Lick"
        marginRight="80px"
        desc="mp3, wav, and mp4's are accepted"
        icon={UploadFileIcon}
        alt="upload file icon"
      />
      {!file ?
        <ReactDropzone setFile={setFile} />
        :
        <>
          <UploadFileCard file={file} setFile={setFile} />
          <TuningCapoForm file={file}/>
        </>
      }
    </Container>
  );
}