var fs = require('fs');

var _ = require('underscore'),
    wd = require("wd"),
    unorm = require("unorm"),
    Q = require('q');

var test = require('../test.js');


var date = new Date();
var dt = date.getDate();
var mt = date.getMonth();
var yr = date.getYear();
var h = date.getHours();
var m = date.getMinutes();
var s = date.getSeconds();
var filenamemail = "result-" + dt + "-" + mt + "-" + yr + "----" + h + "-" + m + "-" + s + ".html"
var results_path = "D:\\demo_gulp\\gulp\\result\\" + filenamemail;
var startTime = date;
var Pass = 0;
var Fail = 0;

exports.fileName = function() {
    return filenamemail;
}

GLOBAL.result = exports.result = function(TCID, data, res, f) {
    if (res == "Pass") {
        return "<tr><td><font color='green'>" + TCID + "</font></td><td><font color='green'>" + data + "</font></td><td><font color='green'>" + res + " </font></td><td><font color='green'>&nbsp;</font></td></tr>";
    } else if (res == "Fail") {
        return "<tr><td><font color='red'>" + TCID + "</font></td><td><font color='red'>" + data + "</font></td><td><font color='red'>" + res + " </font></td><td><font color='green'><a href="+f+">View</a></font></td></tr>";
    }
};

exports.myresults_path = function() {
    return results_path;
}

exports.finalResult = function() {
    var endDate = new Date();
    var totalTestcase = test.PassCases() + test.FailCases();
    var data = fs.readFileSync(results_path);
    var fd = fs.openSync(results_path, 'w+');
    var finalcount = "<style>td{font-weight:bold;}</style><h1 align='center'>Test Summary</h1><table border='1' align='center' width=800> <tr><td> Project Name </td> <td>Android PEX 2015</td></tr> <tr><td> Start time </td>  <td>" + startTime + "</td></tr> <tr><td>End time </td><td> " + endDate + "</td></tr>  <tr><td> Total TestCases </td>   <td>" + totalTestcase + "</td></tr>  <tr><td>Pass </td> <td>" + test.PassCases() + "</td> </tr> <tr><td>" + "Fail </td> <td> " + test.FailCases() + "</td> </tr><tr><td>Report Video</td><td><a href='video.html'>View</td></tr> </table> <br> <table border='1' align='center' width=800><tr><th><b>Test-ID</b></th><th><b>Description</b></th><th><b>Result</b></th><th><b>ScreenShot</b></th><tr>";
    var buffer = new Buffer(finalcount);
    fs.writeSync(fd, buffer, 0, buffer.length);
    fs.writeSync(fd, data, 0, data.length);
    fs.close(fd);
    return "Pass";

}

exports.txtVerify = function(el, expect) {
    debugger;
    return GLOBAL.driver
        .elementById(el).then(function(actual) {
            debugger;
            return actual.text().then(function(actual1) {
                if (actual1 == expect) {
                    console.log(Pass);
                    return "Pass";
                } 
            })
        }).catch(function(err) {
            debugger;
            return err;

        });

};

exports.txtVerify_name = function(el) {
    debugger;
    return GLOBAL.driver
        .elementByName(el).then(function(actual) {
            debugger;
            return actual.text().then(function(actual1) {
                if (actual1 == expect) {
                    console.log(Pass);
                    return "Pass";
                } 
            })
        }).catch(function(err) {
            debugger;
            return err;

        });
};

exports.clickfunction = function(el) {
    debugger;
    return GLOBAL.driver
        .elementById(el).then(function(actual) {
            debugger;
            return actual.click().then(function(actual1) {
                console.log(Pass);
                return "Pass";
            })
        }).catch(function(err) {
            debugger;
            console.log(Fail);
            return err;

        });
};

exports.clickfunction_name = function(el) {
    debugger;
    return GLOBAL.driver
        .elementByName(el).then(function(actual) {
            debugger;
            return actual.click().then(function(actual1) {
                console.log(Pass);
                return "Pass";
            })
        }).catch(function(err) {
            debugger;
            console.log(Fail);
            return err;
        });
};

exports.clickfunction_index_id = function(el, index) {
    debugger;
    return GLOBAL.driver
        .elementsById(el).at(index).then(function(actual) {
            debugger;
            return actual.click().then(function(actual1) {
                console.log(Pass);
                return "Pass";
            })
        }).catch(function(err) {
            debugger;
            console.log(Fail);
            return err;
        });
};

exports.clickfunction_index_name = function(el, index) {
    debugger;
    return GLOBAL.driver
        .elementsByName(el).at(index).then(function(actual) {
            debugger;
            return actual.click().then(function(actual1) {
                console.log(Pass);
                return "Pass";
            })
        }).catch(function(err) {
            debugger;
            console.log(Fail);
            return err;
        });
};

exports.clickByxpath = function(el) {
    debugger;
    GLOBAL.driver
    .findElement(webdriver.By.xpath(el)).then(function(actual) {
            debugger;
            return actual.click().then(function(actual1) {
                console.log(Pass);
                return "Pass";
            })
        }).catch(function(err) {
            debugger;
            console.log(Fail);
            return err;
        });
};

exports.keyboardvalue = function(el) {
    debugger;
    return GLOBAL.driver
        .elementById(el).then(function(actual) {
            debugger;
            return actual.sendKeys("nikhil.jain").then(function(actual1) {
                    return "Pass";
            })
        }).catch(function(err) {
            debugger;
            return err;
    });

};