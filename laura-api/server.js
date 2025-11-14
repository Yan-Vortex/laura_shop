const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

const ARTICLES_FILE = "./data/articles.json";
const SECTIONS_FILE = "./data/sections.json";

function readJSON(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJSON(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

/* ------------------- SECTIONS ---------------------- */

// Liste des sections
app.get("/sections", (req, res) => {
  res.json(readJSON(SECTIONS_FILE));
});

// Création section
app.post("/sections", (req, res) => {
  const { name } = req.body;
  const sections = readJSON(SECTIONS_FILE);

  const newSection = {
    id: Date.now(),
    name
  };

  sections.push(newSection);
  writeJSON(SECTIONS_FILE, sections);

  res.json(newSection);
});

// Suppression section
app.delete("/sections/:id", (req, res) => {
  const id = Number(req.params.id);
  let sections = readJSON(SECTIONS_FILE);

  sections = sections.filter(s => s.id !== id);
  writeJSON(SECTIONS_FILE, sections);

  res.json({ success: true });
});

/* ------------------- ARTICLES ---------------------- */

// Liste articles
app.get("/articles", (req, res) => {
  res.json(readJSON(ARTICLES_FILE));
});

// Ajouter article
app.post("/articles", (req, res) => {
  const { title, price, image, sectionId } = req.body;

  const articles = readJSON(ARTICLES_FILE);

  const newArticle = {
    id: Date.now(),
    title,
    price,
    image,
    sectionId
  };

  articles.push(newArticle);
  writeJSON(ARTICLES_FILE, articles);

  res.json(newArticle);
});

// Modifier article
app.put("/articles/:id", (req, res) => {
  const id = Number(req.params.id);
  const { title, price, image, sectionId } = req.body;

  const articles = readJSON(ARTICLES_FILE);

  const index = articles.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: "Not found" });

  articles[index] = { id, title, price, image, sectionId };
  writeJSON(ARTICLES_FILE, articles);

  res.json(articles[index]);
});

// Supprimer article
app.delete("/articles/:id", (req, res) => {
  const id = Number(req.params.id);
  let articles = readJSON(ARTICLES_FILE);

  articles = articles.filter(a => a.id !== id);

  writeJSON(ARTICLES_FILE, articles);
  res.json({ success: true });
});

/* ------------------- DÉMARRAGE ---------------------- */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("API démarrée sur le port " + PORT));
