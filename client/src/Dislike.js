import React, { useState, useEffect } from 'react';
import { getRandomStrForTrackSearch} from "./utils";
import { getASpotifyTrackFromRandomStr } from "./APIController"
import dislike from './assets/images/dislike.svg'
import sad from './assets/images/sad.svg'

export default function Dislike(props) {
    var { updateDislike } = props;
   

    const handleClick = () => {
        updateDislike(1);
    }

    return (
        <div className='Dislike'>
            <a onClick={handleClick}>
                <img className='Dislike-icon' src={sad} alt='Frowny-Face' />
            </a>
        </div>
        )
}
