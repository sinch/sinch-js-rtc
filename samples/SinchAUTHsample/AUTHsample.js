var global_username = '';


/*** After successful authentication, show user interface ***/

var showUI = function() {
	$('div#authStat').show();
	$('form#userForm').css('display', 'none');
	$('div#userInfo').css('display', 'inline');
	$('h3#login').css('display', 'none');
	$('span#username').text(global_username);
}


/*** If no valid session could be started, show the login interface ***/

var showLoginUI = function() {
	$('form#userForm').css('display', 'inline');
}


/*** Set up sinchClient ***/

sinchClient = new SinchClient({
	applicationKey: 'MY_APPLICATION_KEY', /* NOTE: Use same application key in backend-example.py, and start python script. */ 
	capabilities: {calling: true},
	startActiveConnection: true, /* NOTE: This is required if application is to receive calls / instant messages. */ 
	//Note: For additional loging, please uncomment the three rows below
	onLogMessage: function(message) {
		console.log(message);
	},
});


/*** Name of session, can be anything. ***/

var sessionName = 'sinchSessionAUTH-' + sinchClient.applicationKey;


/*** Check for valid session. NOTE: Deactivated by default to allow multiple browser-tabs with different users. ***/

var sessionObj = JSON.parse(localStorage[sessionName] || '{}');
if(sessionObj.userId) { 
	sinchClient.start(sessionObj)
		.then(function() {
			global_username = sessionObj.userId;
			//On success, show the UI
			showUI();
			//Store session & manage in some way (optional)
			localStorage[sessionName] = JSON.stringify(sinchClient.getSession());
		})
		.fail(function() {
			//No valid session, take suitable action, such as prompting for username/password, then start sinchClient again with login object
			showLoginUI();
		});
}
else {
	showLoginUI();
}


/*** Create user and start sinch for that user and save session in localStorage ***/

$('button#createUser').on('click', function(event) {
	event.preventDefault();
	$('button#loginUser').attr('disabled', true);
	$('button#createUser').attr('disabled', true);
	clearError();

	var signUpObj = {};
	signUpObj.username = $('input#username').val();
	signUpObj.password = $('input#password').val();

	//Use custom backend to create user
	//Then use returned authentication ticket to start sinchClient
	//Then show UI
	Q($.post('http://localhost:2048/register', JSON.stringify(signUpObj), {}, "json"))
		.then(sinchClient.start.bind(sinchClient))
		.then(function() {
			global_username = signUpObj.username;
			showUI();
			localStorage[sessionName] = JSON.stringify(sinchClient.getSession());
			})
		.fail(handleError);;
});


/*** Login user and save session in localStorage ***/

$('button#loginUser').on('click', function(event) {
	event.preventDefault();
	$('button#loginUser').attr('disabled', true);
	$('button#createUser').attr('disabled', true);
	clearError();

	var signInObj = {};
	signInObj.username = $('input#username').val();
	signInObj.password = $('input#password').val();

	//Authenticate user against custom backend
	//Then use returned authentication ticket to start sinchClient
	//Then show UI
	Q($.post('http://localhost:2048/login', JSON.stringify(signInObj), {}, "json"))
		.then(sinchClient.start.bind(sinchClient))
		.then(function() {
			global_username = signInObj.username;
			showUI();
			localStorage[sessionName] = JSON.stringify(sinchClient.getSession());
			})
		.fail(handleError);
});


/*** Log out user ***/

$('button#logOut').on('click', function(event) {
	event.preventDefault();
	clearError();

	//Stop the sinchClient
	sinchClient.terminate();
	//Note: sinchClient object is now considered stale. Instantiate new sinchClient to reauthenticate, or reload the page.

	//Remember to destroy / unset the session info you may have stored
	delete localStorage[sessionName];

	//Allow re-login
	$('button#loginUser').attr('disabled', false);
	$('button#createUser').attr('disabled', false);

	//Reload page.
	window.location.reload();
});


/*** Handle errors, report them and re-enable UI ***/

var handleError = function(error) {
	try {
		error.responseJSON = error.responseJSON || {};
		error.errorCode = error.errorCode || error.responseJSON.errorCode || '0';
		error.message = error.message || (error.errorCode  + ' ' + (error.responseJSON.message || 'No backend'));
	}
	catch(e) {
		console.error('FAIL', e);
		error.message = "Server failure";
	}

	//Enable buttons
	$('button#createUser').prop('disabled', false);
	$('button#loginUser').prop('disabled', false);

	//Show error
	$('div.error').text(error.message);
	$('div.error').show();
}

/** Always clear errors **/
var clearError = function() {
	$('div.error').hide();
}

/** Chrome check for file - This will warn developers of using file: protocol when testing WebRTC **/
if(location.protocol == 'file:' && navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
	$('div#chromeFileWarning').show();
}

$('button').prop('disabled', false); //Solve Firefox issue, ensure buttons always clickable after load

// Check if backend is up & alert developer 
// NOTE: No need to do this in production, this is for aiding developers who use this sample app
setInterval(function() { 
	$.get('http://localhost:2048/ping', function(response) {
			$('div#backendWarning').hide();
		}, 'html')
		.fail(function (jqXHR, textStatus, errorThrown) {
			$('div#backendWarning').show();
			console.log(jqXHR);
			console.log(textStatus);
			console.log(errorThrown);
		});
}, 1000);
