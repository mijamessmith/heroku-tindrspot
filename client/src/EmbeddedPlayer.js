import React, { useState, useEffect } from 'react';

function EmbeddedPlayer({ trackIdFromDislike }) {

    const [iframeSongId, getiframeSongId] = useState(null)

   

    useEffect(() => {
        getiframeSongId(trackIdFromDislike);
        //enable autoplay of function: currently doesn't work
        //autoClick();
    }, [trackIdFromDislike]);

    //function clickPlay(el){
    //    el.click()
    //}

    function autoClick() {
        var btn = document.getElementsByTagName('button');
        if (btn.length > 0) {
            btn[0].click();
            console.log('clicked for autoplay')
        } else console.log('no autoplay')
    };

    var iframeSRC = "https://open.spotify.com/embed/track/" + iframeSongId
    return (
        <div className="EmbeddedPlayer">
            <iframe className="EmbeddedPlayer-iframe" title="spotifyPlayer" src={iframeSRC} frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        </div>
        )
} 

export default EmbeddedPlayer