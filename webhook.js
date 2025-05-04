const express = require("express");
const { exec } = require("child_process");
const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {
  const branch = req.body?.ref;
  if (branch === "refs/heads/main") {
    console.log("🔔 Push to main branch detected");
    exec("/home/tomi/Barter/deploy.sh", (err, stdout, stderr) => {
      if (err) {
        console.error("❌ Deploy error:", stderr);
        return res.sendStatus(500);
      }
      console.log("✅ Deploy output:\n", stdout);
      res.status(200).send("Deployment complete");
    });
  } else {
    res.status(200).send("Not main branch, ignoring");
  }
});

app.listen(7777, () => {
  console.log("🚀 Webhook server listening on port 7777");
});
