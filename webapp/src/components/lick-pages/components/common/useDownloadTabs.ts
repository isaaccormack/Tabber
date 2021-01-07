import { useEffect } from "react";

export const useDownloadTabs = (lickTab: string, setLickDownloadURL: Function) => {

  useEffect(() => {
    // save lick as downloadable txt file and set URL to download
    const myURL = window.URL || window.webkitURL // window.webkitURL for Chrome, window.URL for Firefox
    const blob = new Blob([lickTab], {type: 'text/csv'});
    setLickDownloadURL(myURL.createObjectURL(blob));
  }, [lickTab])

}