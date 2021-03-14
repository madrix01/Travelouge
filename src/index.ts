import * as express from "express"
import * as cors from 'cors'
import * as dotenv from 'dotenv';

dotenv.config();

// Routes
import authRoute from '../src/Routes/auth';
import homeRoute from '../src/Routes/home';
import testRoute from '../src/Test/test';
import followRoute from './Routes/follow';

const app : express.Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', authRoute);
app.use('/api/home', homeRoute);
app.use('/api/follow', followRoute);

// Test
app.use('/test', testRoute);


app.get('/', (req, res) => {
    res.send("Hello")
})

app.listen(6969, () => {
    console.log("Travelouge running on 6969");
})