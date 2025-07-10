import connectionHandler from '../../../lib/connection-handler';

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      let l = 12 + parseInt(req.query.lmt);
      const result = req.db
      .select('jenis.jns')
      .from('jenis')
      .leftJoin('peraturan', 'jenis.idjenis', 'peraturan.idjenis')
      .where('peraturan.publish', 1)
      .groupBy('peraturan.idjenis')
      var totalCount = await result;
      var data = await result.clone().offset(0).limit(l)
      res.status(200)
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({data: data, jml: totalCount.length}));
    } else {
      return res.status(404).end();
    }
  } catch (err) {
      return res.status(500).send({error: 'Oops! Something went wrong!'});
  }
}

export default connectionHandler()(handler);