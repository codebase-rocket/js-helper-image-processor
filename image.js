// Note: Process Image according to given Options
'use strict';

// Shared Dependencies (Managed by Loader)
var Lib = {};

// Image processor library - Graphics-Magick (Private Scope)


// Exclusive Dependencies
var CONFIG = require('./config'); // Loader can override with custom-config



/////////////////////////// Module-Loader START ////////////////////////////////

/********************************************************************
Load dependencies and configurations

@param {Set} shared_libs - Reference to libraries already loaded in memory by other modules
@param {Set} config - Custom configuration in key-value pairs

@return nothing
*********************************************************************/
const loader = function(shared_libs, config){

  // Shared Dependencies (Must be loaded in memory already)
  Lib.Utils = shared_libs.Utils;
  Lib.Debug = shared_libs.Debug;
  Lib.Instance = shared_libs.Instance;

  // Override default configuration
  if( !Lib.Utils.isNullOrUndefined(config) ){
    Object.assign(CONFIG, config); // Merge custom configuration with defaults
  }

};

/////////////////////////// Module-Loader END //////////////////////////////////



/////////////////////////// Module Exports START ///////////////////////////////

module.exports = function(shared_libs, config){

  // Run Loader
  loader(shared_libs, config);

  // Return Public Functions Of This Module
  return ImageProcessor;

}



/////////////////////////// Public Functions START /////////////////////////////

const ImageProcessor = {

  /*******************************************************************
  Convert Image Into GrayScale without alpha

  @param {reference} instance - Request Instance object reference
  @param {Buffer} input_image_buffer - Image Buffer

  @Promise {Buffer} gray_scale_image_buffer - Return GrayScale image data in buffer
  *******************************************************************/
  convertToGrayScaleImage: function( instance, input_image_buffer){

    // Initialize if not already
    _ImageProcessor.initIfNot(instance);

    // Return Promise
    return new Promise(async function(resolve, reject){

      try{

        var image = instance['image']['gm'](input_image_buffer);
        image.channel('gray'); // Grayscale | without alpha | 8 bit
        image.threshold('54%'); //  dither | 1 bit


        // Creating Image Buffer
        image.toBuffer(function(err, buffer){

          // Return GrayScale Image
          resolve(buffer);

        });

      }
      catch(err){
        reject(err);
      }

    })

  },


  /*******************************************************************
  Resize Image

  @param {reference} instance - Request Instance object reference
  @param {Buffer} input_image_buffer - Image Buffer
  @param {Set} image_size - Image Size (width and height)

  @Promise {Buffer} image_buffer - Return image data in buffer
  *******************************************************************/
  resizeImage: function( instance, input_image_buffer, image_size){

    // Initialize if not already
    _ImageProcessor.initIfNot(instance);

    if( Lib.Utils.isNullOrUndefined(image_size['width']) ){
      image_size['width'] = null;
    }

    if( Lib.Utils.isNullOrUndefined(image_size['height']) ){
      image_size['height'] = null;
    }


    // Return Promise
    return new Promise(async function(resolve, reject){

      try{

        var image = instance['image']['gm'](input_image_buffer);

        // Resizing Image
        image.resize(image_size['width'], image_size['height'], '!');

        // Creating Image Buffer
        image.toBuffer(function(err, buffer){

          // Return Image buffer
          resolve(buffer);

        });

      }
      catch(err){
        reject(err);
      }

    })

  },


  /*******************************************************************
  Reformat Image

  @param {reference} instance - Request Instance object reference
  @param {Buffer} input_image_buffer - Image Buffer
  @param {String} output_format - Output Image Format

  @Promise {Buffer} image_buffer - Return image data in buffer
  *******************************************************************/
  reFormatImage: function( instance, input_image_buffer, output_format){

    // Initialize if not already
    _ImageProcessor.initIfNot(instance);

    // Return Promise
    return new Promise(async function(resolve, reject){

      try{

        var image = instance['image']['gm'](input_image_buffer);

        // Set output image format
        image.setFormat(output_format);

        // Creating Image Buffer
        image.toBuffer(function(err, buffer){

          // Return Image buffer
          resolve(buffer);

        });

      }
      catch(err){
        reject(err);
      }

    })

  },


  /*******************************************************************
  format Image

  @param {reference} instance - Request Instance object reference
  @param {Buffer} input_image_buffer - Image Buffer
  @param {Set} format_options - Format Options

  @Promise {Buffer} image_buffer - Return image data in buffer
  *******************************************************************/
  formatImage: function( instance, input_image_buffer, format_options){

    // Initialize if not already
    _ImageProcessor.initIfNot(instance);

    var image = instance['image']['gm'](input_image_buffer);

    // Check size in format_options
    if( Lib.Utils.isNullOrUndefined(format_options['size']) ){

      // Initialize size
      format_options['size'] = {
      width:1080, // image width
      height:1080 // image height
      };

    }

    // Resize Image
    image.resize(format_options['size']['width'], format_options['size']['height'])


    // check format in format_options
    if( !Lib.Utils.isNullOrUndefined(format_options['format']) ){

      // set output image format
      image.setFormat(format_options['format']);

    }


    // Check quality in format_options
    if( !Lib.Utils.isNullOrUndefined(format_options['quality']) ){

      // Set the image quality
      image.quality([format_options['quality']]);

    }


    // Check interlace true or false
    if( format_options['interlace'] ){
      image.interlace('Line');
    }


    // Return Promise
    return new Promise(function(resolve, reject){

    try{
      image.toBuffer(function(err, buffer){

      // Return Image buffer
      resolve(buffer)
    })
    }
    catch(err){
      reject(err);
    }

    })

  }

}

/////////////////////////// Public Functions END ///////////////////////////////



/////////////////////////// Private Functions START ////////////////////////////

const _ImageProcessor = {

  /***************************************************************************
  Initialize Pngjs and Image magick Object - Only if not already initialized

  @param {reference} instance - Request Instance object reference

  @return - None
  ***************************************************************************/
  initIfNot:function( instance ){

    // Create image Object in instance if not already present
    if( !('image' in instance) ){
      instance['image'] = {};
    }


    if( Lib.Utils.isNullOrUndefined(instance['image']['gm']) ){

      //Dependency - image-magick
      instance['image']['gm'] = require('gm');

    }

  }

}

/////////////////////////// Private Functions END //////////////////////////////
