const fs = require('fs');

const handler = async (req, res) => {
    let dir = process.env.NEXT_APP_JDIH_PATH+'Galeri/'+req.query.fl+'/'+req.query.img;
    if(req.query.v === "video") {
    fs.stat(dir, (err, stat) => {
        if (err !== null && err.code === 'ENOENT') {
            res.sendStatus(404);
        }
        const fileSize = stat.size
        const range = req.headers.range
    
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize-1;
            
            const chunksize = (end-start)+1;
            const file = fs.createReadStream(dir, {start, end});
            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': 'video/mp4',
            }
            
            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            }
    
            res.writeHead(200, head);
            fs.createReadStream(dir).pipe(res);
        }
    })
    } else {
    let readStream = fs.createReadStream(dir);
    readStream.on('close', () => {
        res.end()
    })
    res.setHeader('Content-Type', res.contentType(dir));
    readStream.pipe(res);
    }
}

export default handler;