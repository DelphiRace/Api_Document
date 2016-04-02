function getStyle(pageStyleOption,callback){

	var stylePath = pageStyleOption.styleKind+"/"+pageStyleOption.style;

	$.get("pages/style/"+stylePath+".html").done(function(pageStyle){
		callback(pageStyle);
	});
}

function getBorder(style,callback){

	var stylePath = "style/border/"+style;

	$.get("pages/"+stylePath+".html").done(function(pageStyle){
		callback(pageStyle);
	});
}