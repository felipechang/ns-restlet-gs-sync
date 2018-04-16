/**
 * Sync NetSuite saved search results to a Google Spreadsheet.
 *
 * @author Felipe Chang <felipechang@hardcake.org>
 *
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 * @NScriptType RESTlet
 */
define(["require", "exports", "N/search"], function (require, exports, search) {
    Object.defineProperty(exports, "__esModule", { value: true });
    /**
     * Get API search ID if available
     * @param {string} name
     * @returns {string}
     */
    var getApiSearchId = function (name) {
        var res = "";
        var c = search.create({
            type: "customrecord_gs_endpoint",
            filters: [{
                    name: "custrecord_gs_endpoint_endpoint",
                    operator: "is",
                    values: [name]
                }],
            columns: [
                { name: "custrecord_gs_endpoint_search" }
            ]
        });
        var r = c.run();
        r.each(function (e) {
            res = e.getValue({ name: "custrecord_gs_endpoint_search" }).toString();
            return false;
        });
        return res;
    };
    /**
     * Get search results as an array
     * @param {string} searchId
     * @returns {object[]}
     */
    var getSearchData = function (searchId) {
        var arr = [];
        var c = search.load({ id: searchId });
        var r = c.run();
        r.each(function (e) {
            var node = {};
            c.columns.map(function (col) {
                if (typeof col !== "string") {
                    var name_1 = col.name;
                    node[name_1] = e.getValue(col);
                }
            });
            arr.push(node);
            return true;
        });
        return arr;
    };
    /**
     * get event handler
     * @param {Object} requestParams - The parameters from the HTTP request URL as key-value pairs
     * @return {string|object} Returns a String when request "Content-Type" is "text/plain"
     * or an Object when request "Content-Type" is "application/json"
     */
    exports.get = function (requestParams) {
        //Response container
        var res = {
            success: true,
            message: "",
            data: []
        };
        //Get parameters
        if (!requestParams.endpoint) {
            res.success = false;
            res.message = "Query parameter 'endpoint' is required";
            return JSON.stringify(res);
        }
        //Store API info here
        var apiSearchId = getApiSearchId(requestParams.endpoint);
        if (apiSearchId === "") {
            res.success = false;
            res.message = "Invalid endpoint value";
            return JSON.stringify(res);
        }
        //Get search result data
        res.data = getSearchData(apiSearchId);
        //Return results
        return JSON.stringify(res);
    };
});
