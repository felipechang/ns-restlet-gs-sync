function start() {

    //Clear logs
    Logger.clear();

    var app = new App();

    //Add params for NS connection
    app.addPath("https://rest.netsuite.com/app/site/hosting/restlet.nl?script=999&deploy=1");
    app.addEndPoint("nsw");
    app.addCredentials({
        account: "1234567",
        role: "3",
        email: "felipechang@hardcake.org",
        password: "mr$roboto1234"
    });

    //Add Google Spreadsheet ID
    app.addDocumentId("l3j4k5jh4j5hjhgkj43hb53");

    //Getting NS data
    app.callUri();

    //Get active sheet
    app.getActiveSheet();

    //Update results
    app.iterateResults(function (e) {

        /*
         * Result Example {
         *    query: {value: {name: "fred", type: "dog", qty: 2}, index: 1},
         *    row: {value: ["fred", "dog", 1], index: 3}
         * };
         */

        //Ignore header
        if (e.row.index === 0) {
            return ""
        }

        //Add rows with info
        app.addRow([
            e.query.value.name,
            e.query.value.type,
            e.query.value.qty
        ]);

        //If the name matches update the qty field
        if (e.query.value.name === e.row.value[0]) {
            app.updateRow(2, e.query.value.qty)
        }
    });

    //Add one cat named doug
    app.addRow(["doug", "cat", 1]);

    //Update the second column of the second row
    app.updateRow(1, "canine", 1)
}