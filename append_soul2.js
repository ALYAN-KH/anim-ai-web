const fs = require("fs");
const p = "D:\\hf\\src\\components\\Banners.tsx";
let s = fs.readFileSync(p, "utf8");
// remove previous SoulCinema function
const idx = s.indexOf("\nexport function SoulCinema()");
if (idx !== -1) s = s.slice(0, idx) + "\n";
const links = [
  "https://assets.higgsfield.ai/tanstack/assets/868a8dba-z_ugVDsbsOO5mZOO.css",
  "https://assets.higgsfield.ai/tanstack/assets/868a8dba-E1YLuCUgMSHbtIGp.css",
  "https://assets.higgsfield.ai/tanstack/assets/868a8dba-s4gVVUdnEnLwSIzd.css",
  "https://assets.higgsfield.ai/tanstack/assets/868a8dba-v2IlITZYB7Bne3xI.css",
  "https://assets.higgsfield.ai/tanstack/assets/868a8dba-mY5KM0Oc_ZtnvvTL.css",
  "https://assets.higgsfield.ai/tanstack/assets/868a8dba-dgacuv-uC6qF5eMK.css",
  "https://assets.higgsfield.ai/tanstack/assets/868a8dba-_-k8dMBGpNL7CGL4.css",
  "https://assets.higgsfield.ai/tanstack/assets/868a8dba-vBfuva7Ya2N2ez0e.css",
  "https://assets.higgsfield.ai/tanstack/assets/868a8dba-jR28g5ewL6SfHlYp.css",
  "https://assets.higgsfield.ai/tanstack/assets/868a8dba-YAgEB4r_H6wD58TW.css",
  "https://assets.higgsfield.ai/tanstack/assets/868a8dba-mlSkBlGhiqFYyi3t.css",
  "https://assets.higgsfield.ai/tanstack/assets/868a8dba-BuyzeC2SU5O_TzNE.css",
  "https://assets.higgsfield.ai/tanstack/assets/868a8dba-MRX-FsI-uA-n4rk4.css",
].map(u => `    <link rel="stylesheet" href="${u}" />`).join("\n");
const add = `
export function SoulCinema() {
  return (
    <>
${links}
      <section id="soul-cinema-community" dangerouslySetInnerHTML={{ __html: soulCinemaCapturedHtml }} />
    </>
  );
}
`;
s += add;
fs.writeFileSync(p, s);
console.log("done");
`