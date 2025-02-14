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

app.get('/api/games', async (req, res) => {
    const { serie_id } = req.query;

    if (!serie_id) {
        return res.status(400).json({ error: "Missing serie_id parameter" });
    }

    const url = `https://admin.handballbelgium.be/lms_league_ws/public/api/v1/game/byMyLeague?with_referees=true&no_forfeit=true&season_id=4&without_in_preparation=true&sort[0]=date&sort[1]=time&serie_id=${serie_id}`;

    try {
        const client = new MongoClient(mongoUrl);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(gamesCollectionName);

        // Check if the response is already cached
        const cachedResponse = await collection.findOne({ serie_id });
        if (cachedResponse) {
            return res.json(cachedResponse.data.elements);
        }

        // If not cached, fetch from the API
        const response = await axios.get(url, {
            headers: {
                Authorization: `WP_Access ${process.env.API_TOKEN}`
            }
        });

        // Cache the response in MongoDB
        await collection.insertOne({ serie_id, data: response.data });

        res.json(response.data.elements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get('/api/game/:game_id', async (req, res) => {
    const { game_id } = req.params;
    const externalApiUrl = `https://hbint-apps.liga.nu/nuliga/rs/hb/2022/reports/${game_id}`;

    try {
        const client = new MongoClient(mongoUrl);
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(reportsCollectionName);

        // Check if the response is already cached
        const cachedResponse = await collection.findOne({ game_id });

        if (cachedResponse) {
            res.json(cachedResponse.data);

            // Fetch from the API and update the cache in the background
            axios.get(externalApiUrl, {
                headers: {
                    Authorization: `WP_Access ${process.env.API_TOKEN}`
                }
            }).then(response => {
                collection.updateOne(
                    { game_id },
                    { $set: { data: response.data } },
                    { upsert: true }
                );
            }).catch(error => {
                console.error('Error updating cache:', error);
            });

            return;
        }

        // If not cached, fetch from the API
        const response = await axios.get(externalApiUrl, {
            headers: {
                Authorization: `WP_Access ${process.env.API_TOKEN}`
            }
        });

        // Cache the response in MongoDB
        await collection.insertOne({ game_id, data: response.data });

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
