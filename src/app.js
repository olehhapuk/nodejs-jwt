const express = require('express');
const compression = require('compression');
const volleyball = require('volleyball');

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(compression());
app.use(volleyball);

app.use('/api', () => {});

module.exports = app;
