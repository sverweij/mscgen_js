rast = require('./randomast');

process.stdout.write(JSON.stringify(rast.run(), null, " "));
