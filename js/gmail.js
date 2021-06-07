// Enter an API key from the Google API Console:
//   https://console.developers.google.com/apis/credentials
const apiKey = 'AIzaSyDurPEAF6Vdjh34MXz66kQQwA0nCky-sXk';

// Enter the API Discovery Docs that describes the APIs you want to
// access. In this example, we are accessing the People API, so we load
// Discovery Doc found here: https://developers.google.com/people/api/rest/
const discoveryDocs = ["https://people.googleapis.com/$discovery/rest?version=v1", "https://gmail.googleapis.com/$discovery/rest?version=v1"];

// Enter a client ID for a web application from the Google API Console:
//   https://console.developers.google.com/apis/credentials?project=_
// In your API Console project, add a JavaScript origin that corresponds
//   to the domain where you will be running the script.
const clientId = '983744597796-1gnrqksbctip4gqhgbcd7p8gik2troqh.apps.googleusercontent.com';

// Enter one or more authorization scopes. Refer to the documentation for
// the API or https://developers.google.com/people/v1/how-tos/authorizing
// for details.
const scopes = 'profile';

let authorizeButton;
let signoutButton;
let signatureButton;
let myEmail;

$(function() {
    authorizeButton = $('#authorize-button');
    signoutButton = $('#signout-button');
    signatureButton = $('#set-gmail-signature-button');
})

function handleClientLoad() {
    // Load the API client and auth2 library
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
            apiKey: apiKey,
            discoveryDocs: discoveryDocs,
            clientId: clientId,
            scope: scopes
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());

        authorizeButton.click(onAuthClick);
        signoutButton.click(onSignoutClick);
        signatureButton.click(onSetSignatureClick);
    });
}

function updateSigninStatus(isSignedIn) {
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
    const scopes = [
        "https://www.googleapis.com/auth/gmail.settings.basic",
        "https://www.googleapis.com/auth/gmail.settings.sharing",
        "https://www.googleapis.com/auth/gmail.readonly"
    ]

    gapi.auth2.getAuthInstance().signIn({
        scope: scopes.join(' ')
    });
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
        'sendAsEmail' : 'jake@dcitower.com',
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