$(function(){
  if(location.pathname.search("login.html") == -1){
    if(typeof checkUserLogin != "undefined" && typeof checkGoogleApi != "undefined" && typeof firstLoadPage != "undefined" ){
    	checkUserLogin();
    	checkGoogleApi();
    	firstLoadPage();
    }
  }
});

//相關頁面轉換
function redirectPage(result){
  if(result.status){
        $.post(configObject.processLoginUrl,result,function(rs){
           location.href = location.origin + "/content.html";
        });
  }else{
    alert(result.error);
    showLoading(false);
  }
}

function showLoading(turn){
	//開始顯示Loading
	var id = "loading";
	if(turn){
		$("#"+id).remove();
		$('<div id="'+id+'" >')
		.prepend('<div class="ui-widget-overlay" style="z-index:500;">')
		.prepend('<img class="loading-img" src="include/images/loader.svg" style="z-index:600;">')
		.hide()
		.appendTo('body')
		.show("scale", { percent: 100 }, 400);
	}else{
		$("#"+id).hide("scale", { percent: 100 }, 1000,function(){
			$(this).remove();
		});
	}
}

function logoutEven(){
	$.ajax({
		url: configObject.Logout,
		type:"POST",
		async: false,
		success: function(rs){
			//location.href = location.origin;
			location.href = "login.html";
		}
	});
}

function setInputNumberOnly(){
  //只能輸入數字
  $(".inputNumberOnly").keypress(function(event){
    return event.charCode >= 48 && event.charCode <= 57;
  });
}

function getUserInput(objectID){
  var tmpObj = {};
  $("#"+objectID).find(".userInput").each(function(){
    var userInputType = $(this).prop("type");
    if( userInputType != "radio" && userInputType != "checkbox"){
      var id= $(this).prop("id");
      var value = $(this).val();
    }else{
      var id = $(this).prop("name");
      var value = $("[name="+id+"]:checked").val();
      if(value == undefined){
        value = null;
      }
    }
    if(typeof tmpObj[id] == "undefined"){
      tmpObj[id] = value;
    }
  });
  return tmpObj;
}

function itemFade(item,ctr){
  if(ctr){
    if(typeof item == "string"){
      $("#"+item).fadeIn(500);
    }else{
      $(item).fadeIn(500);
    }
  }else{
    if(typeof item == "string"){
      $("#"+item).fadeOut(500);
    }else{
      $(item).fadeOut(500);
    }
  }
}

function sendRequest(sendType,sendUrl,sendData,dataType,responsesType,responsesFunction){
  if(sendUrl.length > 0){
    sendType = sendType.toLowerCase();
    var contentType = null;
    if(dataType == "json"){
      //sendData = JSON.stringify(sendData);
      //contentType = "application/json";
      var headers = { Accept: 'application/json' };
    }
    $.ajax({
       url: sendUrl,
       type: sendType,
       data: sendData,
       headers: headers,
       dataType: responsesType,
       success: function(rs){
          if(typeof responsesFunction != "undefined"){
            window[responsesFunction](rs);
          }
           //console.log(rs);
       }
    });
  }else{
    console.log("sendUrl is Null");
  }
}

//處理WS回傳JSON塞在的XML內容
function processJsonInXml(xmlContent){
  return $.parseJSON($(xmlContent).find("string").text());
}

//iframe設定高
function iframeLoaded(iframeID) {
    var iFrameID = document.getElementById(iframeID);
    if(iFrameID) {
          // here you can make the height, I delete it first, then I make it again
          iFrameID.height = "";
          iFrameID.height = iFrameID.contentWindow.document.body.scrollHeight + "px";
    }   
}

//取得資訊
function porcessData(url, data, async, dataType){
    var result = '';
    if(typeof data === 'undefined'){
        data = {};
    }
    if(typeof async === "undefined"){
    	async = false;
    }
    if(typeof dataType === "undefined"){
    	dataType = "JSON";
    }
    if(typeof beforeFouction === "undefined"){
    	beforeFouction = {};
    }

    $.ajax({
       url: url,
       type: "POST",
       data: data,
       async: async,
       dataType: dataType,
       success: function(rs){
           //console.log(rs);
           if(rs.status){
               result = rs;
           }else{
               console.log(rs.msg);
           }
       }
    });
    return result;
}

//關閉dialog
function closeDialog(itemID){
  $("#"+itemID).dialog('close').remove();
}

//取得物件長度
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

// 選單放入選項
function selectOptionPut(selectID,putVal,putText){
  if(selectID != "" && selectID.search("#") == -1){
    $("<option>").appendTo("#"+selectID).prop("value",putVal).text(putText);
  }
}
