const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidv4');


// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.status(201).json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const repositoryIndex = repositories.findIndex(project => project.id === id);
  
  if(repositoryIndex < 0) {
    return response.status(400).json({error: 'Repositório não encontrado'});
  }

  const prevRepository = repositories[repositoryIndex];

  const repository = {
    id: id,
    title,
    url,
    techs,
    likes: prevRepository.likes
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(project => project.id === id);

  if(repositoryIndex < 0) {
    return response.status(400).json({error: "Repositório não encontrado"})
  }

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(project => project.id === id);
  
  if(repositoryIndex < 0) {
    return response.status(400).json({error: 'Repositório não encontrado'});
  }

  const repositoryToBeUpdated = repositories[repositoryIndex];
  const likes = repositoryToBeUpdated.likes + 1;

  const updatedRepository = {
    id: repositoryToBeUpdated.id,
    title: repositoryToBeUpdated.title,
    url: repositoryToBeUpdated.url,
    techs: repositoryToBeUpdated.techs,
    likes: likes
  }

  repositories[repositoryIndex] = updatedRepository;

  return response.status(201).json({likes: likes});
});

module.exports = app;
