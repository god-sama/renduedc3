const articlesService = require('./articles.service');

/**
 * Contrôleur pour créer un nouvel article et associer l'ID de l'utilisateur connecté
 */
async function createArticle(req, res) {
	try {
		const articleData = req.body;
		const userId = req.user.userId;

		articleData.author = userId;
		const createdArticle = await articlesService.createArticle(userId, articleData);

		req.io.emit('articleCreated', createdArticle); // Émet un événement en temps réel

		res.status(201).json(createdArticle);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

/**
 * Contrôleur pour mettre à jour un article existant
 */
async function updateArticle(req, res) {
	try {
		const articleId = req.params.articleId;
		const updatedData = req.body;

		if (req.user.role !== 'admin') {
			return res.status(403).json({ error: 'Accès refusé. Autorisations insuffisantes.' });
		}

		const updatedArticle = await articlesService.updateArticle(articleId, updatedData);

		req.io.emit('articleUpdated', updatedArticle); // Émet un événement en temps réel

		res.status(200).json(updatedArticle);
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

/**
 * Contrôleur pour supprimer un article
 */
async function deleteArticle(req, res) {
	try {
		const articleId = req.params.articleId;

		if (req.user.role !== 'admin') {
			return res.status(403).json({ error: 'Accès refusé. Autorisations insuffisantes.' });
		}

		await articlesService.deleteArticle(articleId);

		req.io.emit('articleDeleted', { articleId }); // Émet un événement en temps réel

		res.status(204).send();
	} catch (error) {
		res.status(400).json({ error: error.message });
	}
}

module.exports = { createArticle, updateArticle, deleteArticle };
