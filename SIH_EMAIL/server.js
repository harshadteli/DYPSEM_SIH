const express = require("express");
const path    = require("path");

const app  = express();
const PORT = process.env.PORT || 3000;

// Serve all static files with correct MIME types
app.use(express.static(path.join(__dirname), {
  setHeaders(res, filePath) {
    if (filePath.endsWith(".css"))  res.setHeader("Content-Type", "text/css");
    if (filePath.endsWith(".js"))   res.setHeader("Content-Type", "application/javascript");
    if (filePath.endsWith(".html")) res.setHeader("Content-Type", "text/html");
    if (filePath.endsWith(".json")) res.setHeader("Content-Type", "application/json");
    if (filePath.endsWith(".png"))  res.setHeader("Content-Type", "image/png");
    if (filePath.endsWith(".jpg") || filePath.endsWith(".jpeg")) res.setHeader("Content-Type", "image/jpeg");
    if (filePath.endsWith(".svg"))  res.setHeader("Content-Type", "image/svg+xml");
    if (filePath.endsWith(".mp4"))  res.setHeader("Content-Type", "video/mp4");
    if (filePath.endsWith(".webp")) res.setHeader("Content-Type", "image/webp");
  }
}));

// All routes → index.html (SPA fallback)
app.get("*", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => console.log(`BulkMail running on port ${PORT}`));
