import connectionHandler from '../../lib/connection-handler';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const idsurvei = req.body.idsurvei
      const arrayInput = []
      let questionMarks = "";
      const values = [];
      idsurvei.forEach((ids, i) => {
        let pch = req.body.jawaban
        arrayInput.push({
          idhasil:req.body.user_email+i,
          idsurvei: ids, 
          tanggal_survei: req.body.tanggal_survei, 
          ip_user: req.body.ip_user, 
          wilayah: req.body.wilayah,
          jawaban: pch[i],
          catatan: escapeHtml(req.body.catatan),
          user_email: escapeHtml(req.body.user_email),
          user_nama: escapeHtml(req.body.user_nama),
        })
      });
      arrayInput.forEach(function(value, index){
        questionMarks += "("
        Object.keys(value).forEach(function(x){
             questionMarks += "?, ";
             values.push(value[x]);
        });
        questionMarks = questionMarks.substr(0, questionMarks.length - 2);
        questionMarks += "), ";
      });
      questionMarks = questionMarks.substr(0, questionMarks.length - 2);
      await req.db.raw("INSERT INTO hasil_survei (`idhasil`, `idsurvei`, `tanggal_survei`, `ip_user`, `wilayah`, `jawaban`, `catatan`, `user_email`, `user_nama`) VALUES " + questionMarks + " ON DUPLICATE KEY UPDATE catatan = VALUES(`catatan`), jawaban = VALUES(`jawaban`)", values)
      res.status(200)
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'max-age=180000');
      res.end(JSON.stringify(questionMarks));
    } else {
      return res.status(404).end();
    }
  } catch (err) {
      return res.status(500).send({error: 'Oops! Something went wrong!'});
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

export default connectionHandler()(handler);