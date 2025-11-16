const midtransClient = require("midtrans-client");

module.exports = async (req, res) => {
  // Set CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    try {
      const { amount, order_id } = req.body;

      let snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
      });

      let parameter = {
        transaction_details: {
          order_id: order_id || "ORDER-" + Math.round(Math.random() * 1000000),
          gross_amount: amount,
        },
        credit_card: {
          secure: true,
        },
        enabled_payments: [
          "credit_card",
          "permata_va",
          "bca_va",
          "bni_va",
          "bri_va",
          "other_qris",
        ],
      };

      const transaction = await snap.createTransaction(parameter);

      res.status(200).json({
        success: true,
        token: transaction.token,
        redirect_url: transaction.redirect_url,
      });
    } catch (error) {
      console.error("Midtrans Error:", error);
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
};
