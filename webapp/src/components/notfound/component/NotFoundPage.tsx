import React, { useEffect } from "react";
import "./NotFoundPage.css";
import { useHistory } from "react-router";

export default function NotFoundPage(props: any) {
  const history = useHistory();

  // useEffect(() => {
  //   history.push({
  //     state: {
  //       from: '404'
  //     }
  //   })
  // }, [])

    return (
        <div className=" notFound centered">
            404 Not Found
        </div>
    );
}