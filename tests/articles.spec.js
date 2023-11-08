const supertest = require('supertest');
const { app } = require('../server');
const request = supertest(app);
const mockingoose = require('mockingoose');
const jwt = require("jsonwebtoken");
const config = require("../config");
const User = require("../api/users/users.model");
const Article = require('../api/articles/articles.model');


let token;
const USER_ID = "6544f5e30f4d1298bac10241";
const ARTICLE_ID = "6544f5e30f4d1298bac10456";

beforeEach(() => {
	token = jwt.sign({ userId: USER_ID, role: "admin" }, config.secretJwtToken);
	mockingoose(User).toReturn({
		_id: USER_ID,
		name: "ana",
		email: "nfegeg@gmail.com",
		password: "azertyuiop"
	}, "findOne");
});
// Test création d'un article
describe('POST /api/articles/', () => {
	it('devrait retourner un code de réponse 201 et un objet JSON en cas de succès', async () => {
		const response = await request
			.post('/api/articles/')
			.set("x-access-token", token)
			.send({ title: 'Nouvel article', status: 'draft', content: 'test' });
		expect(response.status).toBe(201);
		expect(response.body).toEqual(expect.objectContaining({ title: 'Nouvel article', status: 'draft', content: 'test' }));
	});
});

// Test mise à jour d'un article
describe('PUT /api/articles/:articleId', () => {
	it('devrait retourner un code de réponse 200 et un objet JSON en cas de succès', async () => {
		mockingoose(Article).toReturn({ _id: ARTICLE_ID, title: 'Article mis à jour', status: 'published', content: "test" }, 'findOneAndUpdate');
		const response = await request
			.put('/api/articles/' + ARTICLE_ID)
			.set("x-access-token", token)
			.send({ title: 'Article mis à jour', status: 'published', content: "test" });
		expect(response.status).toBe(200);
		expect(response.body).toEqual(expect.objectContaining({ title: 'Article mis à jour', status: 'published' }));
	});
});

// Test suppression d'un article
describe('DELETE /api/articles/:articleId', () => {
	it('devrait retourner un code de réponse 204 en cas de succès', async () => {
		mockingoose(Article).toReturn({ _id: ARTICLE_ID, title: 'Article à supprimer', status: 'published', content: "test" }, 'findOneAndDelete');
		const response = await request.delete('/api/articles/' + ARTICLE_ID).set("x-access-token", token);
		expect(response.status).toBe(204);
	});
});

afterEach(() => {
	jest.restoreAllMocks();
});
