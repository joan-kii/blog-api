const Admin = require('../models/adminModel');

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const jwtOptions = {expiresIn: 28_800};
const jwtSecret = process.env.ADMIN_PASSCODE;

exports.create_admin_post = [
  body('adminName', 'Admin Name required.')
      .trim()
      .isLength({min: 1})
      .withMessage('Enter your Admin name')
      .isAlphanumeric()
      .withMessage('Admin Name must have only alphanumeric characters')
      .custom(async (value) => {
        const checkAdminName = await Admin.findOne({adminName: value});
        if (checkAdminName) {
          return Promise.reject();
        } else {
          return Promise.resolve();
        }
      })
      .withMessage('An admin with this Admin name already exists')
      .escape(),
  body('password', 'Password required')
      .trim()
      .isLength({min: 4})
      .withMessage('Password must have 4 characters at least')
      .isAlphanumeric()
      .withMessage('Password must have only alphanumeric characters')
      .escape(),
  body('confirmPassword', 'Password confirmation required')
      .trim()
      .isLength({min: 4})
      .withMessage('Password must have 4 characters at least')
      .isAlphanumeric()
      .withMessage('Passwordmust have only alphanumeric characters')
      .custom(async (value, { req }) => {
        if (value === req.body.password) {
          return true;
        } else {
          throw new Error('Password confirmation must match password');
        }
      })
      .escape(),
  body('passcode', 'Passcode required')
      .trim()
      .isLength({min: 12, max: 12})
      .withMessage('Wrong passcode length')
      .isAlphanumeric()
      .withMessage('Password must have only alphanumeric characters')
      .custom(async (value) => {
        if (value === process.env.ADMIN_PASSCODE) {
          return true;
        } else {
          throw new Error('Passcode invalid')
        }
      })
      .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({message: errors.array({onlyFirstError: true}), errors});
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        const admin = new Admin({
          adminName: req.body.adminName,
          password: hashedPassword
        }).save((err, admin) => {
          if (err) res.json({message: 'The admin has not been created', errors: err});
          const token = jwt.sign({ user: admin.adminName }, jwtSecret, jwtOptions);
          res.json({message: 'Admin created', user: admin.adminName, token});
        });
      })
    }
  }
];

exports.admin_login_post = [
  body('adminName', 'Admin Name required.')
    .trim()
    .isLength({min: 1})
    .withMessage('Enter your Admin name')
    .isAlphanumeric()
    .withMessage('Adm Name must have only alphanumeric characters')
    .escape(),
  body('password', 'Password required')
    .trim()
    .isLength({min: 4})
    .withMessage('Password must have 4 characters at least')
    .isAlphanumeric()
    .withMessage('Password must have only alphanumeric characters')
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({message: errors.array({onlyFirstError: true}), errors});
    } else {
      Admin.findOne({adminName: req.body.adminName}, 'adminName password')
           .exec((err, admin) => {
             if (err) res.json({message: 'Admin does not exist', errors: err});
             bcrypt.compare(req.body.password, admin.password, (error, result) => {
               if (err) res.status(500).json({
                 message: 'Something wrong in the server. Try it later', 
                 errors: error
                })
               if (!result) res.status(401).json({message: 'Invalid password', errors: error});
               if (result) {
                const token = jwt.sign({ user: admin.adminName }, jwtSecret, jwtOptions);
                res.status(200).json({message: 'Admin logged', user: admin.adminName, token});
               }
             })
           })
    }
  }
];
