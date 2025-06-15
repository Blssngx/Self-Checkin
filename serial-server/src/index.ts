import express, { Request, Response } from "express";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import { serialPortPath } from "./config";

const app = express();
app.use(express.json());

// 1) Open the serial port once
const port = new SerialPort(
  {
    path: serialPortPath,
    baudRate: 9600,
    dataBits: 8,
    parity: "none",
    stopBits: 1,
  },
  (err) => {
    if (err) console.error("[SerialPort] open error:", err);
    else console.log("[SerialPort] opened successfully");
  }
);

port.on("error", (err) => console.error("[SerialPort] error:", err));

// (Optional) keep listening to incoming data
const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));
parser.on("data", (line) => console.log("[serial incoming]:", line));

// 2) POST /unlock → writes "1"
app.post("/unlock", (req: Request, res: Response) => {
  port.write("2", (err) => {
    if (err) {
      console.error("[SerialPort] write error (unlock):", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, action: "unlocked" });
  });
});

// 3) POST /lock → writes "0"
app.post("/lock", (req: Request, res: Response) => {
  port.write("1", (err) => {
    if (err) {
      console.error("[SerialPort] write error (lock):", err);
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true, action: "locked" });
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🔌 Serial-control API listening on http://localhost:${PORT}`);
});
