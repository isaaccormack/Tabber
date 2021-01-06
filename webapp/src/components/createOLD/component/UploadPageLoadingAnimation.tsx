import React, {useEffect, useState} from "react";

export default function UploadPageLoadingAnimation() {
    const [loadingDots, setLoadingDots] = useState("")

    useEffect(()=> {
        let timeout = setTimeout(() =>{
            if (loadingDots.length === 3) {
                setLoadingDots("");
            } else {
                setLoadingDots(loadingDots + ".");
            }
        }, 500)
        return () => {clearTimeout(timeout);} // clear timeout on unmount
    })

    return (
        <div className="loading centered">
            Uploading{loadingDots}
        </div>
    )
}