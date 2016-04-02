/*
*/
function tabCtrl(itemID,option){
	if(typeof option == "undefined"){
		option = {};
	}
	//先初始化
	$("#"+itemID+" li a").each(function(){
		var id = $(this).prop("id");
		$("#"+id+"-content").addClass(itemID+"-tab-content");
	});
	//設定功能頁籤
  	$("#"+itemID+" li a").click(function(){
  		var contentID = $(this).prop("id");
       
        $("#"+itemID+" li").removeClass("active");
        $(this).parent().addClass("active");
        $("."+itemID+"-tab-content").hide();
        contentID += "-content";
        $("#"+contentID).show();
        return false;
    });
}