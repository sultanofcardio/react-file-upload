const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// default options
app.use(fileUpload());

app.use(express.static('frontend/build'))

app.get('/', (req, res) => {
    res.sendFile('frontend/build/index.html', {root: __dirname})
});

app.post('/upload', function (req, res) {
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const sampleFile = req.files.file;
    const uploadPath = __dirname + '/uploads/' + sampleFile.name;

    sampleFile.mv(uploadPath, function (err) {
        console.log(err)
        if (err) return res.status(500).send('Error uploading file')
        res.send('File uploaded!')
    });
});

const PORT = process.env.port

app.listen(PORT, function () {
    console.log('Express server listening on port ', PORT); // eslint-disable-line
});