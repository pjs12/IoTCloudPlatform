// API 시작
function Start() {
    invokeAPI();
    emptyDeviceListTable();
}

// 디바이스 조회 URI
// prod 스테이지 편집기의 맨 위에 있는 "호출 URL/devices"로 대체해야 함
var API_URI = 'https://5sa5an5cb2.execute-api.ap-northeast-2.amazonaws.com/project/trashdevices';

var invokeAPI = function() {
               
    $.ajax(API_URI, {
        method: 'GET',
        contentType: "application/json",

        success: function (data, status, xhr) {

            var result = JSON.parse(data);
            setDataList(result.things);  // 성공시, 데이터 출력을 위한 함수 호출
            console.log(data);
        },
        error: function(xhr,status,e){
          //  document.getElementById("list_devices").innerHTML="Error";
            alert("error");
        }
    });
};

// 테이블 데이터 삭제
var emptyDeviceListTable = function() {
    $( '#device_list_table > tbody').empty();
    document.getElementById("list_devices").innerHTML="쓰레기통 디바이스 조회 중...";
}

// 데이터 출력을 위한 함수
var setDataList = function(data){
    
    $( '#device_list_table > tbody').empty();
    data.forEach(function(v){

        var tr1 = document.createElement("tr");
        var td1 = document.createElement("td");
        var td2 = document.createElement("td");

        var a1 = document.createElement('a');
        a1.setAttribute('href',`javascript:deviceStates( '${v.thingName}' )`);
        a1.innerHTML = v.thingName;

        var a2 = document.createElement('a');
        a2.setAttribute('href',`javascript:DateStart( '${v.thingName}' )`);
        a2.innerHTML = "디바이스 LOG";

        td1.append(a1);
        td2.append(a2);

        tr1.appendChild(td1);
        tr1.appendChild(td2);
        $('#device_list_table').append(tr1);
    })

    document.getElementById("list_devices").remove();
}
