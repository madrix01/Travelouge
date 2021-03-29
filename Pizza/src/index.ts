import 'module-alias/register'

import * as express from "express"
import * as cors from 'cors'
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';



dotenv.config();

// Routes
import authRoute from '@routes/auth';
import homeRoute from '@routes/home';
import testRoute from '@test/test';
import followRoute from '@routes/follow';
import postRoute from '@routes/post';
import profileRoute from '@routes/profile';
import feedRoute from '@routes/feed';

const app : express.Application = express();


app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/user', authRoute);
app.use('/api/home', homeRoute);
app.use('/api', followRoute);
app.use('/api/post', postRoute);
app.use('/api', profileRoute);
app.use('/api/feed', feedRoute);


// Test
app.use('/test', testRoute  );


app.get('/', (req, res) => {
    res.send("Hello")
})

app.listen(6969, () => {
    console.log("🚀 running on 6969");
})