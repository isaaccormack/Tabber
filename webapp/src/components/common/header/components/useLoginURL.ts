import { useEffect } from "react";
const logger = require('../winston/winston');

export const useLoginURL = (setLoginURL: Function) => {
  useEffect(() => {
    fetch("/api/loginUrl")
      .then(response => response.text())
      .then(data => setLoginURL(data))
      .catch((err: Error) => {
        logger.error('couldn\'t get oauth login URL\n' + err.stack)
      });
  }, [])
}
