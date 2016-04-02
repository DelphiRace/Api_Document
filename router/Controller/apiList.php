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
            $strSQL = "select * from api_method t1 ";
            //API請求方法
            $strSQL .= "left join api_http_method t2 on t1.http_method = t2.uid ";
            //API支援格式
            $strSQL .= "left join ls_support_format t3 on t1.uid = t3.api_uid";
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
            $data = $SysClass->QueryData($strSQL);

            $action = [];
            $action["status"] = false;
            if(!empty($data)){
                $action["status"] = true;
                $action["data"] = $data;
            }else{
                $action["errorMsg"] = "Data is Empty";
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

    //新增API類別
    public function insertApiCategoryAction()
    {
        $SysClass = new ctrlSystem;
        $SysClass->initialization("",true);
        try{
            $action = [];
            $action["status"] = false;
            if(!empty($_POST["name"]) and !empty($_POST["description"])){
                $strSQL = "insert into sys_category(name,description) values('".$_POST["name"]."','".$_POST["description"]."');";

                if($SysClass->Execute($strSQL)){
                    $action["status"] = true;
                    $action["data"]['msg'] = "新增成功";
                    $action["data"]['uid'] = $SysClass->NewInsertID();
                }else{
                    $action["errorMsg"] = "新增失敗";
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

    //新增API類別
    public function modifyApiCategoryAction()
    {
        $SysClass = new ctrlSystem;
        $SysClass->initialization("",true);
        try{
            $action = [];
            $action["status"] = false;
            if(!empty($_POST["name"]) and !empty($_POST["description"]) and !empty($_POST["uid"])){
                $strSQL = "update sys_category set name='".$_POST["name"]."',description='".$_POST["description"]."' where uid = ".$_POST["uid"].";";

                if($SysClass->Execute($strSQL)){
                    $action["status"] = true;
                    $action["data"] = "修改成功";
                }else{
                    $action["errorMsg"] = "修改失敗";
                }
                
            }else{
                 $action["errorMsg"] = "name or description or uid is empry";
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
    public function deleteApiCategoryAction()
    {
        $SysClass = new ctrlSystem;
        $SysClass->initialization("",true);
        try{
            $action = [];
            $action["status"] = false;
            if(!empty($_POST["uid"])){
                $strSQL = "delete from sys_category where uid = ".$_POST["uid"].";";

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
