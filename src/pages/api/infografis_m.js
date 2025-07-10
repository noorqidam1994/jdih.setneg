import connectionHandler from '../../lib/connection-handler';
const path = require('path');
const fs = require('fs');

const handler = async (req, res) => {
    try {
        if(req.method === 'POST') {
            // Check if table exists first
            const tableExists = await req.db.schema.hasTable('infografis');
            
            if (!tableExists) {
                // Return empty data if table doesn't exist
                return res.status(200).json({data: [], jml: 0});
            }

            let hslResult, allResult, length = parseInt(req.body.length), start = parseInt(req.body.start);
            const resulData = req.db.select()
            .from('infografis')
            .timeout(1000, {cancel: true})
            hslResult = await resulData.clone().limit(length).offset(start)
            allResult = await resulData.clone()
            const arrayData = [];

            for (let item_p of hslResult) {
                arrayData.push({
                  idinfo: item_p.idinfo,
                  judul: item_p.judul,
                  isi: item_p.isi,
                  tgl: item_p.tgl
                });
              }
        res.status(200)
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({data: arrayData, jml: allResult.length}));
        }
    } catch (err) {
        return res.status(500).send({error: 'Oops! Something went wrong!'});
    }
  }

export default connectionHandler()(handler);