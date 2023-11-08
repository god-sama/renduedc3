const Article = require('./articles.model');
const User = require('../users/users.model');

/*
 * Crée un nouvel article
 */
async function createArticle(userId, articleData) {
	try {
		const usercheck = await User.findById(userId, "-password");
		if (!usercheck) {
			throw Error("L'utilisateur n'existe pas.");
		}

		const newArticle = new Article(articleData);
		newArticle.user = usercheck;

		const createdArticle = await newArticle.save();
		return createdArticle;
	} catch (error) {
		throw error;
	}
}

/*
 * Met à jour un article existant
 */
async function updateArticle(articleId, updatedData) {
	try {
		const updatedArticle = await Article.findByIdAndUpdate(articleId, updatedData, { new: true });

		if (!updatedArticle) {
			throw new Error("Article non trouvé.");
		}
		return updatedArticle;
	} catch (error) {
		throw error;
	}
}

/*
 * Supprime un article
 */
async function deleteArticle(articleId) {
	try {
		return await Article.deleteOne({ _id: articleId });
	} catch (error) {
		throw error;
	}
}

/*
 * Récupère tous les articles d'un utilisateur (en excluant le mot de passe)
 */
async function getUserArticles(userId) {
	const usercheck = await User.findById(userId, "-password");
	if (!usercheck) {
		throw Error("L'utilisateur n'existe pas.");
	}
	const userArticles = await Article.find({ user: usercheck })
		.populate("user", "-password");
	return userArticles;
}

module.exports = {
	createArticle,
	updateArticle,
	deleteArticle,
	getUserArticles,
};
