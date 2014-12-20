
var menu_list = null;

//获取左边小类菜单、部分带参数页面的参数
function get_menu_param(name) {
	
	var param_str = $("#menu_param").val();
	
	if(!param_str || param_str == "")
		return null;
	
	var param = null;
	
	if(param_str.indexOf(",") > -1) {
		var params = param_str.split(",");
		for(var i in params) {
			param = params[i].split(":");
			
			if(param[0] == name)
				return param[1];
		}		
	}
	else {
		param = param_str.split(":");
		if(param[0] == name)
			return param[1];
	}
	return null;
}

//上面的菜单的点击
function top_menu_click() {
	$("#top-navigation a").click(function() {
		
		var id = $(this).attr("id").split("_")[2];
		$("#left-column").empty();
		$("#top-navigation").empty();
		
		$.each(menu_list, function(i, item) {
			if(item.id == id)
				item.selected = true;
			else
				item.selected = false;
		});
				
		top_menu();
		top_menu_click();
		left_menu_click();
		left_menu2_click();
		
		return false;
	});
}

//左边菜单（大类）的点击事件
function left_menu_click() {
	$("#left-column > .link").click(function() {
		$("#left-column > ul").attr("class", "navhide");

		$(this).next().attr("class", "nav");
		return false;
	});
}

//左边菜单（小类）的点击事件
function left_menu2_click() {
	$("#left-column a[id^='child2_menu_']").click(function() {
		var id = $(this).attr("id").split("_")[2];
		
		//确定左边选中的小类
		$.each(menu_list, function(i, item_obj) {
			$.each(item_obj.child_menu, function(j, item_obj_child) {
				$.each(item_obj_child.child_menu, function(k, item_obj_child2) {
					if(item_obj_child2.id == id) {
						
						//参数部分
						$("#menu_param").val("");
						if(item_obj_child2.param)
							$("#menu_param").val(item_obj_child2.param);
					
						$("#center-column").load("../../static/simple/admin_templates/" + item_obj_child2.url + "?random=" + Math.random());
					}
				});
			});
		});
		
		return false;
	});
}

function top_menu() {
	//上面的菜单
	$.each(menu_list, function(i, item_obj) {
		var item = null;
				
		if(item_obj.selected) {
			//选定
			item = '<li class="active"><span><span>' + item_obj.name + '</span></span></li>';
			
			//左边的大类
			left_menu(item_obj.id);
		}
		else
			item = '<li><span><span><a href="#" id="top_menu_' + item_obj.id + '">' + item_obj.name + '</a></span></span>';
		$("#top-navigation").append(item);
	});
	
}

function left_menu(id) {
	
	var item_obj = null;
	$.each(menu_list, function(i, item) {
		if(item.id == id)
			item_obj = item;
	});	
	if(!item_obj) return;
	
	//左边的大类
	$.each(item_obj.child_menu, function(j, item_obj_child) {
		$("#left-column").append('<a href="#" class="link">' + item_obj_child.name + '</a>');
						
		if(j == 0)							
			$("#left-column").append('<ul class="nav" id="child_menu_' + item_obj_child.id + '"></ul>'); //默认选定第一个											
		else
			$("#left-column").append('<ul class="navhide" id="child_menu_' + item_obj_child.id + '"></ul>');
						
		//左边大类下面的小类
		$.each(item_obj_child.child_menu, function(k, item_obj_child2) {
			var item_obj_child2 = item_obj_child.child_menu[k];
							
			if(k + 1 < item_obj_child.child_menu.length)
				$("#child_menu_" + item_obj_child.id).append('<li><a href="#" id="child2_menu_' + item_obj_child2.id + '">' + item_obj_child2.name + '</a></li>');
			else
				$("#child_menu_" + item_obj_child.id).append('<li class="last"><a href="#" id="child2_menu_' + item_obj_child2.id + '">' + item_obj_child2.name + '</a></li>'); //最后一个
		});
	});
}

$(function() {
	
	//上面的菜单
	$.getJSON(
		"ajax_menu_list",
		function(data) {
			menu_list = data.data;
			
			top_menu();
			
			top_menu_click();
			left_menu_click();
			left_menu2_click();
		}
	);
	
	//退出按钮
	$("#logout").click(function() {
		if(confirm("确认退出吗？")) {
			$.getJSON(
				"ajax_logout",
				function(data) {
					location.href = "index";
				}
			);
		}
		return false;
	});
	
	//中间的界面部分
	$("#center-column").load("../../static/simple/admin_templates/main.html");
	
});
