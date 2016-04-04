var putAreaItem = {};
$(function(){
	getListContent();
	$("#gotop").click(function(){
        $("html,body").animate({
            scrollTop:0
        },800);
    });
    $("#dialogGotop").click(function(){
      $("#viewDialog").animate({
          scrollTop:0
      },800);
  	});
    $(window).scroll(function() {
        if ( $(this).scrollTop() > 100){
            $('#gotop').fadeIn("fast");
        } else {
            $('#gotop').stop().fadeOut("fast");
        }
    });
});

function getListContent(){
	$.getJSON(CategoryApi + "GetList").done(function(rs){
		if(rs.status){
			var titleDiv = $("<div>").addClass("hero-unit");
			$("<h3>").addClass("page-header").text("API類別").appendTo(titleDiv);
			titleDiv.appendTo("#mainListArea");
			var categoryDiv = $("<div>");
			$.each(rs.data,function(index,content){
				var categoryContent = $("<div>").addClass("categoryTag mouse-pointer").html(content.name);
				categoryContent.click(function(){
					var scrollTop = $(putAreaItem[content.uid]).offset().top;
					$('html,body').animate({
						scrollTop: scrollTop
					}, 800);

				});
				if(!categoryDiv.find("div").length){
					categoryDiv.append(categoryContent);
				}else{
					categoryDiv.find("div").last().after(categoryContent);
				}

			});
			categoryDiv.appendTo("#mainListArea");
			createAPIList(rs.data);

		}else{
			putDataEmptyInfo( $("#mainListArea") );
		}
	});
}
function createAPIList(apiData){
	$.getJSON(listApi + "GetList", function(rs){
		if(rs.status){
			// 整理資料
			var data = processListData(rs.data);
		
			getBorder("table",function(tableStyle){
				var option = {styleKind:"table",style:"3grid"};
				getStyle(option,function(grid2Style){
					$.each(apiData,function(index,content){
						var titleDiv = $("<div>").addClass("hero-unit");
						$("<h3>").addClass("page-header").text(content.name).appendTo(titleDiv);
						$("<p>").addClass("hedaer-description").text(content.description).appendTo(titleDiv);
						
						putAreaItem[content.uid] = titleDiv;

						var tableStyleObj = $.parseHTML(tableStyle);
						$(tableStyleObj).find("thead").remove();

						if(data[content.uid] != undefined){
							titleDiv.appendTo("#mainListArea");

							$.each(data[content.uid], function(dataIndex, dataContent){
								// console.log(dataContent);
								var grid2StyleObj = $.parseHTML(grid2Style);
								$(grid2StyleObj).addClass("table-content");
								var apiURLText = $("<a>").prop("href","#").html(dataContent.name).click(function(){
									// 預覽
									viewDialog(dataContent);
									return false;
								});
								var httpMethod = $("<div>").addClass("http-"+dataContent.httpMethodName).text(dataContent.httpMethodName);
								$(grid2StyleObj).find("td").eq(0).html(apiURLText);
								$(grid2StyleObj).find("td").eq(1).html(httpMethod);
								$(grid2StyleObj).find("td").eq(2).html(dataContent.description);
								$(grid2StyleObj).appendTo(tableStyleObj);
							});

							$(tableStyleObj).appendTo("#mainListArea");
						}
						
					});
				});				
			});
		}else{
			putDataEmptyInfo( $("#mainListArea") );
		}
	});
}

// 整理列表資料
function processListData(data){
	var tmpData = {};
	$.each(data,function(index, content){
		var tmpObj;
		if(tmpData[content.category] == undefined){
			tmpData[content.category] = [];
		}
		tmpObj = content;
		tmpData[content.category].push(tmpObj);
	});
	return tmpData;
}
