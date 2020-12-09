#include <Servo.h>
#include <Arduino.h>

#define SERVO_LOCK 0
#define SERVO_UNLOCK 1

class servo {
  private:
    int pin;
    byte state;

  public:
    servo(int pin);
    void init();
    void on();
    void off();
    byte getState();
};
