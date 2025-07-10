import connectionHandler from '../../lib/connection-handler';
const path = require('path');
const fs = require('fs');

const handler = async (req, res) => {
    try {
        if(req.method === 'POST') {
            let hslResult, allResult, length = parseInt(req.body.length), start = parseInt(req.body.start);
            const resulData = req.db.select()
            .from('putusan_pengadilan')
            .timeout(1000, {cancel: true})
            hslResult = await resulData.clone().limit(length).offset(start)
            allResult = await resulData.clone()
            const arrayData = [];

            for (let item_p of hslResult) {
                let gnti_r = item_p.nomor_putusan.replaceAll("/", "_");
                let dirxxxxx = process.env.NEXT_APP_JDIH_PATH + 'Putusanpengadilan/'+gnti_r;
                const jmlFile = fileList(dirxxxxx);
                const arrayFile = [];
                for (let item_file of jmlFile) {
                  if (item_file.ext === '.pdf')
                  arrayFile.push(item_file.file);
                }
                arrayData.push({
                    judul_putusan: item_p.judul_putusan,
                    teu: item_p.teu,
                    nomor_putusan: item_p.nomor_putusan,
                    tahun_putusan: item_p.tahun_putusan,
                    jns_peradilan: item_p.jns_peradilan,
                    singkatan_jns: item_p.singkatan_jns,
                    tempat: item_p.tempat,
                    tanggal_dibacakan: item_p.tanggal_dibacakan,
                    sumber: item_p.sumber,
                    subjek: item_p.subjek,
                    status: item_p.status,
                    bahasa: item_p.bahasa,
                    bidang: item_p.bidang,
                    lokasi: item_p.lokasi,
                    file: arrayFile
                });
              }
        res.status(200)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({data: arrayData, jml: allResult.length}));
        }
    } catch (err) {
        return res.status(500).send({error: 'Oops! Something went wrong!'});
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
