const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(project => id == project.id);

  if (!project) {
    return res.status(400).json({ error: `This project doesn't exist.` });
  }

  return next();
}

function reqCounter(req, res, next) {
  console.count('Number of requisitions');

  return next();
}

server.use(reqCounter);

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => {
    return id == project.id;
  });

  project.title = title;

  return res.json(project);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(project => {
    return id == project.id;
  });

  projects.splice(index, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => {
    return id == project.id;
  });

  project.tasks.push(title);

  return res.json(project);
});

server.listen(3000, () => {
  console.log('Server started and running on port 3000');
});
