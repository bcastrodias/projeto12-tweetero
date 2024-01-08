import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

let usuarios = [
  { username: "a", avatar: "https://i.imgur.com/AD3MbBi.jpeg" },
  { username: "b", avatar: "https://i.imgur.com/AD3MbBi.jpeg" }
];
let tweets = [];

app.post('/sign-up', (req, res) => {
  const { username, avatar } = req.body;

  if (username && avatar) {
    const alreadyExists = usuarios.some((user) => user.username === username);

    if (!alreadyExists) {
      usuarios.push({ username, avatar });
      res.status(201).send({ message: "OK" });
    } else {
      res.status(401).send({ message: "UNAUTHORIZED" });
    }
  } else {
    res.sendStatus(400);
  }
});

app.post('/tweets', (req, res) => {
  const usernameHeader = req.headers.user;
  const { tweet } = req.body;

  if (tweet && usuarios.some((user) => user.username === usernameHeader)) {
    tweets.push({ username: usernameHeader, tweet });
    res.status(201).send({ message: "OK" });
  } else {
    res.status(401).send({ message: "UNAUTHORIZED" });
  }
});

app.get('/tweets', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const reversedTweets = tweets.slice().reverse();
  const twt = reversedTweets.slice(startIndex, endIndex).map((tweet) => {
    const user = usuarios.find((user) => user.username === tweet.username);
    return {
      username: tweet.username,
      avatar: user.avatar,
      tweet: tweet.tweet
    };
  });

  res.send([...twt]);
});

app.get("/tweets/:username", (req, res) => {
  const userTweets = tweets.filter((tweet) => tweet.username === req.params.username);
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  const reversedUserTweets = userTweets.slice().reverse();
  const twt = reversedUserTweets.slice(startIndex, endIndex).map((tweet) => {
    const user = usuarios.find((user) => user.username === tweet.username);
    return {
      username: tweet.username,
      avatar: user.avatar,
      tweet: tweet.tweet
    };
  });

  res.send([...twt]);
});

app.listen(5000, () => console.log("Server running on port: 5000"));
