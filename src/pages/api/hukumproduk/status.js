import connectionHandler from '../../../lib/connection-handler';
const path = require('path');
const fs = require('fs');

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      // Parse status arrays
      const statusArrays = {
        dicabut: req.body.dc ? req.body.dc.split(',') : [],
        dicabutSebagian: req.body.dcs ? req.body.dcs.split(',') : [],
        diubah: req.body.dd ? req.body.dd.split(',') : [],
        diubahSebagian: req.body.dds ? req.body.dds.split(',') : [],
        mencabut: req.body.dm ? req.body.dm.split(',') : [],
        mencabutSebagian: req.body.dms ? req.body.dms.split(' ') : [],
        mengubah: req.body.dme ? req.body.dme.split(',') : [],
        mengubahSebagian: req.body.dmes ? req.body.dmes.split(' ') : [],
        terkait: req.body.dt ? req.body.dt.split(',') : []
      };

      // Combine all IDs for a single optimized query
      const allIds = [
        ...statusArrays.dicabut,
        ...statusArrays.dicabutSebagian,
        ...statusArrays.diubah,
        ...statusArrays.diubahSebagian,
        ...statusArrays.mencabut,
        ...statusArrays.mencabutSebagian,
        ...statusArrays.mengubah,
        ...statusArrays.mengubahSebagian,
        ...statusArrays.terkait
      ].filter(id => id && id.trim());

      let allResults = [];
      
      // Single optimized query with indexes
      if (allIds.length > 0) {
        allResults = await req.db
          .select(
            'a.idperaturan', 
            'a.tentang', 
            'a.publish', 
            'a.no_peraturan', 
            'a.tahun', 
            'b.jns', 
            'a.mencabut_sebagian', 
            'a.mengubah_sebagian'
          )
          .from('peraturan as a')
          .leftJoin('jenis as b', 'a.idjenis', 'b.idjenis')
          .whereIn('a.idperaturan', allIds)
          .where('a.publish', 1)
          .orderByRaw(`b.idjenis ASC, a.tahun ASC, ABS(a.no_peraturan) ASC`);
      }

      // Create lookup map for fast access
      const resultMap = new Map();
      allResults.forEach(item => {
        resultMap.set(item.idperaturan, item);
      });

      // Helper function to generate HTML for regulation items
      const generateRegulationHTML = (ids, className = 'option_item textarealabel-info tooltipx') => {
        return ids.map(id => {
          const item = resultMap.get(id);
          if (!item) return '';
          
          return `<label id="${item.idperaturan}" status="diluar" class="${className}" data-original-title="${item.tentang}">
                    <div class="option_inner _jdih">
                      <div class="name">${item.jns} ${item.no_peraturan.toUpperCase()}/${item.tahun}</div>
                    </div>
                  </label>`;
        }).join('');
      };

      // Generate results efficiently
      const results = {
        dc: generateRegulationHTML(statusArrays.dicabut),
        du: generateRegulationHTML(statusArrays.diubah),
        mc: generateRegulationHTML(statusArrays.mencabut),
        me: generateRegulationHTML(statusArrays.mengubah),
        mcs: statusArrays.mencabutSebagian,
        mes: statusArrays.mengubahSebagian,
        d_rub_s: [],
        d_cab_s: []
      };

      // Handle "dicabut sebagian" with optimized XML parsing
      if (statusArrays.dicabutSebagian.length > 0) {
        const sebagianItems = statusArrays.dicabutSebagian.map(id => resultMap.get(id)).filter(Boolean);
        const arrayMec_s = [];
        
        results.dcs = sebagianItems.map(item => {
          // Simplified XML parsing - extract IDs without ExtractValue
          const xmlContent = item.mencabut_sebagian || '';
          const idMatches = xmlContent.match(/id="([^"]+)"/g) || [];
          const extractedIds = idMatches.map(match => match.replace(/id="([^"]+)"/, '$1'));
          
          arrayMec_s.push(...extractedIds, item.idperaturan);
          
          return `<label class="option_item ketSebagian">
                    <div class="_jdih">
                      <div class="name">
                        <p><i class="fas fa-star"></i> 
                        <span id="${item.idperaturan}" data-original-title="${item.tentang}" class="textarealabel-info tooltipx">
                          ${item.jns} ${item.no_peraturan.toUpperCase()}/${item.tahun}
                        </span>
                        Mencabut Sebagian Dengan Ketentuan Sebagai Berikut:</p>
                      </div>
                    </div>
                  </label>
                  <div style="padding-left: 2rem;">${item.mencabut_sebagian}</div>`;
        }).join('');

        // Get additional data in batch if needed
        if (arrayMec_s.length > 0) {
          const additionalResults = await req.db
            .select('idperaturan')
            .from('peraturan')
            .whereIn('idperaturan', arrayMec_s)
            .where('publish', 1);
          
          results.d_cab_s = additionalResults.map(item => item.idperaturan);
        }
      }

      // Handle "diubah sebagian" with optimized XML parsing
      if (statusArrays.diubahSebagian.length > 0) {
        const sebagianItems = statusArrays.diubahSebagian.map(id => resultMap.get(id)).filter(Boolean);
        const arrayMer_s = [];
        
        results.dus = sebagianItems.map(item => {
          // Simplified XML parsing - extract IDs without ExtractValue
          const xmlContent = item.mengubah_sebagian || '';
          const idMatches = xmlContent.match(/id="([^"]+)"/g) || [];
          const extractedIds = idMatches.map(match => match.replace(/id="([^"]+)"/, '$1'));
          
          arrayMer_s.push(...extractedIds, item.idperaturan);
          
          return `<label class="option_item ketSebagian">
                    <div class="_jdih">
                      <div class="name">
                        <p><i class="fas fa-star"></i> 
                        <span id="${item.idperaturan}" data-original-title="${item.tentang}" class="textarealabel-info tooltipx">
                          ${item.jns} ${item.no_peraturan.toUpperCase()}/${item.tahun}
                        </span>
                        Mengubah Sebagian Dengan Ketentuan Sebagai Berikut:</p>
                      </div>
                    </div>
                  </label>
                  <div style="padding-left: 2rem;">${item.mengubah_sebagian}</div>`;
        }).join('');

        // Get additional data in batch if needed
        if (arrayMer_s.length > 0) {
          const additionalResults = await req.db
            .select('idperaturan')
            .from('peraturan')
            .whereIn('idperaturan', arrayMer_s)
            .where('publish', 1);
          
          results.d_rub_s = additionalResults.map(item => item.idperaturan);
        }
      }

      // Handle "terkait" data grouping
      if (statusArrays.terkait.length > 0) {
        const terkaitItems = statusArrays.terkait.map(id => resultMap.get(id)).filter(Boolean);
        const groupedData = {};
        
        terkaitItems.forEach(item => {
          if (!groupedData[item.jns]) {
            groupedData[item.jns] = [];
          }
          
          groupedData[item.jns].push(
            `<label id="${item.idperaturan}" status="diluar" class="option_item textarealabel-info tooltipx" data-original-title="${item.tentang}">
              <div class="option_inner _jdih">
                <div class="name">${item.jns} ${item.no_peraturan.toUpperCase()}/${item.tahun}</div>
              </div>
            </label>`
          );
        });
        
        results.tk = groupedData;
      }

      // Handle uji materi data (keep file operations as they are filesystem dependent)
      let dataUji = [];
      if (req.body.idx) {
        const resultUji = await req.db('uji_materi').where('idperaturan', req.body.idx).select('*');
        
        if (resultUji.length > 0) {
          dataUji = await Promise.all(resultUji.map(async (itm) => {
            const no_mor = itm.nomor.split('/').join('_');
            const dir = process.env.NEXT_APP_JDIH_PATH + 'uploads/' + req.body.d + no_mor;
            
            // Async file operations for better performance
            const arrayFile = await getFileListAsync(dir);
            
            return {
              iduji: itm.iduji,
              idperaturan: itm.idperaturan + no_mor,
              nomor: itm.nomor,
              tanggal: itm.tanggal,
              intisari: itm.intisari,
              filex: arrayFile.join('')
            };
          }));
        }
      }

      res.status(200);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Cache-Control', 'max-age=300'); // 5 minute cache
      res.end(JSON.stringify({
        ...results,
        ujimateri: dataUji
      }));
      
    } else {
      return res.status(404).end();
    }
  } catch (err) {
    console.error('Status API Error:', err);
    return res.status(500).send({error: 'Oops! Something went wrong!', details: err.message});
  }
}

// Async file operations for better performance
async function getFileListAsync(dir) {
  try {
    if (!fs.existsSync(dir)) return [];
    
    const files = await fs.promises.readdir(dir);
    const arrayFile = [];
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stats = await fs.promises.stat(filePath);
      
      if (!stats.isDirectory() && path.extname(file) === '.pdf') {
        arrayFile.push(
          `<p class="ujimaterilIsiFile" id="${file}:${path.basename(dir)}">
            <i class="fas fa-file-pdf ml-3 pr-1" style="color: red; font-size: 1.1rem;"></i>
            ${file} <b>(${humanFileSize(stats.size)})</b>
          </p>`
        );
      }
    }
    
    return arrayFile;
  } catch (error) {
    console.error('File list error:', error);
    return [];
  }
}

function humanFileSize(size) {
  const i = Math.floor(Math.log(size) / Math.log(1024));
  return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'Kb', 'Mb', 'Gb', 'Tb'][i];
}

export default connectionHandler()(handler);