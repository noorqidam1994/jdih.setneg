const path = require("path");
const fs = require("fs");
import connectionHandler from "../../../lib/connection-handler";

const handler = async (req, res) => {
  try {
    if (req.method === "POST") {
      let sql_x,
        tentang,
        tentangHaving,
        orderUrut,
        jns,
        thn,
        terx,
        status,
        statusUji,
        length = parseInt(req.body.length),
        start = parseInt(req.body.start);
      let cariPch = req.body.tentang.split("%20").join(" ").split("#").join("");

      if (cariPch !== "") {
        let qry = cariPch.trim();
        if (qry.length === 0) {
          return false;
        }
        qry = limitChars(qry);
        let scoreFullJenis = 10;
        let scoreJenisKeyword = 9;
        let scoreFullNamaJenis = 8;
        let scoreNamaJenisKeyword = 7;
        let scoreFullNomor = 6;
        let scoreNomorKeyword = 5;
        let scoreFullTahun = 4;
        let scoreTahunKeyword = 3;
        let scoreFullTentang = 2;
        let scoreTentangKeyword = 1;

        let keywords = filterSearchKeys(qry);
        let escQuery = escapeHtml(qry);
        let jenisSQL = [];
        let namajenisSQL = [];
        let nomorSQL = [];
        let tahunSQL = [];
        let tentangSQL = [];

        if (keywords.length > 1) {
          jenisSQL.push(`if (b.jns = '${escQuery}', ${scoreFullJenis}, 0)`);
          namajenisSQL.push(
            `if (b.nama_jenis = '${titleCase(
              escQuery
            )}', ${scoreFullNamaJenis}, 0)`
          );
          nomorSQL.push(
            `if (ABS(a.no_peraturan) = '${escQuery}', ${scoreFullNomor}, 0)`
          );
          tahunSQL.push(`if (a.tahun = '${escQuery}', ${scoreFullTahun}, 0)`);
          tentangSQL.push(
            `if (a.tentang = '${escQuery}', ${scoreFullTentang}, 0)`
          );
        }

        for (const key of keywords) {
          let item = escapeHtml(key);
          jenisSQL.push(`if (b.jns = '${item}', ${scoreJenisKeyword}, 0)`);
          namajenisSQL.push(
            `if (b.nama_jenis = '${titleCase(
              item
            )}', ${scoreNamaJenisKeyword}, 0)`
          );
          nomorSQL.push(
            `if (ABS(a.no_peraturan) = '${item}', ${scoreNomorKeyword}, 0)`
          );
          tahunSQL.push(`if (a.tahun = '${item}', ${scoreTahunKeyword}, 0)`);
          tentangSQL.push(
            `if (a.tentang = '${item}', ${scoreTentangKeyword}, 0)`
          );
        }

        if (jenisSQL.length === 0) {
          jenisSQL.push(0);
        }
        if (namajenisSQL.length === 0) {
          namajenisSQL.push(0);
        }
        if (nomorSQL.length === 0) {
          nomorSQL.push(0);
        }
        if (tahunSQL.length === 0) {
          tahunSQL.push(0);
        }
        if (tentangSQL.length === 0) {
          tentangSQL.push(0);
        }
        sql_x =
          `, ((` +
          jenisSQL.join(" + ") +
          `) + (` +
          namajenisSQL.join(" + ") +
          `) + (` +
          nomorSQL.join(" + ") +
          `) + (` +
          tahunSQL.join(" + ") +
          `) + (` +
          tentangSQL.join(" + ") +
          `)) as relevance`;
      } else {
        sql_x = "";
      }

      if (req.body.jns.length !== 0) {
        const inClauseJns = req.body.jns.map((j) => `'${j}'`).join(", ");
        jns = `b.jns IN (` + inClauseJns + `)`;
      } else {
        jns = "";
      }
      if (req.body.thn.length !== 0) {
        const inClauseThn = req.body.thn.map((t) => `'${t}'`).join(", ");
        thn = `a.tahun IN (` + inClauseThn + `)`;
      } else {
        thn = "";
      }

      if (req.body.status !== "" && req.body.status === "Uji_Materil") {
        statusUji = `INNER JOIN uji_materi u ON u.idperaturan=a.idperaturan`;
      } else {
        statusUji = "";
      }
      if (req.body.status !== "" && req.body.status === "Dicabut") {
        status = `a.dicabut != ''`;
      } else if (req.body.status !== "" && req.body.status === "Diubah") {
        status = `a.diubah != ''`;
      } else if (req.body.status !== "" && req.body.status === "Mencabut") {
        status = `a.mencabut != ''`;
      } else if (req.body.status !== "" && req.body.status === "Mengubah") {
        status = `a.mengubah != ''`;
      } else {
        status = "";
      }

      if (
        cariPch !== "" &&
        req.body.p_lihan === "semua" &&
        req.body.terx === "Terbaru"
      ) {
        let spaceCount = cariPch.split(" ").length - 1,
          jorder;
        if (spaceCount > 0) {
          jorder = `relevance desc, a.tgl_publish desc, a.tahun desc, b.idjenis, ABS(a.no_peraturan) desc, a.idperaturan desc`;
        } else {
          jorder = `a.tgl_publish desc, a.tahun desc, b.idjenis, ABS(a.no_peraturan) desc, a.idperaturan desc, relevance desc`;
        }
        tentangHaving = `relevance > 0`;
        orderUrut = jorder;
        tentang = "";
      } else if (
        cariPch !== "" &&
        req.body.p_lihan === "tentang" &&
        req.body.terx === "Terbaru"
      ) {
        let spaceCount = cariPch.split(" ").length - 1,
          jorder;
        if (spaceCount > 0) {
          jorder = `relevance desc, a.tgl_publish desc, a.tahun desc, b.idjenis, ABS(a.no_peraturan) desc, a.idperaturan desc`;
        } else {
          jorder = `a.tgl_publish desc, a.tahun desc, b.idjenis, ABS(a.no_peraturan) desc, a.idperaturan desc, relevance desc`;
        }
        tentangHaving = `relevance > 0`;
        orderUrut = jorder;
        tentang = "";
      } else if (
        cariPch !== "" &&
        req.body.p_lihan === "nomor" &&
        req.body.terx === "Terbaru"
      ) {
        tentangHaving = `relevance > 0`;
        orderUrut = `relevance desc, a.tgl_publish desc, a.tahun desc, b.idjenis, ABS(a.no_peraturan) desc, a.idperaturan desc`;
      } else if (cariPch === "" && req.body.terx === "Terbaru") {
        tentangHaving = "";
        tentang = "";
        orderUrut = `a.tgl_publish desc, a.tahun desc, b.idjenis asc, ABS(a.no_peraturan) desc, a.idperaturan desc`;
      } else if (
        cariPch !== "" &&
        req.body.p_lihan === "semua" &&
        req.body.terx === "Terpopuler"
      ) {
        let spaceCount = cariPch.split(" ").length - 1,
          jorder;
        if (spaceCount > 0) {
          jorder = `relevance desc, Lihat desc, a.tgl_publish desc, a.tahun desc, b.idjenis asc, ABS(a.no_peraturan) desc, a.idperaturan desc`;
        } else {
          jorder = `Lihat desc, a.tgl_publish desc, a.tahun desc, b.idjenis asc, ABS(a.no_peraturan) desc, a.idperaturan desc, relevance desc`;
        }
        tentangHaving = `relevance > 0`;
        orderUrut = jorder;
        tentang = "";
      } else if (
        cariPch !== "" &&
        req.body.p_lihan === "tentang" &&
        req.body.terx === "Terpopuler"
      ) {
        let spaceCount = cariPch.split(" ").length - 1,
          jorder;
        if (spaceCount > 0) {
          jorder = `relevance desc, Lihat desc, a.tgl_publish desc, a.tahun desc, b.idjenis asc, ABS(a.no_peraturan) desc, a.idperaturan desc`;
        } else {
          jorder = `Lihat desc, a.tgl_publish desc, a.tahun desc, b.idjenis asc, ABS(a.no_peraturan) desc, a.idperaturan desc, relevance desc`;
        }
        tentangHaving = `relevance > 0`;
        orderUrut = jorder;
        tentang = "";
      } else if (
        cariPch !== "" &&
        req.body.p_lihan === "nomor" &&
        req.body.terx === "Terpopuler"
      ) {
        tentangHaving = `relevance > 0`;
        orderUrut = `relevance desc, Lihat desc, a.tgl_publish desc, a.tahun desc, b.idjenis asc, ABS(a.no_peraturan) desc, a.idperaturan desc`;
      } else if (cariPch === "" && req.body.terx === "Terpopuler") {
        tentangHaving = "";
        tentang = "";
        orderUrut = `Lihat desc, a.tgl_publish desc, a.tahun desc, b.idjenis asc, ABS(a.no_peraturan) desc, a.idperaturan desc`;
      } else if (
        cariPch !== "" &&
        req.body.p_lihan === "semua" &&
        req.body.terx === "All"
      ) {
        let spaceCount = cariPch.split(" ").length - 1,
          jorder;
        if (spaceCount > 0) {
          jorder = `relevance desc, a.tahun desc, b.idjenis asc, ABS(a.no_peraturan) desc, a.idperaturan desc`;
        } else {
          jorder = `a.tahun desc, b.idjenis asc, ABS(a.no_peraturan) desc, a.idperaturan desc, relevance desc`;
        }
        tentangHaving = `relevance > 0`;
        orderUrut = jorder;
        tentang = "";
      } else if (
        cariPch !== "" &&
        req.body.p_lihan === "tentang" &&
        req.body.terx === "All"
      ) {
        let spaceCount = cariPch.split(" ").length - 1,
          jorder;
        if (spaceCount > 0) {
          jorder = `relevance desc, a.tahun desc, b.idjenis asc, ABS(a.no_peraturan) desc, a.idperaturan desc`;
        } else {
          jorder = `a.tahun desc, b.idjenis asc, ABS(a.no_peraturan) desc, a.idperaturan desc, relevance desc`;
        }
        tentangHaving = `relevance > 0`;
        orderUrut = jorder;
        tentang = "";
      } else if (
        cariPch !== "" &&
        req.body.p_lihan === "nomor" &&
        req.body.terx === "All"
      ) {
        tentangHaving = `relevance > 0`;
        orderUrut = `relevance desc, a.tahun desc, b.idjenis asc, ABS(a.no_peraturan) desc, a.idperaturan desc`;
      } else {
        tentangHaving = "";
        tentang = "";
        orderUrut = `a.tahun desc, b.idjenis asc, ABS(a.no_peraturan) desc, a.idperaturan desc`;
      }

      const resulData = req.db
        .select(
          "a.idperaturan",
          "a.no_peraturan",
          "a.tahun",
          "a.tentang",
          "b.jns",
          "b.nama_jenis",
          req.db
            .raw(`SUM(CASE WHEN c.keterangan='lihat' AND c.saat_ini = '1' THEN 1 ELSE 0 END) AS Online,
      SUM(CASE WHEN c.keterangan='lihat' THEN 1 ELSE 0 END) AS Lihat,
      SUM(CASE WHEN c.keterangan='unduh' THEN 1 ELSE 0 END) AS Unduh,
      SUM(CASE WHEN c.keterangan='suka' THEN 1 ELSE 0 END) AS Suka,
      SUM(CASE WHEN c.keterangan='tidak' THEN 1 ELSE 0 END) AS Tidak${sql_x}`)
        )
        .from("peraturan as a")
        .leftJoin("jenis as b", "a.idjenis", "b.idjenis")
        .leftJoin("download_view as c", "a.idperaturan", "c.idperaturan")
        .modify(function(queryBuilder) {
          if (statusUji) queryBuilder.joinRaw(statusUji);
        })
        .where("a.publish", 1)
        .modify(function(queryBuilder) {
          if (jns) queryBuilder.whereRaw(jns);
          if (thn) queryBuilder.whereRaw(thn);
          if (status) queryBuilder.whereRaw(status);
        })
        .groupBy(
          "a.idperaturan",
          "a.idperaturan",
          "a.no_peraturan",
          "a.tahun",
          "a.tentang",
          "b.jns",
          "b.nama_jenis"
        )
        .havingRaw(tentangHaving)
        .orderByRaw(orderUrut)
        .timeout(1000, { cancel: true });
      let check1 = await resulData.clone().limit(length).offset(start);
      let hslResult, allResult, liakko;
      if (check1.length > 1) {
        hslResult = check1;
        allResult = await resulData.clone();
        liakko = "";
      } else {
        if (cariPch !== "") {
          let qry = cariPch.trim();
          if (qry.length === 0) {
            return false;
          }
          qry = limitChars(qry);
          let scoreFullTentang = 5;
          let scoreTentangKeyword = 6;

          let keywords = filterSearchKeys(qry);
          let escQuery = escapeHtml(qry);
          let tentangSQL = [];

          if (keywords.length > 1) {
            tentangSQL.push(
              `if (a.tentang = '${escQuery}', ${scoreFullTentang}, 0)`
            );
          }

          for (const key of keywords) {
            let item = escapeHtml(key);
            tentangSQL.push(
              `if (a.tentang LIKE '%${item}%', ${scoreTentangKeyword}, 0)`
            );
          }
          if (tentangSQL.length === 0) {
            tentangSQL.push(0);
          }
          sql_x = `, ((` + tentangSQL.join(" + ") + `)) as relevance`;
        } else {
          sql_x = "";
        }
        const resulData = req.db
          .select(
            "a.idperaturan",
            "a.no_peraturan",
            "a.tahun",
            "a.tentang",
            "b.jns",
            "b.nama_jenis",
            req.db
              .raw(`SUM(CASE WHEN c.keterangan='lihat' AND c.saat_ini = '1' THEN 1 ELSE 0 END) AS Online,
          SUM(CASE WHEN c.keterangan='lihat' THEN 1 ELSE 0 END) AS Lihat,
          SUM(CASE WHEN c.keterangan='unduh' THEN 1 ELSE 0 END) AS Unduh,
          SUM(CASE WHEN c.keterangan='suka' THEN 1 ELSE 0 END) AS Suka,
          SUM(CASE WHEN c.keterangan='tidak' THEN 1 ELSE 0 END) AS Tidak${sql_x}`)
          )
          .from("peraturan as a")
          .leftJoin("jenis as b", "a.idjenis", "b.idjenis")
          .leftJoin("download_view as c", "a.idperaturan", "c.idperaturan")
          .modify(function(queryBuilder) {
            if (statusUji) queryBuilder.joinRaw(statusUji);
          })
          .where("a.publish", 1)
          .modify(function(queryBuilder) {
            if (jns) queryBuilder.whereRaw(jns);
            if (thn) queryBuilder.whereRaw(thn);
            if (status) queryBuilder.whereRaw(status);
          })
          .groupBy(
            "a.idperaturan",
            "a.idperaturan",
            "a.no_peraturan",
            "a.tahun",
            "a.tentang",
            "b.jns",
            "b.nama_jenis"
          )
          .havingRaw(tentangHaving)
          .orderByRaw(orderUrut)
          .timeout(1000, { cancel: true });
        hslResult = await resulData.clone().limit(length).offset(start);
        allResult = await resulData.clone();
        liakko = "saidebah";
      }

      var { arrayData, arrayData_xid, arrayData_xxid } = newFunctionArray();
      newFunctionResult(hslResult, arrayData, arrayData_xid, arrayData_xxid);
      res.status(200);
      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          data: hslResult,
          id_dt: arrayData_xid,
          jdid: arrayData_xxid,
          jml: allResult.length,
          jn: req.body.jns,
        })
      );
    } else {
      return res.status(404).end();
    }
  } catch (err) {
    const newLocal = err;
    return res.status(500).send({ error: newLocal });
  }
};

function newFunctionArray() {
  const arrayData = [];
  const arrayData_xid = [];
  const arrayData_xxid = [];
  return { arrayData, arrayData_xid, arrayData_xxid };
}

function newFunctionResult(result, arrayData, arrayData_xid, arrayData_xxid) {
  for (let item_p of result) {
    let dirxxxxx =
      process.env.NEXT_APP_JDIH_PATH + "uploads/" + item_p.idperaturan;
    const jmlFile = fileList(dirxxxxx);
    const arrayFile = [];
    let ixx = item_p.idperaturan;
    for (let item_file of jmlFile) {
      if (item_file.ext === ".pdf") arrayFile.push(item_file.file);
    }
    arrayData.push({
      idperaturan: item_p.idperaturan,
      no_peraturan: item_p.no_peraturan,
      tahun: item_p.tahun,
      tentang: item_p.tentang,
      jns: item_p.jns,
      nama_jenis: item_p.nama_jenis,
      file_jj: arrayFile.length,
    });
    arrayData_xid.push({
      id: ixx,
      online: singkatNumber(item_p.Online),
      lihat: singkatNumber(item_p.Lihat),
      unduh: singkatNumber(item_p.Unduh),
      suka: singkatNumber(item_p.Suka),
      tidak: singkatNumber(item_p.Tidak),
    });
    arrayData_xxid.push(ixx);
  }
}

function escapeHtml(str) {
  if (typeof str != "string") return str;

  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
      case "\0":
        return "\\0";
      case "\x08":
        return "\\b";
      case "\x09":
        return "\\t";
      case "\x1a":
        return "\\z";
      case "\n":
        return "\\n";
      case "\r":
        return "\\r";
      case '"':
      case "'":
      case "\\":
      case "%":
        return "\\" + char;
    }
  });
}

function titleCase(str) {
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(" ");
}

export function filterSearchKeys(qu) {
  let match = qu.replace(/(\s+)+/, " ");
  let words = [];
  let list = [
    "di",
    "itu",
    "sebuah",
    "dan",
    "dari",
    "atau",
    "saya",
    "kamu",
    "dia",
    "kami",
    "mereka",
    "untuk",
    "tapi",
    "bahwa",
    "ini",
    "kemudian",
    "/",
  ];
  let c = 0;
  let pch = match.split(" ");
  for (var i = 0; i < pch.length; i++) {
    if (list.includes(pch[i])) {
      continue;
    }
    words.push(pch[i]);
    if (c >= 15) {
      break;
    }
    c++;
  }
  return words;
}

export function limitChars(qu, lm = 200) {
  return qu.substring(0, lm);
}

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
      return list.concat(isDir ? fileList(name) : [{ ext: ext, file: file }]);
    }, []);
  }
  return [];
}

export default connectionHandler()(handler);
