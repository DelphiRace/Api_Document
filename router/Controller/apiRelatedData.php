<?php
/*
    apiCategory Method for api
*/
use SystemCtrl\ctrlSystem;

class apiRelatedDataController
{
    //取得HTTP相關支援方法
    public function httpMethodAction()
    {
        $SysClass = new ctrlSystem;
        $SysClass->initialization("",true);
        try{
            $strSQL = "select * from api_http_method";
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
    //取得支援格式
    public function supportFormatAction()
    {
        $SysClass = new ctrlSystem;
        $SysClass->initialization("",true);
        try{
            $strSQL = "select * from api_support_format";
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

}
