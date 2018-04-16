/**
 * Sync NetSuite saved search results to a Google Spreadsheet.
 *
 * @author Felipe Chang <felipechang@hardcake.org>
 *
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 * @NScriptType RESTlet
 */

import {EntryPoints} from 'N/types';
import * as search from 'N/search';

/**
 * Get API search ID if available
 * @param {string} name
 * @returns {string}
 */
let getApiSearchId = (name: string) => {
    let res = "";
    const c = search.create({
        type: "customrecord_gs_endpoint",
        filters: [{
            name: "custrecord_gs_endpoint_endpoint",
            operator: "is",
            values: [name]
        }],
        columns: [
            {name: "custrecord_gs_endpoint_search"}
        ]
    });
    const r = c.run();
    r.each(function (e) {
        res = e.getValue({name: "custrecord_gs_endpoint_search"}).toString();
        return false;
    });
    return res
};

/**
 * Get search results as an array
 * @param {string} searchId
 * @returns {object[]}
 */
let getSearchData = (searchId: string) => {
    const arr = [];
    const c = search.load({id: searchId});
    const r = c.run();
    r.each(function (e) {
        const node = {};
        c.columns.map(function (col) {
            if (typeof col !== "string") {
                const name = col.name;
                node[name] = e.getValue(col);
            }
        });
        arr.push(node);
        return true;
    });
    return arr
};

/**
 * get event handler
 * @param {Object} requestParams - The parameters from the HTTP request URL as key-value pairs
 * @return {string|object} Returns a String when request "Content-Type" is "text/plain"
 * or an Object when request "Content-Type" is "application/json"
 */
export let get: EntryPoints.RESTlet.get = (requestParams: any) => {

    //Response container
    const res = {
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
    const apiSearchId = getApiSearchId(requestParams.endpoint);

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
