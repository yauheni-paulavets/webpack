const fs = require('fs');
const MemoryStream = require('memorystream');
const archiver = require('archiver');

var customArchiver = new function()
{
	var self = this;

	self.archive = function(nodesNames, callback)
	{
		var memStream = new MemoryStream();

		var data;
		memStream.on('data', function(chunk) 
		{
			if (!data)
			{
				data = chunk;
			} else 
			{
				data = Buffer.concat([data, chunk]);
			}
		});

		memStream.on('end', function() 
		{
			if (callback)
			{
				callback(data.toString('base64'));
			}
		});

		var archive = archiver('zip', {
		  zlib: { level: 9 }
		});

		archive.pipe(memStream);

		archive.on('warning', function(err) 
		{
			if (err.code === 'ENOENT') 
			{
			} else 
			{
				console.log('!!!!!ERROR', err);
			}
		});

		archive.on('error', function(err) 
		{
		 	console.log('!!!!!ERROR', err);
		});

		nodesNames.forEach(function(file)
		{
			let fileNameParts = file.split('/');
			let fileName = fileNameParts[fileNameParts.length - 1];
			if (fs.lstatSync(file).isDirectory())
			{
				archive.directory(file, fileName);
			} else 
			{
				archive.file(file, { name: fileName });
			}
		});

		archive.finalize();
	}
}

module.exports = customArchiver;