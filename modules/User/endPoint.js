const { roles } = require("../../middlewear/auth");


const endPoint = {

    Profile: [roles.Admin, roles.User],
    UpdatePassword: [roles.Admin],
    allUser :[roles.Admin]
}


module.exports= endPoint