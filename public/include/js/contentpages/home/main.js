// 放置類別相關物件內容，以提供刪除時同步操作
var putAreaItem = {};

$(function(){
  getApiCategoryList();
  $("#gotop").click(function(){
      $("html,body").animate({
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

function getApiCategoryList(){
  $.getJSON(CategoryApi + "GetList").done(function(rs){
    $("#mainArea").empty();
    if(rs.status){
      var option = {styleKind:"list",style:"2grid-modify"}
      getStyle(option, function(pagListStyle){
        $.each(rs.data, function(index,content){
          var pagListStyleObj = $.parseHTML(pagListStyle);
          $(pagListStyleObj).addClass("dataContent");
          // 製作錨點動畫
          var CategoryLink = $("<a>").prop("href","#").text(content.name).click(function(){
            var scrollTop = $(putAreaItem[content.uid].area).offset().top;
            $('html,body').animate({
              scrollTop: scrollTop
            }, 800);
            return false;
          });
          $(pagListStyleObj).find(".list-items").eq(0).html(CategoryLink);
          $(pagListStyleObj).find(".list-items").eq(1).html(content.description);
          //修改按鈕
          $(pagListStyleObj).find(".fa-pencil-square-o").click(function(){
            var modifyObj = {
              name: $(pagListStyleObj).find(".list-items").eq(0),
              description: $(pagListStyleObj).find(".list-items").eq(1),
              clickBtn: $(this)
            }
            addApiCategoryDialog(content, modifyObj);
          });
          //刪除按鈕
          $(pagListStyleObj).find(".fa-trash-o").click(function(){
            deletDialog(content.uid, content.name, $(this), CategoryApi + "deleteApiCategory", true);
          });
          // 將物件放入全域變數中，以利刪除或修改時可以同步操作
          putAreaItem[content.uid] = {};
          putAreaItem[content.uid].item = pagListStyleObj;

          $(pagListStyleObj).appendTo("#mainArea");
        });

        $("#mainArea").find(".dataContent").last().removeClass("list-items-bottom");
      });
      // 產生API類別列表
      createAPIList(rs.data);
    }else{
      putDataEmptyInfo($("#mainArea"));
    }
  });
}

// 新增
function addApiCategoryDialog(contentObj, modifyObj){
    $("#addApiCategoryDialog").remove();

    $("<div>").prop("id","addApiCategoryDialog").appendTo("body");

    var title = "", buttonText = "";
    if(contentObj == undefined){
      title = "新增API分類";
      buttonText = "新增";
    }else{
      title = "修改API分類";
      buttonText = "修改";
    }

    var inptObj = {
      name: {
        name: "類別名稱",
        value: (contentObj == undefined) ? "":contentObj.name
      },
      description: {
        name: "類別簡述",
        value: (contentObj == undefined) ? "":contentObj.description
      },
    };

    $("#addApiCategoryDialog").bsDialog({
        autoShow:true,
        title: title,
        start: function(){
          var option = {styleKind:"input",style:"text-help-only"};
          getStyle(option, function(listStyle){
            $.each(inptObj, function(inputID,inputVal){
              var listStyleObj = $.parseHTML(listStyle);
              $(listStyleObj).find(".control-label").html(inputVal.name);
              $(listStyleObj).find("input:text").addClass("userInput").prop("id",inputID).val(inputVal.value);
              // console.log(listStyleObj);
              $(listStyleObj).appendTo( $("#addApiCategoryDialog").find(".modal-body") );
            });
          });
        },
        button: [
          {
            text:buttonText,
            className: "btn-success",
            click: function(){
              var sendObj = getUserInput("addApiCategoryDialog");
              sendObj.uid = (contentObj == undefined) ? "":contentObj.uid;

              var apiMethod = (contentObj == undefined) ? "insertApiCategory":"modifyApiCategory";
              // console.log(sendObj);
              $.post(CategoryApi + apiMethod, sendObj,function(rs){
                rs = $.parseJSON(rs);
                //新增
                if(modifyObj == undefined){
                  sendObj.uid = rs.data["uid"];
                  putTextForInsert(sendObj);
                }else{
                  // 修改後畫面上跟著動
                  putTextForModify(inptObj, modifyObj, sendObj);
                  //重新設定按鈕
                  modifyObj.clickBtn.unbind("click").click(function(){
                    addApiCategoryDialog(sendObj, modifyObj);
                  });

                }
                // console.log(rs);
              });
              $("#addApiCategoryDialog").bsDialog("close");
            }
          },
          {
            text:"取消",
            click: function(){
              $("#addApiCategoryDialog").bsDialog("close");
            }
          }
          
        ]
    });
}

//刪除
function deletDialog(uid, APICategoryName, deleteObj, apiMethod, isCategory){
  if(isCategory == undefined){
    isCategory = false;
  }
  if(apiMethod == undefined){
    return;
  }
  $("#deletDialog").remove();
  var contentText = "確認要刪除 "+APICategoryName+" ?";
  $("<div>").prop("id","deletDialog").html(contentText).appendTo("body");

  $("#deletDialog").bsDialog({
      autoShow:true,
      title: "刪除確認",
      button: [
        {
          text:"刪除",
          className: "btn-danger",
          click: function(){
            $.post(apiMethod, {uid:uid});
            var tmpResetArea = deleteObj.parents(".list-items").parent();
            resetArea = tmpResetArea.parent();
            tmpResetArea.remove();
            resetArea.find(".dataContent").last().removeClass("list-items-bottom");
            if(!resetArea.find(".dataContent").length){
              putDataEmptyInfo(resetArea.find(".dataContent"));
            }
            // 如果是刪除類別，則需要移除API內容
            if(isCategory){
              // console.log(putAreaItem);
              $(putAreaItem[uid].area).remove();
            }
            $("#deletDialog").bsDialog("close");
          }
        },
        {
          text:"取消",
          click: function(){
            $("#deletDialog").bsDialog("close");
          }
        }
        
      ]
  });
}

//新增後，依據新增資料放入對應欄位
function putTextForInsert(insertData){
  $("#mainArea").find(".dataContent").last().addClass("list-items-bottom");

  var option = {styleKind:"list",style:"2grid-modify"}
  getStyle(option, function(pagListStyle){
    var pagListStyleObj = $.parseHTML(pagListStyle);

    $(pagListStyleObj).find(".list-items").eq(0).html(insertData.name);
    $(pagListStyleObj).find(".list-items").eq(1).html(insertData.description);

    //修改按鈕
    $(pagListStyleObj).find(".fa-pencil-square-o").click(function(){
      var modifyObj = {
        name: $(pagListStyleObj).find(".list-items").eq(0),
        description: $(pagListStyleObj).find(".list-items").eq(1),
        clickBtn: $(this)
      }
      addApiCategoryDialog(insertData, modifyObj);
    });
    //刪除按鈕
    $(pagListStyleObj).find(".fa-trash-o").click(function(){
      deletDialog(insertData.uid, insertData.name, $(this), CategoryApi + "deleteApiCategory", true);
    });
    
    // 將物件放入全域變數中，以利刪除或修改時可以同步操作
    putAreaItem[insertData.uid] = {};
    putAreaItem[insertData.uid].item = pagListStyleObj;

    $(pagListStyleObj).removeClass("list-items-bottom").appendTo("#mainArea");

    putAPIContentArea(insertData);
  });
}

//修改後，依據修改資料放入對應欄位
function putTextForModify(inptObj, modifyObj, modifyData){
  $.each(inptObj,function(index,content){
    modifyObj[index].text(modifyData[index]);
  });
}

// 新增分類後，動態放入類別內容新增區域
function putAPIContentArea(insertData){
  // 取得外框資料
  getBorder("list-TitlePlus-left", function(borderStyle){
    var borderStyleObj = $.parseHTML(borderStyle);
    $(borderStyleObj).addClass("apiContent");

    // 加入新增事件
    $(borderStyleObj).find(".fa-plus-circle").click(function(){
      // 新增函式
      insertAPIContentDialog(insertData, undefined, $(this).parents(".row").find(".item-list-border"));
    });
    // console.log(content);
    // 放入Title
    $(borderStyleObj).find("h3").eq(0).html(insertData.name);
    
    putDataEmptyInfo( $(borderStyleObj).find(".item-list-border") );

    // 放到區域中
    if( $(".apiContent").length ){
      $(".apiContent").last().after(borderStyleObj);
    }else{
      $("#APIContentArea").after(borderStyleObj);
    }

    // 將物件放入全域變數中，以利刪除或修改時可以同步操作
    putAreaItem[insertData.uid].area = borderStyleObj;
    // console.log(putAreaItem);

  });
}
