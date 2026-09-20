const fs = require("fs");
const path = require("path");

function cleanFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  const orig = content;
  
  content = content.replace(/â€”/g, "—")
                   .replace(/â€“/g, "–")
                   .replace(/â€™/g, "’")
                   .replace(/â€˜/g, "‘")
                   .replace(/â€œ/g, "“")
                   .replace(/â€/g, "”")
                   .replace(/â†’/g, "→")
                   .replace(/â†/g, "←")
                   .replace(/â˜…/g, "★")
                   .replace(/Â©/g, "©")
                   .replace(/â‚¬/g, "€")
                   .replace(/102Â°/g, "102°");

  if (content !== orig) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log("Cleaned:", filePath);
  }
}

const root = path.resolve(__dirname, "..");
const files = ["index.html", "about.html", "work.html", "contact.html", "privacy-statement.html"];
files.forEach(f => {
  const p = path.join(root, f);
  if (fs.existsSync(p)) cleanFile(p);
});

const projDir = path.join(root, "projecten");
if (fs.existsSync(projDir)) {
  fs.readdirSync(projDir).forEach(f => {
    if (f.endsWith(".html")) {
      cleanFile(path.join(projDir, f));
    }
  });
}
console.log("Encoding clean completed!");
