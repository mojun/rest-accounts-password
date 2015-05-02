// Write your package code here!

Rap = {};

var loginHandler = function() {

    var options = this.request.body;

    try {
        check(options, {
            email: Match.Optional(String),
            username: Match.Optional(String),
            password: String
        });

        // Look up a user that has the username passed in, or has an email with the
        // given address in their emails array. (Note that "email.address" is querying
        // an array field)
        var user = Meteor.users.findOne({
          $or: [
            { username: options.username },
            { "emails.address": options.email }
          ]
        });

        if (! user) {
            throw new Meteor.Error("not-found",
            "User with that username or email address not found.");
        }

        var result = Accounts._checkPassword(user, options.password);
        check(result, {
            userId: String,
            error: Match.Optional(Meteor.Error)
        });

        if (result.error) {
            throw result.error;
        }

        var stampedLoginToken = Accounts._generateStampedLoginToken();
        check(stampedLoginToken, {
            token: String,
            when: Date
        });

        Accounts._insertLoginToken(result.userId, stampedLoginToken);

        var tokenExpiration = Accounts._tokenExpiration(stampedLoginToken.when);
        check(tokenExpiration, Date);

        var result = {};
        result.code = 200;
        result.data = {
            token: stampedLoginToken.token,
            tokenExpires: tokenExpiration,
            id: userId
        };
        
        this.response.end(EJSON.stringify(result));
    } catch (err) {
        var errJson = convertErrorToJson(err);
        console.log("Error in login: ", err);
        var result = {};
        result.code = 500;
        result.data = errJson;
        this.response.end(EJSON.stringify(result));
    }
};

Rap.addLogin = function(path) {
    Router.route(path, {where: 'server'})
    .post(loginHandler);
};

var registerHandler = function(){
    var options = this.request.body;

    try {
        check(options, {
            username: Match.Optional(String),
            email: Match.Optional(String),
            password: String
        });

        var userId = Accounts.createUser(
        _.pick(options, "username", "email", "password"));

    // Log in the new user and send back a token
        var stampedLoginToken = Accounts._generateStampedLoginToken();
        check(stampedLoginToken, {
            token: String,
            when: Date
        });

    // This adds the token to the user
        Accounts._insertLoginToken(userId, stampedLoginToken);

        var tokenExpiration = Accounts._tokenExpiration(stampedLoginToken.when);
        check(tokenExpiration, Date);

    // Return the same things the login method returns
        var result = {};
        result.code = 200;
        result.data = {
            token: stampedLoginToken.token,
            tokenExpires: tokenExpiration,
            id: userId
        };
        
        this.response.end(EJSON.stringify(result));
    } catch (err) {
        var errJson = convertErrorToJson(err);
        console.log("Error in registration: ", err);
        var result = {};
        result.code = 500;
        result.data = errJson;
        this.response.end(EJSON.stringify(result));
    }
};

Rap.addRegister = function(path) {
    Router.route(path, {where: 'server'})
    .post(registerHandler);
};

// Just like in DDP, send a sanitized error over HTTP
function convertErrorToJson(err) {
  if (err.sanitizedError) {
    var sE = err.sanitizedError;
    return {
      error: sE.error,
      reason: sE.reason
    };
  } else if (err.errorType === "Meteor.Error") {
    return {
      error: err.error,
      reason: err.reason
    };
  } else {
    return {
      error: "internal-server-error",
      reason: "Internal server error."
    };
  }
}
