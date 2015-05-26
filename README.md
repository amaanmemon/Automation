# Android and iOS: Native and Hybrid Apps Testing with Appium Using Gulp and Node.js

### Requirements for iOS
 * Mac OSX 10.7+
 * Xcode 4.5+ and Command Line Tools
 * Appium Tool
 * HomeBrew (helps install software on Mac OSX)
 * Node.js (v 0.8 or greater)
 * Valid iOS Development Distribution Certificate and Provisioning Profile (for real devices)

### Requirements for Android
 * JDK
 * Android SDK
 * Appium Tool
 * Node.js (v 0.8 or greater)

### Install Tools for iOS
#####Perform the following steps in Terminal
#####Install homebrew by this command (sudo password will be prompted):
       $ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
        
#####Install libimobiledevice: a cross-platform protocol library to communicate with iOS devices
       $brew install -v --devel --fresh  automake autoconf libtool wget libimobiledevice
       
#####Install ideviceinstaller: A tool to interact with the installation_proxy of an iOS device allowing installing, upgrading, uninstalling, archiving, and restoring apps.
       $brew install -v --HEAD --fresh --build-from-source ideviceinstaller
       
###Device Settings


Android : Settings > Developer Options > On USB Debugging

iOS : Settings > Developer > Enable UIAutomation // To activate developer option at device we must start XCODE 6 

### Instead of Installing tools for Android, We must Set up ENVIRONMENTAL VARIABLES for ANDROIDSDK and JDK

1. Go to Control Panel> System and Security > System > Advance System Settings > Environmental Variable
2. In User Variables , Click New 
3. New User Variable dialog box will be displayed, Type Variable Name as 

        JAVA_HOME
        
4. Variable Value as 
 
        C://Program Files/Java/Jdk     //path to jdk

5. Repeat Step 2, Type Variable Name as

        ANDROID_HOME

6. Variable Value as 

        C://AndroidSDK              //path to ANDROIDSDK

7. Repeat Step 2, Type Variable Name as
 
        PATH

8. Variable Value as 

        %ANDROID_HOME%\platform-tools;%ANDROID_HOME%\platforms;%JAVA_HOME%\bin  

#Appium Tool

Appium is an open source testing tool that allows you to easily write functional tests to automate iOS and Android mobile applications. It is an HTTP server that manages WebDriver sessions and has support for real device testing.

### Configure Appium

##### Download and Install Appium v1.3.7
Open Appium tool to configure the following:

 * App Path: The path to the iOS application (.app, .zip, or .ipa) you wish to test.
 * Choose Button: Used to choose the path to your application
 * BundleID: The bundle ID for the application you wish Appium to use (e.g. com.yourCompany.yourApp).
 * Use Mobile Safari: This will make Appium start the Mobile Safari app instead of using a user-supplied application. BundleID or App Path should both be unchecked when this option is used.
 
### Device Settings
 * Force Device: This will make Appium force the Simulator to iPhone or iPad mode.
 * Platform Version: Version of the mobile platform.
 * Force Orientation: Force the orientation of the Simulator.
 * UDID: This is the UDID for the mobile device on which you want to run Appium. If this box is checked, Appium will use the attached iOS device. If this field is checked, bundle ID must be supplied and app path should be unchecked.
 * Show Simulator Log: If checked, the iOS simulator log will be written to the console.

### Additional Configuration for Mobile Web App Safari(Ignore While Automating iOS Native Apps)
##### Setup
 * Have the ios-webkit-debug-proxy installed

        brew install ios-webkit-debug-proxy

 * Running and listening on port 27753, Open terminal and run the following Command:

        ios-webkit-debug-proxy -c <device-id>:27753
        
 * Turn on web inspector on iOS device (settings > safari > advanced, only for iOS 6.0 and up)

 * To configure you test to run against safari simply set the "browserName" to be "Safari".

###Download Framework and Start Changes to run your FIRST TEST
1. Download the project from:
2. Go to Config directory available in the project and open config.json file and make the necessary changes
3. Below is the overview of that file

This file helps to store details of appium server, app path, desired capabilitile(device settings)

        {
	    "build_file_path_android": "./myapp.apk",  //Path to APK
	    "build_file_path_ios": "./myapp.ipa",      //Path to IPA
	    "servers": {
		"local": {
			"host": "127.0.0.1",  //Your IP Address
			"port": 4723
		    }
	    },
	    "environments": {
		"android": {
			"browserName": "",
			"appium-version": "1.3",
			"platformName": "Android",
			"platformVersion": "4.4.4",
			"deviceName": "my android device",   // adb devices
			"app": ""
		    },		
		"ios": {
			"browserName": "",
			"appium-version": "1.3",
			"platformName": "iOS",
			"platformVersion": "8.1.1",
			"deviceName": "my iOS device",    // Mobile settings
			"app": ""
		    }			
        }
        
###Working with Test Cases
Inspecting Elements:

1. For Native Android Apps use UIAutomation Viewer(androidsdk > Tools > UIAutomation Viewer)

2. For Native iOS Apps use Appium Inspector

3. For Hybrid android Apps i.e Google Chrome (Launch Google Chrome > Click Customise and Control Google Chrome > More tools > Inspect devices)

4. For Hybrid iOS Apps i.e Apple Safari (Launch Apple Safari > Develop Menu > Inspectable Devices)

###Open Cases.js file Present in Cases directory

        var common_functions = require('../helpers/common_functions.js');
        var list = exports.list = {
            // Click Element
            "Functionality_001": function() {
                return common_functions.clickfunction("LoginButton") 
            },
            //Verifying Text of element
            "Functionality_002": function() {
                return common_functions.txtVerify("LoginButton","SIGNUP")
            },
            //Entering KeyBoard Value
            "Functionality_003": function() {
                return common_functions.keyboardValue("emailAddress","hello@example.com")
            },
            //Swiping Elements
            "Functionality_004": function() {
                return common_functions.swipeElements("Notes","Sessions")
            },
            //Restart App
            "Functionality_005": function() {
                return driver.resetApp();
            }
        }
###Now, open test_flow.json file present in config directory

This File helps us to define the flow of the test cases. A test case is a set of conditions whereas test Scenario means talking and thinking requirements in detail. One of the most positive point about test scenario is good test scenarios reduces the complexity and repeatability of product. Hence, Test scenario is thread of operations so we are calling the above case as single functionality and executing it together to make a proper FLOW. You can define a single functionality to multiple times.

        {
        "Flow": [
        {
        "Test_Case_01": [
             "Functionality_001",   // Your changes goes here
             "Functionality_002",
             "Functionality_005"
            ]
        },
        {
        "Test_Case_02": [
             "Functionality_002",   // Your changes goes here
             "Functionality_003",
             "Functionality_004"
            ]
        }]
        }

###Running your test

Open terminal to run test

* ANDROID NATIVE APP: $gulp android 30                             //Record Video for 30 seconds
* ANDROID HYBRID APP: $gulp android-chrome 60                     //Record Video for 60 seconds
* iOS NATIVE APP: $gulp ios
* iOS HYBRID APP: $gulp ios-safari

###Additional: Switch Tabs of Chrome and Safari
        return common_functions.switchTab("2") //Navigate to Second Tab and Just Mention "Switch_Tab" in test_flow.json file as a functionality.
        
This document will guide you regarding one-to-one scenario of gulp framework. In conclusion it can be said that this is successful automation tool that depends on a standard testing process.
I hope this was a helpful guide to automate android and iOS: Native and Hybrid Apps Testing with Appium Using Gulp and Node.js
    
 




