import connectionHandler from '../../../lib/connection-handler';
const path = require('path');
const fs = require('fs');

const handler = async (req, res) => {
    try {
        if(req.method === 'POST') {
            // Check if table exists first
            const tableExists = await req.db.schema.hasTable('putusan_pengadilan');
            
            if (!tableExists) {
                // Return empty data if table doesn't exist
                return res.status(200).json({data: [], jml: 0});
            }

            if(req.body.k === '') {
                // Search/listing functionality
                const length = parseInt(req.body.length) || 10;
                const start = parseInt(req.body.start) || 0;
                const tentang = req.body.tentang || '';
                const jnsArray = req.body.jns || [];
                const thnArray = req.body.thn || [];
                
                let query = req.db
                    .select('idputusan', 'nomor_putusan', 'jenis_putusan', 'tahun_putusan', 'judul_putusan')
                    .from('putusan_pengadilan');

                // Add jenis filter if provided
                if (Array.isArray(jnsArray) && jnsArray.length > 0) {
                    query = query.whereIn('jenis_putusan', jnsArray);
                }

                // Add tahun filter if provided
                if (Array.isArray(thnArray) && thnArray.length > 0) {
                    query = query.whereIn('tahun_putusan', thnArray);
                }

                // Add tentang filter if provided
                if (tentang && tentang.length > 0) {
                    const searchTerm = tentang.replace('%20', ' ').replace('#', '');
                    query = query.where('judul_putusan', 'like', `%${searchTerm}%`);
                }

                const hslResult = await query.clone().limit(length).offset(start);
                const allResult = await query.clone();
                
                res.status(200).json({data: hslResult, jml: allResult.length});
            } else {
                // Detail functionality
                const result = await req.db.select()
                    .from('putusan_pengadilan')
                    .where('jenis_putusan', req.body.jns)
                    .andWhere('nomor_putusan', req.body.no)
                    .andWhere('tahun_putusan', req.body.thn)
                    .groupBy('idputusan')
                    .first();

                if (!result) {
                    return res.status(404).json({error: 'Data not found'});
                }

                let nomor = result.nomor_putusan.replace(/\//g, "_");
                let dir = process.env.NEXT_APP_JDIH_PATH ? process.env.NEXT_APP_JDIH_PATH + 'Putusanpengadilan/' + nomor : '';
                const jmlFile = fileList(dir);
                const arrayFile = [];
                for (let item_file of jmlFile) {
                    if (item_file.ext === '.pdf') {
                        arrayFile.push({
                            name: capitalizeTheFirstLetterOfEachWord(item_file.file), 
                            size: item_file.size, 
                            ext: item_file.ext, 
                            realName: item_file.file
                        });
                    }
                }

                let dirAbstrak = process.env.NEXT_APP_JDIH_PATH ? process.env.NEXT_APP_JDIH_PATH + 'Abstrak/' + nomor : '';
                const jmlFileabsrk = fileList(dirAbstrak);
                const arrayFileabsrk = [];
                for (let item_fileabsrk of jmlFileabsrk) {
                    if (item_fileabsrk.ext === '.pdf') {
                        arrayFileabsrk.push({
                            name: capitalizeTheFirstLetterOfEachWord(item_fileabsrk.file), 
                            size: item_fileabsrk.size, 
                            ext: item_fileabsrk.ext, 
                            realName: item_fileabsrk.file
                        });
                    }
                }

                res.status(200).json({data: [result], file: arrayFile, v: arrayFileabsrk});
            }
        } else {
            return res.status(405).json({error: 'Method not allowed'});
        }
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({error: 'Internal server error', details: err.message});
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