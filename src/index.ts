import * as express from "express"
import * as cors from 'cors'
import * as dotenv from 'dotenv';

dotenv.config();

// Routes
import authRoute from '../src/Routes/auth';
import homeRoute from '../src/Routes/home';

const app : express.Application = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/user', authRoute);
app.use('/api/home', homeRoute);

app.get('/', (req, res) => {
    res.send("Hello")
})

app.listen(6969, () => {
    console.log("Travelouge running on 6969");
})