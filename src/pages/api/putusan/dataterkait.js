import connectionHandler from '../../../lib/connection-handler';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const myArray = []
      const result = await req.db
        .select('a.idperaturan', 'a.tentang', 'a.no_peraturan', 'a.tahun', 'b.jns')
        .from('peraturan as a')
        .leftJoin('jenis as b', 'a.idjenis', 'b.idjenis')
        .where('a.publish', 1)
        .whereIn('a.idperaturan', req.body.dt)
        .groupBy('a.idperaturan')
        .orderByRaw(`b.idjenis ASC, a.tahun ASC, ABS(a.no_peraturan) ASC`)
        .timeout(1000, { cancel: true });

      for (let item of result) {
        myArray.push({
          idperaturan: item.idperaturan,
          tentang: item.tentang,
          no_peraturan: item.no_peraturan,
          tahun: item.tahun,
          jns: item.jns
        });
      }

      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ data: myArray }));
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default connectionHandler()(handler);