
$(function() {
	
	$("#btn_submit").click(function() {

		var old_pwd = $("#old_pwd").val();
		var pwd = $("#pwd").val();
		var pwd2 = $("#pwd2").val();
		
		var msg = "";
		if(old_pwd == "")
			msg += "旧密码不能为空\n";
		if(pwd == "")
			msg += "新密码不能为空\n";
		else if(pwd != pwd2)
			msg += "确认密码不正确\n";
		
		if(msg != "")
			alert(msg);
		else {
			$.getJSON(
				"ajax_admin_updatepwd?old_pwd=" + hex_md5(old_pwd) + "&pwd=" + hex_md5(pwd) + "&pwd2=" + hex_md5(pwd2) + "&random=" + Math.random(),
				function(data) {
					alert(data.desc);
					$("#old_pwd").val("");
					$("#pwd").val("");
					$("#pwd2").val("");
				}
			);
		}
		
	});
	
});
