// app.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('cookie-session');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret-key',
  resave: true,
  saveUninitialized: true
}));

mongoose.connect('mongodb+srv://eugenewlf:Ew25805863@cluster0.u1mqfar.mongodb.net/TMDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
  tlsAllowInvalidCertificates: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('Connected to MongoDB');
});

const saltRounds = 10;

const taskSchema = new mongoose.Schema({
  name: String,
  description: String,
  dueDate: Date,
  owner: String,
});

const Task = mongoose.model('Task', taskSchema);

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

app.use((req, res, next) => {
  req.userDb = db.collection('users');
  next();
});

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await req.userDb.findOne({ username });

    if (existingUser) {
      console.log('Username already exists. Choose a different one.');
      return res.redirect('/register');
    }

    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    console.log('User registered successfully.');
    return res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
  res.redirect('/login');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.authenticated = true;
      req.session.userid = user._id;
      res.redirect('/dash');
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/logout', (req, res) => {
  req.session = null;
  res.redirect('/');
});

app.get('/dash', async (req, res) => {
  if (!req.session.authenticated) {
    res.redirect('/login');
  } else {
    try {
      const user = await User.findById(req.session.userid);
      res.render('dash', { username: user.username });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  }
});

app.get('/createTask', (req, res) => {
  res.render('createTask');
});

app.post('/createTask', async (req, res) => {
  const { name, description, dueDate } = req.body;

  try {
    const userId = req.session.userid.toString();
    await Task.create({ name, description, dueDate, owner: req.session.userid });
    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/updateTask/:taskId', async (req, res) => {
  if (!req.session.authenticated) {
    return res.redirect('/login');
  }

  const taskId = req.params.taskId;

  try {
    const task = await Task.findOne({ _id: taskId, owner: req.session.userid });
    res.render('updateTask', { task });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/updateTask/:taskId', async (req, res) => {
  if (!req.session.authenticated) {
    return res.redirect('/login');
  }

  const taskId = req.params.taskId;
  const { name, description, dueDate } = req.body;

  try {
    await Task.updateOne(
      { _id: taskId, owner: req.session.userid },
      { $set: { name, description, dueDate } }
    );
    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/deleteTask/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    await Task.deleteOne({ _id: taskId, owner: req.session.userid });
    res.redirect('/tasks');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/searchTasks', async (req, res) => {
  const query = req.query.q || '';

  try {
    const tasks = await Task.find({
      owner: req.session.userid,
      $or: [
        { name: { $regex: new RegExp(query, 'i') } },
        { description: { $regex: new RegExp(query, 'i') } },
      ],
    });

    res.render('tasks', { tasks, searchQuery: query });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/tasks', async (req, res) => {
  const query = req.query.q || '';

  try {
    const tasks = await Task.find({ owner: req.session.userid });
    res.render('tasks', { tasks, searchQuery: query });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.session.userid });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const task = await Task.findOne({ _id: taskId, owner: req.session.userid });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  const { name, description, dueDate } = req.body;

  try {
    const userId = req.session.userid.toString();
    const newTask = await Task.create({ name, description, dueDate, owner: req.session.userid });
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put('/api/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  const { name, description, dueDate } = req.body;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, owner: req.session.userid },
      { $set: { name, description, dueDate } },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const deletedTask = await Task.findOneAndDelete({ _id: taskId, owner: req.session.userid });

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
