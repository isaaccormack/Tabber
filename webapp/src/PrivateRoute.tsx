import React from "react";
import { Redirect, Route } from 'react-router-dom'
import { useSelector } from "react-redux";
import RootState from "./store/root-state";

// TODO: dunno what this type complaint it, fix later
// @ts-ignore
const PrivateRoute = ({ component: Component, ...rest }) => {

  const user = useSelector((state: RootState) => state.userState.user);

  return (
    <Route
      {...rest}
      render={props =>
        user ? (
          <Component {...props} />
        ) : (
          // TODO: change 403 unauthorized page, tell user to sign in to access library
          <Redirect to={{ pathname: '/404', state: { from: props.location } }} />
        )
      }
    />
  )
}

export default PrivateRoute