import { LickInterface } from "../../common/lick/interface/LickInterface";
import { throwFormattedError } from "../../common/utils/utils";
import { useEffect } from "react";

export const useGetLibrary = (url: string, setLicks: Function, setAlert: Function) => {
  useEffect(() => {
    fetch(url, {
      method: "GET"
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throwFormattedError('Library could not be retrieved', response.status, response.statusText);
    })
    .then((responseJson: LickInterface[]) => {
      // sorting order differs between library and shared with licks
      if (url.includes('library')) {
        setLicks(responseJson.sort((a, b) => a.dateUploaded > b.dateUploaded ? 1 : -1));
      } else {
        setLicks(responseJson.sort((a, b) => a.name > b.name ? 1 : -1));
      }
    })
    .catch((err: Error) => {
      setAlert({msg: err.message, variant: 'danger'})
    });
  }, []);
}