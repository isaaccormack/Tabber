import React, {useEffect} from 'react';
import {useHistory} from "react-router";
import * as qs from 'query-string';
import {useDispatch} from "react-redux";
import {UpdateUser} from "../../common/user/actions/UserActions";

export default function(props: any) {

    const history = useHistory();
    const dispatch = useDispatch();

    const authorizationCode = qs.parse(props.location.search)["code"]
    useEffect(() => {
        fetch("/api/token?code="+authorizationCode)
            .then(response => response.json())
            .then(data => {
                dispatch(UpdateUser(data.given_name));
            })
        history.push("/")
    })

    return(
        <div>authenticating....</div>
    );
}