'use strict';

var request = require('request').defaults({
    baseUrl: 'https://api.projectoxford.ai/luis/v1.0/',
    headers: { 'User-Agent': 'nodejs/0.3.0' } }),
    // Any particular reason why 0.3.0?
util = require('util'),
    _Promise = require('bluebird');

var entitiesUrl = 'entities';
// const intentUrl = 'intents';

/**
 * @namespace
 * @memberof Client
 * @param  {string} subscriptionKey - Cognitive Services subscription key
 *
 * Subscription key can be found (as of 2016-07-30) under the "My Settings" section (click on your name in the upper right).
 *
 * The Application ID can be found (as of 2016-07-30) under the "App Settings" once you've selected one of your LUIS applications.
 */
var luis = function luis(subscriptionKey) {
    /**
     * @param  {string} luisAppId       - LUIS Application ID
     */
    function app(luisAppId) {
        /**
         * @private
         */
        function _return(error, response, resolve, reject) {
            if (error) {
                return reject(error);
            }

            if (response.statusCode !== 200 && response.statusCode !== 202) {
                reject(response.body);
            }

            return resolve(response.body);
        }

        /**
         * (Private) Get from a LUIS RESTful endpoint
         *
         * @private
         * @param  {string} url         - Relative Url to GET
         * @param  {object} options     - Querystring object
         * @return {Promise}            - Promise resolving with the resulting JSON
         */
        function _get(url, options) {
            return new _Promise(function (resolve, reject) {
                request.get({
                    uri: util.format('prog/apps/%s/%s', luisAppId, url),
                    headers: { 'Ocp-Apim-Subscription-Key': subscriptionKey },
                    json: true,
                    qs: options
                }, function (error, response) {
                    return _return(error, response, resolve, reject);
                });
            });
        }

        /**
         * (Private) Post to a LUIS RESTful endpoint
         *
         * @private
         * @param  {string} url         - Relative Url to POST
         * @param  {object} options     - Querystring object
         * @param  {object} payload     - Body payload
         * @return {Promise}            - Promise resolving with the resulting JSON
         *
        function _post(url, options, payload) {
            return new _Promise(function (resolve, reject) {
                request.post({
                    uri: util.format('prog/apps/%s/%s', luisAppId, url),
                    headers: {'Ocp-Apim-Subscription-Key': subscriptionKey},
                    json: true,
                    body: payload,
                    qs: options
                }, (error, response) => _return(error, response, resolve, reject));
            });
        }
        */

        function getEntity(entityId) {
            return _get(util.format('%s/%s', entitiesUrl, entityId));
        }

        function getEntities() {
            return _get(entitiesUrl);
        }

        return {
            getEntity: getEntity,
            getEntities: getEntities
        };
    }

    return {
        app: app
    };
};

module.exports = luis;
