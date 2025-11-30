const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do Multer (mantida aqui)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'public/uploads';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage: storage });

// Rotas CRUD de Livros
router.get('/', bookController.getAllBooks);
router.post('/', upload.single('imagem'), bookController.createBook);
router.get('/:id', bookController.getBookById); 
router.put('/:id', upload.single('imagem'), bookController.updateBook); 
router.delete('/:id', bookController.deleteBook); 

module.exports = router;