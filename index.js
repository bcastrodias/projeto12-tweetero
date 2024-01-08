import express from 'express';
import cors from 'cors';
import { users, tweets } from './data.js';

const invalidReq = { message: "Todos os campos são obrigatórios!" }

const app = express();
app.use(cors());
app.use(express.json());

app.get('/tweets', (req, res) => {
  const pageSize = 10;
  let page = req.query.page;

  if (page) {
    if (isNaN(page) || page < 1 || tweets.length < ((page - 1) * pageSize)) return res.status(400).send();
  } else {
    page = 1;
  }

  const aux = [...tweets];
  const tweetList = aux.reverse().slice((pageSize * (page - 1)), (page * pageSize)).map(tweet => {
    const user = users.find(user => user.username == tweet.username);
    tweet.avatar = user.avatar;
    return tweet;
  })

  res.status(200).send(tweetList);
});

app.get('/tweets/:USERNAME', (req, res) => {
  const { USERNAME } = req.params;

  const checkUsername = users.find(user => user.username === USERNAME);
  if (!checkUsername) return res.status(404).send();

  const userTweets = tweets.filter(tweet => tweet.username === USERNAME).map(tweet => {
    const user = users.find(user => user.username === USERNAME);
    tweet.avatar = user.avatar;
    return tweet;
  });

  return res.status(200).send(userTweets);
})

app.post('/sign-up', (req, res) => {
  const { username, avatar } = req.body;
  
  if (!username || !avatar || typeof(username) !== 'string' || typeof(avatar) !== 'string') {
    return res.status(400).send(invalidReq);
  }

  const checkUsername = users.map(user => user.username).includes(username);
  if (checkUsername) return res.status(401).send(); 

  users.push({ username, avatar });
  return res.status(201).send();
});

app.post('/tweets', (req, res) => {
  const username = req.headers.user;
  const { tweet } = req.body;

  if (!username || typeof(username) !== 'string' || !tweet || typeof(tweet) !== 'string') {
    return res.status(400).send(invalidReq)
  }

  const checkUsername = users.find(user => user.username === username);
  if (!checkUsername) return res.status(401).send();

  tweets.push({ username, tweet });
  res.status(201).send()
})

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
