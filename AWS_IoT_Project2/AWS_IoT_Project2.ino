/*
  AWS IoT WiFi

  This sketch securely connects to an AWS IoT using MQTT over WiFi.
  It uses a private key stored in the ATECC508A and a public
  certificate for SSL/TLS authetication.

  It publishes a message every 5 seconds to arduino/outgoing
  topic and subscribes to messages on the arduino/incoming
  topic.

  The circuit:
  - Arduino MKR WiFi 1010 or MKR1000

  The following tutorial on Arduino Project Hub can be used
  to setup your AWS account and the MKR board:

  https://create.arduino.cc/projecthub/132016/securely-connecting-an-arduino-mkr-wifi-1010-to-aws-iot-core-a9f365

  This example code is in the public domain.
*/

#include <ArduinoBearSSL.h>
#include <ArduinoECCX08.h>
#include <ArduinoMqttClient.h>
#include <WiFiNINA.h> // change to #include <WiFi101.h> for MKR1000

#include "arduino_secrets.h"

#define echoPin1 0   // 쓰레기 잔량 측정을 위한 초음파센서1 입력핀(echo)
#define trigPin1 1   // 쓰레기 잔량 측정을 위한 초음파센서1 출력핀(trig)
#define echoPin2 6   // 자동문을 위한 초음파센서2 입력핀(echo)
#define trigPin2 7   // 자동문을 위한 초음파센서2 출력핀(trig)

#define servoPin1 4   // 쓰레기통 잠금 서보모터 출력핀
#define servoPin2 10   // 자동문 개폐 서보모터 출력핀

#include <ArduinoJson.h>
#include "Servo.h"

/////// Enter your sensitive data in arduino_secrets.h
const char ssid[]        = SECRET_SSID;
const char pass[]        = SECRET_PASS;
const char broker[]      = SECRET_BROKER;
const char* certificate  = SECRET_CERTIFICATE;

WiFiClient    wifiClient;            // Used for the TCP socket connection
BearSSLClient sslClient(wifiClient); // Used for SSL/TLS connection, integrates with ECC508
MqttClient    mqttClient(sslClient);

unsigned long lastMillis = 0;

Servo doorservo;  // 자동문 개폐 서보모터 set
servo myservo(servoPin1);   // 쓰레기통 잠금 서보모터 set

void setup() {
  doorservo.attach(servoPin2);
  Serial.begin(9600);
  while (!Serial);

  pinMode(echoPin1, INPUT);   // echoPin1 입력
  pinMode(trigPin1, OUTPUT);  // trigPin1 출력
  pinMode(echoPin2, INPUT);   // echoPin2 입력
  pinMode(trigPin2, OUTPUT);  // trigPin2 출력

  if (!ECCX08.begin()) {
    Serial.println("No ECCX08 present!");
    while (1);
  }

  // Set a callback to get the current time
  // used to validate the servers certificate
  ArduinoBearSSL.onGetTime(getTime);

  // Set the ECCX08 slot to use for the private key
  // and the accompanying public certificate for it
  sslClient.setEccSlot(0, certificate);

  // Optional, set the client id used for MQTT,
  // each device that is connected to the broker
  // must have a unique client id. The MQTTClient will generate
  // a client id for you based on the millis() value if not set
  //
  // mqttClient.setId("clientId");

  // Set the message callback, this function is
  // called when the MQTTClient receives a message
  mqttClient.onMessage(onMessageReceived);
}

void loop() {
  long duration2, distance2;
  
  if (WiFi.status() != WL_CONNECTED) {
    connectWiFi();
  }

  if (!mqttClient.connected()) {
    // MQTT client is disconnected, connect
    connectMQTT();
  }

  // poll for new MQTT messages and send keep alives
  mqttClient.poll();

  // publish a message roughly every 5 seconds.
  if (millis() - lastMillis > 5000) {
    lastMillis = millis();
    char payload[512];
    getDeviceStatus(payload);
    sendMessage(payload);
  }

  digitalWrite(trigPin2, HIGH);  // trigPin에서 초음파 발생(echoPin도 HIGH)
  delayMicroseconds(10);         // 자동문 개폐를 위한 초음파 발생
  digitalWrite(trigPin2, LOW);
  delayMicroseconds(2);
 
  duration2 = pulseIn(echoPin2, HIGH);    // echoPin 이 HIGH를 유지한 시간을 저장 한다.
  distance2 = ((float)(340 * duration2) / 10000) / 2;

  if(distance2<10) {   // 특정 거리 안으로 들어오면 쓰레기통 뚜껑이 자동으로 열림
    doorservo.write(180);
    delay(200);
  } 
  
  else {   // 특정 거리 밖으로 나가면 쓰레기통 뚜껑이 자동으로 닫힘
    doorservo.write(0);
    delay(200);
  }
}

unsigned long getTime() {
  // get the current time from the WiFi module  
  return WiFi.getTime();
}

void connectWiFi() {
  Serial.print("Attempting to connect to SSID: ");
  Serial.print(ssid);
  Serial.print(" ");

  while (WiFi.begin(ssid, pass) != WL_CONNECTED) {
    // failed, retry
    Serial.print(".");
    delay(5000);
  }
  Serial.println();

  Serial.println("You're connected to the network");
  Serial.println();
}

void connectMQTT() {
  Serial.print("Attempting to MQTT broker: ");
  Serial.print(broker);
  Serial.println(" ");

  while (!mqttClient.connect(broker, 8883)) {
    // failed, retry
    Serial.print(".");
    delay(5000);
  }
  Serial.println();

  Serial.println("You're connected to the MQTT broker");
  Serial.println();

  // subscribe to a topic
  mqttClient.subscribe("$aws/things/MyMKRWiFi1010/shadow/update/delta");
}

void getDeviceStatus(char* payload) {
  float duration1, distance1;

  digitalWrite(trigPin1, HIGH);  // trigPin1에서 초음파 발생(echoPin1도 HIGH)
  delayMicroseconds(10);
  digitalWrite(trigPin1, LOW);
 
  duration1 = pulseIn(echoPin1, HIGH);    // echoPin1 이 HIGH를 유지한 시간을 저장 한다.
  distance1 = ((float)(340 * duration1) / 10000) / 2; 

  // Read led status
  const char* servo2 = (myservo.getState() == SERVO_UNLOCK)? "UNLOCK" : "LOCK";

  // make payload for the device update topic ($aws/things/MyMKRWiFi1010/shadow/update)
  sprintf(payload,"{\"state\":{\"reported\":{\"SpareSpace\":\"%0.1f\",\"LockState\":\"%s\"}}}",distance1,servo2);
}

void sendMessage(char* payload) {
  char TOPIC_NAME[]= "$aws/things/MyMKRWiFi1010/shadow/update";
  
  Serial.print("Publishing send message:");
  Serial.println(payload);
  mqttClient.beginMessage(TOPIC_NAME);
  mqttClient.print(payload);
  mqttClient.endMessage();
}


void onMessageReceived(int messageSize) {
  // we received a message, print out the topic and contents
  Serial.print("Received a message with topic '");
  Serial.print(mqttClient.messageTopic());
  Serial.print("', length ");
  Serial.print(messageSize);
  Serial.println(" bytes:");

  // store the message received to the buffer
  char buffer[512] ;
  int count=0;
  while (mqttClient.available()) {
     buffer[count++] = (char)mqttClient.read();
  }
  buffer[count]='\0'; // 버퍼의 마지막에 null 캐릭터 삽입
  Serial.println(buffer);
  Serial.println();

  // JSon 형식의 문자열인 buffer를 파싱하여 필요한 값을 얻어옴.
  // 디바이스가 구독한 토픽이 $aws/things/MyMKRWiFi1010/shadow/update/delta 이므로,
  // JSon 문자열 형식은 다음과 같다.
  // {
  //    "version":391,
  //    "timestamp":1572784097,
  //    "state":{
  //        "LockState":"UNLOCK"
  //    },
  //    "metadata":{
  //        "LockState":{
  //          "timestamp":15727840
  //         }
  //    }
  // }
  //
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, buffer);
  JsonObject root = doc.as<JsonObject>();
  JsonObject state = root["state"];
  const char* servo2 = state["LockState"];
  Serial.println(servo2);
  
  char payload[512];
  
  if (strcmp(servo2,"UNLOCK")==0) {
    myservo.on();
    sprintf(payload,"{\"state\":{\"reported\":{\"LockState\":\"%s\"}}}","UNLOCK");
    sendMessage(payload);
    
  } else if (strcmp(servo2,"LOCK")==0) {
    myservo.off();
    sprintf(payload,"{\"state\":{\"reported\":{\"LockState\":\"%s\"}}}","LOCK");
    sendMessage(payload);
  }
 
}
