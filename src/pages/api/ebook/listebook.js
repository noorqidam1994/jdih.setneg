import connectionHandler from "../../../lib/connection-handler";
const path = require("path");
const fs = require("fs");

const handler = async (req, res) => {
  try {
    if (req.method === "POST" && req.body.k === "") {
      // Check if table exists first
      const tableExists = await req.db.schema.hasTable("ebook");

      if (!tableExists) {
        // Return empty data if table doesn't exist
        return res.status(200).json({ data: [], jml: 0 });
      }

      let hslResult,
        allResult,
        length = parseInt(req.body.length) || 10,
        start = parseInt(req.body.start) || 0;

      if (!req.db) {
        return res
          .status(500)
          .json({ error: "Database connection not available" });
      }

      const resulData = req.db
        .select()
        .from("ebook")
        .timeout(1000, { cancel: true });
      hslResult = await resulData.clone().limit(length).offset(start);
      allResult = await resulData.clone();
      const arrayData = [];
      for (let i = 0; i < hslResult.length; i++) {
        let filex;
        let dir =
          process.env.NEXT_APP_JDIH_PATH + "e_book/" + hslResult[i].idebook;
        const jmlFile = fileList(dir);
        const arrayFile = [];
        for (let item_file of jmlFile) {
          if (item_file.ext === ".pdf") arrayFile.push(item_file.file);
        }
        arrayData.push({
          idebook: hslResult[i].idebook,
          judul: hslResult[i].judul,
          tanggal: hslResult[i].tanggal,
          page: hslResult[i].page,
          lihat: hslResult[i].lihat,
          unduh: hslResult[i].unduh,
          file_jj: arrayFile,
        });
      }
      res.status(200);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ data: arrayData, jml: allResult.length }));
    } else if (req.method === "POST" && req.body.k !== "Kedua") {
      // Check if table exists first
      const tableExists = await req.db.schema.hasTable("ebook");

      if (!tableExists) {
        // Return empty data if table doesn't exist
        return res.status(200).json({ data: [], lihat: 0 });
      }

      if (!req.db) {
        return res
          .status(500)
          .json({ error: "Database connection not available" });
      }

      let lht = parseInt(req.body.lht) + 1;
      let order_id = req.body.id;
      const up = await req
        .db("ebook")
        .increment("lihat", 1)
        .where("idebook", order_id);
      res.status(200);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ data: up, lihat: lht }));
    } else {
      res.status(405).json({ error: "Method not allowed" });
    }
  } catch (err) {
    console.error("API Error:", err);
    return res
      .status(500)
      .json({ error: "Database connection failed", details: err.message });
  }
};

export function singkatNumber(labelValue) {
  return Math.abs(Number(labelValue)) >= 1.0e9
    ? Math.abs(Number(labelValue)) / 1.0e9 + "M"
    : Math.abs(Number(labelValue)) >= 1.0e6
    ? Math.abs(Number(labelValue)) / 1.0e6 + "Jt"
    : Math.abs(Number(labelValue)) >= 1.0e3
    ? Math.abs(Number(labelValue)) / 1.0e3 + "Rb"
    : Math.abs(Number(labelValue));
}

export function fileList(dir) {
  if (fs.existsSync(dir)) {
    return fs.readdirSync(dir).reduce(function (list, file) {
      const name = path.join(dir, file);
      const isDir = fs.statSync(name).isDirectory();
      const ext = path.extname(file);
      const size = fs.statSync(name).size;
      return list.concat(
        isDir ? fileList(name) : [{ ext: ext, file: file, size: size }]
      );
    }, []);
  }
  return [];
}

function capitalizeTheFirstLetterOfEachWord(words) {
  var separateWord = words.toLowerCase().split(" ");
  for (var i = 0; i < separateWord.length; i++) {
    separateWord[i] =
      separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1);
  }
  return separateWord.join(" ");
}

export default connectionHandler()(handler);
