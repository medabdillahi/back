const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');

exports.getAllUser = (req, res) => {
    var filter = (req.query.filter) ? req.query.filter : '' ;
    User.find({ nom: { $regex : filter, $options : 'i' }})
        .then(users => res.json(users))
        .catch(error => res.json({ error }));
};

exports.getUser = (req, res) => {
    if(req.params.id) {
        console.log(req.params.id)
        User.findOne({ _id: req.params.id })
        .then(user => res.status(201).json(user))
        .catch(error => res.json({ error }));
    }
};

exports.createUser = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status('200').json({ errors: errors.array()});
    }

    User.findOne({ email: req.body.email })
    .then(user => {
        if(user) {
            console.log(user)
            res.status('200').json({ message: "Cette adresse mail est déja utilisée" });
        }
        else {
            bcrypt.hash(req.body.mot_de_passe, 10)
            .then(hash => {
                var user = new User({
                    prenom: req.body.prenom,
                    nom: req.body.nom,
                    tel: req.body.tel,
                    email: req.body.email,
                    type: req.body.type,
                    mot_de_passe: hash
                })
                user.save()
                    .then(() => { res.status('201').json({ message: 'Utilisateur créer !'})})
                    .catch(error => res.status('401').json({ error }));
            })
            .catch(error => res.status('401').json({ error }));
        }
    });
    
};

exports.updateUser = (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status('200').json({ errors: errors.array()});
    }
    else {
        if(req.params.id) {
            User.updateOne({ _id: req.params.id }, {
                prenom: req.body.prenom,
                nom: req.body.nom,
                tel: req.body.tel,
                email: req.body.email,
                type: req.body.type
            })
            .then(() => {
                res.status(201).json({ message: 'Mise a jour effectué !' })
            })
            .catch(error => res.json({ error }));
        }
        else {
            res.status(401);
        }
    }
    
};

exports.deleteUser = (req, res) => {
    User.deleteOne({ _id: req.params.id })
        .then(() => res.json({ message: 'user deleted !' }))
        .catch(error => res.json({ error }));
};

exports.login = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status('200').json({ errors: errors.array()});
    }

    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(200).json({ errors: [{msg : 'Utilisateur non trouvé !'}]  });
        }
        bcrypt.compare(req.body.mot_de_passe, user.mot_de_passe)
          .then(valid => {
            if (!valid) {
              return res.status(200).json({ errors: [{msg :'Mot de passe incorrect !'}] });
            }
            res.status(201).json({
                id: user._id,
                nom: user.nom,
                prenom: user.prenom,
                tel: user.tel,
                email: user.email,
                type: user.type,
                token: jwt.sign(
                    { id: user._id,
                    type: user.type},
                    'RANDOM_TOKEN_SECRET',
                    { expiresIn: '24h' }
                )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};