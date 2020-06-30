import React from "react";
import EditForm, {LickFormInterface} from "../../edit/component/EditForm";
import MusicPlayer from "../../common/musicplayer/component/MusicPlayer";
import {useDispatch} from "react-redux";
import {UpdateMetaData} from "../actions/FileActions";
import {useHistory} from "react-router";
import TryAgain from "../icons/TryAgain.svg";
import "./CreateDescriptionPage.css"


export default function CreateDescriptionPage() {
    const dispatch = useDispatch();
    const history = useHistory();

    const submitForm = (data: LickFormInterface) => {
        dispatch(UpdateMetaData(data));
        history.push("/create/upload");
    }

   return(
        <div className="centered">
            <img src={TryAgain} className='tryAgainButton' alt='try again button' onClick={() => {history.goBack()}}/>
            <EditForm onSubmit={submitForm} formTitle="Tell us about your lick!"  tuningReadOnly={false} showPublic={true}/>
            <br />
            <MusicPlayer/>
        </div>
    )
}