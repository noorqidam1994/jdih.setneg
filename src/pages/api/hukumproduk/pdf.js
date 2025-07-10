const fs = require('fs');

const handler = async (req, res) => {
    let loc = req.query["l"];
    let dir = process.env.NEXT_APP_JDIH_PATH+loc+'/'+req.query["fl"]+'/'+req.query["f"];
    let readStream = fs.createReadStream(dir);
    let stat = fs.statSync(dir);
    readStream.on('close', () => {
        res.end()
    })

    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename='+req.query["f"]);
    readStream.pipe(res);
}

export default handler;