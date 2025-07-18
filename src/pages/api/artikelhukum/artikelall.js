import connectionHandler from '../../../lib/connection-handler';
const path = require('path');
const fs = require('fs');

const handler = async (req, res) => {
    try {
        // Check if table exists first
        const tableExists = await req.db.schema.hasTable('artikel_hukum');
        
        if (!tableExists) {
            // Return empty data if table doesn't exist
            return res.status(200).json({data: [], jml: 0});
        }

        if(req.method === 'POST' && req.body.k === '') {
            let hslResult, allResult, jns, thn, jdl, length = parseInt(req.body.length), start = parseInt(req.body.start);
            let cariPch = req.body.tentang.split('%20').join(' ').split('#').join('');
            if (req.body.jns.length !== 0) {
              const inClauseJns = req.body.jns.map(j => `'${j}'`).join(', ');
              jns = `jenis_artikel IN (` + inClauseJns + `)`;
            } else { jns = ''; }
            if (req.body.thn.length !== 0) {
              const inClauseThn = req.body.thn.map(t => `'${t}'`).join(', ');
              thn = `tahun_terbit IN (` + inClauseThn + `)`;
            } else { thn = ''; }
            if (cariPch.length > 0) {
              const inClause = cariPch.split(',').map(c => `'${c}'`).join(', ');    
              jdl = `judul LIKE '%${req.body.tentang}%'`;
            } else {
              jdl = '';
            }
            const resulData = req.db
            .select('idartikelhukum', 'jenis_artikel', 'teu_artikel', 'judul', 'tahun_terbit')
            .from('artikel_hukum')
            .whereRaw(jns)
            .whereRaw(thn)
            .whereRaw(jdl)
            .timeout(1000, {cancel: true})
            hslResult = await resulData.clone().limit(length).offset(start)
            allResult = await resulData.clone()
        res.status(200)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({data: hslResult, jml: allResult.length}));
        } else {
          const result = await req.db.select()
          .from('artikel_hukum')
          .where('jenis_artikel', req.body.jns)
          .andWhere('judul', req.body.jdl)
          .andWhere('tahun_terbit', req.body.thn)
          .groupBy('idartikelhukum')
          .timeout(1000, {cancel: true})

          let dir = process.env.NEXT_APP_JDIH_PATH+'Artikelhukum/'+result[0].idartikelhukum;
          const jmlFile = fileList(dir);
          const arrayFile = [];
          for (let item_file of jmlFile) {
            if (item_file.ext === '.pdf')
            arrayFile.push({name: capitalizeTheFirstLetterOfEachWord(item_file.file), size: item_file.size, ext: item_file.ext, realName: item_file.file});
          }

              res.status(200)
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({data: result, file: arrayFile, v: 0}));
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