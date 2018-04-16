/**
 * App Constructor
 * @constructor
 */
var App = function () {

    var BASE;
    var ENDPOINT;
    var DOCUMENT_ID;
    var NS_ACCOUNT;
    var NS_EMAIL;
    var NS_PASS;
    var NS_ROLE;

    var NS_DATA = [];
    var ACTIVE_SHEET;
    var SHEET_VALUES;
    var ROW_INDEX;

    /**
     * Iterate array
     * @param {Array} arr
     * @param {Function} callback
     */
    function iterateArray(arr, callback) {
        for (var i = arr.length - 1; i >= 0; i--) {
            callback(arr[i], i)
        }
    }

    /**
     * Add base
     * @param {string} base
     */
    this.addPath = function (base) {
        BASE = base;
    };

    /**
     * Add endpoint
     * @param {string} endpoint
     */
    this.addEndPoint = function (endpoint) {
        ENDPOINT = endpoint;
    };

    /**
     * Add NetSuite credentials
     * @param {object} o
     * @param {string|number} o.account
     * @param {string|number} o.email
     * @param {string|number} o.password
     * @param {string|number} o.role
     */
    this.addCredentials = function (o) {
        NS_ACCOUNT = o.account;
        NS_EMAIL = o.email;
        NS_PASS = o.password;
        NS_ROLE = o.role;
    };

    /**
     * Add Spreadsheet ID
     * @param {string} id
     */
    this.addDocumentId = function (id) {
        DOCUMENT_ID = id;
    };

    /**
     * Get NetSuite Data
     * @returns {*}
     */
    this.callUri = function () {

        if (!BASE) {
            throw "Base path is needed, set with addPath.";
        }
        if (!ENDPOINT) {
            throw "Path endpoint is needed, set with addPath.";
        }
        if (!NS_ACCOUNT) {
            throw "NetSuite credentials are needed, set with addCredentials.";
        }

        Logger.log("Calling NetSuite...");

        var uri = BASE + "&endpoint=" + ENDPOINT;

        var headers = {
            "User-Agent-x": "SuiteScript-Call",
            "Authorization": "NLAuth nlauth_account=" + NS_ACCOUNT + ", nlauth_email=" + NS_EMAIL +
            ", nlauth_signature= " + NS_PASS + ", nlauth_role=" + NS_ROLE,
            "Content-Type": "application/json"
        };

        var response = UrlFetchApp.fetch(uri, {headers: headers});
        var responseCode = response.getResponseCode();

        //Continue if response code is OK
        if (Number(responseCode) !== 200) {
            Logger.log("Could not get response from Netsuite");
            return "";
        }

        //Get contents
        var responseBody = response.getContentText();
        var parsedResponse = JSON.parse(responseBody);
        while (typeof parsedResponse !== "object") {
            parsedResponse = JSON.parse(parsedResponse);
        }

        //Origin errors
        if (!parsedResponse.success) {
            Logger.log(parsedResponse.message);
            return "";
        }

        Logger.log("Success calling NetSuite");
        Logger.log("Loaded " + parsedResponse.data.length + " results");
        NS_DATA = parsedResponse.data;
    };

    /**
     * Get active sheet
     * @returns {GoogleAppsScript.Spreadsheet.Sheet}
     */
    this.getActiveSheet = function () {

        if (!DOCUMENT_ID) {
            throw "Spreadsheet ID is needed, set with addDocumentId.";
        }

        var document = SpreadsheetApp.openById(DOCUMENT_ID);
        var name = document.getName();
        ACTIVE_SHEET = document.getActiveSheet();
        Logger.log("Loaded spreadsheet " + name);
    };

    /**
     * Go through result combination
     * @param cb
     */
    this.iterateResults = function (cb) {

        var range = ACTIVE_SHEET.getDataRange();
        SHEET_VALUES = range.getValues();

        Logger.log("Iterating over " + SHEET_VALUES.length + " sheet rows and " + NS_DATA.length + " data sets");

        iterateArray(NS_DATA, function (queryValue, queryIndex) {
            iterateArray(SHEET_VALUES, function (rowValue, rowIndex) {

                //Store for later
                ROW_INDEX = rowIndex;

                cb({
                    query: {value: queryValue, index: queryIndex},
                    row: {value: rowValue, index: rowIndex}
                });
            });
        });

        //Save values to spreadsheet with updated data
        range.setValues(SHEET_VALUES);

        Logger.log("Spreadsheet updated");
    };

    /**
     * Update row by current or defined position
     * @param {number} column
     * @param {*} value
     * @param {number} [index]
     */
    this.updateRow = function (column, value, index) {
        SHEET_VALUES[index || ROW_INDEX][column] = value;
    };

    /**
     * Add a row as an array
     * @param {Array} arr
     */
    this.addRow = function (arr) {
        ACTIVE_SHEET.appendRow(arr);
    };
};