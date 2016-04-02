<?php
/*
    apiCategory Method for api
*/
use SystemCtrl\ctrlSystem;

class apiCategoryController
{
    //列表取得
    public function GetListAction()
    {
        $SysClass = new ctrlSystem;
        $SysClass->initialization("",true);
        try{
            $strSQL = "select * from sys_category";
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
