// Injects the word lists into template.html -> index.html
// Usage: node build.js  (expects wordle5.txt + enable1.txt next to it)
//   wordle5.txt : https://raw.githubusercontent.com/tabatkins/wordle-list/main/words
//   enable1.txt : https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt
const fs = require("fs");
const read = f => fs.readFileSync(__dirname + "/" + f, "utf8")
                    .split(/\r?\n/).map(s => s.trim().toLowerCase()).filter(Boolean);

const uniq = a => [...new Set(a)].sort();
const w5 = uniq(read("wordle5.txt").filter(w => /^[a-z]{5}$/.test(w)));
const en = read("enable1.txt").filter(w => /^[a-z]+$/.test(w));

// keys 2..8 are ENABLE1 (the finder, one consistent dictionary across lengths);
// "wordle5" is the Wordle guess list, used only by the Wordle helper.
const words = {wordle5: w5.join(" ")};
for (const n of [2, 3, 4, 5, 6, 7, 8])
  words[n] = uniq(en.filter(w => w.length === n)).join(" ");

const out = fs.readFileSync(__dirname + "/template.html", "utf8")
              .replace("/*__WORDS__*/", JSON.stringify(words));
fs.writeFileSync(__dirname + "/index.html", out);

for (const k of Object.keys(words)) console.log(k + ":", words[k].split(" ").length);
console.log("index.html", (out.length / 1024).toFixed(0) + " KB");
