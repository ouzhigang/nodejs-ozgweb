//显示分类数据
var level = 0;
function show_data(data) {
	
	for(var i in data) {
		
		if(data[i].parent_id == 0)
			level = 0;
		
		var s = "";
		if(level > 0) {
			for(var j = 0; j < level; j++)
				s += "--";
		}
		
		$("#dataclass").append('<option value="' + data[i].id + '">' + s + data[i].name + '</option>');
		
		if(data[i].children) {
			level += 1;
			show_data(data[i].children);
			level -= 1;
		}
	}	
}
