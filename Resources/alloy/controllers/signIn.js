function Controller() {
    function signIn() {
        Cloud.Users.login({
            login: $.login.value,
            password: $.password.value
        }, function(e) {
            if (e.success) {
                var tochange = Alloy.createController("index");
                tochange.signInButton.title = "Sign Out";
                $.signWin.close();
            } else {
                $.signWin.close();
                alert("Sign in Failed");
            }
        });
    }
    require("alloy/controllers/BaseController").apply(this, Array.prototype.slice.call(arguments));
    this.__controllerPath = "signIn";
    arguments[0] ? arguments[0]["__parentSymbol"] : null;
    arguments[0] ? arguments[0]["$model"] : null;
    arguments[0] ? arguments[0]["__itemTemplate"] : null;
    var $ = this;
    var exports = {};
    $.__views.signWin = Ti.UI.createWindow({
        backgroundColor: "#333",
        id: "signWin",
        modal: "true",
        top: "20%",
        left: "10%",
        width: "60%",
        height: "60%"
    });
    $.__views.signWin && $.addTopLevelView($.__views.signWin);
    $.__views.login = Ti.UI.createTextField({
        id: "login",
        hintText: "email",
        top: "10%",
        width: "90%"
    });
    $.__views.signWin.add($.__views.login);
    $.__views.password = Ti.UI.createTextField({
        id: "password",
        hintText: "password",
        top: "40%",
        width: "90%"
    });
    $.__views.signWin.add($.__views.password);
    $.__views.signButton = Ti.UI.createButton({
        id: "signButton",
        title: "Sign in",
        top: "70%",
        left: "5%"
    });
    $.__views.signWin.add($.__views.signButton);
    $.__views.backButton = Ti.UI.createButton({
        id: "backButton",
        title: "Cancel",
        top: "70%",
        right: "5%"
    });
    $.__views.signWin.add($.__views.backButton);
    exports.destroy = function() {};
    _.extend($, $.__views);
    $.signButton.addEventListener("click", signIn);
    $.backButton.addEventListener("click", function() {
        $.signWin.close();
    });
    _.extend($, exports);
}

var Alloy = require("alloy"), Backbone = Alloy.Backbone, _ = Alloy._;

module.exports = Controller;