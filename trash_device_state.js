function Lock(){
    document.getElementById("lock").innerHTML="&nbsp;쓰레기통이 잠금 상태로 변경되었습니다";
    lock.setAttribute("style", "color:red");
}

function Unlock(){
    document.getElementById("lock").innerHTML="&nbsp;쓰레기통 잠금이 해제되었습니다";
    lock.setAttribute("style", "color:green");
}

function deviceStates(deviceName) {
    setTimeout(invokeStateAPI(deviceName), 300);
    emptyDeviceStateTable();
    return false;
}

var invokeStateAPI = function(device) {
    // 디바이스 조회 URI
    // prod 스테이지 편집기의 맨 위에 있는 "호출 URL/devices"로 대체해야 함                
    var API_URI2 = 'https://5sa5an5cb2.execute-api.ap-northeast-2.amazonaws.com/project/trashdevices/'+ device;
    $.ajax(API_URI2, {
        method: 'GET',
        contentType: "application/json",

        success: function (data, status, xhr) {
                var result = JSON.parse(data);
                setDataState(result);
                console.log("data="+data);
        },
        error: function(xhr,status,e){
                alert("error");
        }
    });
};

var emptyDeviceStateTable = function() {
    $( '#device_state_table > tbody').empty();
    document.getElementById("state_devices").innerHTML="선택한 쓰레기통 상태 조회 중...";
}

// 데이터 출력을 위한 함수
var setDataState = function(data){

    $( '#device_state_table > tbody').empty();

    var tr1 = document.createElement("tr");
    var td1 = document.createElement("td");
    var td2 = document.createElement("td");
    var td3 = document.createElement("td");

    td1.innerText = data.state.reported.LockState;
    td2.innerText = data.state.reported.SpareSpace;

    var statetimestamp = data.metadata.reported.SpareSpace.timestamp;
    var datetimestamp = new Date(statetimestamp * 1000);

    var yearObject = datetimestamp.getFullYear();
    var monthObject = parseInt(datetimestamp.getMonth() + 1);
    var dayObject = parseInt(datetimestamp.getDate());
    var hourObject = parseInt(datetimestamp.getHours());
    var minuteObject = parseInt(datetimestamp.getMinutes());

    td3.innerText = yearObject+" "+monthObject+" "+dayObject+" "+hourObject+" "+minuteObject;

    if(minuteObject < 60 && data.state.reported.SpareSpace > 55) {
        if(monthObject == 1 || monthObject == 3 || monthObject == 5 || 
            monthObject == 7 || monthObject == 8 || monthObject == 10) {
            if(dayObject < 31) {
                if((hourObject >= 0) && (hourObject < 2)) {
                    hourObject = 2;
                }
                else if ((hourObject >= 2) && (hourObject < 4)) {
                    hourObject = 4;
                }
                else if ((hourObject >= 4) && (hourObject < 6)) {
                    hourObject = 6;
                }
                else if((hourObject >= 6) && (hourObject < 22)) {
                    hourObject = 22;
                }
                else if((hourObject >= 22) && (hourObject < 24)) {
                    dayObject = dayObject + 1;
                    hourObject = 0;
                }
            }
            else {
                if((hourObject >= 0) && (hourObject < 2)) {
                    hourObject = 2;
                }
                else if ((hourObject >= 2) && (hourObject < 4)) {
                    hourObject = 4;
                }
                else if ((hourObject >= 4) && (hourObject < 6)) {
                    hourObject = 6;
                }
                else if((hourObject >= 6) && (hourObject < 22)) {
                    hourObject = 22;
                }
                else if((hourObject >= 22) && (hourObject < 24)) {
                    monthObject = monthObject + 1;
                    dayObject = 1;
                    hourObject = 0;
                }
            }
            minuteObject = 0;
        }
        else if(monthObject == 4 || monthObject == 6 ||
            monthObject == 9 || monthObject == 11) {
            if(dayObject < 30) {
                if((hourObject >= 0) && (hourObject < 2)) {
                    hourObject = 2;
                }
                else if ((hourObject >= 2) && (hourObject < 4)) {
                    hourObject = 4;
                }
                else if ((hourObject >= 4) && (hourObject < 6)) {
                    hourObject = 6;
                }
                else if((hourObject >= 6) && (hourObject < 22)) {
                    hourObject = 22;
                }
                else if((hourObject >= 22) && (hourObject < 24)) {
                    dayObject = dayObject + 1;
                    hourObject = 0;
                }
            }
            else {
                if((hourObject >= 0) && (hourObject < 2)) {
                    hourObject = 2;
                }
                else if ((hourObject >= 2) && (hourObject < 4)) {
                    hourObject = 4;
                }
                else if ((hourObject >= 4) && (hourObject < 6)) {
                    hourObject = 6;
                }
                else if((hourObject >= 6) && (hourObject < 22)) {
                    hourObject = 22;
                }
                else if((hourObject >= 22) && (hourObject < 24)) {
                    monthObject = monthObject + 1;
                    dayObject = 1;
                    hourObject = 0;
                }
            }
            minuteObject = 0;
        }
        else if(monthObject == 2) {
            if(dayObject < 28) {
                if((hourObject >= 0) && (hourObject < 2)) {
                    hourObject = 2;
                }
                else if ((hourObject >= 2) && (hourObject < 4)) {
                    hourObject = 4;
                }
                else if ((hourObject >= 4) && (hourObject < 6)) {
                    hourObject = 6;
                }
                else if((hourObject >= 6) && (hourObject < 22)) {
                    hourObject = 22;
                }
                else if((hourObject >= 22) && (hourObject < 24)) {
                    dayObject = dayObject + 1;
                    hourObject = 0;
                }
            }
            else {
                if((hourObject >= 0) && (hourObject < 2)) {
                    hourObject = 2;
                }
                else if ((hourObject >= 2) && (hourObject < 4)) {
                    hourObject = 4;
                }
                else if ((hourObject >= 4) && (hourObject < 6)) {
                    hourObject = 6;
                }
                else if((hourObject >= 6) && (hourObject < 22)) {
                    hourObject = 22;
                }
                else if((hourObject >= 22) && (hourObject < 24)) {
                    monthObject = monthObject + 1;
                    dayObject = 1;
                    hourObject = 0;
                }
            }
            minuteObject = 0;
        }
        else if(monthObject == 12) {
            if(dayObject < 31) {
                if((hourObject >= 0) && (hourObject < 2)) {
                    hourObject = 2;
                }
                else if ((hourObject >= 2) && (hourObject < 4)) {
                    hourObject = 4;
                }
                else if ((hourObject >= 4) && (hourObject < 6)) {
                    hourObject = 6;
                }
                else if((hourObject >= 6) && (hourObject < 22)) {
                    hourObject = 22;
                }
                else if((hourObject >= 22) && (hourObject < 24)) {
                    dayObject = dayObject + 1;
                    hourObject = 0;
                }
            }
            else {
                if((hourObject >= 0) && (hourObject < 2)) {
                    hourObject = 2;
                }
                else if ((hourObject >= 2) && (hourObject < 4)) {
                    hourObject = 4;
                }
                else if ((hourObject >= 4) && (hourObject < 6)) {
                    hourObject = 6;
                }
                else if((hourObject >= 6) && (hourObject < 22)) {
                    hourObject = 22;
                }
                else if((hourObject >= 22) && (hourObject < 24)) {
                    yearObject = yearObject + 1;
                    monthObject = 1;
                    dayObject = 1;
                    hourObject = 0;
                }
            }
            minuteObject = 0;
        }

        var year = yearObject.toString();
        var month = ("0" + monthObject).slice(-2);
        var day = ("0" + dayObject).slice(-2);
        var hour = ("0" + hourObject).slice(-2);
        var minute = ("0" + minuteObject).slice(-2);

        var dateObject = year+"-"+month+"-"+day+" "+hour+":"+minute;          

        td3.setAttribute("style", "text-align:center;background-color:red;color:white");
        td3.innerHTML = dateObject+" 수거 필요";
    }
    else {
        td3.setAttribute("style", "text-align:center;background-color:green;color:white");
        td3.innerHTML = "수거 불필요";
    }

    tr1.appendChild(td1);
    tr1.appendChild(td2);
    tr1.appendChild(td3);

    $('#device_state_table').append(tr1);
    document.getElementById("state_devices").innerHTML="";
}