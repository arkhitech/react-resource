'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaults = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* ==========================================================================
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            Request
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            ========================================================================== */

exports.default = request;
exports.parseJSON = parseJSON;

require('whatwg-fetch');

var _merge = require('lodash/merge');

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Expose default settings
 */

var defaults = exports.defaults = {
  credentials: 'same-origin',
  headers: {
    'Content-Type': 'application/json'
  }
};

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} options   The options we want to pass to "fetch"
 *
 * @return {object}           An object containing either "data" or "error"
 */

function request(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return fetch(url, (0, _merge2.default)(options, defaults)).then(checkStatus).then(function (response) {
    var responseBodyPromise = null;
    if (!isJSON(response.headers)) {
      responseBodyPromise = response.text();
    } else {
      responseBodyPromise = response.json();
    }
    var resultsPromise = responseBodyPromise.then(function (responseContent) {
      return { results: responseContent, headers: response.headers };
    });
    return Promise.all([responseBodyPromise, resultsPromise]);
  }).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        responseBody = _ref2[0],
        results = _ref2[1];

    return results;
  });
}

/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */

function parseJSON(response) {
  if (!isJSON(response.headers)) {
    return response.text();
  } else {
    return response.json();
  }
}

/**
 * Verifies that the content returned is JSON
 *
 * @param  {object} headers from the network response
 *
 * @return {boolean} Whether the content-type includes JSON or not
 */

function isJSON(headers) {
  return headers.get('content-type').match(/json/i);
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */

function checkStatus(response) {
  // return response;
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  var error = new Error(response.statusText);
  error.response = response;

  throw error;
}