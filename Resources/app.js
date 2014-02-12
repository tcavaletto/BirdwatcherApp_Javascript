var Alloy = require("alloy"), _ = Alloy._, Backbone = Alloy.Backbone;

Alloy.Globals.database = Ti.Database.open("birdWatcherDatabase");

var Cloud = require("ti.cloud");

Cloud.debug = true;

Alloy.Globals.database.execute("Create table if not exists databaseName(id INTEGER PRIMARY KEY, name TEXT, button1 TEXT, button2 TEXT, button3 TEXT, button4 TEXT, button5 TEXT);");

Alloy.Globals.database.close();

Ti.API.info("alloy completed");

var dataBaseName;

var selectedDatabase = null;

Alloy.createController("index");