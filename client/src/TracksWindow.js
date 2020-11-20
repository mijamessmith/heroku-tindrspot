import React, { useState, useEffect } from 'react';
import { formatTrackDataFromArray } from './utils';
import MaterialTable from "material-table";
import TrackTable from './TrackTable';
import cross from "./assets/images/cross.svg"

export default function TracksWindow(props) {

    var { playlistTracks, setTogglePlaylistTracks, togglePlaylistTracks} = props
    const [formattedPlaylist, getFormattedPlaylist] = useState(playlistTracks);


    const handleToggle = () => {
        setTogglePlaylistTracks(!togglePlaylistTracks);
    }

    return (
        <div className="TracksWindow">
            <img style={{ height: 30, width: 30 }} src={cross} onClick={handleToggle} />
            <h2>Spotind Playlist</h2>
            <div className="TracksWindow-table">
                <TrackTable data={formattedPlaylist}/>
            </div>
        </div>
        )
}