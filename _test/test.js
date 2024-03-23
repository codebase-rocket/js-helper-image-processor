// Info: Test Cases
'use strict';

// Shared Dependencies
var Lib = {};


// Set Configrations
const config = {};

// Dependencies
Lib.Utils = require('js-helper-utils');
Lib.Debug = require('js-helper-debug')(Lib);
Lib.Instance = require('js-helper-instance')(Lib);

var fs = require('fs');

// This Module
var image_processor = require('js-helper-image-processor')(Lib, config);


/////////////////////////////STAGE SETUP///////////////////////////////////////

// Initialize 'instance'
var instance = Lib.Instance.initialize();

// Load dummy image
var image_buffer = fs.readFileSync('dummy_data/storeClosing.png');

///////////////////////////////////////////////////////////////////////////////


/////////////////////////////////TESTS/////////////////////////////////////////

var write = async function(){

  var buffer= await image_processor.convertToGrayScaleImage(
    instance,
    image_buffer
 );

  fs.writeFileSync( 'output/test.png', buffer );

}

write();



console.log("created");


///////////////////////////////////////////////////////////////////////////////
