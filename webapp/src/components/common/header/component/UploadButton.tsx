import React from "react";
import Upload from '../icons/upload.svg';
// import "./CreatePage.css";
// change this later
import {UpdateFile} from "../../../create/actions/FileActions";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router";


export default function UploadButton() {
    const dispatch = useDispatch();
    const history = useHistory();


    const onFileSelect = (fileList: FileList | null) => {
        if (fileList) {
            const file: File = fileList[0];
            dispatch(UpdateFile(file));
            history.push("/create/description");
        }
    }

    return (
        <div>
            <label htmlFor={"upload"}>
                <img src={Upload} style={{height: 22, width: 22}} className='uploadButton' alt='upload button' />
            </label>
            <input id="upload"
                   type="file"
                   accept="audio/*"
                   onChange={(e) => onFileSelect(e.target.files)} />
        </div>
    )
}