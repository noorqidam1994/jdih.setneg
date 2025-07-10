import connectionHandler from '../../../lib/connection-handler';

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const result = req.db
      .select('jenis_monografi')
      .from('monografi_hukum')
      .groupBy('jenis_monografi')
      var totalCount = await result;
      var data = await result.clone()
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