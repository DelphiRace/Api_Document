<?php
/*
    apiCategory Method for api
*/
use SystemCtrl\ctrlSystem;

class apiListController
{
    //列表取得
    public function GetListAction()
    {
        $SysClass = new ctrlSystem;
        $SysClass->initialization("",true);
        try{
            $listCondition = "";
            if(!empty($_GET["listID"])){
                $listCondition = "and t1.uid = ".$_GET["listID"];
            }
            $strSQL = "select t1.*,
            t3.api_sf,
            t8.name as api_sf_name,  
            t7.content as importantInfo,
            t2.name as httpMethodName,
            t5.response_content,
            t4.uid as responseExplanationUID, t4.name as responseExplanationKey, t4.type as responseExplanationType, t4.description as responseExplanationDescription, 
            t6.uid as parameterUID, t6.name as parameterKey, t6.type as parameterType, t6.description as parameterDescription, t6.required as parameterRequired, 
            t5.response_content, t5.original from api_method t1 ";
            //API請求方法
            $strSQL .= "left join api_http_method t2 on t1.http_method = t2.uid ";
            //API支援格式
            $strSQL .= "left join ls_support_format t3 on t1.uid = t3.api_uid ";
            //API回傳範例說明
            $strSQL .= "left join ls_response_explanation t4 on t1.uid = t4.api_uid ";
            //API回傳範例
            $strSQL .= "left join ls_response_example t5 on t1.uid = t5.api_uid ";
            //API 傳遞參數
            $strSQL .= "left join ls_parameter t6 on t1.uid = t6.api_uid ";
            //重要資訊
            $strSQL .= "left join ls_important_info t7 on t1.uid = t7.api_uid ";
            //api 支援格式
            $strSQL .= "left join api_support_format t8 on t3.api_sf = t8.uid ";
            //條件
            $strSQL .= "where 1 ";
            // 指定單筆
            $strSQL .= $listCondition;
            $data = $SysClass->QueryData($strSQL);

            $action = [];
            $action["status"] = false;
            if(!empty($data)){
                // responseExplanation
                $tmpArr = [];
                //已放置的參數UID
                $isPutParameterUID = [];
                //已放置的回傳值說明UID
                $isPutResponseExplanationUID = [];
                foreach ($data as $content) {
                    if(empty($tmpArr[$content['uid']])){
                        $tmpArr[$content['uid']] = [];
                        $tmpArr[$content['uid']]['api_sf'] = $content['api_sf'];
                        $tmpArr[$content['uid']]['api_sf_name'] = $content['api_sf_name'];
                        $tmpArr[$content['uid']]['httpMethodName'] = $content['httpMethodName'];
                        $tmpArr[$content['uid']]['response_content'] = $content['response_content'];
                        $tmpArr[$content['uid']]['category'] = $content['category'];
                        $tmpArr[$content['uid']]['description'] = $content['description'];
                        $tmpArr[$content['uid']]['http_method'] = $content['http_method'];
                        $tmpArr[$content['uid']]['importantInfo'] = $content['importantInfo'];
                        $tmpArr[$content['uid']]['name'] = $content['name'];
                        $tmpArr[$content['uid']]['original'] = $content['original'];
                        $tmpArr[$content['uid']]['uid'] = $content['uid'];
                        $tmpArr[$content['uid']]['url'] = $content['url'];
                    }

                    //參數值說明
                    if(!empty($content["parameterKey"]) and !in_array($content["parameterUID"], $isPutParameterUID)){
                        if(empty($tmpArr[$content['uid']]['parameter'])){
                            $tmpArr[$content['uid']]['parameter'] = [];
                        }
                        $reArr = [];
                        $reArr['key'] = $content["parameterKey"];
                        $reArr['type'] = $content["parameterType"];
                        $reArr['description'] = $content["parameterDescription"];
                        $reArr['required'] = $content["parameterRequired"];
                        $thisLength = count($tmpArr[$content['uid']]['parameter']);
                        $tmpArr[$content['uid']]['parameter'][$thisLength] = $reArr;
                        array_push($isPutParameterUID, $content["parameterUID"]);
                    }

                    // 返回值說明處理
                    if(!empty($content["responseExplanationKey"]) and !in_array($content["responseExplanationUID"], $isPutResponseExplanationUID)){
                        if(empty($tmpArr[$content['uid']]['responseExplanation'])){
                            $tmpArr[$content['uid']]['responseExplanation'] = [];
                        }
                        $reArr = [];
                        $reArr['key'] = $content["responseExplanationKey"];
                        $reArr['type'] = $content["responseExplanationType"];
                        $reArr['description'] = $content["responseExplanationDescription"];
                        $thisLength = count($tmpArr[$content['uid']]['responseExplanation']);
                        $tmpArr[$content['uid']]['responseExplanation'][$thisLength] = $reArr;
                        array_push($isPutResponseExplanationUID, $content["responseExplanationUID"]);
                    }
                }
                $data = array_values($tmpArr);
                $action["status"] = true;
                $action["data"] = $data;
                // $action["tmpData"] = $test;
            }else{
                $action["errorMsg"] = "Data is Empty";
                $action["strSQL"] = $strSQL;
            }
            $pageContent = $SysClass->Data2Json($action);
        }catch(Exception $error){
            //依據Controller, Action補上對應位置, $error->getMessage()為固定部份
            $SysClass->WriteLog("SupplyController", "editorAction", $error->getMessage());
        }
         //關閉資料庫連線
        $SysClass->DBClose();
        //釋放
        $SysClass = null;
        $this->viewContnet['pageContent'] = $pageContent;
    }

    //新增API列表
    public function insertApiListAction()
    {
        $SysClass = new ctrlSystem;
        $SysClass->initialization("",true);
        try{
            $action = [];
            $action["status"] = false;
            if(!empty($_POST)){
                $inserStatus = false;
                // 開始組合SQL指令
                // api_method
                $http_method = ($_POST["api_method_http_method"]) ? $_POST["api_method_http_method"] : 1;
                $strSQL = "insert into api_method(name, description, url, http_method, category) ";
                $strSQL .= "values('".$_POST["api_method_name"]."', '".$_POST["api_method_description"]."','".$_POST["api_method_url"]."',".$http_method.",".$_POST["api_method_Category"].");";
                
                // 新增進api_method
                $SysClass->Transcation();

                if(!$SysClass->Execute($strSQL)){
                    $SysClass->Rollback();
                }else{
                    //取得新增的ID
                    $NewID = $SysClass->NewInsertID();
                }

                // ls_support_format
                $api_sf = ($_POST["ls_support_format_api_sf"]) ? $_POST["ls_support_format_api_sf"] : 1;

                $strSQL = "insert into ls_support_format(api_uid,api_sf) ";
                $strSQL .= "values(".$NewID.",".$api_sf.");";

                //新增狀態
                $lsSupportFormatStatus = false;
                if(!$SysClass->Execute($strSQL)){
                    $SysClass->Rollback();
                }else{
                    $lsSupportFormatStatus = true;
                }

                // ls_important_info
                $ls_important_info_content = ($_POST["ls_important_info_content"]) ? "'".$_POST["ls_important_info_content"]."'" : "NULL";

                $strSQL = "insert into ls_important_info(api_uid,content) ";
                $strSQL .= "values(".$NewID.",".$ls_important_info_content.");";

                //新增狀態
                $lsImportantInfoStatus = false;
                if(!$SysClass->Execute($strSQL)){
                    $SysClass->Rollback();
                }else{
                    $lsImportantInfoStatus = true;

                }

                // ls_response_example
                $ls_response_example_response_content = ($_POST["ls_response_example_response_content"]) ? "'".$_POST["ls_response_example_response_content"]."'" : "NULL";
                $original_content = $ls_response_example_response_content;

                $ls_response_example_response_content = str_replace("\n", "<br>", $ls_response_example_response_content);

                $strSQL = "insert into ls_response_example(api_uid,response_content, original) ";
                $strSQL .= "values(".$NewID.",".$ls_response_example_response_content.", ".$original_content.");";

                //新增狀態
                $lsResponseExampleStatus = false;
                if(!$SysClass->Execute($strSQL)){
                    $SysClass->Rollback();
                }else{
                    $lsResponseExampleStatus = true;
                }

                // ls_parameter
                if(!empty($_POST["ls_parameter"])){
                    //新增狀態
                    $lsParameterStatus = false;
                    if(count($_POST["ls_parameter"]) == 1){
                        if(!empty($_POST["ls_parameter"][0]['name']) and !empty($_POST["ls_parameter"][0]['type']) and !empty($_POST["ls_parameter"][0]['description'])){
                            $strSQL = "insert into ls_parameter(api_uid,name,type,description,required) ";
                            $strSQL .= "values(".$NewID.",'".$_POST["ls_parameter"][0]['name']."','".$_POST["ls_parameter"][0]['type']."','".$_POST["ls_parameter"][0]['description']."',".$_POST["ls_parameter"][0]['required'].");";

                            if(!$SysClass->Execute($strSQL)){
                                $SysClass->Rollback();
                                $lsParameterStatus = false;
                            }else{
                                $lsParameterStatus = true;
                            }
                        }else{
                            $lsParameterStatus = true;
                        }
                    }else{
                        foreach ($_POST["ls_parameter"] as $content) {
                            if(!empty($content['name']) and !empty($content['type']) and !empty($content['description'])){
                                $strSQL = "insert into ls_parameter(api_uid,name,type,description,required) ";
                                $strSQL .= "values(".$NewID.",'".$content['name']."','".$content['type']."','".$content['description']."',".$content['required'].");";

                                if(!$SysClass->Execute($strSQL)){
                                    $SysClass->Rollback();
                                    $lsParameterStatus = false;
                                }else{
                                    $lsParameterStatus = true;
                                }
                            }
                        }
                    }
                }else{
                    $lsParameterStatus = true;
                }

                // ls_response_explanation
                if( !empty($_POST["ls_response_explanation"]) and !empty($_POST["ls_response_example_response_content"]) ){
                    //新增狀態
                    $lsResponseExplanationStatus = false;
                     if(count($_POST["ls_response_explanation"]) == 1){
                        if(!empty($_POST["ls_response_explanation"][0]['name']) and !empty($_POST["ls_response_explanation"][0]['type']) and !empty($_POST["ls_response_explanation"][0]['description'])){
                            $strSQL = "insert into ls_response_explanation(api_uid,name,type,description) ";
                            $strSQL .= "values(".$NewID.",'".$_POST["ls_response_explanation"][0]['name']."','".$_POST["ls_response_explanation"][0]['type']."','".$_POST["ls_response_explanation"][0]['description']."';";

                            if(!$SysClass->Execute($strSQL)){
                                $SysClass->Rollback();
                                $lsResponseExplanationStatus = false;
                            }else{
                                $lsResponseExplanationStatus = true;
                            }
                        }else{
                            $lsResponseExplanationStatus = true;
                        }
                    }else{
                        foreach ($_POST["ls_response_explanation"] as $content) {
                            if(!empty($content['name']) and !empty($content['type']) and !empty($content['description'])){
                                $strSQL = "insert into ls_response_explanation(api_uid,name,type,description) ";
                                $strSQL .= "values(".$NewID.",'".$content['name']."','".$content['type']."','".$content['description']."');";

                                if(!$SysClass->Execute($strSQL)){
                                    $SysClass->Rollback();
                                    $lsResponseExplanationStatus = false;
                                }else{
                                    $lsResponseExplanationStatus = true;
                                }

                            }
                        }
                    }
                }else{
                    $lsResponseExplanationStatus = true;
                }

                // 測試用
                // $action["test"] = $strSQL;
                // $action['uid'] = $NewID;
                // $SysClass->Execute($strSQL);
                // $SysClass->Rollback();
                // $SysClass->Commit();

                //新增後判斷
                if($lsSupportFormatStatus and $lsImportantInfoStatus and $lsResponseExampleStatus and $lsParameterStatus and $lsResponseExplanationStatus){
                    $inserStatus = true;
                }

                if(!$inserStatus){
                    $action["errorMsg"] = "新增失敗";
                }else{
                    $action["status"] = true;
                    $action["data"]['msg'] = "新增成功";
                    $action["data"]['uid'] = $NewID;
                    $SysClass->Commit();
                }
                
            }else{
                 $action["errorMsg"] = "name or description is empry";
            }
            $pageContent = $SysClass->Data2Json($action);
        }catch(Exception $error){
            //依據Controller, Action補上對應位置, $error->getMessage()為固定部份
            $SysClass->WriteLog("SupplyController", "editorAction", $error->getMessage());
        }
         //關閉資料庫連線
        $SysClass->DBClose();
        //釋放
        $SysClass = null;
        $this->viewContnet['pageContent'] = $pageContent;
    }

    //修改API類別
    public function modifyApiListAction()
    {
        $SysClass = new ctrlSystem;
        $SysClass->initialization("",true);
        try{
            $action = [];
            $action["status"] = false;
            if(!empty($_POST)){
                $inserStatus = false;
                $api_uid = $_POST["api_method_UID"];
                // 開始組合SQL指令
                // api_method
                $http_method = ($_POST["api_method_http_method"]) ? $_POST["api_method_http_method"] : 1;
                $strSQL = "update api_method set name='".$_POST["api_method_name"]."', description='".$_POST["api_method_description"]."', url='".$_POST["api_method_url"]."', http_method=".$http_method." ";
                $strSQL .= "where uid = ".$api_uid.";";
                
                // 新增進api_method
                $SysClass->Transcation();

                if(!$SysClass->Execute($strSQL)){
                    $SysClass->Rollback();
                }

                // ls_support_format
                $api_sf = ($_POST["ls_support_format_api_sf"]) ? $_POST["ls_support_format_api_sf"] : 1;

                $strSQL = "update ls_support_format set api_sf=".$api_sf." ";
                $strSQL .= "where api_uid = ".$api_uid.";";

                //新增狀態
                $lsSupportFormatStatus = false;
                if(!$SysClass->Execute($strSQL)){
                    $SysClass->Rollback();
                }else{
                    $lsSupportFormatStatus = true;
                }

                // ls_important_info
                $ls_important_info_content = ($_POST["ls_important_info_content"]) ? "'".$_POST["ls_important_info_content"]."'" : "NULL";

                $strSQL = "update ls_important_info set content=".$ls_important_info_content." ";
                $strSQL .= "where api_uid = ".$api_uid.";";
                //新增狀態
                $lsImportantInfoStatus = false;
                if(!$SysClass->Execute($strSQL)){
                    $SysClass->Rollback();
                }else{
                    $lsImportantInfoStatus = true;

                }

                // ls_response_example
                $ls_response_example_response_content = ($_POST["ls_response_example_response_content"]) ? "'".$_POST["ls_response_example_response_content"]."'" : "NULL";
                $original_content = $ls_response_example_response_content;

                $ls_response_example_response_content = str_replace("\n", "<br>", $ls_response_example_response_content);

                $strSQL = "update ls_response_example set response_content=".$ls_response_example_response_content.", original=".$original_content." ";
                $strSQL .= "where api_uid = ".$api_uid.";";

                //新增狀態
                $lsResponseExampleStatus = false;
                if(!$SysClass->Execute($strSQL)){
                    $SysClass->Rollback();
                }else{
                    $lsResponseExampleStatus = true;
                }

                // ls_parameter
                if(!empty($_POST["ls_parameter"])){
                    //新增狀態
                    $lsParameterStatus = false;
                    if(count($_POST["ls_parameter"]) == 1){

                        if(!empty($_POST["ls_parameter"][0]['name']) and !empty($_POST["ls_parameter"][0]['type']) and !empty($_POST["ls_parameter"][0]['description'])){

                            // 先刪掉全部在新增
                            $strSQL = "delete from ls_parameter where api_uid = ".$api_uid;
                            if(!$SysClass->Execute($strSQL)){
                                $SysClass->Rollback();
                            }

                            $strSQL = "insert into ls_parameter(api_uid,name,type,description,required) ";
                            $strSQL .= "values(".$api_uid.",'".$_POST["ls_parameter"][0]['name']."','".$_POST["ls_parameter"][0]['type']."','".$_POST["ls_parameter"][0]['description']."',".$_POST["ls_parameter"][0]['required'].");";
                            if(!$SysClass->Execute($strSQL)){
                                $SysClass->Rollback();
                            }else{
                                $lsParameterStatus = true;
                            }
                        }else{
                            $lsParameterStatus = true;
                        }
                    }else{
                        // 先刪掉全部在新增
                        $strSQL = "delete from ls_parameter where api_uid = ".$api_uid;
                        if(!$SysClass->Execute($strSQL)){
                            $SysClass->Rollback();
                        }

                        foreach ($_POST["ls_parameter"] as $content) {
                            if(!empty($content['name']) and !empty($content['type']) and !empty($content['description'])){
                                $strSQL = "insert into ls_parameter(api_uid,name,type,description,required) ";
                                $strSQL .= "values(".$api_uid.",'".$content['name']."','".$content['type']."','".$content['description']."',".$content['required'].");";

                                if(!$SysClass->Execute($strSQL)){
                                    $SysClass->Rollback();
                                }else{
                                    $lsParameterStatus = true;
                                }
                            }
                        }
                    }
                }else{
                    $lsParameterStatus = true;
                }

                // ls_response_explanation
                if( !empty($_POST["ls_response_explanation"]) and !empty($_POST["ls_response_example_response_content"]) ){
                    //新增狀態
                    $lsResponseExplanationStatus = false;
                    if(count($_POST["ls_response_explanation"]) == 1){

                        if(!empty($_POST["ls_response_explanation"][0]['name']) and !empty($_POST["ls_response_explanation"][0]['type']) and !empty($_POST["ls_response_explanation"][0]['description'])){

                            // 先刪掉全部在新增
                            $strSQL = "delete from ls_response_explanation where api_uid = ".$api_uid;
                            if(!$SysClass->Execute($strSQL)){
                                $SysClass->Rollback();
                            }

                            $strSQL = "insert into ls_response_explanation(api_uid,name,type,description) ";
                            $strSQL .= "values(".$api_uid.",'".$_POST["ls_response_explanation"][0]['name']."','".$_POST["ls_response_explanation"][0]['type']."','".$_POST["ls_response_explanation"][0]['description']."');";
                            if(!$SysClass->Execute($strSQL)){
                                $SysClass->Rollback();
                            }else{
                                $lsResponseExplanationStatus = true;
                            }
                        }else{
                            $lsResponseExplanationStatus = true;
                        }
                    }else{
                        // 先刪掉全部在新增
                        $strSQL = "delete from ls_response_explanation where api_uid = ".$api_uid;
                        if(!$SysClass->Execute($strSQL)){
                            $SysClass->Rollback();
                        }

                        foreach ($_POST["ls_response_explanation"] as $content) {
                            if(!empty($content['name']) and !empty($content['type']) and !empty($content['description'])){
                                $strSQL = "insert into ls_response_explanation(api_uid,name,type,description) ";
                                $strSQL .= "values(".$api_uid.",'".$content['name']."','".$content['type']."','".$content['description']."');";

                                if(!$SysClass->Execute($strSQL)){
                                    $SysClass->Rollback();
                                }else{
                                    $lsResponseExplanationStatus = true;
                                }

                            }
                        }
                    }
                }else{
                    $lsResponseExplanationStatus = true;
                }

                // 測試用
                // $action["test"] = $strSQL;
                // $action['uid'] = $NewID;
                // $SysClass->Execute($strSQL);
                // $SysClass->Rollback();
                // $SysClass->Commit();

                //新增後判斷
                if($lsSupportFormatStatus and $lsImportantInfoStatus and $lsResponseExampleStatus and $lsParameterStatus and $lsResponseExplanationStatus){
                    $inserStatus = true;
                }

                if(!$inserStatus){
                    $action["errorMsg"] = "修改失敗";
                }else{
                    $action["status"] = true;
                    $action["data"]['msg'] = "修改成功";
                    $SysClass->Commit();
                }
            }
            $pageContent = $SysClass->Data2Json($action);
        }catch(Exception $error){
            //依據Controller, Action補上對應位置, $error->getMessage()為固定部份
            $SysClass->WriteLog("SupplyController", "editorAction", $error->getMessage());
        }
         //關閉資料庫連線
        $SysClass->DBClose();
        //釋放
        $SysClass = null;
        $this->viewContnet['pageContent'] = $pageContent;
    }

    //刪除API類別
    public function deleteApiListAction()
    {
        $SysClass = new ctrlSystem;
        $SysClass->initialization("",true);
        try{
            $action = [];
            $action["status"] = false;
            if(!empty($_POST["uid"])){
                $strSQL = "delete from api_method where uid = ".$_POST["uid"].";";

                if($SysClass->Execute($strSQL)){
                    $action["status"] = true;
                    $action["data"] = "刪除成功";
                }else{
                    $action["errorMsg"] = "刪除失敗";
                }
                
            }else{
                 $action["errorMsg"] = "uid is empry";
            }
            $pageContent = $SysClass->Data2Json($action);
        }catch(Exception $error){
            //依據Controller, Action補上對應位置, $error->getMessage()為固定部份
            $SysClass->WriteLog("SupplyController", "editorAction", $error->getMessage());
        }
         //關閉資料庫連線
        $SysClass->DBClose();
        //釋放
        $SysClass = null;
        $this->viewContnet['pageContent'] = $pageContent;
    }

}
