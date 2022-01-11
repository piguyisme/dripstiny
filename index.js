/*jshint esversion:8 */
const express = require('express');

const app = express();

require('dotenv').config();

class AuthorizedBNetConnection {
  constructor() {
    this.connectCallback = null;
  }
  async requestAPI(endpoint, method, options = {}) {
    let config = options;
    config.method = method;
    config.url = `https://www.bungie.net/platform${endpoint}`;
    config.headers["X-Api-Key"] = process.env.api_key;
    if (this.accessToken) {
      config.headers["Authorization"] = `Bearer ${this.accessToken}`;
    }
    axios(config).then(res => {
      return res;
    }).catch(e => {
      console.error(e);
    });
  }
  connect(auth_code) {
    if (!this.accessToken) {
      this.requestAPI('/app/oauth/token/', 'post', {
        params: {
          "grant_type": "authorization_code",
          "code": auth_code
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }).then(data => {
        console.log(data.code);
        this.accessToken = data.code;
        this.connectCallback();
      }).catch(e=>{
        console.error(e);
      });
    }
  }
  getMembershipID() {
    console.log(requestAPI('/User/GetMembershipsForCurrentUser/', 'get'))
  }
  on(event, callback) {
    switch (event) {
      case "connect":
        this.connectCallback = callback;
        break;
    }
  }
}

const axios = require('axios');

const bAPI = new AuthorizedBNetConnection();

let authCode;
app.get('/', (req, res) => {
  res.send(`Hello Express app! <a href='https://www.bungie.net/en/oauth/authorize?client_id=${process.env.client_id}&response_type=code&state=6i0mkLx79Hp91nzWVeHrzHG4'>bru</a>`)
});

app.get('/callback', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  // authCode = req.query.code;
  // bAPI.connect(authCode);
});

app.listen(8080, () => {
  console.log('server started');
});


function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

bAPI.on('connect', () => {
  console.log(bAPI.accessToken);
});
