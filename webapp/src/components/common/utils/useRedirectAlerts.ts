import { useEffect } from "react";
import { useHistory } from "react-router";

interface State {
  from: string | undefined,
  lickName: string | undefined
}

export const useRedirectAlerts = (setAlert: Function, from: string, msg: string) => {
  const history = useHistory();

  useEffect(() => {
    const state = history.location.state as State;
    if (state && state.from === from) {
      setAlert({msg: state.lickName + msg, variant: "success"})
      history.push({ state: { from: '' } });
    }
  }, [])

}