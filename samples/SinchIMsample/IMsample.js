var global_username = '';

/*** After successful authentication, show user interface ***/

var showUI = function() {
	$('div#chat').show();
	$('form#userForm').css('display', 'none');
	$('div#userInfo').css('display', 'inline');
	$('h3#login').css('display', 'none');
	$('span#username').text(global_username);

	$('form#newRecipient').show();
	$('input#recipients').focus();
}


/*** If no valid session could be started, show the login interface ***/

var showLoginUI = function() {
	$('form#userForm').css('display', 'inline');
	$('input#username').focus();
}

//*** Set up sinchClient ***/

sinchClient = new SinchClient({
	applicationKey: 'MY_APPLICATION_KEY',
	capabilities: {messaging: true},
	startActiveConnection: true,
	//Note: For additional loging, please uncomment the three rows below
	onLogMessage: function(message) {
		console.log(message);
	}
});


/*** Name of session, can be anything. ***/

var sessionName = 'sinchSession-' + sinchClient.applicationKey;


/*** Check for valid session. NOTE: Deactivated by default to allow multiple browser-tabs with different users. Remove "false &&" to activate session loading! ***/

var sessionObj = JSON.parse(localStorage[sessionName] || '{}');
if(false && sessionObj.userId) { //Remove "false &&"" to actually check start from a previous session!
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

	//Use Sinch SDK to create a new user
	sinchClient.newUser(signUpObj, function(ticket) {
		//On success, start the client
		sinchClient.start(ticket, function() {
			global_username = signUpObj.username;
			//On success, show the UI
			showUI();

			//Store session & manage in some way (optional)
			localStorage[sessionName] = JSON.stringify(sinchClient.getSession());
		}).fail(handleError);
	}).fail(handleError);
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

	//Use Sinch SDK to authenticate a user
	sinchClient.start(signInObj, function() {
		global_username = signInObj.username;
		//On success, show the UI
		showUI();

		//Store session & manage in some way (optional)
		localStorage[sessionName] = JSON.stringify(sinchClient.getSession());
	}).fail(handleError);
});


/*** Send a new message ***/

var messageClient = sinchClient.getMessageClient();

$('form#newMessage').on('submit', function(event) {
	event.preventDefault();
	clearError();

	var recipients = $('input#recipients').val().split(' ');
	var text = $('input#message').val();
	$('input#message').val('');

	//Create new sinch-message, using messageClient
	var sinchMessage = messageClient.newMessage(recipients, text);
	//Send the sinchMessage
	messageClient.send(sinchMessage).fail(handleError);
});

$('form#newRecipient').on('submit', function(event) {
	event.preventDefault();

	$('form#newMessage').show();
	$('input#message').focus();
});

/*** Handle incoming messages ***/

var eventListener = {
	onIncomingMessage: function(message) {
		$('div#chatArea').prepend('<div class="msgRow" id="'+message.messageId+'"></div><div class="clearfix"></div>');

		$('div.msgRow#'+message.messageId)
			.attr('class', global_username == message.senderId ? 'me' : 'other')
			.append([
				'<div id="from">'+message.senderId+' <span>'+message.timestamp.toLocaleTimeString()+(global_username == message.senderId ? ',' : '')+'</span></div>', 
				'<div id="pointer"></div>',
				'<div id="textBody">'+message.textBody+'</div>',
				'<div class="recipients"></div>'
			]);
	}
}

messageClient.addEventListener(eventListener);


/*** Handle delivery receipts ***/ 

var eventListenerDelivery = {
	onMessageDelivered: function(messageDeliveryInfo) {
		//$('div#'+messageDeliveryInfo.messageId+' div.recipients').append(messageDeliveryInfo.recipientId + ' ');
		$('div#'+messageDeliveryInfo.messageId+' div.recipients').append('<img src="style/delivered_green.png" title="'+messageDeliveryInfo.recipientId+'">');
	}
}

messageClient.addEventListener(eventListenerDelivery);


/*** Log out user ***/

$('button#logOut').on('click', function(event) {
	event.preventDefault();
	clearError();

	//Stop the sinchClient
	sinchClient.terminate(); //Note: sinchClient object is now considered stale. Instantiate new sinchClient to reauthenticate, or reload the page.

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

