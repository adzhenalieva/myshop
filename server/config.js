const path = require('path');

const rootPath = __dirname;

module.exports = {
    rootPath,
    uploadPath: path.join(rootPath, 'public/uploads'),
    dbURL: 'mongodb://localhost/shop',
    mongoOptions: {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }
};

