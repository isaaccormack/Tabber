import React from "react";
import EditForm, {LickFormInterface} from "../../common/edit/component/EditForm";
import MusicPlayer from "../../common/musicplayer/component/MusicPlayer";
import {useDispatch} from "react-redux";
import {UpdateMetaData} from "../actions/FileActions";
import {useHistory} from "react-router";


export default function CreateDescriptionPage() {
    const dispatch = useDispatch();
    const history = useHistory();

    const submitForm = (data: LickFormInterface) => {
        dispatch(UpdateMetaData(data));
        history.push("/create/upload");
    }

   return(
        <div className="centered">
            <EditForm onSubmit={submitForm} formTitle="Tell us about your lick!"/>
            <br />
            <MusicPlayer/>
        </div>
    )
}