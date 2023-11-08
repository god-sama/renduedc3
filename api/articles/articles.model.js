const { Schema, model } = require("mongoose");

/**
 * Schéma de l'article
 */
const articleSchema = Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  /**
   * Statut de l'article : 'draft' ou 'published'
   * Par défaut, le statut est 'draft'.
   */
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
});
const Article = model("Article", articleSchema);
module.exports = Article;
