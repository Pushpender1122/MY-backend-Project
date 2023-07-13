const jwt = require('jsonwebtoken');
const secretKey = "kn394lmx./'g[a];[dx.z;1[2]4][][x/z";
const connection = require('../db/dbconfig')

module.exports.saferoutes = (req, res, next) => {
    const token = req.cookies.jwt;
    if (req.session.jwt == token) {
        if (token) {
            jwt.verify(token, secretKey, (err, verifyJwt) => {
                if (err) {
                    res.redirect('/login');
                }
                else {
                    if (verifyJwt) {
                        connection.query('select email,id from test3 where id = ?', [verifyJwt.id], (err, data) => {
                            // console.log(data[0].email);
                            // res.render('welcome', { email: data[0].email })
                            req.myDataEmail = data[0].email;
                            req.myDataId = data[0].id;

                            next();
                        });

                    }
                    else {
                        res.redirect('/login');
                    }
                }
            });

        }
        else {

            res.redirect('/login');
        }
    }
    else {
        res.redirect('/login');
    }
}
module.exports.adminRoute = (req, res, next) => {
    this.saferoutes;
    if (req.myDataId == '9f6666e3-1991-11ee-8f9a-0a002700000d') {
        next();
    }
    else {
        res.redirect('/welcome');
    }
}

