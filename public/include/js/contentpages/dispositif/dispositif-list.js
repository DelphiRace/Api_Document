$(function(){
	//$.get().done();
});

function addNewContent(){
	// {
	// 	page:{},
	// 	itemValue:{},
	// 	start: int or string,
	// 	putArea: string,
	//	startHide: string,
	//	backAction: function,
	//	nextBtnAction: {
	// 		a: function,
	// 		....
	// 	},
	//	breadcrumbs:{
	//		mean:{
	// 			name1: "mean value",
	// 			name2: "mean value",
	//		},
	// 		cancelClick:"name1,name2, ...", //string
	// 		select: "name1" //default first object name
	// 	}
	// }
	var pageObject = {
		page:{
			numbers: "contract/numbers",
			dispositif_people: "contract/dispositif-people",
			units: "contract/units"
		},
		putArea: "modifyArea",
		startHide: "mainContent",
		backAction:function(){
			
		},
		nextBtnAction:{
			numbers: function(nowItem,nextItem){
				
				if(nextItem != null){
					nowItem.hide();
					itemFade( nextItem ,true);
				}
			},
			dispositif_people: function(nowItem,nextItem){
				
				if(nextItem != null){
					nowItem.hide();
					itemFade( nextItem ,true);
				}
				
			},
			units: function(nowItem,nextItem){
				
				if(nextItem != null){
					nowItem.hide();
					itemFade( nextItem ,true);
				}
				
			},
		},
		preBtnAction:{
			units: function(nowItem,preItem){
				console.log(nowItem,preItem);
				if(preItem != null){
					nowItem.hide();
					itemFade( preItem ,true);
				}
			}
		},
		breadcrumbs:{
			mean:{
				numbers: "新增契約編號",
				dispositif_people: "契約相關人員",
				units: "相關單位",
			},
			//cancelClick:"numbers"
		}
	};
	elfguide(pageObject);
}
