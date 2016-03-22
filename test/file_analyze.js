const expect = require('expect');
const request = require('supertest');
const mockFs = require('mock-fs');
const fs = require('fs');

const app = require('../app.js');

describe('Analyze File', () => {
	before(function before() {
		mockFs({
			'assets': {
				'README.md': '### Test Readme\n\n> testing the routes'
			}
		});
	});

	after(mockFs.restore);

	it('should return proper file size of an uploaded file.', (done) => {
		request(app)
			.post('/api/file_analyze')
			.accept('Accept', 'application/json')
			.attach('file', 'assets/README.md')
			.expect(200)
			.expect('Content-Type', /json/)
			.end(function(err, result) {
				if (err) {
					return done(err);
				}

				fs.readFile('./assets/README.md', function read(err, file) {
					if (err) { return done(err); }
					expect(result.body.size).toEqual(file.length);
					done();
				})
			})
	});
});
