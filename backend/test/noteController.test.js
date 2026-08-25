process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key_at_least_32_characters_long';
process.env.JWT_EXPIRES_IN = '1h';
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
chai.use(chaiHttp);

const { connect, closeDatabase, clearDatabase } = require('./helpers/testDb');
const app = require('../src/app');

describe('Note API endpoints', () => {
  let token;
  let otherUserToken;

  before(async () => {
    await connect();
  });

  beforeEach(async () => {
    const registerRes = await chai.request(app).post('/api/auth/register').send({
      name: 'Note Owner',
      email: 'owner@example.com',
      password: 'password123',
    });
    token = registerRes.body.data.token;

    const otherRes = await chai.request(app).post('/api/auth/register').send({
      name: 'Other User',
      email: 'other@example.com',
      password: 'password123',
    });
    otherUserToken = otherRes.body.data.token;
  });

  afterEach(async () => {
    await clearDatabase();
  });

  after(async () => {
    await closeDatabase();
  });

  describe('POST /api/notes', () => {
    it('Creates a note for the authenticated user', async () => {
      const res = await chai
        .request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'My First Note', content: 'Some content here' });

      expect(res).to.have.status(201);
      expect(res.body.data.note.title).to.equal('My First Note');
    });

    it('returns 401 without a token', async () => {
      const res = await chai.request(app).post('/api/notes').send({ title: 'No auth' });
      expect(res).to.have.status(401);
    });
    it('returns 400 when title is missing', async () => {
      const res = await chai
        .request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'No title here' });

      expect(res).to.have.status(400);
    });
    it('returns 400 when title is only whitespace', async () => {
      const res = await chai
        .request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '   ' });

      expect(res).to.have.status(400);
    });
  });

  describe('GET /api/notes', () => {
    it("Returns only the authenticated user's notes", async () => {
      await chai
        .request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Owner Note' });

      await chai
        .request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({ title: 'Other User Note' });

      const res = await chai.request(app).get('/api/notes').set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.data.notes).to.have.lengthOf(1);
      expect(res.body.data.notes[0].title).to.equal('Owner Note');
    });
  });

  describe('GET /api/notes/:id', () => {
    it('Returns a single note owned by the user', async () => {
      const createRes = await chai
        .request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Fetch Me' });

      const noteId = createRes.body.data.note._id;

      const res = await chai
        .request(app)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.data.note.title).to.equal('Fetch Me');
    });

    it("Returns 404 when trying to access another user's note", async () => {
      const createRes = await chai
        .request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Private Note' });

      const noteId = createRes.body.data.note._id;

      const res = await chai
        .request(app)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${otherUserToken}`);

      expect(res).to.have.status(404);
    });
  });

  describe('PATCH /api/notes/:id', () => {
    it('updates a note owned by the user', async () => {
      const createRes = await chai
        .request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Old Title' });

      const noteId = createRes.body.data.note._id;

      const res = await chai
        .request(app)
        .patch(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'New Title' });

      expect(res).to.have.status(200);
      expect(res.body.data.note.title).to.equal('New Title');
    });

    it("Returns 404 when trying to update another user's note", async () => {
      const createRes = await chai
        .request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Protected' });

      const noteId = createRes.body.data.note._id;

      const res = await chai
        .request(app)
        .patch(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${otherUserToken}`)
        .send({ title: 'Hacked Title' });

      expect(res).to.have.status(404);
    });

    it('returns 400 when no updatable fields are provided', async () => {
      const createRes = await chai
        .request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Untouched' });

      const noteId = createRes.body.data.note._id;

      const res = await chai
        .request(app)
        .patch(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ user: 'someone-else-id' }); // only a disallowed field

      expect(res).to.have.status(400);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('Deletes a note owned by the user', async () => {
      const createRes = await chai
        .request(app)
        .post('/api/notes')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Delete Me' });

      const noteId = createRes.body.data.note._id;

      const res = await chai
        .request(app)
        .delete(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);

      const getRes = await chai
        .request(app)
        .get(`/api/notes/${noteId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(getRes).to.have.status(404);
    });
  });

  describe('POST /api/notes/import', () => {
    it('rejects a malformed import payload', async () => {
      const res = await chai
        .request(app)
        .post('/api/notes/import')
        .set('Authorization', `Bearer ${token}`)
        .send({ notInAnArray: true });

      expect(res).to.have.status(400);
    });

    it('rejects an import claiming to be from a different account', async () => {
      const res = await chai
        .request(app)
        .post('/api/notes/import')
        .set('Authorization', `Bearer ${token}`)
        .send({
          version: '1.0',
          exportedBy: 'someone-elses-fake-user-id',
          notes: [{ title: 'Sneaky note' }],
        });

      expect(res).to.have.status(403);
    });

    it('accepts a valid import from the same account', async () => {
      const res = await chai
        .request(app)
        .post('/api/notes/import')
        .set('Authorization', `Bearer ${token}`)
        .send([{ title: 'Imported note', content: '', tags: [] }]);

      expect(res).to.have.status(201);
      expect(res.body.data.notes).to.have.lengthOf(1);
    });
  });

  describe('Edge cases and Error handling', () => {
    it('Returns 404 for a malformed note ID format on GET /api/notes/:id', async () => {
      const res = await chai
        .request(app)
        .get('/api/notes/invalid-ObjectId-format')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(404);
    });

    it('Returns 404 when trying to delete a non-existent note', async () => {
      const fakeId = '5f4e3d2c1b0a9f8e7d6c5b4a';
      const res = await chai
        .request(app)
        .delete(`/api/notes/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(404);
    });
  });
});