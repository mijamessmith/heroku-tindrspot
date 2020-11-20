import React, { useState } from "react";


export default function PopoutWindow(props) {
    const { toggle } = props;

    const handleClick = () => {
        toggle();
    };

    return (
            <div className="PopoutWindow">  
                    <span className="PopoutWindow-close" onClick={handleClick}>close</span>
            <p className="PopoutWindow-text">Tindr/Spot uses Spotify to play completely random songs without
             trying to analyze your preferences, prejudices, or current music library.<br /><br /> Any song you like
                on Tindr/Spot will be added to a Spotify Playlist under your Spotify Account, titled, "Tindr/Spot."<br /><br />
                Tindr/Spot will only play full tracks if you have a Spotify Premium Account. Otherwise it will play
                a short preview of the track.
             
                </p>
            </div>
        );
}