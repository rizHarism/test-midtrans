// /api/payment-success.js
const mqtt = require("mqtt");

module.exports = async (req, res) => {
  // Set CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "POST") {
    try {
      const { payment } = req.body;

      console.log("Payment :", payment);

      const MQTT_CONFIG = {
        host: "0e08b402058749c19d1886bcc23c4167.s1.eu.hivemq.cloud",
        port: 8883,
        protocol: "mqtts",
        username: "midtransapi",
        password: "1Sampai8",
      };

      const client = mqtt.connect(MQTT_CONFIG);

      client.on("connect", function () {
        console.log("✅ MQTT Connected");

        // const message = JSON.stringify({
        //   payment,
        // });

        const message = "payment_success";

        client.publish("mid/payment", message, { qos: 1 }, (err) => {
          if (err) {
            console.error("Publish error:", err);
            res.status(500).json({ error: "MQTT failed" });
          } else {
            console.log("✅ Payment success published:", message);
            res.status(200).json({
              success: true,
              message: "Payment processed and sent to ESP32",
            });
          }
          client.end();
        });
      });

      client.on("error", function (err) {
        console.error("MQTT error:", err);
        res.status(500).json({ error: "MQTT connection failed" });
      });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
