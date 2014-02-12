function Controller() {
    function checkSelectedA() {
        if ("object" == typeof selectedDatabase) {
            $.index.setActiveTab(0);
            alert("Please select a database");
        } else {
            var buttonNames = [];
            Alloy.Globals.database = Ti.Database.open("birdWatcherDatabase");
            var rows = Alloy.Globals.database.execute("select distinct * from databaseName where name=?", selectedDatabase);
            while (rows.isValidRow()) {
                buttonNames.push({
                    button1: rows.fieldByName("button1"),
                    button2: rows.fieldByName("button2"),
                    button3: rows.fieldByName("button3"),
                    button4: rows.fieldByName("button4"),
                    button5: rows.fieldByName("button5")
                });
                rows.next();
            }
            Alloy.Globals.database.close();
            $.button1.title = buttonNames[0].button1;
            $.button2.title = buttonNames[0].button2;
            $.button3.title = buttonNames[0].button3;
            $.button4.title = buttonNames[0].button4;
            $.button5.title = buttonNames[0].button5;
        }
    }
    function checkSelectedB() {
        if ("object" == typeof selectedDatabase) {
            $.index.setActiveTab(0);
            alert("Please select a database");
        }
    }
    function uploadSession(name) {
        Cloud.Objects.query({
            classname: "bird",
            page: 1,
            per_page: 100,
            where: {
                dbName: name
            }
        }, function(e) {
            if (e.success) {
                var idList = [];
                for (var i = 0; e.bird.length > i; i++) idList.push({
                    id: e.bird[i].id,
                    name: e.bird[i].name
                });
                for (var i = 0; idList.length > i; i++) Cloud.Objects.remove({
                    classname: "bird",
                    id: idList[i].id
                }, function(e) {
                    e.success || alert("could not upload session");
                });
                Alloy.Globals.database = Ti.Database.open("birdWatcherDatabase");
                var buttonrows = Alloy.Globals.database.execute("select button1, button2, button3, button4, button5 from databaseName where name=?", name);
                var rows = Alloy.Globals.database.execute("select distinct * from " + name);
                Alloy.Globals.database.close();
                var buttonList = [ buttonrows.fieldByName("button1"), buttonrows.fieldByName("button2"), buttonrows.fieldByName("button3"), buttonrows.fieldByName("button4"), buttonrows.fieldByName("button5") ];
                while (rows.isValidRow()) {
                    Cloud.Objects.create({
                        classname: "bird",
                        fields: {
                            name: rows.fieldByName("name"),
                            button1: buttonList[0],
                            button2: buttonList[1],
                            button3: buttonList[2],
                            button4: buttonList[3],
                            button5: buttonList[4],
                            dbName: name
                        }
                    }, function(e) {
                        e.success || alert("error: could not save to cloud");
                    });
                    rows.next();
                }
            } else Ti.API.info("getcloouddata failed");
        });
    }
    function exitProgram() {
        var platform = "android";
        if ("android" === platform) {
            var activity = Titanium.Android.currentActivity;
            activity.finish();
        }
    }
    function signIn() {
        if ("Sign In" === $.signInButton.title) {
            var controller = Alloy.createController("signIn");
            controller.login.value = "tcavalet@asu.edu";
            controller.password.value = "password";
            controller.signWin.open();
        } else Cloud.Users.logout(function(e) {
            e.success ? $.signInButton.title = "Sign In" : alert("Error Signing Out");
        });
    }
    function addSession() {
        var controller = Alloy.createController("addSession");
        controller.addWin.open();
    }
    function loadSession() {
        if ("Sign Out" === $.signInButton.title) {
            var controller = Alloy.createController("prompt");
            controller.promptWin.open();
        } else alert("Please Sign In");
    }
    function sessionPopupInfo(e) {
        var name = e.row.title;
        var buttons = [ "Edit/Delete", "Select", "Upload" ];
        clickHandler = function(e) {
            if (0 === e.index) {
                selectedDatabase = name;
                checkSelectedA();
                var controller = Alloy.createController("addSession");
                controller.sessionName.value = name;
                controller.button1name.value = $.button1.title;
                controller.button2name.value = $.button2.title;
                controller.button3name.value = $.button3.title;
                controller.button4name.value = $.button4.title;
                controller.button5name.value = $.button5.title;
                Ti.API.info("almost there");
                controller.addWin.open();
            }
            if (1 == e.index) {
                selectedDatabase = name;
                $.index.setActiveTab(1);
            }
            2 == e.index && ("Sign Out" === $.signInButton.title ? uploadSession(name) : alert("Please sign in"));
        };
        var confirm = Ti.UI.createAlertDialog({
            message: "",
            buttonNames: buttons
        });
        confirm.addEventListener("click", clickHandler);
        confirm.show();
    }
    function getSessionData() {
        var data = [];
        var toWriteNames = [];
        Alloy.Globals.database = Ti.Database.open("birdWatcherDatabase");
        var rows = Alloy.Globals.database.execute("select name from databaseName");
        Alloy.Globals.database.close();
        while (rows.isValidRow()) {
            Ti.API.info(rows.fieldByName("name"));
            toWriteNames.push({
                name: rows.fieldByName("name")
            });
            rows.next();
        }
        var row = null;
        for (var i = 0; toWriteNames.length > i; i++) {
            Ti.API.info(toWriteNames[i].name);
            row = Ti.UI.createTableViewRow({
                title: toWriteNames[i].name,
                color: "#000",
                font: {
                    fontSize: "35%"
                }
            });
            data.push(row);
        }
        Ti.API.info("completed");
        $.sessionList.setData(data);
    }
    function addButton1() {
        Alloy.Globals.database = Ti.Database.open("birdWatcherDatabase");
        Alloy.Globals.database.execute("insert into " + selectedDatabase + "(name) values (?)", $.button1.title);
        Alloy.Globals.database.close();
    }
    function addButton2() {
        Alloy.Globals.database = Ti.Database.open("birdWatcherDatabase");
        Alloy.Globals.database.execute("insert into " + selectedDatabase + "(name) values (?)", $.button2.title);
        Alloy.Globals.database.close();
    }
    function addButton3() {
        Alloy.Globals.database = Ti.Database.open("birdWatcherDatabase");
        Alloy.Globals.database.execute("insert into " + selectedDatabase + "(name) values (?)", $.button3.title);
        Alloy.Globals.database.close();
    }
    function addButton4() {
        Alloy.Globals.database = Ti.Database.open("birdWatcherDatabase");
        Alloy.Globals.database.execute("insert into " + selectedDatabase + "(name) values (?)", $.button4.title);
        Alloy.Globals.database.close();
    }
    function addButton5() {
        Alloy.Globals.database = Ti.Database.open("birdWatcherDatabase");
        Alloy.Globals.database.execute("insert into " + selectedDatabase + "(name) values (?)", $.button5.title);
        Alloy.Globals.database.close();
    }
    function birdPopupInfo(e) {
        id = e.row.id;
        Ti.API.info("in popup " + id);
        var buttons = [ "Delete", "Exit" ];
        clickHandler = function(e) {
            if (0 === e.index) {
                Alloy.Globals.database = Ti.Database.open("birdWatcherDatabase");
                Alloy.Globals.database.execute("delete from " + selectedDatabase + " where id=?", id);
                Alloy.Globals.database.close();
                getBirdData();
            }
        };
        var confirm = Ti.UI.createAlertDialog({
            message: "",
            buttonNames: buttons
        });
        confirm.addEventListener("click", clickHandler);
        confirm.show();
    }
    function getBirdData() {
        try {
            var data = [];
            var toWriteNames = [];
            Alloy.Globals.database = Ti.Database.open("birdWatcherDatabase");
            var rows = Alloy.Globals.database.execute("select name,id from " + selectedDatabase);
            Alloy.Globals.database.close();
            while (rows.isValidRow()) {
                toWriteNames.push({
                    name: rows.fieldByName("name"),
                    id: rows.fieldByName("id")
                });
                rows.next();
            }
            var row = null;
            for (var i = 0; toWriteNames.length > i; i++) {
                Ti.API.info(toWriteNames[i].name);
                row = Ti.UI.createTableViewRow({
                    title: toWriteNames[i].name,
                    id: toWriteNames[i].id,
                    color: "#000",
                    font: {
                        fontSize: "35%"
                    }
                });
                data.push(row);
            }
            Ti.API.info("completed");
            $.birdList.setData(data);
        } catch (e) {
            alert("please select session to view birds");
        }
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "index";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    var __defers = {};
    $.__views.index = Ti.UI.createTabGroup({
        id: "index"
    });
    $.__views.__alloyId2 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "win1",
        id: "__alloyId2"
    });
    getSessionData ? $.__views.__alloyId2.addEventListener("focus", getSessionData) : __defers["$.__views.__alloyId2!focus!getSessionData"] = true;
    $.__views.signInButton = Ti.UI.createButton({
        id: "signInButton",
        title: "Sign In",
        top: "0",
        width: "31.5%",
        left: "1%",
        height: "13%"
    });
    $.__views.__alloyId2.add($.__views.signInButton);
    signIn ? $.__views.signInButton.addEventListener("click", signIn) : __defers["$.__views.signInButton!click!signIn"] = true;
    $.__views.addSessionButton = Ti.UI.createButton({
        id: "addSessionButton",
        title: "Add/Edit Event",
        top: "0",
        width: "32.5%",
        left: "33.5%",
        height: "13%"
    });
    $.__views.__alloyId2.add($.__views.addSessionButton);
    addSession ? $.__views.addSessionButton.addEventListener("click", addSession) : __defers["$.__views.addSessionButton!click!addSession"] = true;
    $.__views.loadSessionButton = Ti.UI.createButton({
        id: "loadSessionButton",
        title: "Load Event",
        top: "0",
        width: "31.5%",
        left: "67.5%",
        height: "13%"
    });
    $.__views.__alloyId2.add($.__views.loadSessionButton);
    loadSession ? $.__views.loadSessionButton.addEventListener("click", loadSession) : __defers["$.__views.loadSessionButton!click!loadSession"] = true;
    $.__views.sessionList = Ti.UI.createTableView({
        id: "sessionList",
        top: "13.01%"
    });
    $.__views.__alloyId2.add($.__views.sessionList);
    sessionPopupInfo ? $.__views.sessionList.addEventListener("click", sessionPopupInfo) : __defers["$.__views.sessionList!click!sessionPopupInfo"] = true;
    $.__views.__alloyId1 = Ti.UI.createTab({
        window: $.__views.__alloyId2,
        title: "Manage Events",
        id: "__alloyId1"
    });
    $.__views.index.addTab($.__views.__alloyId1);
    $.__views.__alloyId4 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "win2",
        id: "__alloyId4"
    });
    checkSelectedA ? $.__views.__alloyId4.addEventListener("focus", checkSelectedA) : __defers["$.__views.__alloyId4!focus!checkSelectedA"] = true;
    $.__views.button1 = Ti.UI.createButton({
        id: "button1",
        width: "50%",
        top: "10.5%"
    });
    $.__views.__alloyId4.add($.__views.button1);
    addButton1 ? $.__views.button1.addEventListener("click", addButton1) : __defers["$.__views.button1!click!addButton1"] = true;
    $.__views.button2 = Ti.UI.createButton({
        id: "button2",
        width: "50%",
        top: "24.5%"
    });
    $.__views.__alloyId4.add($.__views.button2);
    addButton2 ? $.__views.button2.addEventListener("click", addButton2) : __defers["$.__views.button2!click!addButton2"] = true;
    $.__views.button3 = Ti.UI.createButton({
        id: "button3",
        width: "50%",
        top: "38.5%"
    });
    $.__views.__alloyId4.add($.__views.button3);
    addButton3 ? $.__views.button3.addEventListener("click", addButton3) : __defers["$.__views.button3!click!addButton3"] = true;
    $.__views.button4 = Ti.UI.createButton({
        id: "button4",
        width: "50%",
        top: "52.5%"
    });
    $.__views.__alloyId4.add($.__views.button4);
    addButton4 ? $.__views.button4.addEventListener("click", addButton4) : __defers["$.__views.button4!click!addButton4"] = true;
    $.__views.button5 = Ti.UI.createButton({
        id: "button5",
        width: "50%",
        top: "66.5%"
    });
    $.__views.__alloyId4.add($.__views.button5);
    addButton5 ? $.__views.button5.addEventListener("click", addButton5) : __defers["$.__views.button5!click!addButton5"] = true;
    $.__views.__alloyId3 = Ti.UI.createTab({
        window: $.__views.__alloyId4,
        title: "Add Bird",
        id: "__alloyId3"
    });
    $.__views.index.addTab($.__views.__alloyId3);
    $.__views.__alloyId6 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        title: "win3",
        id: "__alloyId6"
    });
    getBirdData ? $.__views.__alloyId6.addEventListener("focus", getBirdData) : __defers["$.__views.__alloyId6!focus!getBirdData"] = true;
    $.__views.birdList = Ti.UI.createTableView({
        id: "birdList",
        top: "0"
    });
    $.__views.__alloyId6.add($.__views.birdList);
    birdPopupInfo ? $.__views.birdList.addEventListener("click", birdPopupInfo) : __defers["$.__views.birdList!click!birdPopupInfo"] = true;
    $.__views.__alloyId5 = Ti.UI.createTab({
        window: $.__views.__alloyId6,
        title: "Edit Event",
        id: "__alloyId5"
    });
    $.__views.index.addTab($.__views.__alloyId5);
    checkSelectedB ? $.__views.__alloyId5.addEventListener("click", checkSelectedB) : __defers["$.__views.__alloyId5!click!checkSelectedB"] = true;
    $.__views.__alloyId8 = Ti.UI.createWindow({
        backgroundColor: "#fff",
        id: "__alloyId8"
    });
    $.__views.__alloyId7 = Ti.UI.createTab({
        window: $.__views.__alloyId8,
        title: "Exit",
        id: "__alloyId7"
    });
    $.__views.index.addTab($.__views.__alloyId7);
    exitProgram ? $.__views.__alloyId7.addEventListener("click", exitProgram) : __defers["$.__views.__alloyId7!click!exitProgram"] = true;
    $.__views.index && $.addTopLevelView($.__views.index);
    exports.destroy = function() {};
    _.extend($, $.__views);
    Ti.App.addEventListener("refreshList", getSessionData);
    $.index.open();
    __defers["$.__views.__alloyId2!focus!getSessionData"] && $.__views.__alloyId2.addEventListener("focus", getSessionData);
    __defers["$.__views.signInButton!click!signIn"] && $.__views.signInButton.addEventListener("click", signIn);
    __defers["$.__views.addSessionButton!click!addSession"] && $.__views.addSessionButton.addEventListener("click", addSession);
    __defers["$.__views.loadSessionButton!click!loadSession"] && $.__views.loadSessionButton.addEventListener("click", loadSession);
    __defers["$.__views.sessionList!click!sessionPopupInfo"] && $.__views.sessionList.addEventListener("click", sessionPopupInfo);
    __defers["$.__views.__alloyId4!focus!checkSelectedA"] && $.__views.__alloyId4.addEventListener("focus", checkSelectedA);
    __defers["$.__views.button1!click!addButton1"] && $.__views.button1.addEventListener("click", addButton1);
    __defers["$.__views.button2!click!addButton2"] && $.__views.button2.addEventListener("click", addButton2);
    __defers["$.__views.button3!click!addButton3"] && $.__views.button3.addEventListener("click", addButton3);
    __defers["$.__views.button4!click!addButton4"] && $.__views.button4.addEventListener("click", addButton4);
    __defers["$.__views.button5!click!addButton5"] && $.__views.button5.addEventListener("click", addButton5);
    __defers["$.__views.__alloyId6!focus!getBirdData"] && $.__views.__alloyId6.addEventListener("focus", getBirdData);
    __defers["$.__views.birdList!click!birdPopupInfo"] && $.__views.birdList.addEventListener("click", birdPopupInfo);
    __defers["$.__views.__alloyId5!click!checkSelectedB"] && $.__views.__alloyId5.addEventListener("click", checkSelectedB);
    __defers["$.__views.__alloyId7!click!exitProgram"] && $.__views.__alloyId7.addEventListener("click", exitProgram);
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;