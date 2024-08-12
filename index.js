'use strict';

const config = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { MongoClient } = require('mongodb');
const Connection = require('./database/connection');
const routes = require('./routes/routers');

const app = express();

app.use(
	cors({
		credentials: true,
		origin: [
			'http://localhost:3000',
			'http://localhost:8080',
			'http://localhost:4200',
		],
	}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/', routes);

app.listen(process.env.PORT, () => {
	console.log(`Auth Server listening on port ${process.env.PORT}`);
});
