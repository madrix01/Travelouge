import * as express from "express"
import * as cors from 'cors'
import * as dotenv from 'dotenv';

dotenv.config();

// Routes
import authRoute from './Routes/auth';
import homeRoute from './Routes/home';
import testRoute from './Test/test';
import followRoute from './Routes/follow';
import postRoute from './Routes/post';

const app : express.Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', authRoute);
app.use('/api/home', homeRoute);
app.use('/api', followRoute);
app.use('/api/post', postRoute);


// Test
app.use('/test', testRoute);


app.get('/', (req, res) => {
    res.send("Hello")
})

app.listen(6969, () => {
    console.log("Travelouge running on 6969");
})