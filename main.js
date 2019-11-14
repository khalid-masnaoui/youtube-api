const CLIENT_ID = "1090425021546-l9nr8runksisd7opjua0f42fh8g25tn1.apps.googleusercontent.com";
const API_KEY = "AIzaSyDPicS-fechJ7YH45lT5hDhr-zUFOZeiHo";
const title = document.querySelector("#title");
const description = document.querySelector("#description");
const country = document.querySelector("#country");
const view = document.querySelector("#view");
const video_number = document.querySelector("#video_number");
let channelID;
const videoscontainer = document.querySelector("#video_container");


// the API functions 
function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
        .then(function() {
                console.log("Sign-in successful");
                return true
            },
            function(err) {
                console.error("Error signing in", err);

            });
}

function loadClient() {
    gapi.client.setApiKey(API_KEY);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() {
                console.log("GAPI client loaded for API");
                return true
            },
            function(err) {
                console.error("Error loading GAPI client for API", err);

            });
}
// Make sure the client is loaded and sign-in is complete before calling this method.
function execute(channel) {
    return gapi.client.youtube.channels.list({
            "part": "snippet,contentDetails,statistics",
            "forUsername": channel
        })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response.result, );
                title.textContent = "title : " + response.result.items[0].snippet.title;
                description.textContent = "Description : " + response.result.items[0].snippet.description;
                country.textContent = "country : " + response.result.items[0].snippet.country;
                view.textContent = "view number : " + response.result.items[0].statistics.viewCount;
                video_number.textContent = "video number : " + response.result.items[0].statistics.videoCount;
                channelID = response.result.items[0].id;
                console.log(channelID);
            },
            function(err) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function() {
    gapi.auth2.init({ client_id: CLIENT_ID });
});

// getting videos 
function findVideos(arg) {

    return gapi.client.youtube.playlists.list({
            "part": "snippet",
            "channelId": arg,
            "maxResults": 10
        })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                const videos = response.result.items;
                if (videos) {
                    videoscontainer.innerHTML = "";
                    videos.forEach(elt => {
                        const videoID = elt.snippet.thumbnails.default.url.slice(23, 34);
                        console.log(videoID);
                        videoscontainer.innerHTML += '<div> <iframe width="300" height="300" src="https://www.youtube.com/embed/' + videoID + ' frameborder="0" allow="accelerometer;  encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe> </div>'
                    });

                } else {
                    videoscontainer.innerHTML = "<h2>no videos uploads</h2>";
                }
            },
            function(err) { console.error("Execute error", err); });
}

// LOG IN

document.querySelector(".autorized").addEventListener("click", logIn);

async function logIn(e) {
    const val = await authenticate();
    const val2 = await loadClient();
    console.log("hey");
    if (val && val2) {
        e.target.style.display = "none";
        document.querySelector(".execute").style.display = "block";
        document.querySelector("form").style.display = "block";
    } else(console.log("an error happened"))


};

//LOG OUT
document.querySelector(".execute").addEventListener("click", logOut);

function logOut(e) {
    e.target.style.display = "none";
    document.querySelector(".autorized").style.display = "block";
    document.querySelector("form").style.display = "none";
    document.querySelectorAll(".content h3").forEach(elt => {
        elt.textContent = "";
    })
};

//get channel data
document.querySelector("form").addEventListener("submit", getData);

function getData(e) {
    e.preventDefault();
    const value = document.querySelector("input[type=text]").value;
    console.log(value);
    if (value == "") {
        alert("not valid");

    } else {
        async function final(arg) {
            await execute(arg);
            console.log(channelID);
            console.log("c'moon")
            findVideos(channelID);
        };
        final(value);






    }
};