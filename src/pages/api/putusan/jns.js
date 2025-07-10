import connectionHandler from '../../../lib/connection-handler';

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      // Check if table exists first
      const tableExists = await req.db.schema.hasTable('putusan_pengadilan');
      
      if (!tableExists) {
        // Return empty data if table doesn't exist
        return res.status(200).json({data: [], jml: 0});
      }

      const result = req.db
        .select('putusan_pengadilan.jenis_putusan')
        .from('putusan_pengadilan')
        .groupBy('putusan_pengadilan.jenis_putusan');
        
      const totalCount = await result;
      const data = await result.clone();
      
      res.status(200).json({data: data, jml: totalCount.length});
    } else {
      return res.status(405).json({error: 'Method not allowed'});
    }
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({error: 'Internal server error', details: err.message});
  }
}

export default connectionHandler()(handler);