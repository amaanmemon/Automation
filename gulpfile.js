var gulp = require('gulp'); 
var jshint = require('gulp-jshint');
var test = require('./test.js');
var config = require('./config/config.json');
var argv = require('yargs').argv;
var time;

var sys = require('sys');
var exec = require('child_process').exec;
var child;

gulp.task('jshint', function(callback) {
	return gulp.src(['./test_cases/*.js', './test_cases/**/**.js'])
		.pipe(jshint())
		.pipe(jshint.reporter('default'))
		.pipe(jshint.reporter('fail'));
});

gulp.task('android', function() {
	debugger;
	time = process.argv[4];
	console.log(time);
	test.init(function() {
		console.log("Drivers got initialized successfully.");
		 child = exec("adb shell screenrecord --bit-rate 8000000 --time-limit "+time+" /sdcard/PEX2015.mp4", function(error, stdout, stderr) {
                            sys.print('stdout: ' + stdout);
                            sys.print('stderr: ' + stderr);
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            }
                        });
		test.run(function(){
			console.log("Testcases got executed successfully.");
			driver.quit(30000);
		});	
	});

});

gulp.task('android-chrome', function() {
	debugger;
	time = process.argv[4];
	test.init_chrome(function() {
		console.log("Drivers got initialized successfully.");
		console.log("Drivers got initialized successfully.");
		 child = exec("adb shell screenrecord --bit-rate 8000000 --time-limit "+time+" /sdcard/PEX2015.mp4", function(error, stdout, stderr) {
                            sys.print('stdout: ' + stdout);
                            sys.print('stderr: ' + stderr);
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            }
                        });
		 	console.log("adb shell screenrecord --bit-rate 8000000 --time-limit "+time+" /sdcard/PEX2015.mp4");
		test.run(function(){
			console.log("Testcases got executed successfully.");
			driver.quit(30000);
		});	
	});

});

gulp.task('ios', function() {
	debugger;
	test.initios(function() {
		console.log("Drivers got initialized successfully.");
		test.runios(function(){
		console.log("Testcases got executed successfully.");
		});	
	});
});

gulp.task('ios-safari', function() {
	debugger;
	test.initios_safari(function() {
		console.log("Drivers got initialized successfully.");
		test.runios(function(){
		console.log("Testcases got executed successfully.");
		});	
	});
});


