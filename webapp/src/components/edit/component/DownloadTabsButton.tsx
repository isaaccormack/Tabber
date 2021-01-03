import React, { useEffect, useState } from "react";
import DownloadIcon from "../icons/download.svg"

export default function DownloadTabsButton(props: any) {

  const [lickDownloadURL, setLickDownloadURL] = useState<string>();

  useEffect(() => {
    // save lick as downloadable txt file and set URL to download
    const myURL = window.URL || window.webkitURL // window.webkitURL for Chrome, window.URL for Firefox
    const blob = new Blob([props.lickTab], { type: 'text/csv' });
    setLickDownloadURL(myURL.createObjectURL(blob));
  }, [])

  return (
    <>
      <h4 style={{color: 'grey', display: "inline"}}>Download Tabs</h4>
      <a download={props.lickName + '.txt'} href={lickDownloadURL}>
        <img
          style={{marginLeft: '10px', marginBottom: '5px'}}
          id="download-icon"
          src={DownloadIcon}
          height={25}
          alt="download tabs button"
        />
      </a>
    </>
  );
}