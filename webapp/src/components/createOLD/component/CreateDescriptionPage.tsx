import React from "react";
import {useDispatch} from "react-redux";
import {UpdateMetaData} from "../actions/FileActions";
import {useHistory} from "react-router";
import TryAgain from "../icons/TryAgain.svg";
import "./CreateDescriptionPage.css"

export interface LickFormInterface {
  lickname: string
  lickdescription: string
  licktuning: string
  lickcapo: number
  lickpublic: boolean
}

export default function CreateDescriptionPage() {
    const dispatch = useDispatch();
    const history = useHistory();

    const submitForm = (data: LickFormInterface) => {
        dispatch(UpdateMetaData(data));
        history.push("/upload");
    }

   return(
        <div className="centered">
            <img src={TryAgain} className='tryAgainButton' alt='try again button' onClick={() => {history.goBack()}}/>
            {/*<EditFormOLD onSubmit={submitForm} formTitle="Tell us about your lick!" uploading={true}/>*/}
            <br />
            {/*<MusicPlayer/>*/}
        </div>
    )
}