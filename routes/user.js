const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');
const contrUser = require('../controllers/user');
const { body, validationResult } = require('express-validator');


router.get('/', authAdmin, contrUser.getAllUser);
router.get('/:id', authAdmin, contrUser.getUser);
router.post(
    '/',
    body('prenom','Prénom obligatoire (Min: 3 caratéres).').trim().isLength({ min: 3 }),
    body('nom','Nom obligatoire (Min: 3 caratéres).').trim().isLength({ min: 3 }),
    body('email','Email non valide').trim().isEmail(),
    body('tel','Numéro de telephone non valide').trim().isNumeric(),
    body('mot_de_passe','Mot de passe obligatoire (8 caractéres).').trim().isLength({min: 8}),
    contrUser.createUser
);
router.put(
	'/',auth,
    body('prenom','Prénom obligatoire (Min: 3 caratéres).').trim().isLength({ min: 3 }),
    body('nom','Nom obligatoire (Min: 3 caratéres).').trim().isLength({ min: 3 }),
    body('email','Email non valide').trim().isEmail(),
    body('tel','Numéro de telephone non valide').trim().isNumeric()
	, contrUser.updateUser);
router.put('/:id', authAdmin, contrUser.updateUser);
router.delete('/:id', authAdmin, contrUser.deleteUser);


module.exports = router