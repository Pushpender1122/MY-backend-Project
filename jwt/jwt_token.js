const jwt = require('jsonwebtoken');


// console.log(process.env.secretKey)
const secretKey = "kn394lmx./'g[a];[dx.z;1[2]4][][x/z";


module.exports.creatingToken = (id) => {
    return jwt.sign({ id }, secretKey, {
        expiresIn: "1h"
    })


}
