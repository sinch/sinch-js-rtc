var SinchClient = require('sinch-rtc');
var readline = require('readline');

console.log('\u001b[1mSinch JavaScript SDK\u001b[22m Node instant messaging demo')
if(process.argv.indexOf('-h') !== -1) {
    console.log('');
    console.log('Available command line options:');
    console.log('');
    console.log('\t -h \t\t This helpful screen');
    console.log('');
    return;
}

var sinchClient, messageClient, recipientId;

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('SIGINT', function() {
    quit();
});

rl.question("Application key: ", function(answer) {
    init(answer);
    var loginObj = {};
    rl.question("Username: ", function(answer) {
        loginObj.username = answer;
        rl.question("Password: ", function(answer) {
            loginObj.password = answer;
            authenticate(loginObj);
        });
    });
});

var init = function(appKey) {
    sinchClient = new SinchClient({
        applicationKey: appKey,
        capabilities: {messaging: true},
        startActiveConnection: true,
        });

    messageClient = sinchClient.getMessageClient();

    messageClient.addEventListener({
        onIncomingMessage: function(message) {
            if(!message.direction) {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                console.log(message.senderId+': ' + message.textBody);
                rl.prompt(true);
            }
        }
    });
}

var authenticate = function(loginObj) {
    sinchClient.start(loginObj, function() {}, function() {}).then(function() {
            startChat(loginObj);
        }).fail(function(e) {
            console.log('\u001b[31mAuthentication failed \u001b[39m(' + e.message + ')');
            rl.question('Try create user? ', function(answer) {
                if (answer.match(/^y(es)?$/i)) {
                    sinchClient.newUser(loginObj, function(ticket) {
                        //On success, start the client
                        sinchClient.start(ticket, function() {
                            startChat(loginObj);
                        });
                    }, function(e) {
                        console.log('\u001b[31mError creating user \u001b[39m(' + e.message + ')');
                        quit();
                    });
                }
                else {
                    quit();
                }
            });
        })
}

var startChat = function(loginObj) {
    console.log('\u001b[32mAuthenticated as ' + loginObj.username + '\u001b[39m');

    rl.question("Chat with: ", function(answer) {
        console.log('===========================');
        recipientId = answer;
        rl.setPrompt(loginObj.username + '> ');
        rl.prompt(true);

        rl.on('line', function(line) {
            var message = messageClient.newMessage(recipientId, line);

            messageClient.send(message).then(function() {
                rl.prompt(true);
            }).fail(function(e) {
                console.log('\u001b[31mError sending message \u001b[39m(' + e.message + ')');
                rl.prompt(true);
            })
        })
    });    
}

var quit = function() {
    console.log('\nClosing application')
    try {
        sinchClient && sinchClient.terminate();
    }
    catch(e) {}
    process.kill();
}
