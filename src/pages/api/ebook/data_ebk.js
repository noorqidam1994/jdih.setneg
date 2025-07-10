const path = require('path');
const fs = require('fs');
const glob = require("glob")
const admz = require('adm-zip')
const moment = require('moment');

const handler = async (req, res) => {
   if(req.body.ket === 'Keempat') {
    let idLocale = require('moment/locale/id');
    moment.updateLocale('id', idLocale);
    const hariini = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    let Mydir = process.env.NEXT_APP_JDIH_PATH+'e_book/'+req.body.fl+'/'+req.body.isipdf;
    let zp = new admz();
        zp.addLocalFile(Mydir)
    const file_after_download = 'Ebook_JDIH_Kemensetneg_'+hariini+'.zip';
    const data = zp.toBuffer();

    res.set('Content-Type','application/octet-stream');
    res.set('Content-Disposition',`attachment; filename=${file_after_download}`);
    res.set('Content-Length',data.length);
    res.send(data);
  }
  else if(req.body.ket === 'Kelima') {
    let Mydir = process.env.NEXT_APP_JDIH_PATH+"uploads/"+req.body.fl;
    let zip = new admz();
    glob.sync(Mydir+'/*').forEach((item) => {
      let dirname =  path.basename(item);
      zip.addLocalFile(Mydir+"/"+dirname);
      const d_File = fileList(Mydir);
      for (let item_file of d_File) {
      if(item_file.ext === '.pdf')
        zip.addLocalFile(process.env.NEXT_APP_JDIH_PATH+"uploads/"+req.body.fl+"/"+item_file.file);
      }
    })
    const file_download = req.body.gelar+'.zip';
    const datazip = zip.toBuffer();

    res.set('Content-Type','application/octet-stream');
    res.set('Content-Disposition',`attachment; filename=${file_download}`);
    res.set('Content-Length',datazip.length);
    res.send(datazip);
  } 
  else if(req.body.ket === 'Keenam') {
    let Mydir = process.env.NEXT_APP_JDIH_PATH+"Putusanpengadilan/"+req.body.fl;
    let zip = new admz();
    glob.sync(Mydir+'/*').forEach((item) => {
      let dirname =  path.basename(item);
      zip.addLocalFile(Mydir+"/"+dirname);
      const d_File = fileList(Mydir);
      for (let item_file of d_File) {
      if(item_file.ext === '.pdf')
        zip.addLocalFile(process.env.NEXT_APP_JDIH_PATH+"Putusanpengadilan/"+req.body.fl+"/"+item_file.file);
      }
    })
    const file_download = req.body.gelar+'.zip';
    const datazip = zip.toBuffer();

    res.set('Content-Type','application/octet-stream');
    res.set('Content-Disposition',`attachment; filename=${file_download}`);
    res.set('Content-Length',datazip.length);
    res.send(datazip);
  }
  else if(req.body.ket === 'Ketujuh') {
    let Mydir = process.env.NEXT_APP_JDIH_PATH+"Monografihukum/"+req.body.fl;
    let zip = new admz();
    glob.sync(Mydir+'/*').forEach((item) => {
      let dirname =  path.basename(item);
      zip.addLocalFile(Mydir+"/"+dirname);
      const d_File = fileList(Mydir);
      for (let item_file of d_File) {
      if(item_file.ext === '.pdf')
        zip.addLocalFile(process.env.NEXT_APP_JDIH_PATH+"Monografihukum/"+req.body.fl+"/"+item_file.file);
      }
    })
    const file_download = req.body.gelar+'.zip';
    const datazip = zip.toBuffer();

    res.set('Content-Type','application/octet-stream');
    res.set('Content-Disposition',`attachment; filename=${file_download}`);
    res.set('Content-Length',datazip.length);
    res.send(datazip);
  }
  else if(req.body.ket === 'Kedelapan') {
    let Mydir = process.env.NEXT_APP_JDIH_PATH+"Artikelhukum/"+req.body.fl;
    let zip = new admz();
    glob.sync(Mydir+'/*').forEach((item) => {
      let dirname =  path.basename(item);
      zip.addLocalFile(Mydir+"/"+dirname);
      const d_File = fileList(Mydir);
      for (let item_file of d_File) {
      if(item_file.ext === '.pdf')
        zip.addLocalFile(process.env.NEXT_APP_JDIH_PATH+"Artikelhukum/"+req.body.fl+"/"+item_file.file);
      }
    })
    const file_download = req.body.gelar+'.zip';
    const datazip = zip.toBuffer();

    res.set('Content-Type','application/octet-stream');
    res.set('Content-Disposition',`attachment; filename=${file_download}`);
    res.set('Content-Length',datazip.length);
    res.send(datazip);
  }
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

export default handler;