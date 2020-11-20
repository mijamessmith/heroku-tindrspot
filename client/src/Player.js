import React, { useState, useEffect } from 'react';
import EmbeddedPlayer from './EmbeddedPlayer';
import Dislike from './Dislike';
import Like from './Like';
import TracksWindow from './TracksWindow';
import ArtistInfoWindow from "./ArtistInfoWindow";
import { getRandomStrForTrackSearch, formatTrackDataFromArray } from "./utils";
import { getASpotifyTrackFromRandomStr, checkIfUserHasPlaylist, getArtistInformation, getTracksFromPlaylist } from "./APIController"

function Player(props) {

    var { authToken, userId, playlistIdHandler, firstSearchString } = props;

    const [trackId, changeTrackId] = useState(null);
    const [playlistId, getplayListId] = useState(null);
    const [trackLikeCount, changeTrackLikeCount] = useState(0);
    const [trackDislikeCount, changeTrackDislikeCount] = useState(0);
    const [artistId, setArtistId] = useState(null);
    const [artistData, setArtistData] = useState(null);
    const [isFirstSearch, setIsFirstSearch] = useState(true);
    const [artistInfoToggle, setArtistInfoToggle] = useState(false);
    const [playlistTracks, setPlaylistTracks] = useState(null);
    const [togglePlaylistTracks, setTogglePlaylistTracks] = useState(false);
    const [clicked, setClicked] = useState(false);

    useEffect(() => {
        if (isFirstSearch == true) {
            setIsFirstSearch(false);

            async function execute() {
                async function getData() {
                    return checkIfUserHasPlaylist(authToken);
                } await getData()
                    .then(data => {

                        if (data[0] === true) {
                            getplayListId(data[1]);
                            return;
                        } if (data[0] == false) {
                            getplayListId(null);
                        } else console.log("did not receive newTrack in Dislike.js")
                    }).catch(err => {
                        console.log(err);
                    })
            }
            execute();
            return updateTrackStr();
        } 
    }, [])

    //state updater functions to be passed as props


    const updateTrack = (tID) => {
        changeTrackId(tID)
    }

    const updateTrackLikeCount = (TLC) => {
        //how to increment? Can we add one in changeTrackLikecount
        changeTrackLikeCount(trackLikeCount + TLC); 
        updateTrackStr();
    }

    const handleArtistId = (id) => {
        setArtistId(id);
    }

    const updateDislikeCount = (TLC) => {
        changeTrackDislikeCount(trackDislikeCount + TLC);
        updateTrackStr();
    }

    const getTracks = async () => {
        if (playlistId) {
            let playlist = await getTracksFromPlaylist(authToken, playlistId);
            console.log(playlist);
            let formatted = formatTrackDataFromArray(playlist);
            setPlaylistTracks(formatted);
        }
    }

    const handleGetTracks = async () => {
        await getTracks();
        setTogglePlaylistTracks(!togglePlaylistTracks);
    }

    const handleGetArtistInformation = async () => {
       
        async function getInfo() {
        return getArtistInformation(authToken, artistId)
        }
        await getInfo()
            .then(artist => {
         
        if (artist) {
            setArtistData(artist);
            setArtistInfoToggle(!artistInfoToggle);
        } else {
            console.log("Did not receive Artist Data")
        }
            }).catch((err) => {
                console.log(err)
            })
}


    const updatePlaylistId = (pID) => {
        getplayListId(pID);
        playlistIdHandler(pID);
    }

    const updateTrackStr = () => {

        async function execute() {

            async function getData() {
                return getASpotifyTrackFromRandomStr(getRandomStrForTrackSearch());
            } await getData()
                .then(data => {

                    if (data[0]) {
                        let newTrackId = data[0];
                        let newArtistId = data[1];
                        updateTrack(newTrackId);
                        setArtistId(newArtistId);
                        return;
                    } else console.log("did not receive newTrack in Dislike.js")
                }).catch(err => {
                    console.log(err);
                })
        }
        execute();
    };

    const wasClicked = () => {
        setClicked(true);
        setTimeout(() => setClicked(false), 500);
    }


    return (
        <div className="Player">
            {trackId ?
                <EmbeddedPlayer trackIdFromDislike={trackId} /> : null}
            
            <div className="Player-icon-container">
                <Dislike wasClicked={wasClicked} onClick={() => setArtistInfoToggle(false) && setTogglePlaylistTracks(false)} handleArtistId={handleArtistId} updateDislike={updateDislikeCount} />
                <Like wasClicked={wasClicked} onClick={() => setArtistInfoToggle(false) && setTogglePlaylistTracks(false) } handleArtistId={handleArtistId} updatePlayerTrack={updateTrack} updateCount={updateTrackLikeCount} currentTrack={trackId} user={userId} authToken={authToken} playlist={playlistId} updatePlaylist={updatePlaylistId} isFirstSearch={isFirstSearch} />  
            </div>
            <div className="Player-information">
                <button className="Player-information-artistInfo" onClick={handleGetArtistInformation}>About Artist</button>
                <button className="Playlist-information" onClick={handleGetTracks}>My Tracks</button>
            </div>
            {artistData && artistInfoToggle === true ?
                <ArtistInfoWindow
                    artistData={artistData}
                    artistInfoToggle={artistInfoToggle}
                    setArtistInfoToggle={setArtistInfoToggle}
                />
                : null
            }

            {
                playlistTracks && togglePlaylistTracks === true ?
                    <TracksWindow
                        playlistTracks={playlistTracks}
                        togglePlaylistTracks={togglePlaylistTracks}
                        setTogglePlaylistTracks={setTogglePlaylistTracks}
                    />
                    : null
            }



        </div>
        
        )
}

export default Player;