//  var testData = [
//     {id: "A", name: 'My Organization1', parent: 0},
//     {id: "A1", name: 'CEO Office1', parent: "A"},
    

//     // {id: 3, name: 'Division 1', parent: 1},
//     // {id: 4, name: 'Division 2', parent: 1},
//     // {id: 6, name: 'Division 3', parent: 1},
//     // {id: 7, name: 'Division 4', parent: 1},
//     // {id: 8, name: 'Division 5', parent: 1},
//     // {id: 5, name: 'Sub Division', parent: 3},
    
// ];
var testData = [];
$(function(){
    getOrgData();
    // if(testData.length > 0){
    //     createTree();
    //     $(".createBtn").remove();
        
    // }else{
    //     addDialog("","root");
    // }
});

function getOrgData(){
	$.getJSON(ctrlAdminAPI + "GetData_AssOrg",function(rs){
        //有資料
        if(rs.Status){

        }else{ //沒有資料
            addDialog("",0);
        }
		console.log(rs);
	});
}

// 創建組織樹狀圖
function createTree(){
    orgTreeChart = $('#orgChart').orgChart({
        data: testData,
        showControls: true,
        allowEdit: false,
        onAddNode: function(node){ 
            // log('Created new node on node '+node.data.id);
            // org_chart.newNode(node.data.id); 
            var parentID = node.data.id;
            addDialog(orgTreeChart, parentID);
        },
        onDeleteNode: function(node){
            log('Deleted node '+node.data.id);
            orgTreeChart.deleteNode(node.data.id); 
        },
        onClickNode: function(node){
            log('Clicked node '+node.data.id);
        }

    });
}

// 取得組織資料
function getOUData(uid){
    var sendData = {}
    if(uid != undefined){
        sendData = { iUid : uid };
    }
    // ＡＰＩ呼叫
    $.getJSON(ctrlAdminAPI + "GetData_AssTypeOffice", sendData ).done(function(rs){
        if(rs.Status){
            if(uid == null){
                putDataToPage(rs.Data);
            }else{
                // insertDialog(uid,name);
            }
        }else{
            // 放入空的
            putDataEmptyInfo($("#grid"));
        }
        // console.log(rs);
    }).fail(function(){
        // 放入空的
        putDataEmptyInfo($("#grid"));
    });
}

// 新增
function addDialog(orgTreeChart, parentID){
    $("#addDialog").remove();

    var addDialog = $("<div>").prop("id","addDialog");

    $("<div>").addClass("contents").appendTo(addDialog);
    addDialog.appendTo("body");

    var headerCloseBtn = true;

    if(orgTreeChart == ""){
        headerCloseBtn = false;
    }

    $("#addDialog").bsDialog({
        autoShow:true,
        headerCloseBtn: headerCloseBtn,
        title: "組織單位選單",
        start: function(){
            // 取得組織資料
            $.getJSON(ctrlAdminAPI + "GetData_AssTypeOffice").done(function(rs){
                console.log(rs);
                if(rs.Status){
                    createOtgList(parentID, orgTreeChart,rs.Data,false);
                }
            });
        },
        showFooterBtn:false,
    });
}

function createOtgList(parentID, orgTreeChart,data,isEmpty){
    if(isEmpty == undefined){
        isEmpty = false;
    }

    if(!isEmpty){
        var option = {styleKind:"list",style:"1grid-add"};
        // 取得選單樣式
        getStyle(option,function(insertPage){

            $.each(data, function(index, content){
                // 轉物件
                var insertPageObj = $.parseHTML(insertPage);
                $(insertPageObj).find(".list-items").eq(0).html(content.name);
                // 新增按鈕事件
                $(insertPageObj).find(".fa-plus-square-o").click(function(){
                    // 創建組織資料與節點
                    creatOrgData(orgTreeChart, content, parentID);
                   // console.log();
                });
                $(insertPageObj).appendTo( $("#addDialog").find(".modal-body").find(".contents") );
                // 找最後一項去除底線
                $("#addDialog").find(".modal-body")
                .find(".contents")
                .find(".list-items-bottom").last()
                .removeClass("list-items-bottom");

                // $("#addDialog").bsDialog("show");
            });

        });
    }else{
        var option = {styleKind:"system",style:"data-empty"};
        // 取得選單樣式
        getStyle(option,function(emptyStyle){
            $$("#addDialog").find(".modal-body").find(".contents").html(insertPageObj);
        });
    }
}

function creatOrgData(orgTreeChart,contentObj,parentID){
    var sendObj = {
      "officeid": contentObj.uid,
      "faid": parentID,
      "suid": 1
    };
    console.log(sendObj);
    $.post(ctrlAdminAPI + "Insert_AssOrg",sendObj).done(function(rs){
        console.log(rs);
        if(rs.Status){
            if(orgTreeChart != ""){
                // 新增
                // newNode : parentId,name,childID
                orgTreeChart.newNode( parentID, contentObj.name, rs.Data );
            }else{
                // ROOT
                var rootObj = {
                    id: rs.Data,
                    name: contentObj.name,
                    parent: parentID
                };
                testData.push(rootObj);
                createTree();
                // 關閉
                $("#addDialog").bsDialog("close");
            }
        }
    });
}

// just for example purpose
function log(text){
    $('#consoleOutput').append('<p>'+text+'</p>')
}