import { LickInterface } from "../../common/lick/interface/LickInterface";
import { useEffect } from "react";
import { throwFormattedError } from "../../common/utils/formattingHelpers";
import { useHistory } from "react-router";

// Attempt to fetch lick, then lick audio using lick id
export const useGetLick = (lickId: number, setLick: Function) => {
  const history = useHistory();

  useEffect(() => {
    fetch("/api/licks/" + lickId, {
      method: "GET"
    })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throwFormattedError('Lick could not be retrieved', response.status, response.statusText);
    })
    .then((responseJson: LickInterface) => {
      setLick(responseJson);
      return responseJson.id;
    })
    .catch((err: Error) => {
      let redirectRoute = '/500';
      if (err.message.includes('403')) {
        redirectRoute = '/403';
      } else if (err.message.includes('400')) {
        redirectRoute = '/400';
      }
      history.push({ pathname: redirectRoute,  state: { from: 'get-lick' , lickName: ''} });
    })
  }, [lickId]);
}
// Probably dont end up using this
// Only attempt to fetch lick audio after lick is retrieved
export const useGetLickAudio = (lickId: number, lick: LickInterface | undefined, setLickAudioURL: Function, setAlert: Function) => {
  useEffect(() => {
    if (lick) {
      fetch("/api/licks/audio/" + lickId, {
        method: "GET"
      })
      .then((response) => {
        if (response.status === 200) {
          return response.blob();
        }
        throwFormattedError('Lick audio could not be retrieved', response.status, response.statusText);
      })
      .then((file: Blob | undefined) => {
        setLickAudioURL(URL.createObjectURL(file));
      })
      .catch((err: Error) => {
        setAlert({msg: err.message, variant: 'danger'})
      })
    }
  }, [lickId])
}
