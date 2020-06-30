import React, {useCallback, useEffect, useState} from "react";

import "./UploadPage.css";
import {useHistory} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import RootState from "../../../store/root-state";
import {DeleteUser} from "../../common/user/actions/UserActions";
import {Button} from "react-bootstrap";
import UploadPageLoadingAnimation from "./UploadPageLoadingAnimation";
import {ClearFileState} from "../actions/FileActions";
import {LickInterface} from "../../common/lick/interface/LickInterface";

export default function UploadPage() {
    const [responseStatus, setResponseStatus] = useState(0)
    const {file, metadata} = useSelector((state: RootState) => state.fileState);

    const history = useHistory();
    const dispatch = useDispatch();

    const sendFile = useCallback(() => {
        setResponseStatus(0);
        if (file && metadata) {
            const form = new FormData();
            form.append("file", file);
            form.append("name", metadata.lickname);
            form.append("tuning", metadata.licktuning);
            form.append("description", metadata.lickdescription)
            form.append("isPublic", metadata.lickpublic.toString());
            fetch("/api/licks",{
                method: "POST",
                body: form
            }).then((response) => {
                setResponseStatus(response.status);
                if (response.status !== 201) throw Error("upload failed");
                return response.json()
            }).then((responseJson: LickInterface) => {
                dispatch(ClearFileState());
                history.push("/edit/" + responseJson.id);
            }).catch((error) => {
                console.log(error);
            })
        }
    }, [file, metadata, history, dispatch]);

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