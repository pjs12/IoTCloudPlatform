#include "Servo.h"

Servo servo1;
int pos = 0;

servo::servo(int pin) {
  // Use 'this->' to make the difference between the
  // 'pin' attribute of the class and the 
  // local variable 'pin' created from the parameter.
  this->pin = pin;
  init();
}
void servo::init() {
  servo1.attach(pin);
  // Always try to avoid duplicate code.
  // Instead of writing digitalWrite(pin, LOW) here,
  // call the function off() which already does that
  off();
  state = SERVO_LOCK;
}
void servo::on() {
  for(pos = 0; pos < 180; pos += 1) 
  { 
    servo1.write(pos);
    delay(5); //delay값을 조정하여 모터의 속도를 컨터롤가능
  } 
  state = SERVO_UNLOCK;
}
void servo::off() {
  for(pos = 180; pos>=1; pos-=1)
  { 
    servo1.write(pos); 
    delay(5); 
  } 
  state = SERVO_LOCK;
}

byte servo::getState() {
  return state;
}
