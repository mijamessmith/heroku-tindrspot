// JavaScript source code
import axios from 'axios';
import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

async function handleLikedTrack(userID, trackID, authT, stateStoredPlaylistId, callBackFunction = null) {
    /* I'll need:
     * 1. Auth Token
     * 2. PlaylistId - get from inside the inner functions
     * 3. Userid
     * 4. Track id
     */

    let userIdFromParam = userID;
    let trackIdFromParam = trackID;
    let authTokenFromParam = authT
    let PlaylistId = stateStoredPlaylistId;
    let hasPlaylist = false;
    let message = ''

    async function checkIfUserHasPlaylist() {
        async function checkPlaylist() {
            spotifyApi.getUserPlaylists(userIdFromParam)
                .then(data => {
                    console.log('got the playlists:' + data);
                    let items = data.items
                    debugger;
                    let play = items.filter((ps) => ps.name === 'Testing Playlist1')
                    debugger;
                    if (play[0] !== undefined) {
                        PlaylistId = play[0].id
                        message += 'User had playlist. '

                        //call add track to playlist
                        addTrackToPlaylist();
                    } else console.log('no app playlist yet')
                    //call createNewPlaylist here
                    message += 'User did not have a playlist yet. '
                    createNewPlaylist()
                },
                    function (err) {
                        console.error(err);
                    }
                ).catch((err) => console.log(err));
        }
        checkPlaylist() //invoke inner function
    }

    async function createNewPlaylist() {

        let address = "https://api.spotify.com/v1/users/" + userIdFromParam + "/playlists"

        debugger;

        async function subp() {
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
                debugger;
                PlaylistId = response.data.id
                debugger;
                message += 'Created the playlist'
            }).catch((err) => console.log(err))
        } await subp();
        //afterwards, add the track to the new playlist
        await addTrackToPlaylist();
    }


    async function addTrackToPlaylist() {

        let trackIdParam = ["spotify:track:" + trackIdFromParam] //must be an array of uris
        let address = "https://api.spotify.com/v1/playlists/" + PlaylistId + "/tracks"

        debugger;

        async function sub() {
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
                if (response) {
                    debugger;
                    message += "added track to playlist";
                    debugger;
                }
            }).catch((err) => console.log(err))
        } await sub();

        console.log('posted track to playlist. ')
        debugger;

    }

    async function executeFunctionality() {

        //in this inner function we will call above functions
        //after getting values we will call the passed in setter
        //functions from the above component to set the State of:
        //playlistId, addedTrack? (a state to see how many likes?)

        //we can do that by useing the param callBackFunction

        if (stateStoredPlaylistId) {
            hasPlaylist = true;
            await addTrackToPlaylist();
        } else if (!stateStoredPlaylistId) {
            await checkIfUserHasPlaylist();
        }
    }
    executeFunctionality();
    return [PlaylistId, hasPlaylist, message]
}

var test1 = handleLikedTrack(user, song, auth)
console.log(test1);