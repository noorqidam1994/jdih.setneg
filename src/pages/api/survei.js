import connectionHandler from '../../lib/connection-handler';

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const result = await req.db.from('survei').where('aktif', '1')
      res.status(200)
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({dataSl: result}));
    } 
    else if(req.method === 'POST' && req.body.k === 'SelectFooter') {
      const resx = await req.db
        .select(req.db.raw(` 
              SUM(CASE WHEN jawaban='Ya' THEN 1 ELSE 0 END) AS yajawab,
              SUM(CASE WHEN jawaban='Cukup' THEN 1 ELSE 0 END) AS cukupjawab,
              SUM(CASE WHEN jawaban='Tidak' THEN 1 ELSE 0 END) AS tidakjawab`))
        .from('hasil_survei');
          let jdya, jdcukup, jdtidak;
          if(resx[0].yajawab !== null) {jdya = parseInt(resx[0].yajawab)} else {jdya = 0}
          if(resx[0].cukupjawab !== null) {jdcukup = parseInt(resx[0].cukupjawab)} else {jdcukup = 0}
          if(resx[0].tidakjawab !== null) {jdtidak = parseInt(resx[0].tidakjawab)} else {jdtidak = 0}
          let arrayData
          if(jdya === 0 && jdcukup === 0 && jdtidak === 0) {
            arrayData = []
          } else {
            arrayData = [{label: "Ya", count: jdya, color: "#00bcd4"}, {label: "Cukup", count: jdcukup, color: "#ffeb3b"}, {label: "Tidak", count: jdtidak, color: "#ff5722"}]
          }
        res.status(200)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({row: arrayData}));
      } else {
      return res.status(404).end();
    }
  } catch (err) {
      return res.status(500).send({error: 'Oops! Something went wrong!'});
  }
}

export default connectionHandler()(handler);