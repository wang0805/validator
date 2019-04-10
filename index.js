const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("testing if works");
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Listening to port ${PORT}`));
