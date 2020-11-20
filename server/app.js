/*-------------------------Import Modules-----------------------------------------*/

const express = require('express'); // Express web server framework
require('dotenv').config()
const session = require('express-session'); //must be above app
const request = require('request'); // "Request" library
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const Promise = require('bluebird');


const app = express();

/*---------------------------API Credentials to be later saved as .ENV ----------------*/
var client_id = process.env.REACT_APP_client_id;
var client_secret = process.env.REACT_APP_client_secret
var redirect_uri = 'http://localhost:8888/callback'



/*--------------------------Setup parsers and other middleware------------------------------------------------*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/public'))
    .use(cookieParser());

app.use(cors());
/*-----------------------------------Setting up the Session------------------------------- */

app.use(session({
    genid: (req) => { //generate id
        console.log('Inside session middleware genid function')
        console.log('Request object sessionID from client: ' + req.sessionID);
        var new_sid = uuid.v4(); //method of uuid version 4
        console.log('New session id generated: ' + new_sid);
        return new_sid; // use UUIDs for session IDs
    },
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
    name: 'server_sid'
}))


/*-------------------------------Hashing---------------------------------*/


var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';


/*--------------------------------Routes--------------------------------*/

app.get('/API/login', function(req, res) {

  var state = generateRandomString(16);
    res.cookie(stateKey, state);
  // your application requests authorization
    var scope = 'user-read-private playlist-modify-private user-read-email playlist-read-private user-read-playback-state playlist-modify-public';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});


app.get('/API/logout', (req, res, next) => {
    req.session.destroy(); //Kill Session
    console.log('killed:' + req.session)
    res.end();
    res.redirect("http://localhost:3000?logout=true");
})


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'))
})


app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code',

      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;
           

          //set up the tokens in the session
          req.session.access_token = access_token;
          req.session.refresh_token = refresh_token;
          
        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

            function getSpotifyUserId (){
              return Promise.try(() => {
                     request.get(options, function (error, response, body) {
                          console.log(body);
                          req.session.spotifyUserId = body.id
                         res.redirect('http://localhost:3000/#' +
                             querystring.stringify({
                                 access_token: access_token,
                                 refresh_token: refresh_token,
                                 userId: req.session.spotifyUserId
                             }));
                      })
                  }
              )
          }

          getSpotifyUserId().then(() => {
              // we can also pass the token to the browser to make requests from there
              //res.redirect('http://localhost:3000/#' +
              //    querystring.stringify({
              //        access_token: access_token,
              //        refresh_token: refresh_token,
              //        userId: req.session.spotifyUserId
              //    }));
          }).catch(er => console.log(er))

      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});



app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

app.get("/getCredentials", cors(), (req, res, next) => {
    if (req.session.access_token) {
        async function getCred() {
            await axios({
                method: "get",
                url: 'https://api.spotify.com/v1/me',
                responseType: 'json',
                headers: {
                    'Authorization': 'Bearer ' + req.session.access_token,
                    'Access-Control-Allow-Origin' : '*'
                }
            })
                .then(response => {
                    let resp = response.data.id;
                    req.session.currentUserId = resp
                    console.log(resp)
                    res.send(resp)
                })
                .catch((err) => {
                    console.log(err)
                })
        } getCred();
    } else {
        res.redirect('/#' +
            querystring.stringify({
                error: 'token_undefined'
            }));
    }
})

const PORT = process.env.PORT || 8888;

app.listen(PORT, () => console.log(`node server started on PORT: ${PORT}`));
