const mocker = require('mocker-data-generator').default;
const csv = require("fast-csv");
const fs = require("fs");
const path = require('path');

async function GenerateTofIle(schema, amount, filePath)
{
    return new Promise( async (resolve, reject) =>
    {
        try
        {
            let mock_data = await new Promise((resolve2, reject2) =>
            {
                mocker()
                    .schema('data', schema, amount)
                    .build(function (error, data) {
                        if (error)
                            reject2(error);
                        else
                            resolve2(data);
                    });
            });

            let writableStream = fs.createWriteStream(filePath);

            let csvStream = csv.format({ headers: true, quoteColumns: true, });
            csvStream.pipe(writableStream);
            mock_data.data.forEach((row) => { csvStream.write(row); });
            csvStream.end();

            writableStream.on("finish", function()
            {
                resolve(true);
            });
        }
        catch (e)
        {
            reject(e);
        }
    });
}

async function main()
{
    var mock_schema = {
        id: {
            faker: 'random.uuid'
        },
        name: {
            faker: 'name.firstName'
        },
        surname: {
            faker: 'name.lastName'
        },
        phone_number: {
            faker: 'phone.phoneNumberFormat(0)'
        },
        id_number: {
            function: function()  { return Math.floor(100000000000 + Math.random() * 900000000000) }
        },
    };

    let fileRecordCount = (25*41) + 1; /* Tests a read ahead + 40*25 batch submits and then 1 full batch and then a single record in a batch, so most code paths */
    let s3RecordCount = 1000000*3;

    await GenerateTofIle(mock_schema, fileRecordCount, __dirname+path.sep+"data_file.csv");
    await GenerateTofIle(mock_schema, s3RecordCount, __dirname+path.sep+"data_s3.csv");
}

main().catch((err) =>
{
    console.error(err);
});
