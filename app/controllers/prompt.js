$.addButton.addEventListener('click', addSession);
function addSession(e){
	var loadName=$.sessionName.value;
	downloadSession(loadName);
	$.promptWin.close();
	
}
/*
 * Grabs all the birds in a database from the cloud, then deletes the preexisting database and makes a new one 
 * with the cloud data
 */
function downloadSession(name){
	Cloud.Objects.query({
		classname:'bird',
		page:1,
		per_page:100,
		where:{dbName:name}
	},function(e){
		if(e.success){
			Alloy.Globals.database=Ti.Database.open('birdWatcherDatabase');
			var birdData=[];
			for(var i =0;i<e.bird.length;i++){
				birdData.push({id:e.bird[i].id, name:e.bird[i].name});
				}
			Ti.API.info('deletecloudalso '+e.bird.length+' '+birdData.length);
			Alloy.Globals.database.execute("drop table if exists'"+name+"'");
			Alloy.Globals.database.execute("delete from databaseName where name=?",name);
			Alloy.Globals.database.execute("insert into databaseName(name, button1, button2, button3, button4, button5) values (?,?,?,?,?,?)",name, e.bird[0].button1,e.bird[0].button2,e.bird[0].button3,e.bird[0].button4,e.bird[0].button5);
			Alloy.Globals.database.execute('Create table if not exists '+name+'(id INTEGER PRIMARY KEY, name TEXT);');
			for(var i=0;i<birdData.length;i++){
				Alloy.Globals.database.execute('insert into '+name+'(name) values (?)',birdData[i].name);
				}
			Ti.App.fireEvent('refreshList');
			Alloy.Globals.database.close();
			}else{Ti.API.info('getcloouddata failed');}
		});
	}
$.backButton.addEventListener('click', function(e){$.promptWin.close();});