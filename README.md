## Log in and register password accounts over HTTP

```sh
meteor add immojun:rest-accounts-password
```

### POST path for login and registeor
```js
Rap.addLogin(path);
Rap.addRegister(path);
```

#### Responses

Both login and register have the same response format.

##### Success
```js
{
    code: 200
    data: {
        token: token,
        tokenExpires: tokenExpiration,
        id: userId
    }
}     
```

##### Error
```js
{
    code: 500
    data: {
        error: error,
        reason: reason
    }
}     
```

#### Thanks to @stubailo
Based on [rest-accounts-password](https://github.com/stubailo/meteor-rest/tree/master/packages/rest-accounts-password).