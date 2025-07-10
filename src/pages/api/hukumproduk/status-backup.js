import connectionHandler from '../../../lib/connection-handler';
const path = require('path');
const fs = require('fs');

const handler = async (req, res) => {
  try {
  if (req.method === 'POST') {
    const vsttDicabut = [];
    const vsttDicabutSebagian = [];
    const vsttDiubah = [];
    const vsttDiubahSebagian = [];
    const vsttMencabut = [];
    const vsttMencabutSebagian = [];
    const vsttMengubah = [];
    const vsttMengubahSebagian = [];
    const vsttTerkait = [];

    if(req.body.dc !== '') {let pchDicabut = req.body.dc.split(','); for (let item of pchDicabut) {vsttDicabut.push(item)}}
    if(req.body.dcs !== '') {let pchDicabutSebagian = req.body.dcs.split(','); for (let item of pchDicabutSebagian) {vsttDicabutSebagian.push(item)}}
    if(req.body.dd !== '') {let pchDiubah = req.body.dd.split(','); for (let item of pchDiubah) {vsttDiubah.push(item)}}
    if(req.body.dds !== '') {let pchDiubahSebagian = req.body.dds.split(','); for (let item of pchDiubahSebagian) {vsttDiubahSebagian.push(item)}}
    if(req.body.dm !== '') {let pchMencabut = req.body.dm.split(','); for (let item of pchMencabut) {vsttMencabut.push(item)}}
    if(req.body.dms !== '') {let pchMencabutSebagian = req.body.dms.split(' '); for (let item of pchMencabutSebagian) {vsttMencabutSebagian.push(item)}}
    if(req.body.dme !== '') {let pchMengubah = req.body.dme.split(','); for (let item of pchMengubah) {vsttMengubah.push(item)}}
    if(req.body.dmes !== '') {let pchMengubahSebagian = req.body.dmes.split(' '); for (let item of pchMengubahSebagian) {vsttMengubahSebagian.push(item)}}
    if(req.body.dt !== '') {let pchTerkait = req.body.dt.split(','); for (let item of pchTerkait) {vsttTerkait.push(item)}}

    const resx = req.db
    .select('a.idperaturan', 'a.tentang', 'a.publish', 'a.no_peraturan', 'a.tahun', 'b.jns', 'a.mencabut_sebagian', 'a.mengubah_sebagian', 
      req.db.raw(`
        ExtractValue(a.mencabut_sebagian, '//span//@id') AS mencabutsebagian,
        ExtractValue(a.mengubah_sebagian, '//span//@id') AS mengubahsebagian
      `))
    .from('peraturan as a')
    .leftJoin('jenis as b', 'a.idjenis', 'b.idjenis')
    .where('a.publish', 1)
    .groupBy('a.idperaturan')
    .orderByRaw(`b.idjenis ASC, a.tahun ASC, ABS(a.no_peraturan) ASC`)

    const resultUji = await req.db('uji_materi').where('idperaturan', req.body.idx).select('*')
    let dataUji = []
    if(resultUji.length > 0) {
    resultUji.forEach(function(itm, id) {
      let no_mor = itm.nomor.split('/').join('_')
      const arrayFile = [];
      let dir = process.env.NEXT_APP_JDIH_PATH+'uploads/'+req.body.d+no_mor;
      const file_d = fileList(dir);
      for (let item_file of file_d) {
        if(item_file.ext === '.pdf')
        arrayFile.push('<p class="ujimaterilIsiFile" id="'+item_file.file+':'+no_mor+'" >'+
        '<i class="fas fa-file-pdf ml-3 pr-1" style="color: red; font-size: 1.1rem;"></i>'+
        item_file.file+' <b>('+humanFileSize(item_file.size)+')</b></p>');
      }
      dataUji.push({
      iduji: itm.iduji,
      idperaturan: itm.idperaturan+no_mor,
      nomor: itm.nomor,
      tanggal: itm.tanggal,
      intisari: itm.intisari,
      filex: arrayFile.join('')
    })
    });
  }

    const resultDicabut = await resx.clone().whereIn('a.idperaturan', vsttDicabut)
    const resultDicabutSebagian = await resx.clone().whereIn('a.idperaturan', vsttDicabutSebagian)
    const resultDiubah = await resx.clone().whereIn('a.idperaturan', vsttDiubah)
    const resultDiubahSebagian = await resx.clone().whereIn('a.idperaturan', vsttDiubahSebagian)
    const resultMencabut = await resx.clone().whereIn('a.idperaturan', vsttMencabut)
    const resultMencabutSebagian = await resx.clone().whereIn('a.idperaturan', vsttMencabutSebagian)
    const resultMengubah = await resx.clone().whereIn('a.idperaturan', vsttMengubah)
    const resultMengubahSebagian = await resx.clone().whereIn('a.idperaturan', vsttMengubahSebagian)
    const resultTerkait = await resx.clone().whereIn('a.idperaturan', vsttTerkait)

    let dataDicabut = '', dataDicabutSebagian = '', dataDiubah = '', dataDiubahSebagian = '', dataMencabut = '', dataMengubah = '', dataTerkait;
    const dataMencabutSebagian = [], dataMengubahSebagian = [];
    if(resultDicabut.length > 0) {
      resultDicabut.forEach(function(itm, id) { 
        dataDicabut += '<label id="'+itm.idperaturan+'" status="diluar" class="option_item textarealabel-info tooltipx" data-original-title="'+itm.tentang+'">' +
                        '<div class="option_inner _jdih">' +
                        '<div class="name">'+itm.jns+' '+itm.no_peraturan.toUpperCase()+'/'+itm.tahun+'</div>' +
                        '</div>' +
                        '</label>'
      })
    }
    if(resultDiubah.length > 0) {
      resultDiubah.forEach(function(itm, id) { 
        dataDiubah += '<label id="'+itm.idperaturan+'" status="diluar" class="option_item textarealabel-info tooltipx" data-original-title="'+itm.tentang+'">' +
                        '<div class="option_inner _jdih">' +
                        '<div class="name">'+itm.jns+' '+itm.no_peraturan.toUpperCase()+'/'+itm.tahun+'</div>' +
                        '</div>' +
                        '</label>'
      })
    }
    if(resultMencabut.length > 0) {
      resultMencabut.forEach(function(itm, id) { 
        dataMencabut += '<label id="'+itm.idperaturan+'" status="diluar" class="option_item textarealabel-info tooltipx" data-original-title="'+itm.tentang+'">' +
                        '<div class="option_inner _jdih">' +
                        '<div class="name">'+itm.jns+' '+itm.no_peraturan.toUpperCase()+'/'+itm.tahun+'</div>' +
                        '</div>' +
                        '</label>'
      })
    }
    if(resultMengubah.length > 0) {
      resultMengubah.forEach(function(itm, id) { 
        dataMengubah += '<label id="'+itm.idperaturan+'" status="diluar" class="option_item textarealabel-info tooltipx" data-original-title="'+itm.tentang+'">' +
                        '<div class="option_inner _jdih">' +
                        '<div class="name">'+itm.jns+' '+itm.no_peraturan.toUpperCase()+'/'+itm.tahun+'</div>' +
                        '</div>' +
                        '</label>'
      })
    }
    if(resultTerkait.length > 0) {
      const myArray = []
      resultTerkait.forEach(function(itm, id) { 
        myArray.push({ jns: itm.jns, isi: '<label id="'+itm.idperaturan+'" status="diluar" class="option_item textarealabel-info tooltipx" data-original-title="'+itm.tentang+'">' +
        '<div class="option_inner _jdih">' +
        '<div class="name">'+itm.jns+' '+itm.no_peraturan.toUpperCase()+'/'+itm.tahun+'</div>' +
        '</div>' +
        '</label>'})
        })

        dataTerkait = myArray.reduce(function (obj, item) {
            obj[item.jns] = obj[item.jns] || [];
            obj[item.jns].push(item.isi);
            return obj;
        }, {});
    }
    const arrayMec_sx = [];
    if(resultDicabutSebagian.length > 0) {
      const arrayMec_s = [];
      resultDicabutSebagian.forEach(function(itm, id) { 
        let pch = itm.mencabutsebagian.split(' '); 
        for (let item of pch) {arrayMec_s.push(item)}
        arrayMec_s.push(itm.idperaturan)
        dataDicabutSebagian +='<label class="option_item ketSebagian">' +
                      '<div class="_jdih">' +
                      '<div class="name"><p><i class="fas fa-star"></i> <span id="'+itm.idperaturan+'" data-original-title="'+itm.tentang+'" class="textarealabel-info tooltipx">'+itm.jns+' '+itm.no_peraturan.toUpperCase()+'/'+itm.tahun+'</span>' +
                      'Mencabut Sebagian Dengan Ketentuan Sebagai Berikut:</p></div>' +
                      '</div>' +
                      '</label><div style="padding-left: 2rem;">'+itm.mencabut_sebagian+'</div>';
      })
      const resultMecSebagianx = await resx.clone().whereIn('a.idperaturan', arrayMec_s)
      for (let item of resultMecSebagianx) {arrayMec_sx.push(item.idperaturan)}
    }
    const arrayMer_sx = [];
    if(resultDiubahSebagian.length > 0) {
      const arrayMer_s = [];
      resultDiubahSebagian.forEach(function(itm, id) {
        let pch = itm.mengubahsebagian.split(' '); 
        for (let item of pch) {arrayMer_s.push(item)}
        arrayMer_s.push(itm.idperaturan)
        dataDiubahSebagian +='<label class="option_item ketSebagian">' +
                              '<div class="_jdih">' +
                              '<div class="name"><p><i class="fas fa-star"></i> <span id="'+itm.idperaturan+'" data-original-title="'+itm.tentang+'" class="textarealabel-info tooltipx">'+itm.jns+' '+itm.no_peraturan.toUpperCase()+'/'+itm.tahun+'</span>' +
                              'Mengubah Sebagian Dengan Ketentuan Sebagai Berikut:</p></div>' +
                              '</div>' +
                              '</label><div style="padding-left: 2rem;">'+itm.mengubah_sebagian+'</div>'
      })
      const resultMerSebagianx = await resx.clone().whereIn('a.idperaturan', arrayMer_s)
      for (let item of resultMerSebagianx) {arrayMer_sx.push(item.idperaturan)}
    }

    if(resultMencabutSebagian.length > 0 || resultMengubahSebagian.length > 0) {
      resultMencabutSebagian.forEach(function(itm, id) {
        dataMencabutSebagian.push(itm.idperaturan)
      })
      resultMengubahSebagian.forEach(function(itm, id) { 
        dataMengubahSebagian.push(itm.idperaturan)
      })
    }
      
    res.status(200)
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ 
      dc: dataDicabut, 
      dcs: dataDicabutSebagian, 
      du: dataDiubah, 
      dus: dataDiubahSebagian, 
      mc: dataMencabut, 
      mcs: dataMencabutSebagian, 
      me: dataMengubah, 
      mes: dataMengubahSebagian,
      d_rub_s: arrayMer_sx,
      d_cab_s: arrayMec_sx,
      tk: dataTerkait, 
      ujimateri: dataUji 
    }));
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
    return list.concat(isDir ? fileList(name) : [{ext: ext, file: file, size : size}]);
  }, []);
  } return []
}

function humanFileSize(size) {
  var i = Math.floor( Math.log(size) / Math.log(1024) );
  return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['B', 'Kb', 'Mb', 'Gb', 'Tb'][i];
}

export default connectionHandler()(handler);