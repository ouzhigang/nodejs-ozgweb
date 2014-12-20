
$(function() {
	
	$("#btn_submit").click(function() {
		
		var name = $("#name").val();
		var pwd = $("#pwd").val();
		var pwd2 = $("#pwd2").val();
		
		var msg = "";
		if(name == "")
			msg += "用户名不能为空\n";
		if(pwd == "")
			msg += "密码不能为空\n";
		else if(pwd != pwd2)
			msg += "确认密码不正确\n";
		
		if(msg != "")
			alert(msg);
		else {
			$.getJSON(
				"ajax_admin_add?name=" + encodeURIComponent(name) + "&pwd=" + pwd + "&pwd2=" + pwd2 + "&random=" + Math.random(),
				function(data) {
					$("#center-column").load("../../static/simple/admin_templates/admin_list.html?random=" + Math.random());
				}
			);
		}
		
	});
	
});
