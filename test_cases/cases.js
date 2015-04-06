var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
var when = require('when');
var wd = require("wd");

var scrollpinch = [];

var nodemailer = require('nodemailer');

var common_functions = require('../helpers/common_functions.js');

var list = exports.list = {
    // The below are the cases
	 "UI_Splash": function() { 
        debugger;
        return common_functions.txtVerify("com.builtio.vmworld.event.pex:id/splash_loadingTextForPex");
    },
    "Web_Chrome": function() { 
      return common_functions.clickByxpath("//i[@class='fa fa-bars']")
    },
    "VM_DontAllow_Push_Notifications": function() {
           debugger;
        return common_functions.clickfunction("android:id/button2")
    },
    "VM_Left_Menu_Click": function() {
        return common_functions.clickfunction("com.builtio.vmworld.event.pex:id/left_menu_textview")
    },
    "Reset_App": function() {
      return driver.resetApp().then(function(){
        console.log("reset app call back");
        return "Pass";
      });
    },
    // below case is used to send the report as mail
     "VM_Send_Mail": function() {
        var smtpTransport = nodemailer.createTransport("SMTP", {
            service: "Gmail",
            auth: {
                user: "you@gmail.com",
                pass: "*****"
            }
        });

        var mailOptions = {
            from: "yourname <you@gmail.com>",
            to: "send@gmail.com, ",
            subject: "Testing Report",
            html: "<b>Hi Team,</b><br><br>PFA Report<br><br>Thanks,<br>Amaan",
            attachments: [{
                filename: common_functions.fileName(),
                path: "./result/" + common_functions.fileName(),
                contentType: "text/plain",
                streamSource: fs.createReadStream("./result/" + common_functions.fileName())

            }]
        }
        var promise = when.promise(function(resolve, reject, notify) {
            smtpTransport.sendMail(mailOptions,
                function(err) {
                    if (!err) {
                        resolve('Email send ...');
                    } else reject(sys.inspect(err));
                });
        });
        promise.then(function(res) {
            console.log('P', res);
        }).catch(function(err)
        {
            return err;
        })
    },
    "VM_Back": function() {
        return driver.back();
    },
    "VM_Sleep": function() {
        return driver.sleep(4000).then(function()
        {
            return "Pass";
        })
    },

    // below case is used to make result html file
    "VM_Final_Result": function(callback)
     {
      return common_functions.finalResult(callback);
    },
    // below case is used to transfer video recording from SD card to the local machine
    "VM_Video_Record_Stop": function() {
            var callback = function (error, stdout, stderr) {
            sys.print('stdout: ' + stdout);
            sys.print('stderr: ' + stderr);
            if (error !== null) {
                console.log('exec error: ' + error);
            }
        };
        when.try(exec, "adb pull /sdcard/PEX2015.mp4 ./result/PEX2015.mp4", callback);
        return "Pass";
    },
     "VM_Left_Menu_Scroll": function()
     {
       wd.addPromiseChainMethod('swipe', swipe);
       return GLOBAL.driver.elementByName("Daily Highlights").getLocation().then(function(loc1)
       {
      return GLOBAL.driver.elementByName("Sessions").getLocation().then(function(loc2)
     {
     scrollpinch.push(loc1,loc2);
     var els1  = scrollpinch[0];
     var els2 = scrollpinch[1];
     return driver.swipe({ startX: els2.x, startY: els2.y,
         endX: els1.x,  endY: els1.y, duration: 800 });
     });
     });

      function swipe(opts) {
     var action = new wd.TouchAction(this);
     action
       .press({x: opts.startX, y: opts.startY})
       .wait(opts.duration)
       .moveTo({x: opts.endX, y: opts.endY})
       .release();
       action.perform();
       return "Pass";
   }
   }
};

