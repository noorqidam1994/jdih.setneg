import formidable from "formidable";
import connectionHandler from '../../lib/connection-handler';
import fs from "fs";
const sprintf = require ('sprintf');
  
export const config = {
  api: {
    bodyParser: false
  }
};

const saveFile = async (file, kd) => {
  const data = fs.readFileSync(file.path);
  fs.writeFileSync(`${process.env.NEXT_APP_JDIH_PATH + `filekontak/` + kd}/${file.name}`, data);
  fs.unlinkSync(file.path);
  return;
};

  async function handler(req, res) {
    if (req.method === "POST" && req.body.ket == 'inpdata') {
      const arrayData = [];

        for (let item_p of req.body.dt) {
          arrayData.push({
            idkontak: item_p.idkontak,
            nama: capitalizeFirstLetter(item_p.nama),
            email: item_p.email,
            telp_kontak: item_p.telp_kontak,
            pesan: item_p.pesan,
            tanggal: item_p.tanggal,
            balas: null
            });
        }
      await req.db('kontak').insert(arrayData);
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ stt: 'Succsess' }));
    } else {
    const form = new formidable.IncomingForm();
    const regdb = await req.db.raw('SELECT MAX(RIGHT(idkontak,4)) AS idmax FROM kontak');
    let idmx = regdb[0][0]['idmax'];
    let jdkd;
    let temp = parseInt(idmx) + 1;
    let kd = sprintf("%04s", temp);
    if (kd !== '0NaN') {
      jdkd = "K" + kd;
    } else {
      jdkd = "K0001";
    }
    form.parse(req, async function (err, fields, files) {
      const kurukx = ([{
        idkontak: jdkd,
        nama: escapeHtml(fields.nama),
        email: escapeHtml(fields.email),
        telp_kontak: escapeHtml(fields.telp),
        pesan: escapeHtml(fields.pesan),
        tanggal: fields.tanggal,
        balas: null
      }]);
      if(files.file != null) {
      const dir = process.env.NEXT_APP_JDIH_PATH + 'filekontak/' + jdkd;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, 0o775);
      }
      saveFile(files.file, jdkd);
      }
      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(kurukx));
    });
  }
}

  function escapeHtml(str) {
    if (typeof str != 'string')
          return str;
  
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
              case "\"":
              case "'":
              case "\\":
              case "%":
                  return "\\"+char; 
          }
      });
  }

  function capitalizeFirstLetter(str) {
    var pieces = str.split(" ");
    for ( var i = 0; i < pieces.length; i++ )
    {
        var j = pieces[i].charAt(0).toUpperCase();
        pieces[i] = j + pieces[i].substr(1);
    }
    return pieces.join(" ");
  }

  function hasSpace(sentence) {
    return /\\s/g.test(sentence);
  }

 export default connectionHandler()(handler);