const multer = require('multer');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/newImg');
        console.log('image uploaded')
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(' ').join('_');
    cb(null, name);

  }
});


const upload = multer({ storage: storage })

module.exports = upload