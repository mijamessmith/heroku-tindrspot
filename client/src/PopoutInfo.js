import React, {useState} from 'react'
import info from './assets/images/information.svg';
import PopoutWindow from './PopoutWindow';

export default function PopoutInfo() {
    const [visible, changeVisible] = useState(false)

    const handleClick = () => {
        changeVisible(!visible);
    }

    return (
        <div className='PopoutInfo'>
            <img className='PopoutInfo-icon' src={info} onClick={handleClick}></img>
            {visible ?
                <PopoutWindow toggle={handleClick} />
                : null
            }
        </div>
        )
}