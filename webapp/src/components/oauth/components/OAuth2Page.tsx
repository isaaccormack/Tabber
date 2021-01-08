import React, {useEffect} from 'react';
import {useHistory} from "react-router";
import * as qs from 'query-string';
import {useDispatch} from "react-redux";
import {UpdateUser} from "../../common/user/actions/UserActions";
import {UserInterface} from "../../common/user/interface/UserInterface";
import {IdentityTokenInterface} from "../../common/user/interface/IdentityToken";

export default function(props: any) {

    const history = useHistory();
    const dispatch = useDispatch();

    const authorizationCode = qs.parse(props.location.search)["code"]
    useEffect(() => {
        fetch("/api/token?code="+authorizationCode)
            .then(response => response.json())
            .then( (data: IdentityTokenInterface) => {
                const user: UserInterface = {
                    email: data.email,
                    family_name: data.family_name,
                    given_name: data.given_name,
                    name: data.name,
                    picture_URL: data.picture,
                    identityToken: data
                }
                dispatch(UpdateUser(user));
            })
        history.push("/")
    })

    return(
        <div>authenticating....</div>
    );
}