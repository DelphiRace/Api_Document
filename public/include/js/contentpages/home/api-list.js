// 創建各API列表(依據API類別)

function createAPIList(apiData){
	//先取得API全部列表資料
	$.getJSON(listApi + "GetList", function(rs){
		// console.log(rs);
		// 取得外框資料
		getBorder("list-TitlePlus", function(borderStyle){
			// APIContentArea
			$.each(apiData,function(index, content){
				var borderStyleObj = $.parseHTML(borderStyle);
				$(borderStyleObj).addClass("apiContent");

				// 加入新增事件
				$(borderStyleObj).find(".fa-plus-circle").click(function(){
					// 新增函式
					insertAPIContentDialog(content);
				});

				console.log(content);
				// 放入Title
				$(borderStyleObj).find("h3").eq(0).html(content.name);

				// 放到區域中
				if( $(".apiContent").length ){
					$(".apiContent").last().after(borderStyleObj);
				}else{
					$("#APIContentArea").after(borderStyleObj);
				}
				if(rs.status){

				}else{
					putDataEmptyInfo( $(borderStyleObj).find(".item-list-border") );
				}
			});
		});
	})
	
}

// 新增API內容
function insertAPIContentDialog(apiCategoryObj, contentObj){
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
      api_method_url: {
        name: "URL",
        type: "input",
        value: (contentObj == undefined) ? "":contentObj.description
      },
      api_method_http_method:{
      	name: "請求方式",
      	type: "radio",
      	call: function(listStyleObj, inputID, contentObj, modalBody, inputValName){
        	putRadioBtn(listStyleObj, inputID, relatedDataApi + "httpMethod");
        }
      },
      api_method_support_format:{
      	name: "支援格式",
      	type: "radio",
      	call: function(listStyleObj, inputID, contentObj, modalBody, inputValName){
        	putRadioBtn(listStyleObj, inputID, relatedDataApi + "supportFormat");
        }
      },
      api_method_parameter:{
      	name: "請求參數",
      	type: "area",
      	call: function(listStyleObj, inputID, contentObj, modalBody, inputValName){
      		// parameter-input
        	putParameterArea(modalBody, inputValName, contentObj);
        }
      }
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

				$(listStyleObj).find(".control-label").html(inputVal.name);
				//輸入項目不為此二項時
				if(inputVal.type != 'radio' && inputVal.type != 'select' && inputVal.type != "area"){
					$(listStyleObj).find("input:text").addClass("userInput").prop("id",inputID).val(inputVal.value);
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
              console.log(sendObj);
              // var apiMethod = (contentObj == undefined) ? "insertApiCategory":"modifyApiCategory";
              // // console.log(sendObj);
              // $.post(CategoryApi + apiMethod, sendObj,function(rs){
              //   rs = $.parseJSON(rs);
              //   //新增
              //   if(modifyObj == undefined){
              //     sendObj.uid = rs.data["uid"];
              //     putTextForInsert(sendObj);
              //   }else{
              //     // 修改後畫面上跟著動
              //     putTextForModify(inptObj, modifyObj, sendObj);
              //     //重新設定按鈕
              //     modifyObj.clickBtn.unbind("click").click(function(){
              //       insertAPIContentDialog(sendObj, modifyObj);
              //     });

              //   }
              //   // console.log(rs);
              // });
              // $("#insertAPIContentDialog").bsDialog("close");
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

function putRadioBtn(putObj, inputID,callAPI){
	var putStyle = $(putObj).find("label").parent().html();
	var putObjParent = $(putObj).find("label").parent();
	//清空
	$(putObj).find("label").parent().empty();
	$.getJSON(callAPI,function(rs){
		if(rs.status){
			$.each(rs.data,function(index, content){
				var putStyleObj = $.parseHTML(putStyle);
				//找到radio物件
				$(putStyleObj).find("input:radio").addClass("userInput").prop("name",inputID).attr("value", content.uid);
				$(putStyleObj).find(".label-description").text(content.name);
				$(putStyleObj).appendTo(putObjParent);
			});
		}
	});
}

function putParameterArea(putObj, putLabel, contentObj){
	var option = {styleKind:"parameter", style:"parameter-input"};
	getStyle(option, function(parameterStyle){
		var parameterStyleObj = $.parseHTML(parameterStyle);
		$(parameterStyleObj).find(".control-label").eq(0).text(putLabel);
		var parameterAreaStyle = $(parameterStyleObj).find(".parameterArea").html();
		$(parameterStyleObj).find(".fa-plus-square-o").click(function(){
			addParameterArea(parameterStyleObj, parameterAreaStyle);
		});
		// 新增
		if(contentObj == undefined){

		}
		
		$(parameterStyleObj).appendTo(putObj);
	});

}

function addParameterArea(putObj, parameterAreaStyle){
	// parameterArea
	var parameterAreaStyleObj = $.parseHTML(parameterAreaStyle);	
	$(parameterAreaStyleObj).appendTo( $(putObj).find(".parameterArea") );
}