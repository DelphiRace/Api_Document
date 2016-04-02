function getStyle(pageStyleOption,callback){

	var stylePath = pageStyleOption.styleKind+"/"+pageStyleOption.style;

	$.get("pages/style/"+stylePath+".html").done(function(pageStyle){
		callback(pageStyle);
	});
}

function getBorder(pageStyleOption,callback){

	var stylePath = pageStyleOption.styleKind+"/"+pageStyleOption.style;

	$.get("pages/"+stylePath+".html").done(function(pageStyle){
		callback(pageStyle);
	});
}