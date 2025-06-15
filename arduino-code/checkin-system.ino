// Define the pins for the LED cathodes (common-anode RGB LED)
const int blueLight = 3;
const int greenLight = 4;
const int redLight = 5;
const int relayPin = 13;

void setup() {
  // Configure pins as outputs
  pinMode(redLight, OUTPUT);
  pinMode(greenLight, OUTPUT);
  pinMode(blueLight, OUTPUT);
  pinMode(relayPin, OUTPUT);

  // Initialize serial at 9600 bps
  Serial.begin(9600);
  Serial.println("Ready. Default: BLUE. Send 0=blue, 1=red (auto-revert), 2=green");

  // Default to blue on startup
  setBlue();
}

void loop() {
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    switch (cmd) {
      case '0':  // Blue
        setBlue();
        setLock();
        Serial.println("Blue ON");
        break;

      case '1':  // Red for 5s, then back to blue
        setRed();
        setLock();
        Serial.println("Red ON for 5s");
        delay(5000);
        setBlue();
        Serial.println("Red timeout → Blue ON");
        break;

      case '2':  // Green
        setGreen();
        setUnlock();
        Serial.println("Green ON");
        break;

      default:
        // ignore unknown commands
        break;
    }
  }
}

// Helper functions to light one color (others OFF)
void setRed() {
  digitalWrite(redLight, LOW);
  digitalWrite(greenLight, HIGH);
  digitalWrite(blueLight, HIGH);
}

void setGreen() {
  digitalWrite(redLight, HIGH);
  digitalWrite(greenLight, LOW);
  digitalWrite(blueLight, HIGH);
}

void setBlue() {
  digitalWrite(redLight, HIGH);
  digitalWrite(greenLight, HIGH);
  digitalWrite(blueLight, LOW);
  setLock();
}

void setUnlock() {
  digitalWrite(relayPin, HIGH);
}

void setLock() {
  digitalWrite(relayPin, LOW);
}