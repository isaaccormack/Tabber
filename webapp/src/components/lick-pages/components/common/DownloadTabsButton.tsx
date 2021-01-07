import React, { useEffect, useState } from "react";
import DownloadIcon from "../../icons/download.svg"
import { useDownloadTabs } from "./useDownloadTabs";

export default function DownloadTabsButton(props: any) {

  const [lickDownloadURL, setLickDownloadURL] = useState<string>();

  useDownloadTabs(props.lickTab, setLickDownloadURL);

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