import React, {useEffect} from 'react';
import {useHistory} from "react-router";
import * as qs from 'query-string';
import {useDispatch} from "react-redux";
import {UpdateUser} from "../../common/navigation/actions/NavigationActions";

export default function(props: any) {

    const history = useHistory();
    const dispatch = useDispatch();

    const authorizationCode = qs.parse(props.location.search)["code"]
    useEffect(() => {
        fetch("/token?code="+authorizationCode)
            .then(response => response.text())
            .then(data => {
                dispatch(UpdateUser(data));
            })
        history.push("/")
    })

    return(
        <div>authenticating....</div>
    );
}