// 預覽
function viewDialog(data){
    $("#viewDialog").remove();

    $("<div>").prop("id","viewDialog").appendTo("body");

    $("#viewDialog").bsDialog({
        autoShow:true,
        showFooterBtn: false,
        modalClass: "bsDialogWindow",
        start: function(){
        	var contentArea = $("#viewDialog").find(".modal-body");
			var str = '<img src="include/images/loader.svg" width="64">';
			contentArea.empty();
			var centerArea = $("<div>").addClass("text-center");
			$(str).appendTo(centerArea);
			centerArea.appendTo(contentArea);

			var loadPage = "view.html";
          	$.ajax({
		    	url: loadPage, 
		    	type: "GET",
		    	success: function(contents){
		    		putContent( contentArea, contents, function(){
		    			getPageContentByData(data);
		    		});
		    	},
		    	error: function(xhr, status, msg){
					putContent( contentArea, "此功能暫不開放" );
		    	}
			});
			$("#viewDialog").scroll(function() {
				if ( $(this).scrollTop() > 100){
					$('#dialogGotop').fadeIn("fast");
				} else {
					$('#dialogGotop').stop().fadeOut("fast");
				}
			});
        },        
    });
}