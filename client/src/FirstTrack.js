import React, { useState, useEffect } from "./react";
import { getASpotifyTrackFromRandomStr } from './APIController';


export default function FirstTrack() {
    useEffect(() => {
        async function getData() {
            let data = await getASpotifyTrackFromRandomStr(getRandomStrForTrackSearch())[0]
            if (data) {
                let newTrackId = data[0];
                let newArtistId = data[1];
                if (newTrackId) {
                    getTrack(newTrackId);
                    handleArtistId(newArtistId);
                } else console.log("did not receive newTrack in Like.js")
            }
        } getData()
    }, [searchStr]);


    return (
        <div>
            <p>
                To get start, like or dislike a track
            </p>
        </div>
        )
}