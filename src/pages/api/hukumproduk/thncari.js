import connectionHandler from '../../../lib/connection-handler';

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      let v = escapeHtml(req.query.vl);
      const result = await req.db
      .select('tahun')
      .from('peraturan')
      .whereRaw(`publish=1 AND tahun LIKE '%${v}%'`)
      .groupBy('tahun')
      .offset(0).limit(5)
      res.status(200)
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result));
    } else {
      return res.status(404).end();
    }
  } catch (err) {
      return res.status(500).send({error: 'Oops! Something went wrong!'});
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "").replace(/'/g, "'");
}

export default connectionHandler()(handler);