
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
				"ajax_admin_add?name=" + encodeURIComponent(name) + "&pwd=" + hex_md5(pwd) + "&pwd2=" + hex_md5(pwd2) + "&random=" + Math.random(),
				function(data) {
					if(data.code == 1) {
						alert(data.desc);
						return;
					}
					$("#center-column").load("../../admin_templates/admin_list.html?random=" + Math.random());
				}
			);
		}
		
	});
	
});
