function DateStart(deviceName) {
    setTimeout(invokeLogAPI(deviceName), 300);
    emptyDeviceLogTable();
    return false;
}

var invokeLogAPI = function(device) {
    var startdateObject = $('#date_start').val().toString();
    var enddateObject = $('#date_end').val().toString();
    var displayStartDate = startdateObject.replace(/\//gi,"-");
    var displayEndDate = enddateObject.replace(/\//gi,"-");

    // 디바이스 조회 URI
    // prod 스테이지 편집기의 맨 위에 있는 "호출 URL/devices"로 대체해야 함 
    var API_URI3 = 'https://5sa5an5cb2.execute-api.ap-northeast-2.amazonaws.com/project/trashdevices/'+device
    +'/log?from='+displayStartDate+':00&to='+displayEndDate+':00';
    $.ajax(API_URI3, {
        method: 'GET',
        contentType: "application/json",

        success: function (data, status, xhr) {
                var result = JSON.parse(data);
                setDataLog(result.data);
                console.log("data="+data);
        },
        error: function(xhr,status,e){
                alert("error");
        }
    });
};

var emptyDeviceLogTable = function() {
    $( '#device_log_table > tbody').empty();
    document.getElementById("log_devices").innerHTML="선택한 쓰레기통 로그 조회 중...";
}

// 데이터 출력을 위한 함수
var setDataLog = function(data){

    $( '#device_log_table > tbody').empty();

    data.forEach(function(v) {
    	var tr1 = document.createElement("tr");
    	var td1 = document.createElement("td");
    	var td2 = document.createElement("td");
        var td3 = document.createElement("td");

    	td1.innerText = v.SpareSpace;
        td2.innerText = v.LockState;
    	td3.innerText = v.timestamp;

    	tr1.appendChild(td1);
    	tr1.appendChild(td2);
        tr1.appendChild(td3);

    	$('#device_log_table').append(tr1);
    })
    document.getElementById("log_devices").innerHTML="";
}
