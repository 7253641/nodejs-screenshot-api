var fs = require('fs');
var temp = require('temp');
var webshot = require('webshot');
var path = require('path');
/**
 * Generates a PNG image for a URL
 *
 * @param  {String}     url                 The URL for which to generate a PNG image
 * @param  {Object}     [options]           A set of options that manipulate the image
 * @param  {Number}     [options.width]     The desired width (in pixels) for the generated image, default: 1024
 * @param  {Number}     [options.height]    The desired height (in pixels) for the generated image, default 768
 * @param  {Number}     [options.delay]     The delay (in milliseconds) before the screenshot, default 0, maximum 10000
 * @param  {String}     [options.userAgent] An optional user agent, defaults to an empty string
 * @param  {Boolean}    [options.full]      If specified, the entire webpage will be screenshotted and the `options.height` property will be ignored
 * @param  {Function}   callback            A standard callback function
 * @param  {Object}     callback.err        An error object (if any)
 * @param  {String}     callback.path       The path on disk where the image is stored
 */
var generate = module.exports.generate = function(url, options,parsedUrl, callback) {
    options = options || {};
    options.width = options.width || 1024;
    options.height = options.height || 768;
    options.delay = options.delay || 0;
    options.userAgent = options.userAgent || '';

    if (options.delay > 10000) {
        options.delay = 10000;
    }
//benito -- added track traceurl nav redirection for iframe 
if(parsedUrl.hostname != "connect.track-trace.com"){
    screengrab(url, options, callback);

}
else{
    screengrab(url + '/open,self+action,direct', options, callback);
}
};

/**
 * Take a screenshot of url
 *
 * @param  {String}     url             The URL for which to generate a PNG image
 * @param  {Object}     options         A set of options that manipulate the page
 * @param  {Function}   callback        A standard callback function
 * @param  {Object}     callback.err    An error object (if any)
 * @param  {String}     callback.path   The path on disk where the image is stored
 * @api private
 */
var screengrab = function(url, options, callback) {
    //var tempPath = temp.path({suffix: '.png'});
    //console.log(tempPath);


    
    var rotsavefile =path.resolve(path.join(__dirname,'static'));
    var tempPath = rotsavefile + '\\'+randomString(12).toString() + '.png';
    console.log(tempPath);


    var webshotOptions = {
        'renderDelay': options.delay,
        'windowSize': {
            'width': options.width,
            'height': options.height
        },
        'shotSize': {
            'width': 'window',
            'height': (options.full === true) ? 'all' : 'window' //--benito
            //'height': 'all'
        },
        'userAgent': options.userAgent, //--benito
        //'userAgent': 'Mozilla/5.0 (Windows NT 6.2; Win64; x64)',
        'phantomConfig': {
            'ignore-ssl-errors': true,
            'ssl-protocol': 'any',
            'debug':'false'
        }
    };

    webshot(url, tempPath, webshotOptions, function(err) {
        if (err) {
            console.log(err);
            return callback({'code': 500, 'msg': url});
        }

        return callback(null, tempPath);
    });
};

function randomString(length, chars) {

    var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var result = '';
        for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
        return result;
}