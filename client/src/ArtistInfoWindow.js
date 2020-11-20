import React, { useState } from 'react';
import cross from "./assets/images/cross.svg"

export default function ArtistInfoWindow(props) {

    var {artistData, artistInfoToggle, setArtistInfoToggle } = props


    var getPopularity = (n) => {
        if (n <= 1) {
            return "Undiscovered Artist"
        }
        else if (n <= 5) {
            return "Rarely Heard Artist  "
        } 
        else if (n <= 12) {
            return "Low Profile Artist"
        } 
        else if (n <= 25) {
            return "Small Following Artist"
        } 
        else if (n < 40) {
            return "Medium Profile Artist"
        } 

        else if (n < 60) {
            return "Larger Profile Artist"
        } 

        else if (n < 70) {
            return "Artist of Significant Exposure"
        } 

        else if (n <= 80) {
            return "Popular Artist across Circles"
        } 

        else if (n <= 90) {
            return "Leading Artist of Today"
        } 

        else if (n <= 100) {
            return "Chart Topping Spotify Artist"
        } 
    }


    var artistPopularity = getPopularity(artistData.popularity);

    const handleClick = () => {
        setArtistInfoToggle(!artistInfoToggle);
    }


    return (
        <div className="ArtistInfoWindow">
            <img className="ArtistInfoWindow-cross" style={{ height: 30, width: 30 }} src={cross} onClick={handleClick} />
            <div className="ArtistInfoWindow-name">{artistData.name}</div>

            <img className="ArtistInfoWindow-artist-img" src={artistData.images[1].url} alt="Artist Picture" />

            {artistData.genres ?
                <div className="ArtistInfoWindow-genres"><span className="ArtistInfoWindow-Header">GENRES </span>
                     {artistData.genres.map((genre, index = 0) => (
                         <div className="ArtistInfoWindow-artist-genre" key={index}>{genre}</div>
                     )
                     )}
                </div>
                 : null}

            <div className="ArtistInfoWindow-followers"><span className="ArtistInfoWindow-Header">FOLLOWERS
            <br/>
                </span>{artistData.followers.total}</div>

            <div className="ArtistInfoWindow-populartity"><span className="ArtistInfoWindow-Header">POPULARITY <br /> </span>{artistPopularity}</div>
        </div>
        )
}