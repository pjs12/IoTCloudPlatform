# IoTCloudPlatform 스마트 쓰레기통 프로젝트

* 스마트 쓰레기통 구조도 *
![KakaoTalk_20201209_195820228](https://user-images.githubusercontent.com/31908647/101621454-1e502000-3a59-11eb-9e3b-2d728623436b.jpg)

1. 브레드 보드에 아두이노 디바이스와 센서를 연결합니다.
![KakaoTalk_20201209_141251131](https://user-images.githubusercontent.com/31908647/101614680-99610880-3a50-11eb-89bf-9ed13ca4aaff.jpg)

2. AWS_IoT_Project2 폴더의 AWS_IoT_Project2.ino 파일을 실행시킵니다.
이떄, AWS와 연동을 위해 arduino.secrets.h 파일에서
Secret_SSID, Secret_PASS, Secret_BROKER, Secret_CERTIFICATE를 설정해주세요.

3. AWS IoT에서 사물을 하나 생성해줍니다. 
csr을 통해 인증서도 만들어주고 AWS IoT 작업을 수행할 수 있는 정책도 설정해줍니다.
![pjimage](https://user-images.githubusercontent.com/31908647/101588907-bda9ee80-3a2a-11eb-8063-2da4c670dc1a.jpg)

4. AWS SNS 서비스를 이용해서 쓰레기통 잔량이 특정 값 이하가 되면 알림을 보내도록 합니다.
저희가 만든 웹어플리케이션에서 알림이 뜨도록 구현하고 싶었지만
웹 서버와 연동되어 작동하는 것이 아니기 때문에 AWS SNS에서 HTTP를 이용해 알림을 보낼 수 없었습니다.
대신 이메일을 연동하여 특정 값 이하가 되면 메일을 수신할 수 있도록 구현했습니다.
(이 부분은 구현해보고 싶은 분들만 해주세요...)

![pjimage2](https://user-images.githubusercontent.com/31908647/101590071-14b0c300-3a2d-11eb-9c6c-3b7de46975c6.jpg)
먼저 AWS SNS(Simple Notification Service)에서 유형은 표준으로 설정해주고 원하는 이름으로 주제 생성을 해줍니다.
해당 주제에서 구독 생성을 클릭한 후 프로토콜은 이메일, 엔드포인트는 자신의 이메일로 설정하고 구독 생성을 클릭합니다. 
구독 생성을 완료하면 해당 이메일로 AWS Notification에서 구독 확인 메일을 보냅니다. 그 메일에서 구독 확인을 클릭하여 자신의 이메일의 상태가 확인됨으로 바뀌게 해줍니다.

![캡처8](https://user-images.githubusercontent.com/31908647/101606508-cf00f400-3a46-11eb-9045-580e8ca49a0e.JPG)
![캡처9](https://user-images.githubusercontent.com/31908647/101610766-07570100-3a4c-11eb-9967-368b7ed5b9e0.JPG)
AWS SNS에서 SNS서비스를 사용하기 위한 Lambda함수입니다.
TrashSNSLambda의 자바 파일에서 AccessKey, SecretKey, topicArn을 설정해주고 AWS에 업로드합니다.
여기서 topicArn은 설정한 주제의 ARN입니다.

![캡처10](https://user-images.githubusercontent.com/31908647/101610947-3c635380-3a4c-11eb-9006-a2a226ec7407.JPG)
AWS SNS을 사용하기 위한 백엔드 구축을 위한 Lambda함수입니다.
DistanceMonitoringLambda의 자바 파일에서 ccessKey, SecretKey, topicArn을 설정해주고 AWS에 업로드합니다.
여기서 topicArn은 설정한 주제의 ARN입니다.

![pjimage3](https://user-images.githubusercontent.com/31908647/101612196-b9db9380-3a4d-11eb-9e04-3cadeb5fa7eb.jpg)
IoT 콘솔에서 DistanceMonitoringLambda를 실행하기 위한 규칙을 생성합니다.
규칙 생성을 클릭하고 규칙의 이름을 적고
규칙 쿼리 설명문에 SELECT * FROM '$aws/things/본인이 생성한 사물/shadow/update/accepted'을 입력합니다.
하나 이상의 작업을 설정에서 메시지 데이터를 전달하는 Lambda함수 호출을 클릭하고
DistanceMonitoringLambda를 선택합니다.

5. 아두이노 디바이스에서 받은 데이터 값들을 저장하는 DynamoDB 테이블을 만들고 DynamoDB에 데이터를 저장하는 Lambda함수를 실행시킵니다.
DynamoDB로 저장할 데이터는 쓰레기통 잔량을 확인하는 SpareSpace와 잠금 상태를 확인하는 LockState입니다.

![캡처14](https://user-images.githubusercontent.com/31908647/101613229-db894a80-3a4e-11eb-8644-396e8ba27dd9.JPG)
DynamoDB에 들어가서 테이블 만들기를 클릭합니다.
테이블 이름을 적어주고 파티션 키는 문자열의 deviceId, 정렬키는 번호의 time으로 설정하고 테이블을 생성합니다.

![캡처15](https://user-images.githubusercontent.com/31908647/101613702-6a966280-3a4f-11eb-99f4-f5fc5c8965c6.JPG)
RecordingTrashDeviceData의 자바 파일에서 DYNAMODB_TABLE_NAME을 자신이 만든 테이블 이름으로 바꿔주고 AWS에 업로드합니다.

![pjimage4](https://user-images.githubusercontent.com/31908647/101614145-ee504f00-3a4f-11eb-95c6-dc294f0bd95f.jpg)
IoT콘솔에서 RecordingTrashDeviceData Lambda를 실행하기 위한 규칙을 생성합니다.
규칙 생성을 클릭하고 규칙의 이름을 적고
규칙 쿼리 설명문에 
SELECT *, 'MyMKRWiFi1010' as device'$aws/things/본인이 생성한 사물/shadow/update/documents'
을 입력합니다.

하나 이상의 작업을 설정에서 메시지 데이터를 전달하는 Lambda함수 호출을 클릭하고
RecordingTrashDeviceData Lambda를 선택합니다.

6. 웹 어플리케이션에서 내가 만든 사물들을 출력하게 합니다.

![캡처19](https://user-images.githubusercontent.com/31908647/101615024-007ebd00-3a51-11eb-948f-67de739fc6cb.JPG)
ListingTrashDeviceLambda를 AWS에 업로드합니다.

![pjimage5](https://user-images.githubusercontent.com/31908647/101616270-894a2880-3a52-11eb-99d7-921f77f4266c.jpg)
API Gateway로 들어가서 REST API를 구축해줍니다.
먼저, 새 API 생성에서 API 이름을 입력하고 엔드포인트 유형을 지역으로 둔 후 API를 생성해줍니다.
생성한 API의 /에서 리소스 생성을 선택하고 리소스 이름을 입력하고 생성합니다.
그후 메소드 생성을 클릭하고 GET을 선택한 후 확인 표시 아이콘을 선택합니다.
GET 메소드 설정에서 Lambda함수를 선택하고 Lambda 리전을 업로드할 때 설정한 곳으로 설정한 후
ListingTrashDeviceLambda 함수를 선택하고 저장합니다.
생성한 리소스의 CORS 활성화를 해주고 API 배포를 클릭하여 새 스테이지를 입력후 배포합니다.

7. 웹 어플리케이션에서 내가 만든 사물들의 현재 상태를 조회할 수 있게 합니다.

![캡처25](https://user-images.githubusercontent.com/31908647/101616675-05447080-3a53-11eb-8b82-d0c50156b2a9.JPG)
GetTrashDeviceStateLambda를 AWS에 업로드합니다.

![pjimage5](https://user-images.githubusercontent.com/31908647/101618322-2e660080-3a55-11eb-91c3-5c77f36a7340.jpg)
6번에서 만든 리소스 하위에 리소스를 하나 만듭니다. 이때 리소스 경로를 중괄호를 이용하여 클라이언트에서 입력을 가져오는데 사용되는 템플릿 경로 변수를 만듭니다.
그후 메소드 생성을 클릭하고 GET을 선택한 후 확인 표시 아이콘을 선택합니다.
GET 메소드 설정에서 Lambda함수를 선택하고 Lambda 리전을 업로드할 때 설정한 곳으로 설정한 후
GetTrashDeviceStateLambda 함수를 선택하고 저장합니다.
통합요청을 클릭하고 매핑 템플릿에서 정의된 템플릿이 없는 경우를 클릭한 후
매핑템플릿을 application/json으로, 아래 편집기에 다음과 같이 입력하여 device 속성 값을 /{device} 경로 변수의 값으로 사용하겠다고 정의합니다.
{
  "device": "$input.params('device')"
}
생성한 리소스의 CORS 활성화를 해주고 API를 배포합니다.

8. 웹 어플리케이션에서 내가 만든 사물의 상태를 변경할 수 있게 해줍니다.

![캡처32](https://user-images.githubusercontent.com/31908647/101618571-8866c600-3a55-11eb-8e4d-c365196ac599.JPG)
UpdateTrashDeviceLambda를 AWS에 업로드합니다.

![pjimage6](https://user-images.githubusercontent.com/31908647/101619325-78031b00-3a56-11eb-85b1-09bff03b3634.jpg)
7번에서 만든 리소스 하위에 메소드를 하나 생성합니다. PUT을 선택한 후 확인 표시 아이콘을 선택합니다.
PUT 메소드 설정에서 Lambda함수를 선택하고 Lambda 리전을 업로드할 때 설정한 곳으로 설정한 후
UpdateTrashDeviceLambda 함수를 선택하고 저장합니다.
통합요청을 클릭하고 매핑 템플릿에서 정의된 템플릿이 없는 경우를 클릭한 후
매핑템플릿을 application/json으로, 아래 편집기에 다음과 같이 입력하여 API의 디바이스에서 들어오는 값을 API 형식에 맞게 바꿔줍니다.
#set($inputRoot = $input.path('$'))
{
    "device": "$input.params('device')",
    "tags" : [
    ##TODO: Update this foreach loop to reference array from input json
        #foreach($elem in $inputRoot.tags)
        {
            "tagName" : "$elem.tagName",
            "tagValue" : "$elem.tagValue"
        } 
        #if($foreach.hasNext),#end
        #end
    ]
}
생성한 메소드의 CORS 활성화를 해주고 API를 배포합니다.

9. 웹 어플리케이션에서 내가 만든 사물의 로그를 조회할 수 있게 합니다.

![캡처36](https://user-images.githubusercontent.com/31908647/101619532-c2849780-3a56-11eb-94ee-7cf2c4d7be09.JPG)
LogTrashDeviceLambda를 AWS에 업로드합니다.

![pjimage7](https://user-images.githubusercontent.com/31908647/101620634-1f348200-3a58-11eb-9c4b-d8d464b01b47.jpg)
7번에서 만든 리소스 하위에 리소스를 하나 더 생성합니다.
방금 만든 리소스 하위에 메소드 생성을 클릭하고 GET을 선택한 후 확인 표시 아이콘을 선택합니다.
GET 메소드 설정에서 Lambda함수를 선택하고 Lambda 리전을 업로드할 때 설정한 곳으로 설정한 후
LogTrashDeviceLambda 함수를 선택하고 저장합니다.
메서드 요청에서 URL 쿼리 문자열 파라미터를 클릭하고 from과 to라는 쿼리 문자열을 추가한 후,
여기서 만든 쿼리 문자열들을 필수 조건으로 설정해줍니다.
통합요청을 클릭하고 매핑 템플릿에서 정의된 템플릿이 없는 경우를 클릭한 후
매핑템플릿을 application/json으로, 아래 편집기에 다음과 같이 입력하여 API의 디바이스에서 들어오는 값을 API 형식에 맞게 바꿔줍니다.
{
  "device": "$input.params('device')",
  "from": "$input.params('from')",
  "to":  "$input.params('to')"
}
생성한 리소스의 CORS 활성화를 해주고 API를 배포합니다.

10.어플리케이션에서 로그 조회를 할 때 달력을 띄우게 하기 위해 프로젝트 디렉토리에

jquery.datetimepicker.full.js

jquery.datetimepicker.min.css

jquery.js

위의 3개의 파일들을 함께 넣어줍니다.
이 파일들은 https://plugins.jquery.com/datetimepicker/ 에서 배포한 파일들을 참조하여 사용합니다.

먼저, 기기 조회 버튼을 누르면 AWS IoT에 등록되어 있는 쓰레기통 사물들이 보입니다.

디바이스 명 아래에 출력된 디바이스들을 클릭하면
해당 디바이스의 남은 공간, 잠금 상태, 수거가 필요한 시간을 알려줍니다.

디바이스 상태 로그 아래에 출력된 '디바이스 LOG'라는 Text를 클릭한 후,
Start time와 End time의 빈 박스를 클릭하면 뜨는 달력에서 조회하고 싶은 기간을 설정합니다.
기간을 설정한 후, 기간 조회 버튼을 누르면 설정한 기간 동안의
선택한 쓰레기통 디바이스의 남은 공간, 잠금 상태의 시간 로그가 출력됩니다.

잠금 버튼을 누르면 쓰레기통 디바이스가 잠금상태가 되어 열리지 않고
잠금 해제 버튼을 누르면 쓰레기통 디바이스를 다시 사용할 수 있는 상태가 됩니다.

![캡처41](https://user-images.githubusercontent.com/31908647/101620886-6c185880-3a58-11eb-8a58-2c765fa2233e.JPG)
저희가 만든 웹 어플리케이션에서는 PUT 메소드가 실행되지 않기 때문에 POSTMAN을 이용해서
잠금장치를 제어합니다.

잠금장치를 UNLOCK으로 바꾸면 쓰레기통의 잠금 장치가 열리고 쓰레기통의 현재 잠금 상태가 바뀝니다.
