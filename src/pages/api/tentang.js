import connectionHandler from '../../lib/connection-handler';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const ket = req.body.ket;
      
      // Validate the ket parameter
      if (!ket || typeof ket !== 'string') {
        return res.status(400).json({error: 'Invalid or missing ket parameter'});
      }

      // Sanitize the column name to prevent SQL injection
      const allowedColumns = ['visi_misi', 'dasar_hukum', 'struktur', 'tentang', 'sop'];
      if (!allowedColumns.includes(ket)) {
        return res.status(400).json({error: 'Invalid column name'});
      }

      // Check if table exists first
      const tableExists = await req.db.schema.hasTable('tentangjdih');
      
      if (!tableExists) {
        // Return empty data if table doesn't exist
        const emptyResult = {};
        emptyResult[ket] = '';
        return res.status(200).json(emptyResult);
      }

      const result = await req.db
        .select(ket)
        .from('tentangjdih')
        .first();

      if (!result) {
        // Return empty data if no records found
        const emptyResult = {};
        emptyResult[ket] = '';
        return res.status(200).json(emptyResult);
      }

      res.status(200).json(result);
    } else {
      return res.status(405).json({error: 'Method not allowed'});
    }
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({error: 'Internal server error', details: err.message});
  }
}

export default connectionHandler()(handler);