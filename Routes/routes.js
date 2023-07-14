const express = require("express");
const multer = require('multer');
const authcontroller = require("../controller/authcontroller");
const { saferoutes } = require('../middleware/routes_middleware');
const { adminRoute } = require('../middleware/routes_middleware');
const sess = require('../session/session_conf');


const fs = require('fs');

const routes = express();
routes.use(sess);
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const path = `./uploads/${req.body.item_name}`;
        //recursive : true means if folder already exist they does not throw err if if false it throw err when folder already exist
        fs.mkdirSync(path, { recursive: true });
        cb(null, path);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
})
const upload = multer({ storage })



routes.get("/login", authcontroller.login_get);
routes.post("/login", authcontroller.login_post);
routes.get("/signup", authcontroller.signup_get);
routes.post("/signup", authcontroller.signup_post);
routes.get("/logout", saferoutes, authcontroller.logout_get);
// routes.post("/welcome", saferoutes, upload.single('U_file'), authcontroller.welcome_post);
routes.get("/welcome", saferoutes, authcontroller.welcome_get);
routes.get("/welcome/items", authcontroller.items_get);
routes.get("/item-details", authcontroller.item_details);
// routes.get("/fruits", authcontroller.fruits);

// admin page

routes.get("/welcome/admin", saferoutes, adminRoute, authcontroller.admin_get);
routes.get("/welcome/admin/add-item", saferoutes, adminRoute, authcontroller.add_item_get);
routes.post("/welcome/admin/add-item", saferoutes, adminRoute, upload.single('item_img'), authcontroller.add_item_post);
routes.get("/welcome/admin/item-list", saferoutes, adminRoute, authcontroller.get_item_list);
routes.put("/welcome/admin/item-list", saferoutes, adminRoute, authcontroller.put_item_list);
routes.delete("/welcome/admin/item-list", saferoutes, adminRoute, authcontroller.delete_item_list);
routes.get("/welcome/admin/users", saferoutes, adminRoute, authcontroller.user_get);
routes.delete("/welcome/admin/users", saferoutes, adminRoute, authcontroller.user_delete);
routes.delete("/welcome/admin/usersAll", saferoutes, adminRoute, authcontroller.user_deleteAll);



module.exports = routes; 