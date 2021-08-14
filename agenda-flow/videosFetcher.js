const fetch = require("node-fetch");
const dateFormat = require("dateformat");
const lodash = require('lodash');
const fs = require('fs');
const youtubeKey = "";
let youtubeApiUrl = "https://www.googleapis.com/youtube/v3/search?key="+youtubeKey+"&channelId=UC4ncvgh5hFr5O83MH7-jRJg&part=snippet,id&order=date&maxResults=50"
let apiJsonData =  require('./api.json');

fetch(youtubeApiUrl)
.then(response => response.json())
.then(data => processData(data)).then(function() {
    fs.writeFile ("api2.json", JSON.stringify(apiJsonData), function(err) {
        if (err) throw err;
        console.log('complete');
        }
    );
});

function processData(data) {
    if (data.items) {
        for(const item of data.items) { 
            let itemDate = new Date(item.snippet.publishedAt);
            let itemGuest = lodash.startCase(item.snippet.title.split("-")[0].trim().toLowerCase());
            apiJsonData.push({
                "datetime": dateFormat(itemDate, "dd/mm/yyyy"),
                "guest": itemGuest,
                "guestLink": "",
                "videoLink": "https://www.youtube.com/watch?v="+item.id.videoId,
                "image": "",
                "cancelled": false
            });
        }
    }
    if (data.nextPageToken && data.nextPageToken.length > 0) {
        console.log(data.nextPageToken);
        return fetch(youtubeApiUrl + "&pageToken=" + data.nextPageToken)
            .then(response => response.json())
            .then(data => processData(data));
    }
}
