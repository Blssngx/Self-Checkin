# 🔌 Self Checkin – Arduino Setup

This guide walks you through how to configure the Arduino component of the **Self Checkin** project — a privacy-first access control system using Zero-Knowledge Proofs and IoT hardware.

This sketch listens for serial commands sent from a Node.js microserver and controls:

- An RGB LED (red = denied, green = granted, blue = idle)
- A relay to physically lock or unlock a door

---

## 🧰 Requirements

- Arduino Uno (or compatible)
- RGB LED (common anode)
- 3 × 220Ω resistors
- 5V Relay module
- Breadboard + jumper wires
- USB cable (Arduino to computer)
- Optional: Electronic lock

---

## ⚙️ Circuit Wiring

| Arduino Pin | Component                | Description             |
| ----------- | ------------------------ | ----------------------- |
| D3          | RGB LED (Blue)           | Blue = idle state       |
| D4          | RGB LED (Green)          | Green = access granted  |
| D5          | RGB LED (Red)            | Red = access denied     |
| D13         | Relay IN                 | Controls the door lock  |
| 5V          | Common anode & relay VCC | Power for LED and relay |
| GND         | All components           | Shared ground           |

> 🔎 Tip: Connect each LED cathode to its Arduino pin **through a 220Ω resistor**. Connect the **common anode** of the RGB LED to **5V**.

---

## 📝 Upload the Sketch

### Step 1: Open Arduino IDE or [Arduino Create](https://create.arduino.cc/editor)

### Step 2: Copy & Paste the Code

```cpp
const int blueLight = 3;
const int greenLight = 4;
const int redLight = 5;
const int relayPin = 13;

void setup() {
  pinMode(redLight, OUTPUT);
  pinMode(greenLight, OUTPUT);
  pinMode(blueLight, OUTPUT);
  pinMode(relayPin, OUTPUT);
  Serial.begin(9600);

  Serial.println("Ready. Default: BLUE. Send 0=blue, 1=red (auto-revert), 2=green");
  setBlue();
}

void loop() {
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    switch (cmd) {
      case '0':
        setBlue();
        setLock();
        Serial.println("Blue ON");
        break;
      case '1':
        setRed();
        setLock();
        Serial.println("Red ON for 5s");
        delay(5000);
        setBlue();
        Serial.println("Red timeout → Blue ON");
        break;
      case '2':
        setGreen();
        setUnlock();
        Serial.println("Green ON");
        break;
    }
  }
}

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
```
