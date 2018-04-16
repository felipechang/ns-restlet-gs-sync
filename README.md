# Overview
 Sync NetSuite saved search results to a Google Spreadsheet.

# Installation

NetSuite:

- Place the out folder javascript files in the SuiteScripts folder of your NetSuite account.

- Create the RESTlet and save the EXTERNAL URL.

- Install the record folder xml `customrecord_gs_endpoint` using the NetSuite SDK.


Google:

- Install the google folder javascript files in the Google Spreadsheet script editor.

- Update the app.gs file to include the RESTlet external URL, referred endpoint, NetSuite credentials, and Spreadsheet ID.


# Usage
On NetSuite, the Google Endpoint custom record is used to link a saved search to a custom endpoint keyword. When the RESTlet is called with that keyword as a query parameter `&endpoint={keyword}` it will return an object array with the search results.

The Google script will call the RESTlet, get the information and make it available to update/add on the spreadsheet. For a usage example see the app.gs file on the google folder.

# License
GNU GPL see LICENSE.

**Use at your own discretion. Test before using in production.**

# Author
Felipe Chang <felipechang@hardcake.org> @mr_pepian