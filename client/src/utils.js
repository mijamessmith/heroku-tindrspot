import queryString from 'query-string'


function getRandomStrForTrackSearch() {
    const chars = '1234567890abcdefghijklmnopqrstuvwxyz'

    var charPosition = () => Math.floor(Math.random() * chars.length + 1)

    var wildCharPosition = Math.round(Math.random());
    var outputStr = ''

    for (let i = 0; i < 3; i++) {
        outputStr += chars[charPosition()];
    }
    if (wildCharPosition === 0) {
        outputStr = '%' + outputStr;
    } else outputStr = '%' + outputStr + '%'; 
    return outputStr;
}

function getArtistIdFromData(data) {
    if (data) {
        
        return data.artists[0].id
    } else return null;
}

function getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
        e = r.exec(q);
    }
    return hashParams;
}

function getQueryParams() {
    let result = ''
    let hashed = queryString.parse(window.location.hash)
    //
    if (hashed) {
        //;
        result = hashed.userId;
        //;
        return result
    } else return result;
}

function getRandomColorArray(num) {
    let outputArray = []
    for (let i = 0; i < num; i++) {
        outputArray.push(getRandomColor())
    }
    return outputArray;
}

function getRandomColor() {
    let red = Math.floor(Math.random() * 256)
    let blue = Math.floor(Math.random() * 256)
    let green = Math.floor(Math.random() * 256);
    let randomColor = `rgb(${red}, ${green}, ${blue})`;

    return randomColor;
}

function formatTrackDataFromArray(data) {
    //add an object with Artist, Track Title, Album values to output array
    let output = [];

    for (let i = 0; i < data.length; i++) {
        let obj = {}
        obj.track = data[i].track.name;
        obj.album = data[i].track.album.name;
        obj.artist = data[i].track.artists[0].name;
        output.push(obj);
    }
    return output;
}

export {
    getRandomColorArray,
    getHashParams,
    getRandomStrForTrackSearch,
    getQueryParams,
    getArtistIdFromData,
    formatTrackDataFromArray
} 

