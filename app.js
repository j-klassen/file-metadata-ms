'use strict';

// Free Code Camp - File metadata microservice

const express = require('express');
const app = express();
const morgan = require('morgan');
const multer = require('multer');
const storage = multer.memoryStorage();
const maxFileSize = 2250000; // A little over 2mb
const upload = multer({
	storage: storage,
	limits: {
		files: 1,
		fileSize: maxFileSize
	}
});
const port = process.env.PORT || 3000;

app.set('views', './views');
app.set('view engine', 'jade');

app.use(morgan('dev'));

app.get('/', (req, res) => {
	res.render('index', {
		title: 'File Analyzer Microservice',
		maxFileSize: maxFileSize
	});
});

const api = express.Router();

api.post('/file_analyze', upload.single('file'), (req, res) => {
	res.json({
		size: req.file.size
	});
});

app.use('/api', api);

app.use((err, req, res, next) => {
	// Multer file size check
	if (err.code === 'LIMIT_FILE_SIZE') {
		res.status(413).json({
			error: err
		});
	} else {
		res.status(500).json({
			error: err
		});
	}
});

app.listen(port, () => {
	console.log(`server listening on port ${port}`);
});