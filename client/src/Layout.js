import React from 'react';
import PopoutInfo from './PopoutInfo'
import SpotifyLogo from './assets/images/spotify.svg'

export default function Layout(props) {
    const {loggedIn} = props;
    return (
        <div className="Layout">
            <div className="Layout-header">
                <span className="Spotify-Logo" >
                    <a target="_blank" href="https://developer.spotify.com/documentation/web-api/quick-start/">
                        <img className="Spotify-Logo-img"
                            src={SpotifyLogo}
                            style={{
                                "transform": "scale(1.1)"
                            }}>
                        </img>
                    </a>
                </span><span className="Layout-header-title">Tindr/Spot</span></div>
            <PopoutInfo />
            <div className="Layout-leftDiv"></div>
            <div className="Layout-rightDiv"></div>
            {!loggedIn &&
                <div className="Layout-messageDiv">
                <p className="Layout-messageDiv-p">Building playlists from the most remote corners of the music world</p>
                </div>
            }
            <div className="Layout-footer">
                <p className="Layout-footer-p">Tindr/Spot copyright 2020 under MIT</p>
            </div>
        </div>
        )
}