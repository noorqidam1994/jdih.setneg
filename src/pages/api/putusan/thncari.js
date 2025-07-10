import connectionHandler from '../../../lib/connection-handler';

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      // Check if table exists first
      const tableExists = await req.db.schema.hasTable('putusan_pengadilan');
      
      if (!tableExists) {
        // Return empty data if table doesn't exist
        return res.status(200).json([]);
      }

      const searchValue = req.query.vl ? escapeHtml(req.query.vl) : '';
      
      const result = await req.db
        .select('tahun_putusan as tahun')
        .from('putusan_pengadilan')
        .where('tahun_putusan', 'like', `%${searchValue}%`)
        .groupBy('tahun_putusan')
        .offset(0)
        .limit(5);
        
      res.status(200).json(result);
    } else {
      return res.status(405).json({error: 'Method not allowed'});
    }
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({error: 'Internal server error', details: err.message});
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}

export default connectionHandler()(handler);