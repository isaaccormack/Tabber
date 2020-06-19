import React from "react";
import Upload from '../icons/Upload.svg';
import "./CreatePage.css";
import {UpdateFile} from "../actions/FileActions";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router";


export default function UploadButton() {

    const dispatch = useDispatch();
    const history = useHistory();

    const onFileSelect = (file: FileList | null) => {
        if (file) {
            dispatch(UpdateFile(file));
            console.log(file);
            history.push("/create/description");
        }
    }

    return (
        <div>
            <label htmlFor={"upload"}>
                <img src={Upload} className='uploadButton' alt='upload button' />
            </label>
            <input id="upload"
                   type="file"
                   accept="audio/*"
                   onChange={(e) => onFileSelect(e.target.files)} />
        </div>
    )
}