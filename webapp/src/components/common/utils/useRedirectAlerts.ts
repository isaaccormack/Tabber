import { useEffect } from "react";
import { useHistory } from "react-router";

interface State {
  from: string | undefined,
  lickName: string | undefined,
  msg: string | undefined
}

export const useRedirectAlerts = (setAlert: Function, from: string, msg: string, variant: string) => {
  const history = useHistory();

  useEffect(() => {
    const state = history.location.state as State;
    if (state && state.from === from) {

      // Override with state.msg for convenience where applicable
      if (state.msg) {
        setAlert({msg: state.msg, variant: variant})
      } else {
        setAlert({msg: state.lickName + msg, variant: variant})
      }
      history.push({ state: { from: '' } });
    }
  }, [])

}