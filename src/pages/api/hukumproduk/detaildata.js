import connectionHandler from '../../../lib/connection-handler';
const path = require('path');
const fs = require('fs');

const handler = async (req, res) => {
  try {
  if(req.body.k === '' && req.method === 'POST') {
    const result = await req.db
    .select('a.idperaturan', 'a.no_peraturan', 'a.tahun', 'a.tgl_di', 'a.diundangkan', 'a.tentang', 'a.ln', 'a.tln', 'a.keterangan', 'b.idjenis', 'b.jns', 'b.nama_jenis', 'b.status', 'a.terkait', 'a.mengubah', 'a.mencabut', 'a.diubah', 'a.dicabut', 'a.diubah_sebagian', 'a.dicabut_sebagian',
    req.db.raw(`
        (a.mengubah_sebagian) AS mngbh_s, (a.mencabut_sebagian) AS mcbt_s,
        ExtractValue(a.mencabut_sebagian, '//span//@id') AS mencabutsebagian,
        ExtractValue(a.mengubah_sebagian, '//span//@id') AS mengubahsebagian
    `))
    .from('peraturan as a')
    .leftJoin('jenis as b', 'a.idjenis', 'b.idjenis')
    .where('b.jns', req.body.jns)
    .andWhere('a.no_peraturan', req.body.no)
    .andWhere('a.tahun', req.body.thn)
    .andWhere('a.publish', 1)
    .groupBy('a.idperaturan')
    .timeout(1000, {cancel: true})

    const arrayFile = []
    let dir = process.env.NEXT_APP_JDIH_PATH+'uploads/'+result[0].idperaturan;
    const file_d = fileList(dir);
      for (let item_file of file_d) {
        if(item_file.ext === '.pdf') {
        arrayFile.push({name: capitalizeTheFirstLetterOfEachWord(item_file.file), size: item_file.size, ext: item_file.ext, realName: item_file.file});
        }
      }
    res.status(200)
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({row: result, file: arrayFile, v: arrayFile.length}));
} 
else if(req.body.k === 'Pohon' && req.method === 'POST') {
    const result = await req.db
    .select('a.idperaturan', 'a.no_peraturan', 'a.tahun', 'a.tgl_di', 'a.diundangkan', 'a.tentang', 'a.ln', 'a.tln', 'a.keterangan', 'b.idjenis', 'b.jns', 'b.nama_jenis', 'b.status', 'a.terkait', 'a.mengubah', 'a.mencabut', 'a.diubah', 'a.dicabut', 'a.diubah_sebagian', 'a.dicabut_sebagian',
    req.db.raw(`
        (a.mengubah_sebagian) AS mngbh_s, (a.mencabut_sebagian) AS mcbt_s,
        ExtractValue(a.mencabut_sebagian, '//span//@id') AS mencabutsebagian,
        ExtractValue(a.mengubah_sebagian, '//span//@id') AS mengubahsebagian
    `))
    .from('peraturan as a')
    .leftJoin('jenis as b', 'a.idjenis', 'b.idjenis')
    .where('a.idperaturan', req.body.idp)
    .andWhere('a.publish', 1)
    .groupBy('a.idperaturan')
    .timeout(1000, {cancel: true})
    res.status(200)
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({row: result}));
}
else if(req.body.k === 'StatusFooter') {
  const arrayData = [];
  let questionMarks = "";
  const values = [];
  const rows = req.body.arrData
  rows.forEach(function(value, index){
    questionMarks += "("
    Object.keys(value).forEach(function(x){
         questionMarks += "?, ";
         values.push(value[x]);
    });
    questionMarks = questionMarks.substr(0, questionMarks.length - 2);
    questionMarks += "), ";
  });
  questionMarks = questionMarks.substr(0, questionMarks.length - 2); 
    if(rows.length > 0) {
    const insert = await req.db
    .raw("INSERT INTO download_view (`iddownloadview`, `idperaturan`, `browser`, `os`, `ip`, `wilayah`, `negara`, `saat_ini`, `keterangan`, `tanggal`, `front_back`, `user`) VALUES " + questionMarks + " ON DUPLICATE KEY UPDATE saat_ini = VALUES(`saat_ini`)", values)
    if(insert[0].affectedRows > 0) {
    const query = await req.db
    .select('idperaturan', req.db.raw(`
          SUM(CASE WHEN keterangan='lihat' AND saat_ini = '1' THEN 1 ELSE 0 END) AS online,
          SUM(CASE WHEN keterangan='lihat' THEN 1 ELSE 0 END) AS lihat,
          SUM(CASE WHEN keterangan='unduh' THEN 1 ELSE 0 END) AS unduh,
          SUM(CASE WHEN keterangan='suka' THEN 1 ELSE 0 END) AS suka,
          SUM(CASE WHEN keterangan='tidak' THEN 1 ELSE 0 END) AS tidak
          `))
    .from('download_view')
    .where('idperaturan', req.body.idperaturan)
    .groupBy('idperaturan')
    .timeout(1000, {cancel: true})
    if(query.length > 0) {
      arrayData.push({id: query[0].idperaturan, online: singkatNumber(query[0].online), lihat: singkatNumber(query[0].lihat), unduh: singkatNumber(query[0].unduh), suka: singkatNumber(query[0].suka), tidak: singkatNumber(query[0].tidak)})
    }
    }
    }
    res.status(200)
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({row: arrayData}));
} 
else if(req.body.k === 'SelectFooter') {
  let arrayData;
  const resx = req.db
    .select('idperaturan', req.db.raw(` 
          SUM(CASE WHEN keterangan='lihat' AND saat_ini = '1' THEN 1 ELSE 0 END) AS Online,
          SUM(CASE WHEN keterangan='lihat' THEN 1 ELSE 0 END) AS Lihat,
          SUM(CASE WHEN keterangan='unduh' THEN 1 ELSE 0 END) AS Unduh,
          SUM(CASE WHEN keterangan='suka' THEN 1 ELSE 0 END) AS Suka,
          SUM(CASE WHEN keterangan='tidak' THEN 1 ELSE 0 END) AS Tidak`))
    .from('download_view')
    .groupBy('idperaturan')
    .timeout(1000, {cancel: true})
      const arrIn = [];
      const resultData = await resx.clone().whereIn('idperaturan', req.body.idperaturan)
      for (let item_p of resultData) {
        arrIn.push({id: item_p.idperaturan, online: singkatNumber(item_p.Online), lihat: singkatNumber(item_p.Lihat), unduh: singkatNumber(item_p.Unduh), suka: singkatNumber(item_p.Suka), tidak: singkatNumber(item_p.Tidak)})
      }
      arrayData = arrIn
    res.status(200)
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({row: arrayData}));
  }
  else if(req.body.k === 'SelectCounter') {
    let arrayData;
    const resx = req.db
      .select(req.db.raw(` 
            SUM(CASE WHEN keterangan='lihat' AND saat_ini = '1' THEN 1 ELSE 0 END) AS Online,
            SUM(CASE WHEN keterangan='lihat' THEN 1 ELSE 0 END) AS Lihat,
            SUM(CASE WHEN keterangan='unduh' THEN 1 ELSE 0 END) AS Unduh,
            SUM(CASE WHEN keterangan='suka' THEN 1 ELSE 0 END) AS Suka,
            SUM(CASE WHEN keterangan='tidak' THEN 1 ELSE 0 END) AS Tidak`))
      .from('download_view')
      .timeout(1000, {cancel: true})
        const resultDataHit = await resx.clone()
        arrayData = [{onlinehit: singkatNumber(resultDataHit[0].Online), lihathit: singkatNumber(resultDataHit[0].Lihat), unduhhit: singkatNumber(resultDataHit[0].Unduh), sukahit: singkatNumber(resultDataHit[0].Suka), tidakhit: singkatNumber(resultDataHit[0].Tidak)}]
      res.status(200)
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({row: arrayData}));
    }
  } catch (err) {
    console.error('Database Error:', err);
    return res.status(500).send({error: 'Database connection failed', details: err.message});
  }
  }

  export function singkatNumber(labelValue) {
    return Math.abs(Number(labelValue)) >= 1.0e+9
    ? Math.abs(Number(labelValue)) / 1.0e+9 + "M"
    : Math.abs(Number(labelValue)) >= 1.0e+6
    ? Math.abs(Number(labelValue)) / 1.0e+6 + "Jt"
    : Math.abs(Number(labelValue)) >= 1.0e+3
    ? Math.abs(Number(labelValue)) / 1.0e+3 + "Rb"
    : Math.abs(Number(labelValue));
  }

  export function fileList(dir) {
    if (fs.existsSync(dir)){
    return fs.readdirSync(dir).reduce(function(list, file) {
      const name = path.join(dir, file);
      const isDir = fs.statSync(name).isDirectory();
      const ext = path.extname(file);
      const size = fs.statSync(name).size;
      return list.concat(isDir ? fileList(name) : [{ext: ext, file: file, size : size}]);
    }, []);
    } return []
  }

  function capitalizeTheFirstLetterOfEachWord(words) {
    var separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
       separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
       separateWord[i].substring(1);
    }
    return separateWord.join(' ');
 }
  
  export default connectionHandler()(handler);
