const Admin = require('../models/adminModel');

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* exports.create_admin_post = [
  body('adminName', 'Admin Name required.')
      .trim()
      .isLength({min: 1})
      .withMessage('Enter your Admin name')
      .isAlphanumeric()
      .withMessage('Enter only alphanumeric characters')
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
      .withMessage('Enter only alphanumeric characters')
      .escape(),
  body('confirmPassword', 'Password confirmation required')
      .trim()
      .isLength({min: 4})
      .withMessage('Password must have 4 characters at least')
      .isAlphanumeric()
      .withMessage('Enter only alphanumeric characters')
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
      .withMessage('Enter only alphanumeric characters')
      .custom(async (value) => {
        if (value === process.env.ADMIN_PASSCODE) {
          return true;
        } else {
          throw new Error('Passcode invalid')
        }
      })
      .escape(),
  (req, res, next) => {
    const errors = validationResult();
    if (!errors.isEmpty()) {
      res.json({message: 'The admin has not been created', errors});
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) return next(err);
        const admin = new Admin({
          adminName: req.body.adminName,
          password: hashedPassword
        }).save(err => {
          if (err) res.json({message: 'The admin has not been created', errors: err});
          res.json({message: 'Admin created', adminName: admin.adminName});
        });
      })
    }
  }
]; */

exports.create_admin_post = function (req, res, next) {
  console.log('Content type', req.header('Content-Type'));
  console.log(req.params);
  /* console.log('Content type', req.header('Content-Type')); */
  res.json(req.body);
};

exports.admin_login_post = [
  body('adminName', 'Admin Name required.')
    .trim()
    .isLength({min: 1})
    .withMessage('Enter your Admin name')
    .isAlphanumeric()
    .withMessage('Enter only alphanumeric characters')
    .escape(),
  body('password', 'Password required')
    .trim()
    .isLength({min: 4})
    .withMessage('Password must have 4 characters at least')
    .isAlphanumeric()
    .withMessage('Enter only alphanumeric characters')
    .escape(),
  (req, res, next) => {
    const errors = validationResult();
    if (!errors.isEmpty()) {
      res.json({message: 'Admin login not done', errors});
    } else {
      Admin.findOne({adminName: req.body.adminName}, 'adminName password')
           .exec((err, admin) => {
             if (err) res.json({message: 'Admin does not exist', errors: err});
             bcrypt.compare(req.body.password, admin.password, (err, result) => {
               if (err) res.status(401).json({message: 'Invalid password', errors: err});
               if (result) {
                const options = {expiresIn: 28_800};
                const secret = process.env.ADMIN_PASSCODE;
                const token = jwt.sign({ user: admin.adminName }, secret, options);
                res.status(200).json({message: 'Admin logged', token});
               }
             })
           })
    }
  }
];
