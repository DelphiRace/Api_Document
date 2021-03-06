// 創建各API列表(依據API類別)

function createAPIList(apiData){
	//先取得API全部列表資料
	$.getJSON(listApi + "GetList", function(rs){
		// console.log(rs);
		// 整理資料
		if(rs.status){
			var data = processListData(rs.data);
			// console.log(data);
		}
		// 取得外框資料
		getBorder("list-TitlePlus-left", function(borderStyle){
			// 取得內欄資料
			var option = {styleKind:"list",style:"3grid-modify"};
			getStyle(option, function(listStyle){
				// APIContentArea
				$.each(apiData,function(index, content){
					var borderStyleObj = $.parseHTML(borderStyle);
					$(borderStyleObj).addClass("apiContent");

					// 加入新增事件
					$(borderStyleObj).find(".fa-plus-circle").click(function(){
						// 新增函式
						insertAPIContentDialog(content, undefined, $(this).parents(".row").find(".item-list-border"));
					});

					// console.log(content);
					// 放入Title
					$(borderStyleObj).find("h3").eq(0).html(content.name);
					if(rs.status){
						if(data[content.uid] != undefined){
							$.each(data[content.uid], function(dataIndex, dataContent){
								// console.log(dataContent);
								var listStyleObj = $.parseHTML(listStyle);

								$(listStyleObj).addClass("dataContent");
								var apiURLText = $("<a>").prop("href","#").html(dataContent.name).click(function(){

									// 預覽
									viewDialog(dataContent);
									return false;
								});
								//放入方法名稱
								$(listStyleObj).find(".list-items").eq(0).html(apiURLText);
								// 放入請求方法
								var httpMethod = $("<div>").addClass("http-"+dataContent.httpMethodName).html(dataContent.httpMethodName);
								$(listStyleObj).find(".list-items").eq(1).html(httpMethod);

								// 放入方法說明
								$(listStyleObj).find(".list-items").eq(2).text(dataContent.description);

								// 修改按鈕
								$(listStyleObj).find(".fa-pencil-square-o").click(function(){
									var resetObj = {
										name: $(listStyleObj).find(".list-items").eq(0),
										description: $(listStyleObj).find(".list-items").eq(2),
										httpMethodName: $(listStyleObj).find(".list-items").eq(1),
										clickBtn: $(this)
									}
									insertAPIContentDialog(content, dataContent, resetObj);
								});
								// 刪除按鈕
								$(listStyleObj).find(".fa-trash-o").click(function(){
									deletDialog(dataContent.uid, dataContent.name, $(this), listApi + "deleteApiList");
								});

								$(listStyleObj).appendTo($(borderStyleObj).find(".item-list-border"));
							});
							

							$(borderStyleObj).find(".list-items-bottom").last().removeClass("list-items-bottom");
						}else{
							putDataEmptyInfo( $(borderStyleObj).find(".item-list-border") );
						}
					}else{
						putDataEmptyInfo( $(borderStyleObj).find(".item-list-border") );
					}
					// 放到區域中
					if( $(".apiContent").length ){
						$(".apiContent").last().after(borderStyleObj);
					}else{
						$("#APIContentArea").after(borderStyleObj);
					}
					// 將物件放入全域變數中，以利刪除或修改時可以同步操作
					putAreaItem[content.uid].area = borderStyleObj;
				});
				
			});
		});
	})
	
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

// 新增API內容
function insertAPIContentDialog(apiCategoryObj, contentObj, resetObj){
	// console.log(apiCategoryObj, contentObj, resetObj);
	$("#insertAPIContentDialog").remove();

    $("<div>").prop("id","insertAPIContentDialog").appendTo("body");

    var title = "", buttonText = "";
    if(contentObj == undefined){
      title = "新增 ";
      buttonText = "新增";
    }else{
      title = "修改 ";
      buttonText = "修改";
    }
    title += apiCategoryObj.name +" API項目";

    var inptObj = {
      api_method_name: {
        name: "方法名稱",
        type: "input",
        value: (contentObj == undefined) ? "":contentObj.name
      },
      api_method_description: {
        name: "方法簡述",
        type: "input",
        value: (contentObj == undefined) ? "":contentObj.description
      },
      api_method_url: {
        name: "URL",
        type: "input",
        value: (contentObj == undefined) ? "":contentObj.url
      },
      api_method_http_method:{
      	name: "請求方式",
      	type: "radio",
      	call: function(listStyleObj, inputID, contentObj, modalBody, inputValName){
      		var isCheckedID = (contentObj == undefined)?"":contentObj.http_method;
        	putRadioBtn(listStyleObj, inputID, relatedDataApi + "httpMethod", isCheckedID);
        }
      },
      ls_support_format_api_sf:{
      	name: "支援格式",
      	type: "radio",
      	call: function(listStyleObj, inputID, contentObj, modalBody, inputValName){
      		var isCheckedID = (contentObj == undefined)?"":contentObj.api_sf;
        	putRadioBtn(listStyleObj, inputID, relatedDataApi + "supportFormat",isCheckedID);
        }
      },
      ls_parameter:{
      	name: "請求參數",
      	type: "area",
      	call: function(listStyleObj, inputID, contentObj, modalBody, inputValName){
      		// parameter-input
        	putParameterArea(listStyleObj, inputValName, contentObj);
        	// console.log(contentObj);
        }
      },
      ls_important_info_content:{
      	name: "重要說明",
      	type: "textarea",
      	value: (contentObj == undefined) ? "":contentObj.importantInfo
      },
      ls_response_example_response_content:{
      	name: "返回值範例",
      	type: "textarea",
      	className: "textarea-height-200",
      	value: (contentObj == undefined) ? "":contentObj.response_content
      },
      ls_response_explanation:{
      	name: "返回值說明",
      	type: "area",
      	call: function(listStyleObj, inputID, contentObj, modalBody, inputValName){
      		// parameter-input
        	putResponseExplanationArea(listStyleObj, inputValName, contentObj);
        }
      },
    };

    $("#insertAPIContentDialog").bsDialog({
        autoShow:true,
        title: title,
    	modalClass:"bsDialogWindow",
        start: function(){
          var option = {styleKind:"input",style:"input-complex-none-button"};
          var modalBody = $("<div>").addClass("row").appendTo( $("#insertAPIContentDialog").find(".modal-body") );
          getStyle(option, function(listStyle){

            $.each(inptObj, function(inputID, inputVal){
				var listStyleObj = $.parseHTML(listStyle);

				listStyleObj = $(listStyleObj).find("."+inputVal.type);
				// 若為為定義，先空出空間擺放
				if(!listStyleObj.length){
					listStyleObj = $("<div>").prop("id",inputID);
				}

				$(listStyleObj).find(".control-label").html(inputVal.name);
				//輸入項目不為此二項時
				if(inputVal.type != 'radio' && inputVal.type != 'select' && inputVal.type != "area"){
					var inputArea = $(listStyleObj).find("input:text");
					if(!inputArea.length){
						inputArea = $(listStyleObj).find("textarea");
					}
					if(inputVal.className != undefined){
						inputArea.addClass(inputVal.className);
					}
					inputArea.addClass("userInput").prop("id",inputID).val(inputVal.value);
				}else{
					inputVal["call"](listStyleObj, inputID, contentObj, modalBody, inputVal.name);
				}
				// console.log(listStyleObj);
				$(listStyleObj).appendTo( modalBody );
            });
            // $(modalBody).find(".list-items-bottom").last().removeClass("list-items-bottom");
          });
        },
        button: [
          {
            text:buttonText,
            className: "btn-success",
            click: function(){
              var sendObj = getUserInput("insertAPIContentDialog");
              sendObj['api_method_Category'] = apiCategoryObj.uid;
              if(contentObj != undefined){ //修改
              	sendObj['api_method_UID'] = contentObj.uid;
              }
              sendObj['ls_response_example_response_content'] = $('<div/>').text(sendObj['ls_response_example_response_content']).html();
              // 取得參數與返回說明輸入區域資訊
              var parameter = getInsertAreaInfo();
              sendObj.ls_parameter = parameter[0];
              sendObj.ls_response_explanation = parameter[1];
              // console.log(sendObj);
              // 放入請求方法
              sendObj['httpMethodName'] = $("[name=api_method_http_method]:checked").parent().find(".label-description").text();
              sendObj['api_sf_name'] = $("[name=ls_support_format_api_sf]:checked").parent().find(".label-description").text();
              var apiMethod = (contentObj == undefined) ? "insertApiList":"modifyApiList";

              $.post(listApi + apiMethod, sendObj, function(rs){
              	rs = $.parseJSON(rs);
              	var modifyData = restSendDataObj(sendObj);
                //新增
                if(contentObj == undefined){
                	modifyData.uid = rs.data.uid;
                	resetObj.find(".date-empty").remove();
                	putAPIListTextForInsert(apiCategoryObj, modifyData, resetObj);
                }else{
              	 
                  // 修改後畫面上跟著動
              	 	putAPIListTextForModify(resetObj, modifyData);
                  //重新設定按鈕
                  resetObj.clickBtn.unbind("click").click(function(){
                    insertAPIContentDialog(apiCategoryObj, modifyData, resetObj)
                  });

                }
                // console.log(sendObj);
                // console.log(contentObj);
                // console.log(rs);
              });
              $("#insertAPIContentDialog").bsDialog("close");
            }
          },
          {
            text:"取消",
            click: function(){
              $("#insertAPIContentDialog").bsDialog("close");
            }
          }
          
        ]
    });
}

function putRadioBtn(putObj, inputID,callAPI, isChecked){
	var putStyle = $(putObj).find("label").parent().html();
	var putObjParent = $(putObj).find("label").parent();
	// console.log(isChecked);
	//清空
	$(putObj).find("label").parent().empty();
	$.getJSON(callAPI,function(rs){
		if(rs.status){
			$.each(rs.data,function(index, content){
				var putStyleObj = $.parseHTML(putStyle);
				//找到radio物件
				$(putStyleObj).find("input:radio").addClass("userInput").prop("name",inputID).attr("value", content.uid);
				if(isChecked == content.uid){
					$(putStyleObj).find("input:radio").attr("checked",true).parent().addClass("active");
				}
				$(putStyleObj).find(".label-description").text(content.name);
				$(putStyleObj).appendTo(putObjParent);
			});
		}
	});
}

//使用於變數相關說明
function putParameterArea(putObj, putLabel, contentObj){
	var option = {styleKind:"parameter", style:"parameter-input"};
	getStyle(option, function(parameterStyle){
		var parameterStyleObj = $.parseHTML(parameterStyle);

		// 將相關設定值塞入標籤，以便於同步
		var setClass = $(parameterStyleObj).prop("class");
		putObj.addClass(setClass);

		//將內容拔出，重新定義
		parameterStyle = $(parameterStyleObj).html();
		parameterStyleObj = $.parseHTML(parameterStyle);

		$(parameterStyleObj).find(".control-label").eq(0).text(putLabel);
		var parameterAreaStyle = $(parameterStyleObj).find(".parameterArea").html();
		$(parameterStyleObj).find(".fa-plus-square-o").click(function(){
			var thisTotalHeight = $(parameterStyleObj).find(".parameterArea")[0].clientHeight;
			addParameterArea(parameterStyleObj, parameterAreaStyle);
			// 錨點移動
			var topHeight = 0;
			for(var i = 0; i<5; i++){
				topHeight += $("#insertAPIContentDialog").find(".modal-body").find(".list-items").eq(i)[0].clientHeight;
			}
			var scrollTop = topHeight + thisTotalHeight;
			$('#insertAPIContentDialog').animate({
					scrollTop: scrollTop
			}, 800);
		});

		$(parameterStyleObj).find(".fa-trash").click(function(){
			$(this).parents(".row")[0].remove();
		});
		$(parameterStyleObj).appendTo(putObj);
		// 修改
		if(contentObj != undefined){
			$(parameterStyleObj).find(".parameterArea").find(".row").empty();
			addParameterArea(parameterStyleObj, parameterAreaStyle, contentObj);
		}
	});

}

// 使用於回傳值相關說明
function putResponseExplanationArea(putObj, putLabel, contentObj){
	var option = {styleKind:"response", style:"response-input"};
	getStyle(option, function(parameterStyle){
		var parameterStyleObj = $.parseHTML(parameterStyle);

		// 將相關設定值塞入標籤，以便於同步
		var setClass = $(parameterStyleObj).prop("class");
		putObj.addClass(setClass);

		//將內容拔出，重新定義
		parameterStyle = $(parameterStyleObj).html();
		parameterStyleObj = $.parseHTML(parameterStyle);

		$(parameterStyleObj).find(".control-label").eq(0).text(putLabel);
		var parameterAreaStyle = $(parameterStyleObj).find(".responseExplanationArea").html();
		$(parameterStyleObj).find(".fa-plus-square-o").click(function(){
			// 錨點移動
			var newREInput = addResponseExplanationArea(parameterStyleObj, parameterAreaStyle);
			if(newREInput){
				// 製作錨點動畫
				var thisHeight = $(newREInput).eq(1).height();
				var scrollTop = $("#insertAPIContentDialog").find(".modal-body").height() - thisHeight;
				$('#insertAPIContentDialog').animate({
					scrollTop: scrollTop
				}, 800);
			}
		});


		$(parameterStyleObj).find(".fa-trash").click(function(){
			$(this).parents(".row")[0].remove();
		});
		$(parameterStyleObj).appendTo(putObj);
		// 修改
		if(contentObj != undefined){
			$(parameterStyleObj).find(".responseExplanationArea").find(".row").empty();
			addResponseExplanationArea(parameterStyleObj, parameterAreaStyle, contentObj);
		}
	});

}

// 新增變數輸入區域
function addParameterArea(putObj, parameterAreaStyle, contentObj){
	// 取得唯一ID
	var idGen =new Generator();
	var onlyISSendID = idGen.getId();
	// console.log(putObj, contentObj);
	if(contentObj == undefined){ //新增
		// parameterArea
		var parameterAreaStyleObj = $.parseHTML(parameterAreaStyle);	
		$(parameterAreaStyleObj).find(".fa-trash").click(function(){
			$(this).parents(".row")[0].remove();
		});
		$(parameterAreaStyleObj).find(".fa-angle-up").click(function(){
			// 錨點移動
			var topHeight = 0;
			for(var i = 0; i<5; i++){
				topHeight += $("#insertAPIContentDialog").find(".modal-body").find(".list-items").eq(i)[0].clientHeight;
			}
			var scrollTop = topHeight + 56;
			$('#insertAPIContentDialog').animate({
					scrollTop: scrollTop
			}, 800);
		});
		var radioSendFalse = $(parameterAreaStyleObj).find("input:radio").eq(0).attr("name","isSend"+onlyISSendID);
		var radioSendTrue = $(parameterAreaStyleObj).find("input:radio").eq(1).attr("name","isSend"+onlyISSendID);
		$(parameterAreaStyleObj).appendTo( $(putObj).find(".parameterArea") );
	}else{ //修改
		if(contentObj.parameter != undefined){
			$.each(contentObj.parameter,function(index, content){
				var parameterAreaStyleObj = $.parseHTML(parameterAreaStyle);	
				// key值
				$(parameterAreaStyleObj).find("input:text").eq(0).val(content.name);
				$(parameterAreaStyleObj).find("input:text").eq(1).val(content.type);
				$(parameterAreaStyleObj).find("input:text").eq(2).val(content.description);
				var radioSendFalse = $(parameterAreaStyleObj).find("input:radio").eq(0).attr("name","isSend"+onlyISSendID);
				var radioSendTrue = $(parameterAreaStyleObj).find("input:radio").eq(1).attr("name","isSend"+onlyISSendID);
				if(content.required == 1 || content.required == "1"){
					radioSendFalse.attr('checked', true).parent().addClass("active");
				}else{
					radioSendTrue.attr('checked', true).parent().addClass("active");

				}
				// console.log(idGen.getId(),$(parameterAreaStyleObj).find("input:radio"));
				// $(parameterAreaStyleObj).find("input[name=isSend][value=" + content.required + "]").attr('checked', true);
				// $(parameterAreaStyleObj).find("input[name=isSend][value=" + content.required + "]").parent().addClass("active");
				// console.log($.uniqueId($(parameterAreaStyleObj)));
				$(parameterAreaStyleObj).find(".fa-trash").click(function(){
					$(this).parents(".row")[0].remove();
				});

				$(parameterAreaStyleObj).find(".fa-angle-up").click(function(){
					// 錨點移動
					var topHeight = 0;
					for(var i = 0; i<5; i++){
						topHeight += $("#insertAPIContentDialog").find(".modal-body").find(".list-items").eq(i)[0].clientHeight;
					}
					var scrollTop = topHeight + 56;
					$('#insertAPIContentDialog').animate({
							scrollTop: scrollTop
					}, 800);
				});
				$(parameterAreaStyleObj).appendTo( $(putObj).find(".parameterArea") );
			});
		}
	}
}

// 新增返回值輸入區域
function addResponseExplanationArea(putObj, parameterAreaStyle, contentObj){
	if(contentObj == undefined){ //新增
		// ResponseExplanationArea
		var parameterAreaStyleObj = $.parseHTML(parameterAreaStyle);	
		// 刪除項目按鈕
		$(parameterAreaStyleObj).find(".fa-trash").click(function(){
			$(this).parents(".row")[0].remove();
		});
		$(parameterAreaStyleObj).find(".fa-angle-up").click(function(){
			var areaHeight = $("#insertAPIContentDialog").find("#ls_response_explanation").height();
			var totalHeight = $("#insertAPIContentDialog").find(".modal-body").height();
			var scrollTop = totalHeight - areaHeight;
			$('#insertAPIContentDialog').animate({
					scrollTop: scrollTop
			}, 800);
		});
		$(parameterAreaStyleObj).appendTo( $(putObj).find(".responseExplanationArea") ).offset();
		return parameterAreaStyleObj;
	}else{ //修改
		if(contentObj.responseExplanation != undefined){
			$.each(contentObj.responseExplanation,function(index, content){
				var parameterAreaStyleObj = $.parseHTML(parameterAreaStyle);	
				// key值
				$(parameterAreaStyleObj).find("input:text").eq(0).val(content.name);
				$(parameterAreaStyleObj).find("input:text").eq(1).val(content.type);
				$(parameterAreaStyleObj).find("input:text").eq(2).val(content.description);


				$(parameterAreaStyleObj).find(".fa-trash").click(function(){
					$(this).parents(".row")[0].remove();
				});

				$(parameterAreaStyleObj).find(".fa-angle-up").click(function(){
					var areaHeight = $("#insertAPIContentDialog").find("#ls_response_explanation").height();
					var totalHeight = $("#insertAPIContentDialog").find(".modal-body").height();
					var scrollTop = totalHeight - areaHeight;
					$('#insertAPIContentDialog').animate({
							scrollTop: scrollTop
					}, 800);
				});
				$(parameterAreaStyleObj).appendTo( $(putObj).find(".responseExplanationArea") );
			});
		}
		return false;
	}	
}

// 取得新增或修改時的請求參數部分與返回值說明部分
function getInsertAreaInfo(){
	// 先取得參數部分
	var ls_parameter = $("#insertAPIContentDialog").find("#ls_parameter").find(".parameterArea").find(".row");
	var lsParameterObj = [];
	ls_parameter.each(function(){
		// key
		var name = $(this).find("input:text").eq(0).val();
		// type
		var type = $(this).find("input:text").eq(1).val();
		// 參數說明
		var description = $(this).find("input:text").eq(2).val();
		// 是否必傳
		var required = (parseInt($(this).find("input:radio:checked").val())) ? 1 : 0;
		if(name != undefined && type != undefined && description != undefined && $.trim(name) != "" && $.trim(type) != "" && $.trim(description) != ""){
			var tmpObj = {
				name:name,
				type:type,
				description:description,
				required:required
			};

			lsParameterObj.push(tmpObj);
		}
	});

	// 先取得返回值說明部分
	var ls_response_explanation = $("#insertAPIContentDialog").find("#ls_response_explanation").find(".responseExplanationArea").find(".row");
	var lsResponseExplanation = [];
	ls_response_explanation.each(function(){
		// key
		var name = $(this).find("input:text").eq(0).val();
		// type
		var type = $(this).find("input:text").eq(1).val();
		// 參數說明
		var description = $(this).find("input:text").eq(2).val();
		if(name != undefined && type != undefined && description != undefined && $.trim(name) != "" && $.trim(type) != "" && $.trim(description) != ""){
			var tmpObj = {
				name:name,
				type:type,
				description:description
			};

			lsResponseExplanation.push(tmpObj);
		}
	});

	var returnArr = [];
	returnArr.push(lsParameterObj);
	returnArr.push(lsResponseExplanation);

	return returnArr;
}

// 處理新增後的資料物件
function restSendDataObj(sendObj){
	// console.log(sendObj);
	var tmpObj = {};
	tmpObj.api_sf = sendObj.ls_support_format_api_sf;
	tmpObj.category = sendObj.api_method_Category;
	tmpObj.description = sendObj.api_method_description;
	tmpObj.http_method = sendObj.api_method_http_method;
	tmpObj.importantInfo = sendObj.ls_important_info_content;
	tmpObj.name = sendObj.api_method_name;
	// tmpObj.original = sendObj.ls_response_example_response_content;
	tmpObj.response_content = sendObj.ls_response_example_response_content;
	tmpObj.parameter = sendObj.ls_parameter;
	tmpObj.responseExplanation = sendObj.ls_response_explanation;
	tmpObj.uid = sendObj.api_method_UID;
	tmpObj.url = sendObj.api_method_url;
	tmpObj.httpMethodName = sendObj.httpMethodName;
	tmpObj.api_sf_name = sendObj.api_sf_name;
	return tmpObj;
}

//新增後，依據新增資料放入對應欄位
function putAPIListTextForInsert(apiCategoryObj, insertData, insertArea){
	insertArea.find(".dataContent").last().addClass("list-items-bottom");

	var option = {styleKind:"list",style:"3grid-modify"}
		getStyle(option, function(pagListStyle){
		var pagListStyleObj = $.parseHTML(pagListStyle);

		var apiURLText = $("<a>").prop("href","#").html(insertData.name).click(function(){
			// 預覽
			viewDialog(insertData);
			return false;
		});
		// API名稱
		$(pagListStyleObj).find(".list-items").eq(0).html(apiURLText);
		// 放入請求方法
		var httpMethod = $("<div>").addClass("http-"+insertData.httpMethodName).html(insertData.httpMethodName);
		$(pagListStyleObj).find(".list-items").eq(1).html(httpMethod);
		$(pagListStyleObj).find(".list-items").eq(2).html(insertData.description);

		//修改按鈕
		$(pagListStyleObj).find(".fa-pencil-square-o").click(function(){
		  var modifyObj = {
		    name: $(pagListStyleObj).find(".list-items").eq(0),
		    description: $(pagListStyleObj).find(".list-items").eq(2),
		    httpMethodName: $(pagListStyleObj).find(".list-items").eq(1),
		    clickBtn: $(this)
		  }
		  insertAPIContentDialog(apiCategoryObj, insertData, modifyObj);
		});
		//刪除按鈕
		$(pagListStyleObj).find(".fa-trash-o").click(function(){
		  deletDialog(insertData.uid, insertData.name, $(this), listApi + "deleteApiList");
		});

		$(pagListStyleObj).addClass("dataContent").removeClass("list-items-bottom").appendTo(insertArea);

	});
}

//修改後，依據修改資料放入對應欄位
function putAPIListTextForModify(modifyObj, modifyData){
	// console.log(modifyData);
  $.each(modifyObj, function(index, content){
  	if(index == "httpMethodName"){
  		var httpMethod = $("<div>").addClass("http-"+modifyData[index]).text(modifyData[index]);
  		content.html(httpMethod);
  	}else if(index == "name"){
  		var apiURLText = $("<a>").prop("href","#").html(modifyData[index]).click(function(){
			// 預覽
			viewDialog(modifyData);
			return false;
		});
		content.html(apiURLText);
  	}else{
    	content.text(modifyData[index]);
	}
  });
}

function Generator() {};

Generator.prototype.rand =  Math.floor(Math.random() * 26) + Date.now();

Generator.prototype.getId = function() {
	return this.rand++;
};
