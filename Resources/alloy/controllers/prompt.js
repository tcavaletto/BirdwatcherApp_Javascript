function Controller() {
    function addSession() {
        var loadName = $.sessionName.value;
        downloadSession(loadName);
        $.promptWin.close();
    }
    function downloadSession(name) {
        Cloud.Objects.query({
            classname: "bird",
            page: 1,
            per_page: 100,
            where: {
                dbName: name
            }
        }, function(e) {
            if (e.success) {
                Alloy.Globals.database = Ti.Database.open("birdWatcherDatabase");
                var birdData = [];
                for (var i = 0; e.bird.length > i; i++) birdData.push({
                    id: e.bird[i].id,
                    name: e.bird[i].name
                });
                Ti.API.info("deletecloudalso " + e.bird.length + " " + birdData.length);
                Alloy.Globals.database.execute("drop table if exists'" + name + "'");
                Alloy.Globals.database.execute("delete from databaseName where name=?", name);
                Alloy.Globals.database.execute("insert into databaseName(name, button1, button2, button3, button4, button5) values (?,?,?,?,?,?)", name, e.bird[0].button1, e.bird[0].button2, e.bird[0].button3, e.bird[0].button4, e.bird[0].button5);
                Alloy.Globals.database.execute("Create table if not exists " + name + "(id INTEGER PRIMARY KEY, name TEXT);");
                for (var i = 0; birdData.length > i; i++) Alloy.Globals.database.execute("insert into " + name + "(name) values (?)", birdData[i].name);
                Ti.App.fireEvent("refreshList");
                Alloy.Globals.database.close();
            } else Ti.API.info("getcloouddata failed");
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "prompt";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.promptWin = Ti.UI.createWindow({
        backgroundColor: "#333",
        id: "promptWin",
        title: "Download Event",
        modal: "true",
        top: "20%",
        left: "10%",
        width: "60%",
        height: "60%"
    });
    $.__views.promptWin && $.addTopLevelView($.__views.promptWin);
    $.__views.sessionName = Ti.UI.createTextField({
        id: "sessionName",
        hintText: "Enter Event Name",
        top: "20%",
        width: "90%"
    });
    $.__views.promptWin.add($.__views.sessionName);
    $.__views.addButton = Ti.UI.createButton({
        id: "addButton",
        title: "Import Event",
        top: "40%"
    });
    $.__views.promptWin.add($.__views.addButton);
    $.__views.backButton = Ti.UI.createButton({
        id: "backButton",
        title: "Cancel",
        top: "60%"
    });
    $.__views.promptWin.add($.__views.backButton);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.addButton.addEventListener("click", addSession);
    $.backButton.addEventListener("click", function() {
        $.promptWin.close();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;