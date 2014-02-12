
/* Background functions
 * CheckSelectedA and CheckSelectedB check to make sure a database is selected before allowing you to make changes
 * or view a database.
 * UploadSession uploads the event to the "cloud"
 * exitProgram exits the program
 */
function checkSelectedA(e){
	if(typeof selectedDatabase==="object"){
		$.index.setActiveTab(0);
		alert('Please select a database');
	}
	else{
		var buttonNames=[];
		Alloy.Globals.database=Ti.Database.open('birdWatcherDatabase');
		var rows=Alloy.Globals.database.execute('select distinct * from databaseName where name=?',selectedDatabase);
		while(rows.isValidRow()){
			buttonNames.push({button1:rows.fieldByName('button1'), button2:rows.fieldByName('button2'), button3:rows.fieldByName('button3'), button4:rows.fieldByName('button4'), button5:rows.fieldByName('button5')});
			rows.next();
			}
		Alloy.Globals.database.close();
		$.button1.title=buttonNames[0].button1;
		$.button2.title=buttonNames[0].button2;
		$.button3.title=buttonNames[0].button3;
		$.button4.title=buttonNames[0].button4;
		$.button5.title=buttonNames[0].button5;
	}
}
function checkSelectedB(e){
	if(typeof selectedDatabase==="object"){
		$.index.setActiveTab(0);
		alert('Please select a database');
	}
}
function uploadSession(name){
	//Collect birds
	Cloud.Objects.query({
	classname:'bird',
	page:1,
	per_page:100,
	where:{dbName: name}
	},function(e){
		if(e.success){
			var idList=[];
			for(var i =0;i<e.bird.length;i++){
				idList.push({id:e.bird[i].id, name:e.bird[i].name});
				}
			//Delete existing birds
			for(var i=0;i<idList.length;i++){
				Cloud.Objects.remove({
					classname:'bird',
					id:idList[i].id
				},function(e){
					if(!e.success)
						alert('could not upload session');
					});
				}
			//Save to Database
			Alloy.Globals.database=Ti.Database.open('birdWatcherDatabase');
			var buttonrows=Alloy.Globals.database.execute('select button1, button2, button3, button4, button5 from databaseName where name=?',name);
			var rows=Alloy.Globals.database.execute('select distinct * from '+name);
			Alloy.Globals.database.close();
			var buttonList=[buttonrows.fieldByName('button1'), buttonrows.fieldByName('button2'), buttonrows.fieldByName('button3'), buttonrows.fieldByName('button4'), buttonrows.fieldByName('button5')];
			while(rows.isValidRow()){
			Cloud.Objects.create({
				classname: 'bird',
				fields: {
					name: rows.fieldByName('name'),
					button1: buttonList[0],
					button2: buttonList[1],
					button3: buttonList[2],
					button4: buttonList[3],
					button5: buttonList[4],
					dbName:name
					}
				}, function (e){
					if(!e.success)
						alert('error: could not save to cloud');
					}
				);
		rows.next();
	}
		}else{Ti.API.info('getcloouddata failed');}
		}
	);
	
}
function exitProgram(e){
	var platform =Ti.Platform.osname;
	if(platform==='android'){
     var activity = Titanium.Android.currentActivity;
     activity.finish();}
}
Ti.App.addEventListener('refreshList',getSessionData);
//Manage Session functions
/* signIn, addSession, and LoadSession are called when their respective buttons are pushed.
 * sessionPopupInfo is called when a database is selected
 * getSessionData builds the table of databases
 */
function signIn(e){
	if($.signInButton.title==="Sign In"){
		var controller=Alloy.createController("signIn");
		controller.login.value="tcavalet@asu.edu";
		controller.password.value='password';
		controller.signWin.open();
	}
	else{
		Cloud.Users.logout(function (e) {
   			 if (e.success) {
        	$.signInButton.title="Sign In";
    		} else {
        	alert('Error Signing Out');
    		}
		});
		
	}
};
function addSession(e){
	var controller=Alloy.createController("addSession");
	controller.addWin.open();
};
function loadSession(e){
	if($.signInButton.title==="Sign Out"){
		var controller=Alloy.createController("prompt");
		controller.promptWin.open();
	}
	else{
		alert("Please Sign In");
	}
};
function sessionPopupInfo(e){
	var name=e.row.title;
	var buttons=['Edit/Delete','Select','Upload'];
	clickHandler=function(e){
		if(e.index===0){
			selectedDatabase=name;
			checkSelectedA();
		var controller=Alloy.createController("addSession");
		controller.sessionName.value=name;
		controller.button1name.value=$.button1.title;
		controller.button2name.value=$.button2.title;
		controller.button3name.value=$.button3.title;
		controller.button4name.value=$.button4.title;
		controller.button5name.value=$.button5.title;
		Ti.API.info('almost there');
		controller.addWin.open();
		}
		if(e.index==1){
			selectedDatabase=name;
			$.index.setActiveTab(1);
		}
		if(e.index==2){
			if($.signInButton.title==="Sign Out")
				uploadSession(name);
			else
				alert('Please sign in');
		}
	};
	var confirm=Ti.UI.createAlertDialog({
		message:"",
		buttonNames:buttons
		});
	confirm.addEventListener('click', clickHandler);
	confirm.show();
};
function getSessionData(e){
		var data=[];
		var toWriteNames=[];
		Alloy.Globals.database=Ti.Database.open('birdWatcherDatabase');
		var rows=Alloy.Globals.database.execute('select name from databaseName');
		Alloy.Globals.database.close();
		while(rows.isValidRow()){
			Ti.API.info(rows.fieldByName('name'));
			toWriteNames.push({name:rows.fieldByName('name')});
			rows.next();
			}
		var row=null;
		for (var i = 0; i < toWriteNames.length; i++) {
			Ti.API.info(toWriteNames[i].name);
			row =Ti.UI.createTableViewRow({
				title:toWriteNames[i].name,
				color: '#000',
				font: {
					fontSize: "35%",
					}
				});
			data.push(row);
			}
		Ti.API.info('completed');
		$.sessionList.setData(data);
		};
//Add Bird functions
/*
 * editButtons is a function for a button whose function has been shifted to addSession
 * addButtons 1-5 add the bird to the database
 */
function editButtons(e){
	Ti.API.info('entered editButtons');
	var controller=Alloy.createController("addSession");
	controller.sessionName.value=selectedDatabase;
	controller.button1name.value=$.button1.title;
	controller.button2name.value=$.button2.title;
	controller.button3name.value=$.button3.title;
	controller.button4name.value=$.button4.title;
	controller.button5name.value=$.button5.title;
	Ti.API.info('almost there');
	controller.addWin.open();
};
function addButton1(e){
	Alloy.Globals.database=Ti.Database.open('birdWatcherDatabase');
	Alloy.Globals.database.execute('insert into '+selectedDatabase+'(name) values (?)',$.button1.title);
	Alloy.Globals.database.close();
};
function addButton2(e){
	Alloy.Globals.database=Ti.Database.open('birdWatcherDatabase');
	Alloy.Globals.database.execute('insert into '+selectedDatabase+'(name) values (?)',$.button2.title);
	Alloy.Globals.database.close();
};
function addButton3(e){
	Alloy.Globals.database=Ti.Database.open('birdWatcherDatabase');
	Alloy.Globals.database.execute('insert into '+selectedDatabase+'(name) values (?)',$.button3.title);
	Alloy.Globals.database.close();
};
function addButton4(e){
	Alloy.Globals.database=Ti.Database.open('birdWatcherDatabase');
	Alloy.Globals.database.execute('insert into '+selectedDatabase+'(name) values (?)',$.button4.title);
	Alloy.Globals.database.close();
};
function addButton5(e){
	Alloy.Globals.database=Ti.Database.open('birdWatcherDatabase');
	Alloy.Globals.database.execute('insert into '+selectedDatabase+'(name) values (?)',$.button5.title);
	Alloy.Globals.database.close();
};
/*function addButtonOther(e){
	var otherButton=prompt("Enter other bird","");
	Alloy.Globals.database.execute('insert int '+selectedDatabase+'(name) values (?)', otherButton);
};*/

//Edit Session Functions
/*
 * birdPopupInfo is called when a bird is selected
 * getBirdData populates the bird table
 */
function birdPopupInfo(e){
	id=e.row.id;
	Ti.API.info('in popup '+id);
	var buttons=['Delete','Exit'];
	clickHandler=function(e){
		if(e.index===0){
		Alloy.Globals.database=Ti.Database.open('birdWatcherDatabase');
		Alloy.Globals.database.execute('delete from '+selectedDatabase+' where id=?',id);
		Alloy.Globals.database.close();
		getBirdData();
		}
	};
	var confirm=Ti.UI.createAlertDialog({
		message: "",
		buttonNames:buttons
		});
	confirm.addEventListener('click', clickHandler);
	confirm.show();
};
function getBirdData(e){
	try{
			var data=[];
		var toWriteNames=[];
		Alloy.Globals.database=Ti.Database.open('birdWatcherDatabase');
		var rows=Alloy.Globals.database.execute('select name,id from '+selectedDatabase);
		Alloy.Globals.database.close();
		while(rows.isValidRow()){
			toWriteNames.push({name:rows.fieldByName('name'), id:rows.fieldByName('id')});
			rows.next();
			}
		var row=null;
		for (var i = 0; i < toWriteNames.length; i++) {
			Ti.API.info(toWriteNames[i].name);
			row =Ti.UI.createTableViewRow({
				title:toWriteNames[i].name,
				id:toWriteNames[i].id,
				color: '#000',
				font: {
					fontSize:"35%"	
					}
				});
			data.push(row);
			}
		Ti.API.info('completed');
		$.birdList.setData(data);
	}catch(e){
		alert('please select session to view birds');
	}
		};

$.index.open();