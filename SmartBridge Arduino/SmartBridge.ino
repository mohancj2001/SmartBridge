#include <Arduino_JSON.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ESP32Servo.h>
#include <Ultrasonic.h>

// WiFi credentials
// const char* ssid = "Hello";
// const char* password = "20010406";
const char *ssid = "AQUOS sense5G_7417";
const char *password = "BamidUMob@";

// Servo objects and pin definitions
Servo servo1, servo2, servo3;
const int servoPin1 = 27;
// const int servoPin2 = 26;
const int servoPin3 = 25;
int angle1 = 90;   // Initial angle for servo1
// int angle2 = 90;  // Initial angle for servo2
int angle3 = 0;   // Initial angle for servo3

// LED and buzzer pins
const int ledPin = 22;
const int ledPin1 = 23;
const int buzzerPin = 19;

// Ultrasonic sensor pins
Ultrasonic u(17, 16);  //(TRIG, ECHO)

void setup() {
  Serial.begin(115200);

  // Attach servos to their respective pins
  servo1.attach(servoPin1);
  // servo2.attach(servoPin2);
  servo3.attach(servoPin3);

  // Initialize servos to their starting positions
  servo1.write(angle1);
  // servo2.write(angle2);
  servo3.write(angle3);

  // Set up LED and buzzer pins
  pinMode(ledPin, OUTPUT);
  pinMode(ledPin1, OUTPUT);
  pinMode(12, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  digitalWrite(12, HIGH);
  // Wi-Fi connection
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.println("Connecting...");
  }
  Serial.println("\nConnected to Wi-Fi");
}

void loop() {
  HTTPClient request;
  request.begin("https://e0d4-61-245-170-138.ngrok-free.app/Smart_Bridge/Sub");
  request.addHeader("Content-Type", "application/x-www-form-urlencoded");

  int httpResponseCode = request.GET();

  if (httpResponseCode == HTTP_CODE_OK) {
    String responseText = request.getString();
    JSONVar json = JSON.parse(responseText);

    if (JSON.typeof(json) == "undefined") {
      Serial.println("Error: Parsing failed!");
    } else {
      int status = int(json["status"]);
      Serial.println("Status: " + String(status));
      handleStatus(status);
    }
  } else {
    Serial.printf("Error in HTTP request: %d\n", httpResponseCode);
  }

  request.end();
  delay(2000);
}

void handleStatus(int status) {
  switch (status) {
    case 1:  // Open Bridge
      setLED(true);
      moveServoToAngle(servo1, angle1, 0);
       activateBuzzer();
      //  moveServoToAngle(servo2, angle2, 0);
      break;
    case 0:  // Close Bridge
      setLED(false);
      moveServoToAngle(servo1, angle1, 90);
      // moveServoToAngle(servo2, angle2, 90);
      deactivateBuzzer();
      break;
    case 2:  // Activate Buzzer
    moveServoToAngle(servo3, angle3, 0);
      activateBuzzer();
      setLED(true);
      break;
    case 3:  // Deactivate Buzzer
      deactivateBuzzer();
      setLED(false);
      moveServoToAngle(servo3, angle3, 90);
      break;
    default:  // Reset controls
      resetControls();
      break;
  }

  int distance = u.read();
  Serial.println("Distance: " + String(distance));

  if (distance > 10) {
    deactivateBuzzer();
  } else {
    activateBuzzer();
  }
}

void moveServoToAngle(Servo& servo, int& currentAngle, int targetAngle) {
  int step = targetAngle > currentAngle ? 1 : -1;
  while (currentAngle != targetAngle) {
    currentAngle += step;
    servo.write(currentAngle);
    delay(15);
  }
}

void setLED(bool state) {
  digitalWrite(ledPin, state ? HIGH : LOW);
  digitalWrite(ledPin1, state ? LOW : HIGH);
}

void activateBuzzer() {
  digitalWrite(buzzerPin, HIGH);
  delay(1000);
  digitalWrite(buzzerPin, LOW);
}

void deactivateBuzzer() {
  digitalWrite(buzzerPin, LOW);
}

void resetControls() {
  setLED(false);
  servo1.write(0);
  servo2.write(90);
  servo3.write(0);
  deactivateBuzzer();
}
