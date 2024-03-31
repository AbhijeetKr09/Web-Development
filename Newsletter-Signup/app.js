const express = require("express");
const https = require("https");
const request = require("request");
const bodyParser = require("body-parser");
const client = require("@mailchimp/mailchimp_marketing");
const { response } = require("express");
require('dotenv').config();

let apiKey = process.env.MAILCHIMP_APIKEY; 

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/signup.html")

    client.setConfig({
        apiKey: apiKey,
        server: "us12"
    })
});

app.post("/", (req, res) => {
    const FirstName = req.body.FirstName;
    const secondName = req.body.secondName;
    const email = req.body.email;
    const listid = "bab87552c3";

    async function run() {
        const response = await client.lists.addListMember(listid, {
            
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: FirstName,
                LNAME: secondName
            } 
            
        });

        res.sendFile(__dirname+"/success.html")
        console.log(`Successfully added contact as an audience member. The contact id is ${response.full_name}`)
    }

    run().catch(e => res.sendFile(__dirname + "/failure.html"));

});

app.listen(process.env.PORT || 3000, () => {
    console.log("listening to port 3000.")
})


// bab87552c3

// us19  server prefix