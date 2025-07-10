import connectionHandler from '../../lib/connection-handler';

const handler = async (req, res) => {
    try {
        // if(req.method === 'POST') {
            let allResult;
            const resulData = req.db.select()
            .from('infografis')
            .timeout(1000, {cancel: true})
            allResult = await resulData.clone()
            const arrayData = [];

            let no_i = 0;
            for (let item_p of allResult) {
                arrayData.push({
                  idData: no_i,
                  tahun_pengundangan: item_p.judul,
                  tanggal_pengundangan: item_p.isi,
                  jenis: item_p.tgl,
                  noPeraturan: item_p.idinfo,
                  judul: item_p.judul,
                  fileDownload: item_p.isi,
                  urlDownload: item_p.tgl,
                  operasi: item_p.tgl,
                  display: item_p.tgl
                });
                no_i++;
              }
        res.status(200)
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({data: arrayData, jml: allResult.length}));
        // }
    } catch (err) {
        return res.status(500).send({error: 'Oops! Something went wrong!'});
    }
  }

export default connectionHandler()(handler);