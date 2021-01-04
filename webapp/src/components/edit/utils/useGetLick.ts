import { LickInterface } from "../../common/lick/interface/LickInterface";
import { throwFormattedError } from "../../common/utils/utils";
import { getAudioFile } from "../../common/musicplayer/component/MusicHelper";
import { useEffect } from "react";

// Attempt to fetch lick, then lick audio using lick id
export const useGetLick = (lickId: number, setLick: Function, setLickAudioURL: Function, setAlert: Function) => {
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
      // TODO: redirect to error page eventually -- probably want to send err.message via history.state too
      // TODO: will need to return something that indicates an error of this nature here
      // history.push('/');
    })
    .then((lickId: number | void) => {
      return getAudioFile(lickId || -1)
    })
    .then((file: Blob) => {
      setLickAudioURL(URL.createObjectURL(file));
    })
    .catch((err: Error) => {
      setAlert({msg: err.message, variant: 'danger'})
    })
  }, [lickId]);
}
