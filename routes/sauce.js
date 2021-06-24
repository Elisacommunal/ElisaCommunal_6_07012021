const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauce');


router.post('/', auth, multer, sauceCtrl.createSauce); 
router.put('/:id', auth, multer, sauceCtrl.modifySauce ); 
router.delete('/:id', auth, sauceCtrl.deleteSauce); 
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/:id/like', auth, sauceCtrl.likeOrDislikeSauce)
  
  router.use((req, res, next) => {
    console.log('Requête reçue !');
    next();
  });
  
  router.use((req, res, next) => {
    res.status(201);
    next();
  });
  
  router.use((req, res, next) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
    next();
  });
  
  router.use((req, res, next) => {
    console.log('Réponse envoyée avec succès !');
  });

module.exports = router;