import React from "react";
import Upload from '../icons/Upload.svg';
import "./CreatePage.css";
import {UpdateFile} from "../actions/FileActions";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router";


export default function UploadButton() {

    const dispatch = useDispatch();
    const history = useHistory();

    const onFileSelect = (fileList: FileList | null) => {
        if (fileList) {
            if (fileList.length > 1) {
                // err
            } else {
                const file: File = fileList[0];
                console.log(file);
                dispatch(UpdateFile(file));
                console.log(file);
                history.push("/create/description");
            }

        }

        // this shouldnt support more than one file selected, if it is the case, then throw errors
        // if (file) {
        //     const f: File = file[0];
        //     console.log(f);
        //     dispatch(UpdateFile(file));
        //     console.log(file);
        //     history.push("/create/description");
        // }
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