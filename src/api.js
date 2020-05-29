const path = require('path');
const express = require('express');
const multer = require('multer');
const loaders = require('./loaders/loaders');
const userService = require('./services/user-service');
const tokenService = require('./services/token-service');
const postService = require('./services/post-service');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '../user-images/uploads/'));
  },
  filename: function(req, file, cb) {
    // cb(null, new Date().toISOString() + file.originalname);
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    // accept a file
    cb(null, true);
  } else {
    // reject a file
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter,
});

let app;

function startServer() {
  app = express();

  app.use(express.static('../user-images/uploads/'));
  loaders.init(app);
  app.listen(process.env.PORT || 3333, () => console.log(`Server is listening on port ${process.env.PORT || 3333}!`));
}

startServer();

app.get('/users', async (req, res) => {
  console.log('got a request to sign up');
  const { userID, clientError } = await userService.signUp(req.body);
  const { token } = await tokenService.setNewToken(userID);
  if (clientError) {
    res.status(400).send(clientError);
  } else {
    res.cookie('token', token, { maxAge: 90000000, httpOnly: true, path:'/' });
    res.send(`userId ${userID}: new user ${req.body.firstName} ${req.body.lastName} has been created`);
  }
});

app.get('/users', async (req, res, next) => {
  console.log('got a request to get users');
  const { token, clientError } = await tokenService.tokenIsValid(req.cookies);
  console.log(`token is: ${token}`);
  if (clientError) {
    console.log('sending a 401 response');
    res.status(401).send(clientError);
  } else {
    const { user, clientError }  = await userService.getUserByToken(token);
    if (clientError) {
      res.status(401).send(clientError);
    }
    res.send(user);
  }
});

app.post('/signin', async (req, res) => {
  console.log('got a request to sign in');
  const { userId, userName, clientError } = await userService.validateUser(req.body);
  if (clientError) {
    res.status(400).send(clientError);
  } else {
    const { token } = await tokenService.setNewToken(userId);
    res.cookie('token', token, { maxAge: 90000000, httpOnly: true, path:'/' });
    res.send(`${userName} is logged in!`);
  }
});

app.post('/signout', async (req, res) => {
  console.log('got a request to sign out');
  const { token,  clientError } = await tokenService.tokenIsValid(req.cookies);
  if (clientError) {
    res.status(401).send(clientError);
  } else {
    const { userName } = await userService.getUserNameByToken(token);
    await tokenService.deleteToken(token);
    res.clearCookie('token');
    res.status(202).send(`${userName} is logged out`);
  }
});


app.get('/users/:id', async (req, res) => {
  console.log('got a request to get user by id');
  const { clientError } = await tokenService.tokenIsValid(req.cookies);
  if (clientError) {
    res.status(401).send(clientError);
  } else {
    const { user, clientError }  = await userService.getUserByID(req.params.id);
    if (clientError) {
      res.status(401).send(clientError);
    }
    res.send(user);
  }
});

app.post('/posts', upload.single('postImage'), async (req, res) => {
  console.log('got here');
  console.log('got a request POST a new post');
  const { token,  clientError } = await tokenService.tokenIsValid(req.cookies);
  if (clientError) {
    res.status(401).send(clientError);
  } else {
    console.log(req.file);
    const imagePath = req.file ? `http://127.0.0.1:3333/${req.file.originalname}` : null;
    console.log(imagePath);
    const { userId: userId } = await userService.getUserIdByToken(token);
    const { postId } = await postService.addNewPost(req.body, imagePath, userId);
    if (clientError) {
      res.status(400).send(clientError);
    } else {
      console.log(imagePath);
      const retValue = {
        imagePath,
        postId,
      };
      res.send(retValue);
    }
  }
});

app.get('/posts', async (req, res) => {
  console.log('got a requset to get all posts');
  const { token,  clientError } = await tokenService.tokenIsValid(req.cookies);
  console.log(`token is: ${token}`);
  if (clientError) {
    res.status(401).send(clientError);
  } else {
    const { userId } = await userService.getUserIdByToken(token);
    const posts = await postService.getAllPostsByID(userId);
    console.log(posts);
    res.send(posts);
  }
});

app.get('/posts/:id', async (req, res) => {
  console.log('got a request to GET a post by id');
  const { token,  clientError } = await tokenService.tokenIsValid(req.cookies);
  if (clientError) {
    res.status(401).send(clientError);
  } else {
    const { userId } = await userService.getUserIdByToken(token);
    const post = await postService.getPostByPostId(userId, req.params.id);
    res.send(post);
  }
});

app.put('/posts/:id', upload.single('postImage'), async (req, res) => {
  console.log('got a requset to update a post');
  const { token,  clientError } = await tokenService.tokenIsValid(req.cookies);
  if (clientError) {
    res.status(401).send(clientError);
  } else {
    const imagePath = req.file ? `http://127.0.0.1:3333/${req.file.originalname}` : null;
    const { userId } = await userService.getUserIdByToken(token);
    const { clientError } = await postService.updatePost(userId, req.params.id, req.body, imagePath);
    if (clientError) {
      res.status(400).send(clientError);
    } else {
      res.send(imagePath);
    }
  }
});

app.delete('/posts/:id', async (req, res) => {
  console.log('got a request to delete a post');
  const { token,  clientError } = await tokenService.tokenIsValid(req.cookies);
  if (clientError) {
    res.status(401).send(clientError);
  } else {
    const { userId } = await userService.getUserIdByToken(token);
    const { clientError } = await postService.deletePost(userId, req.params.id);
    if (clientError) {
      res.status(400).send(clientError);
    } else {
      res.send(`post with postId ${req.params.id} was successfully deleted`);
    }
  }
});