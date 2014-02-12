function Controller() {
    function addSession() {
        Alloy.Globals.database = Ti.Database.open("birdWatcherDatabase");
        Alloy.Globals.database.execute("create table if not exists " + $.sessionName.value + "(id INTEGER PRIMARY KEY, name TEXT);");
        Alloy.Globals.database.execute("delete from databaseName where name=?", $.sessionName.value);
        Alloy.Globals.database.execute("insert into databaseName(name, button1, button2, button3, button4, button5) values (?,?,?,?,?,?)", $.sessionName.value, $.button1name.value, $.button2name.value, $.button3name.value, $.button4name.value, $.button5name.value);
        Alloy.Globals.database.close();
        selectedDatabase = $.sessionName.value;
        Ti.App.fireEvent("refreshList");
        $.addWin.close();
    }
    function deleteSession() {
        try {
            var name = $.sessionName.value;
            Alloy.Globals.database = Ti.Database.open("birdWatcherDatabase");
            Alloy.Globals.database.execute("drop table " + name);
            Alloy.Globals.database.execute("delete from databaseName where name=?", name);
            Alloy.Globals.database.close();
            Ti.App.fireEvent("refreshList");
            $.addWin.close();
        } catch (e) {
            alert("Deletion Failed");
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "addSession";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.addWin = Ti.UI.createWindow({
        backgroundColor: "#333",
        id: "addWin",
        title: "Add Window",
        modal: "true",
        top: "10%",
        left: "10%",
        width: "80%",
        height: "80%"
    });
    $.__views.addWin && $.addTopLevelView($.__views.addWin);
    $.__views.sessionName = Ti.UI.createTextField({
        id: "sessionName",
        hintText: "Enter Event Name",
        top: "5%",
        width: "90%"
    });
    $.__views.addWin.add($.__views.sessionName);
    $.__views.button1name = Ti.UI.createTextField({
        id: "button1name",
        hintText: "Enter Bird",
        top: "17%",
        width: "90%"
    });
    $.__views.addWin.add($.__views.button1name);
    $.__views.button2name = Ti.UI.createTextField({
        id: "button2name",
        hintText: "Enter Bird",
        top: "29%",
        width: "90%"
    });
    $.__views.addWin.add($.__views.button2name);
    $.__views.button3name = Ti.UI.createTextField({
        id: "button3name",
        hintText: "Enter Bird",
        top: "41%",
        width: "90%"
    });
    $.__views.addWin.add($.__views.button3name);
    $.__views.button4name = Ti.UI.createTextField({
        id: "button4name",
        hintText: "Enter Bird",
        top: "53%",
        width: "90%"
    });
    $.__views.addWin.add($.__views.button4name);
    $.__views.button5name = Ti.UI.createTextField({
        id: "button5name",
        hintText: "Enter Bird",
        top: "65%",
        width: "90%"
    });
    $.__views.addWin.add($.__views.button5name);
    $.__views.addButton = Ti.UI.createButton({
        id: "addButton",
        title: "Add/Edit Event",
        top: "77%",
        left: "10"
    });
    $.__views.addWin.add($.__views.addButton);
    $.__views.deleteButton = Ti.UI.createButton({
        id: "deleteButton",
        title: "Delete Event",
        top: "77%",
        right: "10"
    });
    $.__views.addWin.add($.__views.deleteButton);
    $.__views.backButton = Ti.UI.createButton({
        id: "backButton",
        title: "Cancel",
        top: "89%"
    });
    $.__views.addWin.add($.__views.backButton);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.addButton.addEventListener("click", addSession);
    $.deleteButton.addEventListener("click", deleteSession);
    $.backButton.addEventListener("click", function() {
        $.addWin.close();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;