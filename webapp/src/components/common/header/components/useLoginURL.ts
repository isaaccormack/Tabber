import { useEffect } from "react";

export const useLoginURL = (setLoginURL: Function) => {
  useEffect(() => {
    fetch("/api/loginUrl")
      .then(response => response.text())
      .then(data => setLoginURL(data))
      .catch((err: Error) => {
        console.error('Could not get oauth login URL' + err);
      });
  }, [])
}
