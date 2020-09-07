import React, {useEffect, useState} from "react";
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {useHistory} from "react-router";
import {useDispatch} from "react-redux";

import {getAudioFile} from "../../common/musicplayer/component/MusicHelper";
import {LickInterface} from "../../common/lick/interface/LickInterface";
import LickCards from "./LickCards";
import LickTable from "./LickTable";
import LickNav from "./LickNav";
import RequestLickUpload from "./RequestLickUpload";
import LickDisplayControl from "./LickDisplayControl";
import ShareLickModal from "./ShareLickModal";
import DeleteLickModal from "./DeleteLickModal";
import UnfollowLickModal from "./UnfollowLickModal";


export default function LibraryPage() {  

    const [licks, setLicks] = useState<LickInterface[]>([])
    const [selectedFile, setSelectedFile] = useState<Blob>()
    const [sortBy, setSortBy] = useState('Date Created');
    const [searchQuery, setSearchQuery] = useState('');
    const [displayCards, setDisplayCards] = useState(true);
    const [ascending, setAscending] = useState(false);
    const [selectedLickIDs, setSelectedLickIDs] = useState<string[]>([]);
    
    function getLibrary() {
        fetch("/api/user/licks", {
            method: "GET"
        }).then((response) => {
            if (response.status === 200) { //remove this later
                return response.json();
            }
        }).then((responseJson) => {
            if (responseJson) {
                setLicks(responseJson);
            }
        })
    }

    useEffect(() => {
        getLibrary();
    }, [])

    useEffect(() => {
        if (licks.length > 0) {
            getAudioFile(licks[0]).then((file: Blob) => {
                setSelectedFile(file);
            })
        }
    }, [licks])
    
    const [showShareModal, setShowShareModal] = useState(false);
    const handleCloseShareModal = () => {setShowShareModal(false)}
    const handleShareSelectedLicks = () => {setShowShareModal(false); console.log("Sharing licks...")} // and make the API call
    
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const handleCloseDeleteModal = () => {setShowDeleteModal(false)}
    const handleDeleteSelectedLicks = () => {setShowDeleteModal(false); console.log("Deleting licks...")} // and make the API call
    
    const [showUnfollowModal, setShowUnfollowModal] = useState(false);
    const handleCloseUnfollowModal = () => {setShowUnfollowModal(false)}
    const handleUnfollowSelectedLicks = () => {setShowUnfollowModal(false); console.log("Unfollowing licks...")} // and make the API call

    const handleSelectAll = (event: any) => {
        if (event.target.checked) {
            setSelectedLickIDs(licks.map(lick => lick.id.toString()));
        } else {
            setSelectedLickIDs([]);
        }
    }

    const handleSelectOne = (event: any) => {
        if (event.target.checked) {
            setSelectedLickIDs(selectedLickIDs.concat(event.target.id))
        } else {
            setSelectedLickIDs(selectedLickIDs.filter(e => e !== event.target.id))
        }
    }

    return (
        <Container>
            {/* have to make share modal component */}
            <ShareLickModal selectedLickIDs={selectedLickIDs}
                             showShareModal={showShareModal}
                             handleCloseShareModal={handleCloseShareModal}
                             handleShareSelectedLicks={handleShareSelectedLicks}
                             />
            <DeleteLickModal selectedLickIDs={selectedLickIDs}
                             showDeleteModal={showDeleteModal}
                             handleCloseDeleteModal={handleCloseDeleteModal}
                             handleDeleteSelectedLicks={handleDeleteSelectedLicks}
                             />
            <UnfollowLickModal selectedLickIDs={selectedLickIDs}
                               showUnfollowModal={showUnfollowModal}
                               handleCloseUnfollowModal={handleCloseUnfollowModal}
                               handleUnfollowSelectedLicks={handleUnfollowSelectedLicks}
                               />

            <LickNav licks={licks}
                     selectedLickIDs={selectedLickIDs}
                     handleSelectAll={handleSelectAll}
                     setShowShareModal={setShowShareModal}
                     setShowDeleteModal={setShowDeleteModal}
                     setShowUnfollowModal={setShowUnfollowModal}
            />
            {licks.length === 0 ?
                <RequestLickUpload/>
                :
                <Container>
                    <LickDisplayControl displayCards={displayCards}
                                        sortBy={sortBy}
                                        ascending={ascending}
                                        setDisplayCards={setDisplayCards}
                                        setSearchQuery={setSearchQuery}
                                        setSortBy={setSortBy}
                                        setAscending={setAscending}
                    />
                    {displayCards ?
                        <LickCards licks={licks}
                                    searchQuery={searchQuery}
                                    sortBy={sortBy}
                                    ascending={ascending}
                                    selected={selectedLickIDs}
                                    handleSelectOne={handleSelectOne}
                                    setShowShareModal={setShowShareModal}
                        />
                        :
                        <LickTable licks={licks}
                                    searchQuery={searchQuery}
                                    selected={selectedLickIDs}
                                    handleSelectOne={handleSelectOne}
                        />
                    }
                </Container>
            }
        </Container>
    )
}