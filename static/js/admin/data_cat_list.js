
$(function() {
	
	//获取分类数据
	$.getJSON(
		"ajax_data_cat_list?type=" + get_menu_param("type") + "&random=" + Math.random(),
		function(data) {
			show_data(data.data);
		}
	);
	
	//编辑
	$("#btn_edit").click(function() {
		
		if($("#data_cat").val() != "0") {
			$("#menu_param").val("type:" + get_menu_param("type") + ",id:" + $("#data_cat").val());
			$("#center-column").load("../../admin_templates/data_cat_add.html?random=" + Math.random());
		}
		else
			alert("请选择分类");
		
		return false;
	});
	
	//删除
	$("#btn_delete").click(function() {
		
		if(confirm("确认删除吗？")) {
			if($("#data_cat").val() != "0") {
				$.getJSON(
					"ajax_data_cat_del?id=" + $("#data_cat").val() + "&random=" + Math.random(),
					function(data) {
						alert(data.desc);
						$("#data_cat").empty();
						$("#data_cat").append('<option value="0">请选择分类</option>');
						
						//重新获取分类数据
						$.getJSON(
							"ajax_data_cat_list?type=" + get_menu_param("type") + "&random=" + Math.random(),
							function(data) {
								show_data(data.data);
							}
						);
					}
				);
			}
			else
				alert("请选择分类");
		}
		
		return false;
	});
	
	//添加按钮
	$("#add_btn").click(function() {
		$("#center-column").load("../../admin_templates/data_cat_add.html?random=" + Math.random());
		return false;
	});	
});
