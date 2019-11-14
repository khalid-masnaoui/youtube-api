  /**
   * Sample JavaScript code for youtube.channels.list
   * See instructions for running APIs Explorer code samples locally:
   * https://developers.google.com/explorer-help/guides/code_samples#javascript
   */

  const CLIENT_ID = "1090425021546-l9nr8runksisd7opjua0f42fh8g25tn1.apps.googleusercontent.com";
  const API_KEY = "AIzaSyDPicS-fechJ7YH45lT5hDhr-zUFOZeiHo";
  const title = document.querySelector("#title");
  const description = document.querySelector("#description");
  const country = document.querySelector("#country");
  const view = document.querySelector("#view");
  const video_number = document.querySelector("#video_number");



  function authenticate() {
      return gapi.auth2.getAuthInstance()
          .signIn({ scope: "https://www.googleapis.com/auth/youtube.readonly" })
          .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }

  function loadClient() {
      gapi.client.setApiKey(API_KEY);
      return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
          .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
  // Make sure the client is loaded and sign-in is complete before calling this method.
  function execute() {
      return gapi.client.youtube.channels.list({
              "part": "snippet,contentDetails,statistics",
              "forUsername": "GoogleDevelopers"
          })
          .then(function(response) {
                  // Handle the results here (response.result has the parsed body).
                  console.log("Response", response.result, );
                  title.textContent = "title : " + response.result.items[0].snippet.title;
                  description.textContent = "Description : " + response.result.items[0].snippet.description;
                  country.textContent = "country : " + response.result.items[0].snippet.country;
                  view.textContent = "view number : " + response.result.items[0].statistics.viewCount;
                  video_number.textContent = "video number : " + response.result.items[0].statistics.videoCount;
              },
              function(err) { console.error("Execute error", err); });
  }
  gapi.load("client:auth2", function() {
      gapi.auth2.init({ client_id: CLIENT_ID });
  });