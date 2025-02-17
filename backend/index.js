const express = require('express');
const axios = require('axios');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const port = 3000;

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'Matches';
const gamesCollectionName = 'games';
const reportsCollectionName = 'reports';

app.use(cors());

async function fetchAndCache(url, collectionName, query, res) {
    try {
        const client = new MongoClient(mongoUrl, { serverSelectionTimeoutMS: 1000 });
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Check if the response is already cached
        const cachedResponse = await collection.findOne(query);
        if (cachedResponse) {
            res.json(cachedResponse.data);

            // Fetch from the API and update the cache in the background
            axios.get(url, {
                headers: {
                    Authorization: `${process.env.API_TOKEN}`
                }
            }).then(response => {

                if (collectionName === reportsCollectionName) {
                    if (response.data.data.teamHome.persons) response.data.data.teamHome.persons = []
                    if (response.data.data.teamGuest.persons) response.data.data.teamGuest.persons = []
                }

                collection.updateOne(
                    query,
                    { $set: { data: response.data } },
                    { upsert: true }
                );
            }).catch(error => {
                console.error('Error updating cache:', error);
            });

            return;
        }

        // If not cached, fetch from the API
        const response = await axios.get(url, {
            headers: {
                Authorization: `${process.env.API_TOKEN}`
            }
        });

        if (response.data.resultState === "ERROR") {
            return res.status(404).json({ error: "Game not found: " + response.data.resultDetail });
        }

        // remove unnecessary fields
        if (collectionName === reportsCollectionName) {
            if (response.data.data.teamHome.persons) response.data.data.teamHome.persons = []
            if (response.data.data.teamGuest.persons) response.data.data.teamGuest.persons = []
        }

        // Cache the response in MongoDB
        await collection.insertOne({ ...query, data: response.data });

        return res.json(response.data);
    } catch (mongoError) {
        console.error('MongoDB connection error:', mongoError);

        // If MongoDB is not available, fetch from the API directly
        try {
            const response = await axios.get(url, {
                headers: {
                    Authorization: `${process.env.API_TOKEN}`
                }
            });
            if (response.data.resultState === 'ERROR') {
                return res.status(404).json({ error: "Game not found: " + response.data.resultDetail });
            }
            return res.json(response.data);
        } catch (apiError) {
            console.error('API call error:', apiError);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

app.get('/api/games', async (req, res) => {
    const { serie_id } = req.query;

    if (!serie_id) {
        return res.status(400).json({ error: "Missing serie_id parameter" });
    }

    const url = `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/game/byMyLeague?with_referees=true&no_forfeit=true&season_id=4&without_in_preparation=true&sort[0]=date&sort[1]=time&serie_id=${serie_id}`;

    await fetchAndCache(url, gamesCollectionName, { serie_id }, res);
});

app.get('/api/game/:game_id', async (req, res) => {
    const { game_id } = req.params;
    const externalApiUrl = `https://hbint-apps.liga.nu/nuliga/rs/hb/2022/reports/${game_id}`;

    await fetchAndCache(externalApiUrl, reportsCollectionName, { game_id }, res);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
