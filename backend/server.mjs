import express from "express";
import userSchema from './Schema.js';
import mongoose from 'mongoose';
import cors from 'cors';
import { mintToken, checkToken, getInfo } from './mintToken.js';

const mongoDB = 'mongodb+srv://admin:admin@cluster0.7mvqd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

main().catch(err => console.log(err));
async function main() {
    await mongoose.connect(mongoDB);
    console.log('Connected to MongoDB');
}
const app = express();
const port = 8000;
const corsOptions = {
    origin: 'http://localhost:3000', // Allow only your React app
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, authorization headers)
};
app.use(express.json());
app.use(cors(corsOptions));

app.post('/formdata', async (req, res) => {

    const { walletAddress, name, hkid, dateOfBirth, nationality, gender } = req.body;
    const newUser = new userSchema({ walletAddress: walletAddress, name: name, hkid: hkid, dateOfBirth: dateOfBirth, nationality: nationality, gender: gender })
    await newUser.save().then(() => {
        res.send('User created');
    }).catch((err) => {
        res.status(400).send('Error creating user');
        console.log(err);
    });

});

app.post('/getUser', async (req, res) => {
    const { walletAddress } = req.body;
    const user = await userSchema.findOne({ walletAddress: walletAddress });
    res.send(user);
    console.log(user);
});

app.post('/mintSBT', async (req, res) => {
    const { walletAddress } = req.body;
    await mintToken(walletAddress);
    console.log('Minted token');

    const tokenInfo = await getInfo();
    res.send(tokenInfo);
});

app.get('/getTokenInfo', async (req, res) => {
    const tokenInfo = await getInfo();
    res.send(tokenInfo);
});


app.post('/findUser', async (req, res) => {
    const { walletAddress } = req.body;
    console.log(walletAddress);
    const user = await checkToken(walletAddress);
    console.log(user.hasToken);
    if (user.hasToken == false) {
        res.send('0');
        console.log('User not found');
    } else {
        res.send('1');
        console.log('User found');
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});