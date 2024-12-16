require('./global');
const express = require('express');
const fs = require('fs')
const app = express();
const fileUpload = require('express-fileupload');
const expressLayout = require('express-ejs-layouts');
const rateLimit = require("express-rate-limit");
const uplot = require('./gofiledl')

const { writeDB, readDB } = require('./database/db')
/* config */
app.set('json spaces', 4);
app.set('trust proxy', 1);
app.set('view engine', 'ejs');
app.use(expressLayout);
app.use(fileUpload({ limits: { fileSize: 5 * 1024 * 1024 } }))
app.use(rateLimit({ windowMs: 1 * 60 * 1000,  max: 2000, message: 'Terlalu banyak requests' }));
app.use('/assets', express.static('assets'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());



app.get('/', async(req, res) => {
  var { link: _link } = await readDB('AGUS', 'gambar')
  res.render('index', { layout: false, linkgambar: _link })
})

app.post('/kirim', async(req, res) => {
  if (!req.files) {
    return res.json({ status: false, msg: 'Tidak ada berkas yang diunggah' });
  } if(!/^image\/(jpg|jpeg|png|bmp|svg|webp)$/.test(req.files.file.mimetype))  {
      return res.json({ status: false, msg: 'Media tidak validd' });
  }else if (req.files.file.size > 5 * 1024 * 1024) {
      return res.status(413).json({ message: 'Ukuran file terlalu besar. Maksimal ukuran file adalah 5 MB.' });
  }else{
    try {
      var { name, data, mimetype } = req.files.file;
      var { link: _link } = await readDB('AGUS', 'gambar')
      var link = _link.length > 0 ? link : []
      await uplot(data, name).then(async kirim => {
        link.push(kirim.imageUrl)
        await writeDB('AGUS', 'gambar', { link }).then(p => {
          console.log(p)
        })
      })
      // // link.push(kirim.imageUrl)
      // // console.log(link)
      // // var _write = await writeDB('AGUS', 'gambar', link)
      res.send({ status: true, name })
    } catch {
      res.send({ status: false })
    }
  }
});

app.listen(3000, () => {
    console.log('Server berjalan pada http://localhost:3000');
});
  