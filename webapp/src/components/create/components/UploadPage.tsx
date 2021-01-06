import React, { useCallback, useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import {useDropzone} from 'react-dropzone'
import "./UploadPage.css"
import UploadCloudIcon from "../icons/upload-cloud.svg";
import { formatCapo, throwFormattedError } from "../../common/utils/formattingHelpers";
import { ClimbingBoxLoader, ClipLoader } from "react-spinners";
import Upload from "../../createOLD/icons/Upload.svg";
import WarningIcon from "../icons/warning.svg"
import { LickInterface } from "../../common/lick/interface/LickInterface";
import { ClearFileState } from "../../createOLD/actions/FileActions";
import { useHistory } from "react-router";
import UploadTitleBlock from "./UploadTitleBlock";
import ReactDropzone from "./ReactDropzone";
import TuningFormControl from "../../lick-pages/components/edit/TuningFormControl";
import CapoFormControl from "../../lick-pages/components/edit/CapoFormControl";
import FileIcon from "../icons/music-file.svg";
import NavigationButton from "../../home-pages/components/common/NavigationButton";
import TrashIcon from "../../lick-pages/icons/trash.svg";
import { AlertInterface, useAlertTimeouts } from "../../common/utils/useAlertTimeouts";
import { useRedirectAlerts } from "../../common/utils/useRedirectAlerts";
import renderAlert from "../../common/utils/renderAlert";
import UploadFileCard from "./UploadFileCard";
import TuningCapoForm from "./TuningCapoForm";
import UploadFileIcon from "../icons/upload-file.svg";


export default function UploadPage() {
  const history = useHistory();

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
      <UploadTitleBlock
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