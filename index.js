const express = require('express');
const md5 = require('md5');
const app = express();
const port = 19123;
const multer = require('multer');   
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const getfileformat = file.originalname.split('.');
        const hash = createHash(file.originalname);
        cb(null, `${hash}.${getfileformat[getfileformat.length - 1]}`);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 200 * 1024 * 1024 }
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/upload', upload.single('file'), (req, res) => {
    const protocol = req.secure ? 'https' : 'http';
    const host = req.get('host');
    const fileUrl = `https://${host}/${req.file.filename}`;
    res.json({ fileUrl });
});

const createHash = (data) => {
    return md5(data + Date.now());
};


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.get('/:filename', (req, res) => {   
    res.sendFile(__dirname + '/uploads/' + req.params.filename);
});

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});