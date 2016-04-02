var socket = io.connect(configObject.socketConn);
var systemID = '';
var uuid = '',userName = '';
getAcInfo();

socket.on('chatMsg', function(data) {
    if(data.systemID != systemID){
        showNoticeToast(data.userName+':<br/>'+data.msg);
    }
});

socket.on('conn', function (data) {
    var postdata = {
        'uid': uuid,
        'userName' : userName
    }
    systemID = data.systemID;
    socket.emit('login', postdata,function(result){});

});

function getAcInfo(){
   $.ajax({
        url: configObject.getAcInfo,
        type: "POST",
        async:false,
        dataType: "JSON",
        success: function(rs){
           uuid = rs.uuid;
           userName = rs.userName;
           //console.log(rs);
        }
    });
}