function checkUserLogin(){
	$.getJSON(configObject.getAcInfo,{},function(rs){
		if(!rs.status){
           location.href = location.origin;
		}else{
       		$(".user-name").html(rs.userName);
       		//取得選單

       		getMenus(rs);
		}
	});
}
