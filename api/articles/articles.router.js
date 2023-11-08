const express = require("express");
const articlesController = require("./articles.controller");
const authMiddleware = require("../../middlewares/auth");

const router = express.Router();

/*
 * Crée un article
 */
router.post("/", authMiddleware, articlesController.createArticle);

/*
 * Met à jour un article existant
 */
router.put("/:articleId", authMiddleware, articlesController.updateArticle);

/*
 * Supprime un article
 */
router.delete("/:articleId", authMiddleware, articlesController.deleteArticle);

module.exports = router;

