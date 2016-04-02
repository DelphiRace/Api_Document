//整理樹狀資料
function processTreeData(treeData, showRoot, rootID, rootName, options){
	var tmpMenuObj = {};
    if(typeof options == "undefined"){
        options = {};
        options.idName = "id";
    }
	if(typeof showRoot == "undefined"){
		showRoot = true;
	}
	if(showRoot == true){
		if(typeof rootID == "undefined"){
			rootID = "root";
		}
		if(typeof rootName == "undefined"){
			rootName = "資料";
		}
	}
    //先整理
    $.each(treeData,function(i,node){
    	if(typeof tmpMenuObj[node.parent] == "undefined"){
    		tmpMenuObj[node.parent] = {};
    		tmpMenuObj[node.parent]["nodes"] = {};
    	}
    	tmpMenuObj[node.parent]["nodes"][node[options.idName]] = {id: node[options.idName], text: node.name};
    });
	tmpMenuObj[0].id = rootID;
	tmpMenuObj[0].text = rootName;
    // console.log(tmpMenuObj);
    // ---------------------------------------------------------------------

    //放好第一層級的資料
    $.each(tmpMenuObj[0].nodes,function(i,node){
    	var otherMenuContent = {};
    	//這代表還有第二層
    	if(typeof tmpMenuObj[i] != "undefined"){
    		//轉換為陣列
    		otherMenuContent = $.map(CreatOtherTreeDataNodes(i, tmpMenuObj),function(v, i){
            	return v;
            });
    		tmpMenuObj[0]["nodes"][i]["nodes"] = otherMenuContent;
    	}
    });
    //將物件轉為陣列
    tmpMenuObj[0].nodes = $.map(tmpMenuObj[0].nodes,function(v, i){
    	return v;
    });
    // ---------------------------------------------------------------------
    //回傳
    if(showRoot){
    	return [tmpMenuObj[0]];
	}else{
		var tmpArr = [];
		$.each(tmpMenuObj[0].nodes,function(i,v){
			tmpArr.push(v);
		});

    	return tmpArr;
	}
}

//產生其他子層
function CreatOtherTreeDataNodes(otherLayerDataIndex, totalData){
	var otherMenuContent = {};
	//console.log(otherLayerDataIndex);
	$.each(totalData[otherLayerDataIndex].nodes,function(i,content){
	// console.log(i,content["uid"]);
		if(typeof otherMenuContent[i] == "undefined"){
			otherMenuContent[i] = {};
		}
		//這代表還有第二層
        if(typeof totalData[i] != "undefined"){
            //重複建好
            otherMenuContent[i].id = i;
            otherMenuContent[i].text = content.text;
            otherMenuContent[i].nodes = $.map(CreatOtherTreeDataNodes(i, totalData),function(v, i){
            	return v;
            });
        }else{
        	
        	otherMenuContent[i] = content;
        	
        }
	});
    
    return otherMenuContent;
}