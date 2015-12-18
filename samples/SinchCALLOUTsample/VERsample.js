
sinchClient = new SinchClient({
	applicationKey: 'MY_APPLICATION_KEY',
	startActiveConnection: true,
	//Note: For additional loging, please uncomment the three rows below
	onLogMessage: function(message) {
		console.log(message);
	}
});

var ongoingVerification;

$('button#sendSMS').on('click', function(event) {
	event.preventDefault();
	clearError();
	$('button#sendSMS').attr('disabled', true);

	var selectedPhoneNumber = $('input#phoneNumber').val();

	ongoingVerification = sinchClient.createCalloutVerification(selectedPhoneNumber, 'HelloWorld');

	ongoingVerification.initiate().then(function(result) {
		$('div.success').show();
		$('button#sendSMS').attr('disabled', false);
	}).fail(handleError);
});

/*** Handle errors, report them and re-enable UI ***/

var handleError = function(error) {
	console.log('Verification error', error);
	
	//Show error
	$('div.error').text(error.message || error.data.message);
	$('div.error').show();
	$('button#sendSMS').attr('disabled', false);
}

/** Always clear errors **/
var clearError = function() {
	$('div.success').hide();
	$('div.error').hide();
}

