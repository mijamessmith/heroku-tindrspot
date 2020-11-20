import React, { useState, useEffect } from 'react';
import { getRandomStrForTrackSearch } from "./utils";
import { getASpotifyTrackFromRandomStr, handleLikedTrack } from "./APIController"
import heart from './assets/images/heart.svg'

export default function Like(props) {
    var { updatePlayerTrack, updateCount, currentTrack, playlist, handleArtistId, user, authToken, updatePlaylist, isFirstSearch, firstSearchString } = props;

    const [searchStr, getSearchStr] = useState(firstSearchString);
    const [track, getTrack] = useState(null);
    const [message, getMessage] = useState("Message blank")

    //maybe set track outside state, so component holds it until necessary to pass back

    useEffect(() => {
       
        if (isFirstSearch == false) {
          
            async function execute() {

                function getData() {
                    return getASpotifyTrackFromRandomStr(getRandomStrForTrackSearch());

                } await getData()
                    .then(data => {
                        if (data) {
                            let newTrackId = data[0];
                            let newArtistId = data[1];
                            if (newTrackId) {
                                getTrack(newTrackId);
                                handleArtistId(newArtistId);
                            } else console.log("did not receive newTrack in Like.js")
                        }
                    })
            }
            execute();
        }
    }, [searchStr]);

    async function handleLike() {
        let output;
            if (playlist) {
      
                await handleLikedTrack(user, currentTrack, authToken, playlist)
                    .then((response) => {
                        output = response                       
                    }).catch(er => console.log(er))

            } else if (!playlist) {
              
                await handleLikedTrack(user, currentTrack, authToken)
                    .then((response) => {
                        output = response;
                    }).catch(er => console.log(er))
            } 
        
 
            //;
            if (output) {
                //update the playlistId in Player State
                updatePlaylist(output[0]);
                //update the message in Like State
                getMessage(output[1]);
                //update trackId in Player State; 
                updatePlayerTrack(track);
                //update Count in Player State;
                updateCount(1);
            }      
    }


    return (
        <div className='Like'>
            <a onClick={handleLike} onChange={() => track}>
                <img className='Like-icon' src={heart} alt='Heart Icon' />
            </a>
        </div>
    )
}