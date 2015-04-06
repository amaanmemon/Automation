"use strict";

require("./helpers/setup");

var unorm = require("unorm"),
    wd = require("wd"),
    _ = require('underscore'),
    STACKIFY = require('stackify'),
    Q = require('q'),
    require_directory = require('require-directory'),
    fs = require('fs');

GLOBAL.webdriver = require('selenium-webdriver');
var config = require('./config/config.json');
var test_flow = require('./config/test_flow.json');
var i = 0;
var print = "";
var test_data = require('./test_data.js');
var test_count = 0;

var sys = require('sys');
var exec = require('child_process').exec;
var child;

var Pass = 0;
var Fail = 0;

var common_functions = require('./helpers/common_functions.js');

exports.PassCases = function() {
    return Pass;
}

exports.FailCases = function() {
    return Fail;
}

var get_test_cases_list = function(callback) {
    debugger;

    var case_list = {};
    var cases = require_directory(module, './test_cases');
    for (var item in cases) { // This will allows you take test cases from multiple files present in cases folder
        for (var sub_item in cases[item]["list"]) {
            if (typeof(case_list[sub_item]) == "undefined") {
                case_list[sub_item] = cases[item]["list"][sub_item];
            }
        }
    }

    callback(case_list);
};

var init = exports.init = function(callback) { // This function is used to load appium drivers
    try {
        var serverConfig = config.servers.local; // Appium Server details imported from config.json present in config folder
        GLOBAL.driver = wd.promiseChainRemote(serverConfig);
        require("./helpers/logging").configure(driver);

        var desired = _.clone(config.environments.android18); // Device setting imported from config.json present in config folder
        desired.app = config.build_file_path; // // App_path imported from config.json present in config folder

        GLOBAL.driver
            .init(desired)
            .setImplicitWaitTimeout(10000);

        debugger;
        setTimeout(function() {
            callback();
        }, 50000); // This will wait for 20 seconds until the driver loads and app starts

    } catch (e) {
        callback(e);
    }
};

var init_chrome = exports.init_chrome = function(callback) {
    try {
        GLOBAL.driver = new webdriver.Builder().
        withCapabilities(config.environments.android19).
        usingServer('http://172.16.0.220:4723/wd/hub').
        build();
        driver.get('http://pex.builtapp.io/');

        debugger;
        setTimeout(function() {
            callback();
        }, 50000);

    } catch (e) {
        callback(e);
    }
};

var initios = exports.initios = function(callback) { // This function is used to load appium drivers
    try {
        var serverConfig = config.servers.local;
        GLOBAL.driver = wd.promiseChainRemote(serverConfig);
        require("./helpers/logging").configure(driver);


        var desired = _.clone(config.environments.ios81);
        desired.app = config.build_file_path_ios;

        GLOBAL.driver
            .init(desired)
            .setImplicitWaitTimeout(10000);

        debugger;
        setTimeout(function() {
            callback();
        }, 50000); // This will wait for 50 seconds until the driver loads and app starts
    } catch (e) {
        callback(e);
    }
};

var initios_safari = exports.initios_safari = function(callback) { // This function is used to load appium drivers
    try {
        var serverConfig = config.servers.local;
        GLOBAL.driver = wd.promiseChainRemote(serverConfig);
        require("./helpers/logging").configure(driver);

        var desired = _.clone(config.environments.ios82);
        desired.browserName = 'safari';

        GLOBAL.driver
            .init(desired)
            .setImplicitWaitTimeout(10000);

        debugger;
        setTimeout(function() {
            callback();
        }, 50000); // This will wait for 50 seconds until the driver loads and app starts
    } catch (e) {
        callback(e);
    }
};

var run = exports.run = function(callback) {

    try {
        debugger;
        // below are the steps to record video using command prompt and store the same in the device memory

        // below function will add child item one by one presented in a single flow
        var stackify_processor = new STACKIFY(function(index, stackify) {
            var item = stackify.item(index);
            var flow_name = stackify.options.flow_name;
            try {
                item.call().done(function(output) { //call from cases file to perform
                    if (output == "Pass") { // if the child item return value as "Pass" then will it execute another child item else it will execute the another flow and make the test case as fail
                        print = "yes";
                        stackify.next(index, "Function got Executed: " + index); // This will execue another child item
                    } else {
                        print = "no";
                        Fail++
                        ++i
                        test_count++;
                        child = exec("adb shell screencap -p /sdcard/" + flow_name + ".png", function(error, stdout, stderr) { // this allows you to take screenshot of failed testcase and store in the device memory
                            sys.print('stdout: ' + stdout);
                            sys.print('stderr: ' + stderr);
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            }
                        });
                        child = exec("adb pull /sdcard/" + flow_name + ".png ./result/" + flow_name + ".png", function(error, stdout, stderr) { // this will sore the above screenshot to the desktop 
                            sys.print('stdout: ' + stdout);
                            sys.print('stderr: ' + stderr);
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            }
                        });
                        fs.appendFile(common_functions.myresults_path(), common_functions.result("TCID-" + test_count, test_data.test_detail[flow_name], 'Fail', flow_name + ".png")); // This will print the failed testcase in the result file
                        stackify.parent.next(stackify.parent.index, "Function got Executed: " + index); // this will directly jump to the another flow and will skip all the child items
                    }
                });
            } catch (e) {
                stackify.error(index, e);
            }
        }, function(index, stackify) {}, function(index, stackify) {
            stackify.parent.next(stackify.parent.index, "Function got Executed: " + index);
        });

        var flow_details = function(item) {
            debugger;
            var flow_name = "";
            var function_name_list = [];

            for (var key in item) {
                debugger;
                function_name_list = item[key];
                flow_name = key;
            }

            return {
                "flow_name": flow_name,
                "function_name_list": function_name_list
            };
        };

        var stackify_parent_processor = new STACKIFY(function(index, stackify_parent) {
            debugger;
            var item = stackify_parent.item(index);
            var flow_det = flow_details(item);
            var function_list = [];


            for (var i = 0, length = flow_det.function_name_list.length; i < length; i++) {
                function_list.push(stackify_parent.options.steps[flow_det.function_name_list[i]]);
            }

            console.log("Executing- " + flow_det.flow_name);
            stackify_processor.process({
                'items': function_list,
                'slab': 1,
                'flow_name': flow_det.flow_name
            }, stackify_parent);
        }, function(index, stackify_parent) {
            var item = stackify_parent.item(index);
            var flow_det = flow_details(item);
            if (print != "no") {
                ++i
                console.log("Case: " + i + " Executed")
                test_count++;
                Pass++;
                fs.appendFile(common_functions.myresults_path(), common_functions.result("TCID-" + test_count, test_data.test_detail[flow_det.flow_name], 'Pass', i));
            }
            debugger;
        }, function(index, stackify_parent) {
            callback(stackify_parent.requests);
        }, 'stackify_parent_processor');

        get_test_cases_list(function(test_cases) {
            debugger;
            if (config.execute == "flow") {

                var flow = {};
                var flow_type = "default";
                try {
                    if (config.session.is_authenticated) {
                        flow_type = "authenticated";
                    } else {
                        flow_type = "un_authenticated";
                    }
                } catch (e) {}

                console.log("Executing " + flow_type + " flow.");
                flow = test_flow[flow_type];

                stackify_parent_processor.process({
                    'items': flow,
                    'steps': test_cases,
                    'slab': 1

                });

            } else {
                var function_list = [];
                for (var item in test_cases) {
                    function_list.push({
                        "name": item,
                        "func": test_cases[item]
                    });
                }

                stackify_processor.process({
                    'items': function_list,
                    'slab': 1
                });
            }
        });


    } catch (e) {
        callback(e);
    }
};

var runios = exports.runios = function(callback) {
    console.log("Executing Run Function");
    try {
        debugger;
        var stackify_processor = new STACKIFY(function(index, stackify) {
            var item = stackify.item(index);
            var flow_name = stackify.options.flow_name;
            try {
                item.call().done(function(output) { //call from cases file to perform
                    if (output == "Pass") {
                        print = "yes"; // if the child item return value as "Pass" then will it execute another child item else it will execute the another flow and make the test case as fail
                        stackify.next(index, "Function got Executed: " + index); // This will execue another child item
                    } else {
                        print = "no";
                        Fail++
                        ++i
                        test_count++;
                        child = exec("idevicescreenshot ./result/" + flow_name + "", function(error, stdout, stderr) { // this allows you to take screenshot of failed testcase and store in the device memory
                            sys.print('stdout: ' + stdout);
                            sys.print('stderr: ' + stderr);
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            }
                        });
                        fs.appendFile(common_functions.myresults_path(), common_functions.result("TCID-" + test_count, test_data.test_detail[flow_name], 'Fail', flow_name + ".tiff")); // This will print the failed testcase in the result file
                        stackify.parent.next(stackify.parent.index, "Function got Executed: " + index); // this will directly jump to the another flow and will skip all the child items
                    }
                });
            } catch (e) {
                stackify.error(index, e);
            }
        }, function(index, stackify) {}, function(index, stackify) {
            stackify.parent.next(stackify.parent.index, "Function got Executed: " + index);
        });

        var flow_details = function(item) {
            debugger;
            var flow_name = "";
            var function_name_list = [];

            for (var key in item) {
                debugger;
                function_name_list = item[key];
                flow_name = key;
            }

            return {
                "flow_name": flow_name,
                "function_name_list": function_name_list
            };
        };

        var stackify_parent_processor = new STACKIFY(function(index, stackify_parent) {
            debugger;
            var item = stackify_parent.item(index);
            var flow_det = flow_details(item);
            var function_list = [];


            for (var i = 0, length = flow_det.function_name_list.length; i < length; i++) {
                function_list.push(stackify_parent.options.steps[flow_det.function_name_list[i]]);
            }

            console.log("Executing- " + flow_det.flow_name);
            stackify_processor.process({
                'items': function_list,
                'slab': 1,
                'flow_name': flow_det.flow_name
            }, stackify_parent);
        }, function(index, stackify_parent) {
            var item = stackify_parent.item(index);
            var flow_det = flow_details(item);
            if (print != "no") {
                ++i
                console.log("Case: " + i + " Executed")
                test_count++;
                Pass++;
                console.log(Pass);
                fs.appendFile(common_functions.myresults_path(), common_functions.result("TCID-" + test_count, test_data.test_detail[flow_det.flow_name], 'Pass', i));
            }
            debugger;
        }, function(index, stackify_parent) {
            callback(stackify_parent.requests);
        }, 'stackify_parent_processor');

        get_test_cases_list(function(test_cases) {
            debugger;
            if (config.execute == "flow") {
                var flow = {};
                var flow_type = "default";
                try {
                    if (config.session.is_authenticated) {
                        flow_type = "authenticated";
                    } else {
                        flow_type = "un_authenticated";
                    }
                } catch (e) {}

                console.log("Executing " + flow_type + " flow.");
                flow = test_flow[flow_type];

                stackify_parent_processor.process({
                    'items': flow,
                    'steps': test_cases,
                    'slab': 1

                });

            } else {
                var function_list = [];
                for (var item in test_cases) {
                    function_list.push({
                        "name": item,
                        "func": test_cases[item]
                    });
                }

                stackify_processor.process({
                    'items': function_list,
                    'slab': 1
                });
            }
        });

    } catch (e) {
        console.log("Error: ", e);
        callback(e);
    }
};