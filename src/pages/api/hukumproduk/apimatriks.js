import connectionHandler from '../../../lib/connection-handler';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      let result;
      if (req.body.ket === 'atas') {
        result = await req.db
        .select('a.idjenis', 'a.jns')
        .from('jenis as a')
        .leftJoin('peraturan as b', 'a.idjenis', 'b.idjenis')
        .where('b.publish', 1)
        .groupBy('a.idjenis')
        .orderBy('a.idjenis', 'asc')
      } 
      else if (req.body.ket === 'hadap'){
        result = await req.db
        .select('b.idjenis', 'b.jns', req.db.raw(`COUNT(a.idjenis)As jml`))
        .from('peraturan as a')
        .leftJoin('jenis as b', 'a.idjenis', 'b.idjenis')
        .where('a.publish', 1)
        .groupBy('b.idjenis')
        .orderBy('b.idjenis', 'asc')
      } else {
        result = await req.db
        .select('a.tahun', 'b.nama_jenis', 'b.idjenis', 'b.jns', req.db.raw(`COUNT(a.idjenis)As jml`))
        .from('peraturan as a')
        .leftJoin('jenis as b', 'a.idjenis', 'b.idjenis')
        .where('a.publish', 1)
        .groupBy('a.tahun', 'b.idjenis')
        .orderBy('a.tahun', 'desc')
      }
      res.status(200)
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'max-age=180000');
      res.end(JSON.stringify({data: result}));
    } else {
      return res.status(404).end();
    }
  } catch (err) {
      console.error('API Error:', err);
      return res.status(500).send({error: 'Oops! Something went wrong!', details: err.message});
  }
}

export default connectionHandler()(handler);