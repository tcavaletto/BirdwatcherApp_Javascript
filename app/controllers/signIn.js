$.signButton.addEventListener('click', signIn);
//Signs a user in
function signIn(e){
	Cloud.Users.login({
		login:$.login.value,
		password:$.password.value
	}, function(e){
		if(e.success){
			var tochange=Alloy.createController("index");
			tochange.signInButton.title="Sign Out";
			$.signWin.close();
		}
		else{
			$.signWin.close();
			alert("Sign in Failed");
		}
	});
	
	
}
$.backButton.addEventListener('click', function(e){$.signWin.close();});
