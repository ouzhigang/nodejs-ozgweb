
var curr_page = 1; //当前页
var request_data = true; //这个变量是为了防止请求完数据后，更新分页导航数据时反复请求数据

function show_data(list) {
	$(".listing > tbody").empty();
	
	//title部分
	var item_str = '<tr>';
	item_str += '<th class="first" width="30%">名称</th>';
	item_str += '<th width="20%">类别</th>';
	item_str += '<th width="25%">时间</th>';
	item_str += '<th width="10%">点击</th>';
	item_str += '<th class="last" width="15%">操作</th>';
	item_str += '</tr>';
	$(".listing > tbody").append(item_str);
	
	for(var i in list) {
		var item = list[i];
		
		item_str = '<tr class="bg">';
		item_str += '<td class="first style1">' + item.name + '</td>';
		item_str += '<td>' + item.dataclass.name + '</td>';
		item_str += '<td>' + item.add_time + '</td>';
		item_str += '<td>' + item.hits + '</td>';
		item_str += '<td class="last"><a href="#" class="btn_edit" id="btn_edit_' + item.id + '">编辑</a> <a href="#" class="btn_del" id="btn_del_' + item.id + '">删除</a></td>';
		item_str += '</tr>';
		$(".listing > tbody").append(item_str);
	}
	
	//编辑按钮
	$(".btn_edit").click(function() {
		
		var id = $(this).attr("id").split("_")[2];
		var page = curr_page;
		$("#menu_param").val("type:" + get_menu_param("type") + ",id:" + id + ",page:" + page);
		
		$("#center-column").load("../../static/simple/admin_templates/data_add.html?random=" + Math.random());
		
		return false;
	});
	
	//删除按钮
	$(".btn_del").click(function() {
		if(confirm("确认删除吗？")) {
			var id = $(this).attr("id").split("_")[2];
			$.getJSON(
				"ajax_data_del?id=" + id + "&random=" + Math.random(),
				function(data) {
					do_page();
				}
			);
		}
		return false;
	});
	
}

function update_page_nav(data) {
				
	if(get_menu_param("page")) {
		//获取了当前页后，需要把已保存的当前页删除
		curr_page = get_menu_param("page");
		$("#menu_param").val("type:" + get_menu_param("type"));
	}
	
	var opt = {
		callback: function(page_index, jq) {
			curr_page = page_index + 1;
			if(request_data) {
				request_data = false;
				do_page();
			}
			else
				request_data = true;
			return false;
		},
		items_per_page: data.page_size,
		current_page: curr_page - 1,
		num_edge_entries: 1
	};
	
	$("#Pagination").pagination(data.total, opt);
}

function do_page() {
	$.getJSON(
		"ajax_data_list?type=" + get_menu_param("type") + "&page=" + curr_page + "&random=" + Math.random(),
		function(data) {
			show_data(data.data.list);
			update_page_nav(data.data);
		}
	);
}

$(function() {
	
	var url = null;
	if(get_menu_param("page")) {
		curr_page = get_menu_param("page");
		url = "ajax_data_list?type=" + get_menu_param("type") + "&page=" + get_menu_param("page") + "&random=" + Math.random();
	}
	else
		url = "ajax_data_list?type=" + get_menu_param("type") + "&random=" + Math.random();

	$.getJSON(
		url,
		function(data) {
			if(data.data.page_count == 1) {
				$(".pagetable").hide(); //只有一页的话就不显示分页导航
				
				show_data(data.data.list);
			}
			else {
				show_data(data.data.list);
				update_page_nav(data.data);
			}
		}
	);
	
	//添加按钮
	$("#add_btn").click(function() {
		$("#menu_param").val("type:" + get_menu_param("type"));
		$("#center-column").load("../../static/simple/admin_templates/data_add.html?random=" + Math.random());
		return false;
	});
	
});
