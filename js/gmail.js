// Enter an API key from the Google API Console:
//   https://console.developers.google.com/apis/credentials

// New project
// https://console.cloud.google.com/apis/credentials?project=diverse-email-sig&supportedpurview=project

const apiKey = 'YOUR_API_KEY';

// Enter the API Discovery Docs that describes the APIs you want to
// access. In this example, we are accessing the People API, so we load
// Discovery Doc found here: https://developers.google.com/people/api/rest/
const discoveryDocs = ["https://people.googleapis.com/$discovery/rest?version=v1", "https://gmail.googleapis.com/$discovery/rest?version=v1"];

// Enter a client ID for a web application from the Google API Console:
//   https://console.developers.google.com/apis/credentials?project=_
// In your API Console project, add a JavaScript origin that corresponds
//   to the domain where you will be running the script.

const clientId = 'YOUR_CLIENT_ID';

// Enter one or more authorization scopes. Refer to the documentation for
// the API or https://developers.google.com/people/v1/how-tos/authorizing
// for details.
const scopes = [
    "https://www.googleapis.com/auth/gmail.settings.basic",
    "https://www.googleapis.com/auth/gmail.settings.sharing",
    "https://www.googleapis.com/auth/gmail.readonly"
]

let authorizeButton;
let signoutButton;
let signatureButton;
let myEmail;

window.isAuthenticated = false;
window.identity = {};
window.token = '';

let client;

$(function() {
    authorizeButton = $('#authorize-button');
    signoutButton = $('#signout-button');
    signatureButton = $('#set-gmail-signature-button');

    authorizeButton.click(onAuthClick);
    signoutButton.click(onSignoutClick);
    signatureButton.click(onSetSignatureClick);
    
    updateSigninStatus(false);
})

function handleClientLoad() {
    // Oauth Client Library Loaded
    client = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: scopes.join(' '),
        callback: (response) => {
            console.log('response', response)
            window.at = response.access_token
            window.gapi2 = gapi
            if( response?.access_token ) {
                gapi.client.setApiKey(response.access_token);
                gapi.client.load('gmail', 'v1', handleApiLoadFinished);
            }
        }
    });
}

function handleApiLoad() {
    // API Library Loaded
    gapi.load('client');
}

function handleApiLoadFinished() {
    updateSigninStatus(true);
}

function updateSigninStatus(isSignedIn) {
    console.log('updateSigninStatus', isSignedIn)
    if (isSignedIn) {
        authorizeButton.hide()
        signoutButton.show()
        signatureButton.show()
        getProfile();
    } else {
        authorizeButton.show()
        signoutButton.hide()
        signatureButton.hide()
    }
}

function onAuthClick(event) {
    client.requestAccessToken()
}

function onSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
    $('#gmail-result').html('')
}

function onSetSignatureClick(event)
{
    const signature = $('#code-textarea').val()

    gapi.client.gmail.users.settings.sendAs.patch({
        'userId': 'me',
        'sendAsEmail' : myEmail,
        'signature' : signature
    }).then(function(response) {
        $('#gmail-result').html('√ Updated Gmail Signature')
    },
    function(err) {
        $('#gmail-result').html('x Error Updating Signature')
    });
}

function getProfile()
{
    gapi.client.gmail.users.getProfile({
        'userId': 'me'
    }).then(function(res) {
        myEmail = res.result.emailAddress
        $('#gmail-result').html('Authorized: ' + myEmail)
    });
}
