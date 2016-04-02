function getMenus(loginInfo){
	var menus = porcessData(configObject.getmenu,loginInfo);
	//console.log(menus);
	$("#menus").html(menus.menu)
	.find("a").click(function(){
      var thisHref = $(this).attr("href");
      if(thisHref != "#"){
        //location.href = location.origin + "/" + $(this).attr("href");
        loadPage($(this).attr("href"),"pagescontent");
      }
      return false;
  	});
  	getLan();
	loadJS("include/strongly/assets/js/content-main.js","keep");
}