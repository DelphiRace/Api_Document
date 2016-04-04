(function( $ ){

    $.fn.bsDialog = function(action, option) {
        if(typeof action == "object"){
            option = $.extend({}, $.fn.bsDialog.defaults, action);
            action = "";
        }else{
            option = $.extend(true, {}, $.fn.bsDialog.defaults, option);
        }
        // console.log(action, option);
        
        return new BsDialog(this, option, action);
    }

    $.fn.bsDialog.defaults = {
        headerCloseBtn: true,
        title: "&nbsp;",
        showFooterBtn: true,
        autoShow: true,
        width: null,
        height: null,
        modalClass: null,
        button: [],
        start: function(){}
    };

    function BsDialog($selector, option, action){
        var self = this;
        this.bsDialogShow = function(){
            // $selector.modal('show');
            // $selector.on('show.bs.modal', function () {
            //         alert('The modal is about to be shown.');
            // });
            $selector.modal({
                backdrop: 'static',
                show: 'show'
            }).on("shown.bs.modal",function(event){
                // console.log(event);
                // var lastBackdrop = $("body").find(".modal-backdrop").last();
                // var last2ItemBackdrop = $("body").find(".modal-backdrop").eq(-2);
                // var last2ItemBackdropZindex = parseInt(last2ItemBackdrop.css("z-index"));
                // $selector.css("z-index",last2ItemBackdropZindex+12)
                // lastBackdrop.css("z-index",last2ItemBackdropZindex + 10);
                // console.log($(".modal.fade.in").eq(-2).);
                $(".modal.fade.in").eq(-2).fadeOut();
            }).on("hidden.bs.modal",function(event){
                console.log($(".modal.fade.in"));
                $(".modal.fade.in").eq(-1).fadeIn();
            });

        };

        this.bsDialogClose = function(){
            $selector.modal("hide");
        };

        this.start = function(){

            if($selector.find(".modal-content").length){
                return;
            }
            $selector.addClass("modal fade").attr("aria-hidden","true");
            var originContent = $selector.html();
            $selector.empty();
            var bsModal = $("<div>").addClass("modal-dialog");
            if(option.width != null){
                bsModal.css("width", option.width);
            }

            if(option.height != null){
                bsModal.css("height", option.height);
            }

            if(option.modalClass != null){
                bsModal.addClass(option.modalClass);
            }

            bsModal.appendTo($selector);
            var bsModalContent = $("<div>").addClass("modal-content").appendTo(bsModal);
            var bsModalHeader = $("<div>").addClass("modal-header");
            // title Button
            if(option.headerCloseBtn){
                $("<button>").addClass("close")
                .attr("data-dismiss","modal")
                .html("&times;")
                .appendTo(bsModalHeader);
            }
            // title
            $("<h4>").addClass("modal-title").html(option.title).appendTo(bsModalHeader);
            bsModalHeader.appendTo(bsModalContent);

            // bodys
            $("<div>").addClass("modal-body").html(originContent).appendTo(bsModalContent);

            // footer Button
            if(option.showFooterBtn){
                var buttonArea = $("<div>").addClass("modal-footer");
                    // console.log(typeof option.button, option.button);

                $.each(option.button,function(index,content){
                    var button = $("<button>");
                    
                    button.addClass("btn btn-default").text(content.text).click(function(){
                        if(typeof content["click"] != "undefined"){
                            content["click"]();
                        }
                    });
                    if(typeof content.className != "undefined"){
                        button.addClass(content.className);
                    }
                    button.appendTo(buttonArea);
                        
                });
                buttonArea.appendTo(bsModalContent);
            }

            option["start"]();
        }

        switch(action){
            case "show":
                self.bsDialogShow();
                return;
            break;
            case "close":
                self.bsDialogClose();
                return;
            break;
        }
            
        
        if(option.autoShow){
            self.start();
            self.bsDialogShow();
        }else{
            self.start();
        }
    }
})(jQuery);