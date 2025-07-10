import connectionHandler from '../../../lib/connection-handler';

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      // Check if table exists first
      const tableExists = await req.db.schema.hasTable('artikel_hukum');
      
      if (!tableExists) {
        // Return empty data if table doesn't exist
        return res.status(200).json({data: [], jml: 0});
      }

      let l = 6 + parseInt(req.query.lmt);
      const result = req.db
      .select('tahun_terbit')
      .from('artikel_hukum')
      .groupBy('tahun_terbit')
      .orderBy('tahun_terbit', 'desc')
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