//var apurl=location.origin+":99";
var apurl = location.protocol+"//"+location.hostname+":99";
var apiUrl = location.protocol+"//"+location.hostname+":300/";
var originUrl = location.origin+'/';
var configObj = {
    "LoginUrl": apurl+"/login",
    "WebAPI": "http://211.21.170.18:8080",
    "APIUrl": apiUrl,
    "deleteAPI" : "http://211.21.170.18/deletemethod"
};