$.addButton.addEventListener('click', addSession);
//Creates database
function addSession(e){
	Alloy.Globals.database=Ti.Database.open('birdWatcherDatabase');
	Alloy.Globals.database.execute('create table if not exists '+$.sessionName.value+'(id INTEGER PRIMARY KEY, name TEXT);');
	Alloy.Globals.database.execute('delete from databaseName where name=?',$.sessionName.value);
	Alloy.Globals.database.execute('insert into databaseName(name, button1, button2, button3, button4, button5) values (?,?,?,?,?,?)',$.sessionName.value,$.button1name.value,$.button2name.value, $.button3name.value, $.button4name.value, $.button5name.value);
	Alloy.Globals.database.close();
	selectedDatabase=$.sessionName.value;
	Ti.App.fireEvent('refreshList');
	$.addWin.close();
	
}
$.deleteButton.addEventListener('click',deleteSession);
/*
 * Deletes a database and removes it from the list of events
 */
function deleteSession(e){
	try{
		var name=$.sessionName.value;
		Alloy.Globals.database=Ti.Database.open('birdWatcherDatabase');
		Alloy.Globals.database.execute('drop table '+name);
		Alloy.Globals.database.execute('delete from databaseName where name=?',name);
		Alloy.Globals.database.close();
		Ti.App.fireEvent('refreshList');
		$.addWin.close();

	}catch(e){
		alert('Deletion Failed');
	}
}
$.backButton.addEventListener('click', function(e){$.addWin.close();});