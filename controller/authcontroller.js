const connection = require('../db/dbconfig')
const bcrypt = require('bcrypt');
const jwt = require('../jwt/jwt_token')
const cookieParser = require('cookie-parser');
const { json } = require('body-parser');
const session = require('express-session');
const sss = require('../session/session_conf');
const path = require('path');


module.exports.login_get = (req, res) => {
    res.render('login', { Email: " ", Password: " ", email: " " });
}
module.exports.signup_get = (req, res) => {
    res.render('signup', { Email: " ", Password: " ", email: " " })

}
module.exports.login_post = (req, res) => {
    const { email, password } = req.body;
    connection.query("Select password,id from test3 where email = ?", [email], async (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            if (data.length <= 0) {
                res.render('login', { Email: "User not found ", Password: " ", email })
            }
            else {
                const checkingPassword = await bcrypt.compare(password, data[0].password);
                if (checkingPassword) {
                    //Creating jwt token
                    const token = jwt.creatingToken(data[0].id);
                    res.cookie('jwt', token, {
                        maxAge: 1000 * 60 * 60,
                        httpOnly: true
                    })
                    req.session.Email = email;
                    req.session.jwt = token;


                    const sessionEmail = {
                        session_id: req.sessionID,
                        email: email,
                        timestamp: new Date()
                    };
                    connection.query('INSERT INTO session_emails SET ?', sessionEmail, (err) => {
                        if (err) {
                            console.error('Error storing session email:', err);
                        }
                    });
                    // console.log(token);
                    // res.render('welcome', { email });

                    if (data[0].id == '9f6666e3-1991-11ee-8f9a-0a002700000d') {

                        res.redirect('/welcome/admin?data=' + email);
                    }
                    else {
                        res.redirect('/welcome?data=' + email);

                    }
                }
                else {
                    res.render('login', { Email: " ", Password: "Please Enter a correct Password", email });
                }
            }
        }

    });
}
module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(`${email} password is ${password}`);
        const hashPassword = await bcrypt.hash(password, 10);
        connection.query("insert into test3 (id,email,password) values(uuid(),?,?)", [email, hashPassword], (err, data) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    res.render('signup', { Email: "Email already exist ", Password: " ", email })
                    // res.json('Email already exist');
                }
                console.log(err);
            }
            else {
                res.redirect('/login');
            }
        })
    } catch (err) {
        console.log(err);
        res.send('err');
    }

}
module.exports.logout_get = (req, res) => {
    req.session.destroy();
    res.clearCookie('sessionID');
    res.clearCookie('jwt');
    res.redirect('/login');
}
module.exports.items_get = (req, res) => {
    connection.query('select * from item_list', (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(data);
            res.render('view-items', { data });
        }
    })
    // res.render('test');
}

module.exports.welcome_get = (req, res) => {
    var data;
    // console.log(req.session);
    if (req.myDataEmail == undefined) {

        if (req.myDataId == '9f6666e3-1991-11ee-8f9a-0a002700000d') {
            res.redirect('/welcome/admin');
        }
        else {

            res.render('welcome', { email: data, done: '' });
        }
    }
    else {
        data = req.myDataEmail;
        if (req.myDataId == '9f6666e3-1991-11ee-8f9a-0a002700000d') {
            res.redirect('/welcome/admin');
        }
        else {

            res.render('welcome', { email: data, done: '' });
        }
    }
}
//tempery disable
// module.exports.welcome_post = (req, res) => {
//     // const token = req.cookies.jwt;
//     const data = req.body.cart_item;
//     const id = req.myDataId;
//     const email = req.myDataEmail;
//     console.log(req.file);
//     connection.query('insert into cart_item (id,items) values(?,?)', [id, data], (err, data) => {
//         if (err) {
//             if (err.errno == 1062) {

//                 res.render('welcome', { email, done: 'Item already in your cart ' });
//             }

//         }
//         else {

//             res.render('welcome', { email, done: 'Done' });
//         }
//     })

//     // res.render('welcome');
// }




///I will do it later item details page
module.exports.item_details = (req, res) => {
    const itemId = req.query.uuid; // Assuming the UUID is passed as a query parameter

    // Retrieve the item details from the database based on the itemId
    // You need to implement the logic to fetch the item details from your database
    const item = {
        name: 'Example Item',
        price: 9.99,
        description: 'This is an example item description.',
        images: ['/apple/apple.jpg', '/apple/images.jpg', 'image3.jpg']
    };

    res.render('item_details', { item });
}
//admin


module.exports.add_item_get = (req, res) => {
    res.render('add-item', { err: ' ' });
}
module.exports.add_item_post = (req, res) => {
    const item_name = req.body.item_name;
    const item_price = req.body.item_price;
    var item_image = path.join(`/` + req.body.item_name, req.file.filename);
    // console.log(req.body)
    // console.log(req.file)
    item_image = item_image.replaceAll('\\', '/')
    // console.log(item_image)

    connection.query('insert into item_list (item_name,item_price,item_image) values(?,?,?)', [item_name, item_price, item_image], (err, data) => {
        if (err) {
            if (err.errno == 1062) {

                res.render('add-item', { err: 'item already ^_^' })
            }
            else {

                res.send('err');
            }
            // console.log(err);
        }
        else {

            res.render('add-item', { err: 'Done' });
        }
    })

}
module.exports.get_item_list = (req, res) => {
    connection.query('select * from item_list', (err, data) => {
        if (err) {
            console.log(err);
            res.send('err');
        }
        else {
            // console.log(data);
            res.render('item-list', { data });
        }
    })
}
//this module for delte the items
module.exports.delete_item_list = (req, res) => {
    const delete_item = req.body.data;
    connection.query('delete from item_list where item_name = ?', [delete_item], (err, data) => {
        if (err) {
            console.log(err)
            res.json({ msg: "err" });
        }
        else {
            res.json({ msg: "done" });

        }
    })
}
module.exports.put_item_list = (req, res) => {

    //do some err in query so see what err in frountend
    connection.query('update item_list set item_name = ?,item_price =? where item_name =? ', [req.body.originalContent1, +req.body.originalContent2, req.body.name], (err, data) => {
        if (err) {
            console.log(err);
            res.json({ msg: 'Not updated Try again' });
        }
        else {
            res.json({ msg: 'done' });
        }
    })
    // console.log(modifyItem);
}
module.exports.admin_get = (req, res) => {

    var data;
    if (req.myDataEmail == undefined) {

        res.render('admin-welcome', { email: data, done: '' });
    }
    else {
        data = req.myDataEmail;
        res.render('admin-welcome', { email: data, done: '' });
    }
    // res.render('admin-welcome');
}

module.exports.user_get = (req, res) => {

    const session_id = req.sessionID;
    // console.log(seesion);
    // console.log(session_id);
    connection.query('select * from session_emails', (err, data) => {
        if (err) {
            console.log(err);
        }
        else {
            // console.log(data);
            res.render('users', { data, session_id });
        }
    })
}
module.exports.user_delete = (req, res) => {
    const session_id = req.body.data;
    connection.query('delete from sessions where session_id = ?', [session_id], (err, data) => {
        if (err) {
            console.log(err);
            res.json({ msg: "err" });
        }
        else {
            res.json({ msg: "Log_out Successful" });
        }
    })
}
// module.exports.user_deleteAll = (req, res) => {
//     const email = req.body.data;
//     connection.query('select session_id from session_emails where email = ?', [email], (err, data) => {
//         if (err) {
//             console.log(err);
//             res.json({ msg: "err" });
//         }
//         else {
//             console.log(data);
//             if (data.length > 0) {
//                 data.forEach(element => {
//                     for (const value in element) {
//                         if (element[value] == req.sessionID) {
//                             // continue;
//                         }
//                         else {
//                             connection.query('delete from sessions where session_id = ?', [element[value]], (err, data) => {
//                                 if (err) {
//                                     console.log(err);
//                                     res.json({ msg: "err" });
//                                 }
//                                 else {
//                                     res.json({ msg: "Log_out Successful" });
//                                     // res.json({ msg: "Log_out Successful" });
//                                 }
//                             })

//                         }
//                     }
//                 });
//             }
//             else {
//                 res.json({ msg: "err" });
//             }


//         }
//     })
// }
//here is the updated code 
module.exports.user_deleteAll = (req, res) => {
    const email = req.body.data;

    connection.query('SELECT session_id FROM session_emails WHERE email = ?', [email], (err, data) => {
        if (err) {
            console.log(err);
            res.json({ msg: "err" });
        } else {
            console.log(data);
            if (data.length > 0) {
                const sessionIDs = data.map(element => element.session_id);

                sessionIDs.forEach(sessionID => {
                    if (sessionID !== req.sessionID) {
                        connection.query('DELETE FROM sessions WHERE session_id = ?', [sessionID], (err, result) => {
                            if (err) {
                                console.log(err);
                                res.json({ msg: "err" });
                            }
                        });
                    }
                });
                res.json({ msg: "Log_out Successful" });
            } else {
                res.json({ msg: "err" });
            }
        }
    });
}