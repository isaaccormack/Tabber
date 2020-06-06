import React from "react";
import Upload from '../icons/Upload.svg';
import "./CreatePage.css";


export default function UploadButton() {
    const onFileSelect = (file: FileList | null) => {
        if (file) {
            fetch("/api/lick",{
                method: "POST",
                headers: {
                    "Content-Type": "audio"
                },
                body: file[0]
            }).then()
        }
    }

    return (
        <div>
            <label htmlFor={"upload"}>
                <img src={Upload} className='uploadButton' alt='upload button' />
            </label>
            <input id="upload"
                   type="file"
                   onChange={(e) => onFileSelect(e.target.files)} />
        </div>
    )
}