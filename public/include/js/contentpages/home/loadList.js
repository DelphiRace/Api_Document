// $(function(){
// 	firstLoadPage(function(){
// 		getPageContent();
// 	});
	
// });

function getPageContent(){
	var listID = $.trim(getUrlParameter("listID"));
	console.log(listID);
	if(listID == undefined || listID == ""){
		return;
	}
	$.getJSON(listApi + "GetList",{listID:listID}, function(rs){
		if(rs.status){
			var option = {styleKind:"table",style:"3grid"};
			getStyle(option,function(grid3Style){
				option = {styleKind:"table",style:"4grid"};
				getStyle(option,function(grid4Style){

					$.each(rs.data[0],function(index, value){
						if(index != "parameter" && index != "responseExplanation"){
							// 有才放
							if($("#"+index).length){
								if(value == undefined){
									value = "無";
								}
								$("#"+index).html(value);
							}
						}else{
							$.each(value, function(tableIndex, tableVal){
								if(index == "parameter"){//4格
									var grid4StyleObj = $.parseHTML(grid4Style);
									var required = (tableVal.required == "1") ? "true":"false";

									$(grid4StyleObj).find("td").eq(0).html(tableVal.key);
									$(grid4StyleObj).find("td").eq(1).html(required);
									$(grid4StyleObj).find("td").eq(2).html(tableVal.type);
									$(grid4StyleObj).find("td").eq(3).html(tableVal.description);

									$(grid4StyleObj).appendTo( $("#parameterArea").find("tbody") );
								}else if(index == "responseExplanation"){//3格
									var grid3StyleObj = $.parseHTML(grid3Style);

									$(grid3StyleObj).find("td").eq(0).html(tableVal.key);
									$(grid3StyleObj).find("td").eq(1).html(tableVal.type);
									$(grid3StyleObj).find("td").eq(2).html(tableVal.description);

									$(grid3StyleObj).appendTo( $("#responseExplanationArea").find("tbody") );
								}
							});
						}
					});

				});
			});
		}
	});
}

function getPageContentByData(data){

	var option = {styleKind:"table",style:"3grid"};
	getStyle(option,function(grid3Style){
		option = {styleKind:"table",style:"4grid"};
		getStyle(option,function(grid4Style){

			$.each(data,function(index, value){
				if(index != "parameter" && index != "responseExplanation"){
					// 有才放
					if($("#"+index).length){
						if(value == undefined){
							value = "無";
						}
						$("#"+index).html(value);
					}
				}else{
					$.each(value, function(tableIndex, tableVal){
						if(index == "parameter"){//4格
							var grid4StyleObj = $.parseHTML(grid4Style);
							var required = (tableVal.required == "1") ? "true":"false";

							$(grid4StyleObj).find("td").eq(0).html(tableVal.name);
							$(grid4StyleObj).find("td").eq(1).html(required);
							$(grid4StyleObj).find("td").eq(2).html(tableVal.type);
							$(grid4StyleObj).find("td").eq(3).html(tableVal.description);

							$(grid4StyleObj).appendTo( $("#parameterArea").find("tbody") );
						}else if(index == "responseExplanation"){//3格
							var grid3StyleObj = $.parseHTML(grid3Style);

							$(grid3StyleObj).find("td").eq(0).html(tableVal.name);
							$(grid3StyleObj).find("td").eq(1).html(tableVal.type);
							$(grid3StyleObj).find("td").eq(2).html(tableVal.description);

							$(grid3StyleObj).appendTo( $("#responseExplanationArea").find("tbody") );
						}
					});
				}
			});

		});
	});
}