const request = require('supertest');
const express = require('express');
const userRoutes = require('../../src/routes/userRoutes');
const authRoutes = require('../../src/routes/authRoutes');

describe('User Controller', () => {
  let app;
  let authToken;
  let testUser;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);

    // Create and login test user
    testUser = global.testUtils.generateTestUser();
    await request(app)
      .post('/api/auth/register')
      .send(testUser);

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    authToken = loginResponse.body.token;
  });

  describe('GET /api/users/profile', () => {
    it('should get user profile successfully', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(testUser.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should return 401 for missing token', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update profile successfully', async () => {
      const updateData = {
        displayName: 'Updated Name',
        bio: 'Updated bio'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.displayName).toBe(updateData.displayName);
      expect(response.body.user.bio).toBe(updateData.bio);
    });

    it('should return 400 for invalid update data', async () => {
      const invalidData = {
        email: 'invalid-email'
      };

      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing token', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .send({ displayName: 'Test' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/users/search', () => {
    let secondUser;
    let secondUserToken;

    beforeEach(async () => {
      // Create second user for search tests
      secondUser = global.testUtils.generateTestUser();
      await request(app)
        .post('/api/auth/register')
        .send(secondUser);

      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: secondUser.email,
          password: secondUser.password
        });

      secondUserToken = loginResponse.body.token;
    });

    it('should search users successfully', async () => {
      const response = await request(app)
        .get('/api/users/search')
        .query({ q: secondUser.username.substring(0, 5) })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(Array.isArray(response.body.users)).toBe(true);
    });

    it('should return empty array for no matches', async () => {
      const response = await request(app)
        .get('/api/users/search')
        .query({ q: 'nonexistentuser12345' })
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(response.body.users).toHaveLength(0);
    });

    it('should return 400 for missing search query', async () => {
      const response = await request(app)
        .get('/api/users/search')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 401 for missing token', async () => {
      const response = await request(app)
        .get('/api/users/search')
        .query({ q: 'test' })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/users/upload-avatar', () => {
    it('should return 401 for missing token', async () => {
      const response = await request(app)
        .post('/api/users/upload-avatar')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });

    it('should return 400 for missing file', async () => {
      const response = await request(app)
        .post('/api/users/upload-avatar')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });
});
