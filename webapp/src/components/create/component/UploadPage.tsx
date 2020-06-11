import React, {useCallback, useEffect, useState} from "react";

import "./UploadPage.css";
import {useHistory} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {DeleteUser} from "../../common/user/actions/UserActions";
import {Button} from "react-bootstrap";
import RootState from "../../../store/root-state";
import UploadPageLoadingAnimation from "./UploadPageLoadingAnimation";

export default function UploadPage() {
    const [responseStatus, setResponseStatus] = useState(0)
    const file: FileList | undefined = useSelector((state: RootState) => state.fileState.file);


    const history = useHistory();
    const dispatch = useDispatch();

    const sendFile = useCallback(() => {
        setResponseStatus(0);
        if (file) {
            const form = new FormData();
            form.append("file", file[0]);
            form.append("name", "placeholder name");
            form.append("tuning", "standard");
            form.append("isPublic", "false");

            fetch("/api/licks",{
                method: "POST",
                body: form
            }).then((response) => {
                setResponseStatus(response.status);
                if (response.status === 201) {
                    console.log("Success: TODO: navigate to edit page");
                    history.push("/create");
                    // TODO: add response to redux, delete old file
                    // TODO: navigate to edit page for the user to finalize.
                }
            }).catch((error) => {
                console.log(error);
                setResponseStatus(418);
            })
        }
    }, [file, history]);

    useEffect(()=> {
        sendFile();
    }, [sendFile])


    const handleResponseOrLoading = () => {
        if (responseStatus === 0) {
            return (
                <UploadPageLoadingAnimation />
            )
        } if (responseStatus === 401) {
            dispatch(DeleteUser());
            history.push("/login");
            localStorage.clear();
        } else {
            //render retry buttons
            return (
                <div className="failed centered">
                    Upload Failed
                    <div className="retry-discard-buttons">
                        <Button
                            variant="primary"
                            onClick={sendFile}>
                            Retry
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {history.push("/create")}}>
                            Discard
                        </Button>
                    </div>
                </div>
            )
        }
    }

    return (
        <div className="upload-panel centered">
            {handleResponseOrLoading()}
        </div>
    )
}