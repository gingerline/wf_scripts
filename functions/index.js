/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const functions = require("firebase-functions");
const WEBFLOW_API_KEY = "s"; //process.env.WEBFLOW_API_KEY;
console.log(WEBFLOW_API_KEY);
const fetch = require('node-fetch');

const express = require('express');
const app = express();
const port = 3000;

//const url = 'https://api.webflow.com/v2/sites/64f5f071f0e113c1506f8814/collections';
const baseUrl = 'https://api.webflow.com/v2';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        authorization: 'Bearer ' + WEBFLOW_API_KEY
    }
};

app.get('/sites', async (req, res) => {
    try {
        const sites = await fetch(baseUrl + '/sites', options);
        const sitesData = await sites.json();
        res.send(sitesData);
    }
    catch (e) {
        res.send(e);
    }

});

app.get('/collections/:collectionId/items', async (req, res) => {
    const collectionId = req.params.collectionId;
    try {
        const collections = await fetch(baseUrl + `/collections/${collectionId}/items`, options);
        const collectionsData = await collections.json();
        res.send(collectionsData);
    }
    catch (e) {
        res.send(e);
    }

});

app.post('/collections/:collectionId/items', async (req, res) => {
    const collectionId = req.params.collectionId;
    const { name, description, emCollectionId } = req.body;
    console.log(req.body);
    console.log(name, description, emCollectionId);
    try {
        const collections = await fetch(baseUrl + `/collections/${collectionId}/items`, {
            method: 'POST',
            headers: {
                accept: 'application/json',
                authorization: 'Bearer ' + WEBFLOW_API_KEY,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                isArchived: false,
                isDraft: false,
                fieldData: {
                    name: name,
                    slug: name.toLowerCase().split(' ').join('-'),
                    description: description,
                    collectionid: emCollectionId
                }
            })
        });
        const collectionsData = await collections.json();
        console.log(collectionsData);
        res.send(collectionsData);
    }
    catch (e) {
        res.send(e);
    }

});

exports.v1 = onRequest(app);

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//     logger.info("Hello logs!", { structuredData: true });
//     response.send("Hello from Firebase!");
// });
