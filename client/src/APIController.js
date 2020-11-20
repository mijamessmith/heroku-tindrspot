import axios from 'axios';

import { getArtistIdFromData } from './utils'
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

function getASpotifyTrackFromRandomStr(searchStr) {

           return spotifyApi.searchTracks(searchStr)
               .then(data => {   
                   
                   let trackData = data.tracks.items[Math.floor(Math.random() * 20)];
                   let trackId = trackData.id
                   let artistId = getArtistIdFromData(trackData);
                   return [trackId, artistId]
            }).catch((err) => {
                console.log(err)
            })
}




async function checkIfUserHasPlaylist(authTokenFromParam) {
    let output;
    let address = "https://api.spotify.com/v1/me/playlists"
    //;
    await axios({
        method: 'GET',
        url: address,
        responseType: 'json',
        headers: {
            'Authorization': 'Bearer ' + authTokenFromParam,
            "Content-Type": "application/json"
        }
    }).then(response => {
        
        let items = response.data.items
        let play = items.filter((ps) => ps.name == 'Testing Axios Playlist')
        if (play.length > 0) {
            let playlistId = play[0].id
            output = [true, playlistId];
            return [true, playlistId];

        } else if (play.length == 0) {
            console.log('no app playlist yet')
           output = [false, null]
            return [false, null]
        }
    }).catch((err) => console.log(err));
    return output;
}



async function getTracksFromPlaylist(authToken, playlistId) {
    let output;
    let address = "https://api.spotify.com/v1/playlists/" + `${playlistId}` + "/tracks"
    //;
    await axios({
        method: 'GET',
        url: address,
        responseType: 'json',
        headers: {
            'Authorization': 'Bearer ' + authToken,
            "Content-Type": "application/json"
        }
    }).then(response => {
       
        if (response) {
            output = response.data.items;
            return response;

        } else if (!response) {
            console.log('no app playlist yet')
            output = "empty";
            return;
        }
    }).catch((err) => console.log(err));
    return output;
}


async function createNewPlaylist(userIdFromParam, authTokenFromParam) {

    //needs userIdFromParam, authTokenFromParam
    let output;
    let address = "https://api.spotify.com/v1/users/" + userIdFromParam + "/playlists"
        //;
    await axios({
        method: 'POST',
        url: address,
        responseType: 'json',
        headers: {
            'Authorization': 'Bearer ' + authTokenFromParam,
            "Content-Type": "application/json"
        },
        data: {
            name: "Testing Axios Playlist"
        }
    }).then(response => {
        output = response.data.id;
        return response.data.id;
    }).catch((err) => console.log(err));
    return output;
}

async function handleUpdateArtist(authToken) {

}

async function getArtistInformation(authToken, artistId) {
    let output;
    let address = "https://api.spotify.com/v1/artists/" + `${artistId}`
   
    await axios({
        method: 'GET',
        url: address,
        responseType: 'json',
        headers: {
            'Authorization': 'Bearer ' + authToken,
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (response) {
            output = response.data;
            return response;

        } else if (!response) {
            console.log('cannot find artist')
            output = "empty";
            return;
        }
    }).catch((err) => console.log(err));
    return output;
}


//async function getTrackInformation(authToken, trackId) {
//    let output;
//    let address = "GET https://api.spotify.com/v1/artists/" + `${artistId}`
//    //;
//    await axios({
//        method: 'GET',
//        url: address,
//        responseType: 'json',
//        headers: {
//            'Authorization': 'Bearer ' + authToken,
//            "Content-Type": "application/json"
//        }
//    }).then(response => {
//        S;
//        if (response) {
//            output = response.data;
//            return response;

//        } else if (!response) {
//            console.log('cannot find artist')
//            output = "empty";
//            return;
//        }
//    }).catch((err) => console.log(err));
//    return output;
//}

async function addTrackToPlaylist(trackIdFromParam, PlaylistId, authTokenFromParam) {
    //need trackIdFromParam, PlaylistId, authTokenFromParam
    let output;
    let trackIdParam = ["spotify:track:" + trackIdFromParam] //must be an array of uris
    let address = "https://api.spotify.com/v1/playlists/" + PlaylistId + "/tracks"
        //;
        await axios({
            method: 'POST',
            url: address,
            responseType: 'json',
            headers: {
                'Authorization': 'Bearer ' + authTokenFromParam,
                "Content-Type": "application/json"
            },
            data: {
                uris: trackIdParam
            }
        }).then(response => {
            output = true;
           return true     
        }).catch((err) => console.log(err));
    return output;
}


async function handleLikedTrack(userID, trackID, authT, stateStoredPlaylistId = null, callBackFunction = null) {

    let userIdFromParam = userID;
    let trackIdFromParam = trackID;
    let authTokenFromParam = authT
    let PlaylistId = stateStoredPlaylistId;
    //let handleLikeOutput;


    if (stateStoredPlaylistId) {
        await addTrackToPlaylist(trackIdFromParam, PlaylistId, authTokenFromParam)
            .then((res) => {
              return
            }).catch((er) => console.log(er));

    } else if (!stateStoredPlaylistId) {
        //check if user has playlist
        await checkIfUserHasPlaylist(authTokenFromParam)
            .then(async (res) => {
               
                if (res[0] == true) {
                    //set playlist Id
                    PlaylistId = res[1]
                    //;
                    //add to track
                    await addTrackToPlaylist(trackIdFromParam, PlaylistId, authTokenFromParam)
                        .then((res) => {

                        }).catch((er) => console.log(er));
                }

                else if (res[0] == false) {
                    //create new playlist
                    await createNewPlaylist(userIdFromParam, authTokenFromParam)
                        .then(async (res) => {
                            //set PlaylistId
                            PlaylistId = res;
                            //;
                            //add to track
                            await addTrackToPlaylist(trackIdFromParam, res, authTokenFromParam)
                                .then((res) => {
                                    console.log('finished adding track' + res);
                                    //;
                                }).catch((er) => console.log(er));
                        })
                }
            }).catch((er) => console.log(er));
        //if so, call add to track
    }
    return [PlaylistId, "Completed a Like Click"]
}
   



export { getArtistInformation, checkIfUserHasPlaylist, getASpotifyTrackFromRandomStr, handleLikedTrack, getTracksFromPlaylist }