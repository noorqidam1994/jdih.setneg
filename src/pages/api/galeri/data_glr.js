import connectionHandler from '../../../lib/connection-handler';
const path = require('path');
const fs = require('fs');

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      let v = req.body.ket;
      const regdb = req.db.select('*').from('galeri')
      let result;
      if (req.body.ket === '') {
        result = await regdb.clone()
      } else {
        result = await regdb.clone().where('idgaleri', req.body.ket)
      }
      
      const allImg = [];
      if(result.length > 0) {
        result.forEach(function(itm, id) {
          let dir = process.env.NEXT_APP_JDIH_PATH+"Galeri/"+itm.idgaleri;
          const krm = [];
          fileList(dir).forEach(function(x){
            krm.push({file: x.file, ext: x.ext});
          });
          allImg.push({id: itm.idgaleri, judul: itm.nama_folder, tgl: itm.tgl_create, img: krm});
        })
      }
      res.status(200)
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(allImg));
    } else {
      return res.status(404).end();
    }
  } catch (err) {
      return res.status(500).send({error: 'Oops! Something went wrong!'});
  }
}

export function fileList(dir) {
    if (fs.existsSync(dir)){
    return fs.readdirSync(dir).reduce(function(list, file) {
      const name = path.join(dir, file);
      const isDir = fs.statSync(name).isDirectory();
      const ext = path.extname(file);
      const size = fs.statSync(name).size;
      let arrayExtensions = [".jpg" , ".jpeg", ".png", ".bmp", ".gif"];
      let extJd;
      if (arrayExtensions.lastIndexOf(ext) === -1) {
        extJd = "video"
      } else {
        extJd = "photo"
      }
      return list.concat(isDir ? fileList(name) : [{ext: extJd, file: file, size : size}]);
    }, []);
    } return []
  }

  export default connectionHandler()(handler);