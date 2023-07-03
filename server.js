const express = require('express');
const multer = require('multer');

const app = express();

// Configuración de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Define la carpeta de destino para los archivos cargados
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    // Define el nombre del archivo en el servidor
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Configura las validaciones para multer
const fileFilter = function (req, file, cb) {
  // Define los tipos de archivos permitidos
  const allowedTypes = ['image/jpeg', 'image/png'];

  if (allowedTypes.includes(file.mimetype)) {
    // Acepta el archivo
    cb(null, true);
  } else {
    // Rechaza el archivo
    cb(new Error('Tipo de archivo no válido'));
  }
};

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const upload = multer({ storage: storage, fileFilter: fileFilter }).array('files');

// Ruta para el formulario de carga de archivos
app.post('/upload', function (req, res, next) {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Error de Multer
      return res.status(400).json({ error: err.message });
    } else if (err) {
      // Otro error
      return res.status(400).json({ error: err.message });
    }

    // Si la validación es exitosa, los archivos se han cargado correctamente
    const files = req.files;

    // Mostrar detalles de cada archivo cargado
    const fileDetails = files.map(file => ({
      originalName: file.originalname,
      fileName: file.filename,
      size: file.size,
      mimeType: file.mimetype
    }));

    res.json({ files: fileDetails });
  });
});

// Resto del código de tu aplicación

app.listen(3000, function () {
  console.log('Servidor en funcionamiento en el puerto 3000');
});
