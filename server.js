const express = require('express')
const app = express();
const db = require('./models/database')
const { router } = require('./routes/user')
const { issueRouter } = require('./routes/issues')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const fs = require('fs')


app.use(cors({ origin: "*", methods: ["GET", "POST"] }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, }));
app.use(bodyParser.json());

app.use('/api/users', router);
app.use('/api/issues', issueRouter)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(8000, console.log('server running at 8000'))