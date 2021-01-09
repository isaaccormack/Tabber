import { useEffect } from "react";

export interface AlertInterface {
  msg: string,
  variant: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "dark" | "light" | undefined;
}

export const useAlertTimeouts = (alert: AlertInterface | undefined,
                                 setAlert: Function,
                                 alertTimeout: NodeJS.Timeout,
                                 setAlertTimeout: Function) => {
  useEffect(() => {
    if (alert) {
      clearTimeout(alertTimeout);
      setAlertTimeout(setTimeout(() => { setAlert(undefined) }, 5000));
    }
  }, [alert])

}