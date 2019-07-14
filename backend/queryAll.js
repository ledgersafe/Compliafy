var express = require("express"); // call express
var app = express(); // define our app using express
var bodyParser = require("body-parser");
var http = require("http");
var fs = require("fs");
var Fabric_Client = require("fabric-client");
var path = require("path");
var util = require("util");
var os = require("os");
var port = 4000
// setup the fabric network
var fabric_client = new Fabric_Client();
var channel = fabric_client.newChannel("mychannel");
var peer = fabric_client.newPeer("grpc://localhost:7051");
channel.addPeer(peer);

const routerTo_queryAll = express.Router();

module.exports = function router() {
    // routerTo_queryAll.route('/')
    // .get((req, res) => {
    //     try {
    //         console.log("getting all cannabis from database: ");

    //         //
    //         var member_user = null;
    //         var store_path = path.join(os.homedir(), ".hfc-key-store");
    //         console.log("Store path:" + store_path);
    //         var tx_id = null;

    //         const state_store = await Fabric_Client.newDefaultKeyValueStore({ path: store_path });
    //         // assign the store to the fabric client
    //         fabric_client.setStateStore(state_store);
    //         var crypto_suite = Fabric_Client.newCryptoSuite();
    //         // use the same location for the state store (where the users' certificate are kept)
    //         // and the crypto store (where the users' keys are kept)
    //         var crypto_store = Fabric_Client.newCryptoKeyStore({
    //             path: store_path
    //         });
    //         crypto_suite.setCryptoKeyStore(crypto_store);
    //         fabric_client.setCryptoSuite(crypto_suite);

    //         const user_from_store = await fabric_client.getUserContext("user1", true);
    //         if (user_from_store && user_from_store.isEnrolled()) {
    //             console.log("Successfully loaded user1 from persistence");
    //             member_user = user_from_store;
    //         } else {
    //             throw new Error("Failed to get user1.... run registerUser.js");
    //         }

    //         // queryAllCannabis - requires no arguments , ex: args: [''],
    //         const request = {
    //             chaincodeId: "cannabis-app",
    //             txId: tx_id,
    //             fcn: "queryAllCannabis",
    //             args: [""]
    //         };

    //         const query_responses = await channel.queryByChaincode(request);
    //         console.log("Query has completed, checking results");
    //         // query_responses could have more than one  results if there multiple peers were used as targets
    //         if (query_responses && query_responses.length == 1) {
    //             if (query_responses[0] instanceof Error) {
    //                 console.error("error from query = ", query_responses[0]);
    //             } else {
    //                 console.log("Response is ", query_responses[0].toString());
    //                 // res.json(JSON.parse(query_responses[0].toString()));
    //                 return JSON.parse(query_responses[0].toString());
    //             }
    //         } else {
    //             console.log("No payloads were returned from query");
    //         }
    //     }
    //     catch (error) {
    //         console.error('dummy failed, ', error);
    //         process.exit(1);
    //     }
    // }.then(function (result) {
    //     if (result) {
    //         console.log('queryAll.js success')
    //         res.status(200).json({ message: 'OK', result: result })
    //     } else {
    //         console.log('queryAll.js failure')
    //         res.status(200).json({ message: 'NOK', result: result })
    //     }
    // });
    routerTo_queryAll.route('/')
    .get((req, res) => {
        try {
            console.log("getting all cannabis from database: ");

            //
            var member_user = null;
            var store_path = path.join(os.homedir(), ".hfc-key-store");
            console.log("Store path:" + store_path);
            var tx_id = null;

            Fabric_Client.newDefaultKeyValueStore({ path: store_path }).then(state_store => {
                // assign the store to the fabric client
                fabric_client.setStateStore(state_store);
                var crypto_suite = Fabric_Client.newCryptoSuite();
                // use the same location for the state store (where the users' certificate are kept)
                // and the crypto store (where the users' keys are kept)
                var crypto_store = Fabric_Client.newCryptoKeyStore({
                    path: store_path
                });
                crypto_suite.setCryptoKeyStore(crypto_store);
                fabric_client.setCryptoSuite(crypto_suite);

                fabric_client.getUserContext("user1", true).then(user_from_store => {
                    if (user_from_store && user_from_store.isEnrolled()) {
                        console.log("Successfully loaded user1 from persistence");
                        member_user = user_from_store;
                    } else {
                        throw new Error("Failed to get user1.... run registerUser.js");
                    }
    
                    // queryAllCannabis - requires no arguments , ex: args: [''],
                    const request = {
                        chaincodeId: "cannabis-app",
                        txId: tx_id,
                        fcn: "queryAllCannabis",
                        args: [""]
                    };
    
                    channel.queryByChaincode(request).then(query_responses => {
                        console.log("Query has completed, checking results");
                        // query_responses could have more than one  results if there multiple peers were used as targets
                        if (query_responses && query_responses.length == 1) {
                            if (query_responses[0] instanceof Error) {
                                console.error("error from query = ", query_responses[0]);
                            } else {
                                console.log("Response is ", query_responses[0].toString());
                                // res.json(JSON.parse(query_responses[0].toString()));
                                const result = JSON.parse(query_responses[0].toString());
                                if (result) {
                                    console.log('queryAll.js success')
                                    res.status(200).json({ message: 'OK', result: result })
                                } else {
                                    console.log('queryAll.js failure')
                                    res.status(200).json({ message: 'NOK', result: result })
                                }
                            }
                        } else {
                            console.log("No payloads were returned from query");
                        }
                    });
                });
            });
        }
        catch (error) {
            console.error('dummy failed, ', error);
            process.exit(1);
        }
    });
}
