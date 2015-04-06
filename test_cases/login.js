
var common_functions = require('../helpers/common_functions.js');

var list = exports.list = {
    "VM_Login_Click": function() {
        return common_functions.clickfunction("com.builtio.vmworld.event.pex:id/user_displayname")
    },
    "VM_Login_Verify": function() {
        return common_functions.txtVerify("com.builtio.vmworld.event.pex:id/user_displayname", "Login")
    },
    "VM_Enter_Valid_Credentials_username": function() {
        return common_functions.keyboardvalue("com.builtio.vmworld.event.pex:id/userNameEditText")
    },
    "VM_Enter_Valid_Credentials_password": function() {
        return driver.elementById("com.builtio.vmworld.event.pex:id/passwordEditText").sendKeys("raw123");
    },
    "VM_Click_LoginPage": function() {
        return common_functions.clickfunction("com.builtio.vmworld.event.pex:id/loginButton")
    }
};
