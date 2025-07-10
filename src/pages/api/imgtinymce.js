const fs = require('fs');

const handler = async (req, res) => {
    let dir = process.env.NEXT_APP_JDIH_PATH+'source/'+req.query.img;
    if (fs.existsSync(dir)) {
    let readStream = fs.createReadStream(dir);
    readStream.on('close', () => {
        res.end()
    })
    res.setHeader('Content-Type', res.contentType(dir));
    readStream.pipe(res);
    }
}

export default handler;