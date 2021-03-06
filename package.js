Package.describe({
  name: 'immojun:rest-accounts-password',
  version: '0.0.2',
  // Brief, one-line summary of the package.
  summary: 'Get a login token to use with simple:rest',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/mojun/rest-accounts-password',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.addFiles('rest-accounts-password.js','server');
  api.use('accounts-password');
  api.use('iron:router@1.0.7');
  if(api.export){
    api.export('Rap');
  }
});

Package.onTest(function(api) {
  api.use('tinytest');
  api.use('immojun:rest-accounts-password');
  api.addFiles('rest-accounts-password-tests.js');
});
