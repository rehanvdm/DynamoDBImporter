'use strict';
var path        = require('path');
const chai = require('chai');
const expect = chai.expect;


process.env.AWS_NODEJS_CONNECTION_REUSE_ENABLED   = 1;

process.env.CSV_BUCKET_NAME = "dynamo-importer-source-prod";
process.env.CSV_KEY_NAME  = "s3_data.csv";
process.env.DYNAMO_TABLE_NAME  = "dynamo-importer-table-prod";
process.env.CONCURRENT_BATCH_SUBMITS  = 1;
process.env.READ_AHEAD_BATCHES  = 1;
process.env.MAX_ROWS_SUBMIT  = 10000;
process.env.EXECUTE_LOCAL  = true;

describe('Test Success', function ()
{
    it('From File - Should return true', async function()
    {
        this.timeout(300*1000);

        let event = { FROM: "file" };
        let app = require('../../../app/lambda/importer/app.js');
        let result = await app.handler(event, null);

        expect(result).to.equal(true);
    });

    it('From S3 - Should return true', async function()
    {
        this.timeout(300*1000);

        let event = { FROM: "s3" };
        let app = require('../../../app/lambda/importer/app.js');
        let result = await app.handler(event, null);

        expect(result).to.equal(true);
    });
});
