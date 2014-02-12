// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};
Alloy.Globals.database=Ti.Database.open('birdWatcherDatabase');
var Cloud=require('ti.cloud');
Cloud.debug=true;
Alloy.Globals.database.execute('Create table if not exists databaseName(id INTEGER PRIMARY KEY, name TEXT, button1 TEXT, button2 TEXT, button3 TEXT, button4 TEXT, button5 TEXT);');
Alloy.Globals.database.close();
Ti.API.info('alloy completed');
var dataBaseName;
var selectedDatabase=null;
