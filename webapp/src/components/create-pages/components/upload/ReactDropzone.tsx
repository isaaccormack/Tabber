import { Row } from "react-bootstrap";
import UploadCloudIcon from "../../icons/upload-cloud.svg";
import WarningIcon from "../../icons/warning.svg";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function ReactDropzone(props: any) {

  const MAX_FILE_SIZE_MB = 2;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1000 * 1000;

  const [fileErrorMsg, setFileErrorMsg] = useState<string>();

  const onDropRejected = useCallback(rejectedFiles => {
    const errMsg = rejectedFiles[0].errors[0].message;
    if (errMsg.includes('must be audio')) {
      setFileErrorMsg("File must be mp3, wav, or mp4");
    } else if (errMsg.includes('larger than')) {
      setFileErrorMsg("File must be less than 5 Mb");
    } else {
      setFileErrorMsg("File is invalid");
    }
  }, [])

  const onDropAccepted = useCallback(acceptedFiles => {
    let audio = new Audio();
    audio.addEventListener("loadedmetadata", () => {
      if (!audio.duration || audio.duration > 30) {
        setFileErrorMsg("File must be less than 30 seconds long");
      } else {
        props.setFile(acceptedFiles[0])
      }
    });
    audio.src = URL.createObjectURL(acceptedFiles[0])
  }, [])

  const {getRootProps, getInputProps, open} = useDropzone({
    noClick: true,
    noKeyboard: true,
    multiple: false,
    accept: 'audio/*',
    maxSize: MAX_FILE_SIZE_BYTES,
    onDropRejected,
    onDropAccepted
  });

  return (
    <Row id="upload-box" {...getRootProps()}>
      <input {...getInputProps()} />
      <img src={UploadCloudIcon} height={150} alt="upload to cloud icon" style={{opacity: 0.2}}/>
      {fileErrorMsg &&
      <Row>
        <img src={WarningIcon} height={20} alt='warning icon' />
        <h5 style={{color: "red", marginLeft: '10px'}}>{fileErrorMsg}</h5>
      </Row>
      }
      <h3 style={{color: "#7a7a7a"}}>Drop lick here or <span id="browse-files" onClick={open}>browse</span></h3>
    </Row>
  );
}
