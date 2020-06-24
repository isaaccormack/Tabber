import React, {useEffect, useState} from "react";

// use redux here and change the state of recording so that when this animation 
// is over, the state is changed

export default function BeginRecordingAnimation() {
    const [number, setNumber] = useState("3")

    useEffect(()=> {
        let timeout = setTimeout(() =>{
            if (number === "3") {
                setNumber("2");
            } else if (number === "2") {
                setNumber("1");
            } else {
                // return, begin recording
            }
        }, 500)
        return () => {clearTimeout(timeout);} // clear timeout on unmount
    })

    return (
        <div className="loading centered">
            {number}
        </div>
    )
}