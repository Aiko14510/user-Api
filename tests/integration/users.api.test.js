import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../../src/app.js';

describe('Users API', () => {
  it('POST /api/v1/users → 201 and Location header', async () => {
    const app = createApp();

    const res = await request(app)
      .post('/api/v1/users')
      .set('Content-Type', 'application/json')
      .send({
        firstName: 'Sita',
        lastName: 'Gurung',
        email: 'sita@example.com',
        password: 'Secret123',
      });

    expect(res.status).toBe(201);

    expect(res.body.data).toMatchObject({
      firstName: 'Sita',
      lastName: 'Gurung',
      email: 'sita@example.com',
    });

    expect(res.body.data).not.toHaveProperty('password');
    expect(res.body.data).not.toHaveProperty('passwordHash');

    expect(res.headers.location).toBe(
      `/api/v1/users/${res.body.data.id}`,
    );
  });

  it('GET /api/v1/users → 200 with data and pagination metadata', async () => {
    const app = createApp();

    const res = await request(app)
      .get('/api/v1/users');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(res.body).toHaveProperty('meta');
expect(res.body).toHaveProperty('links');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('POST /api/v1/users rejects invalid data', async () => {
    const app = createApp();

    const res = await request(app)
      .post('/api/v1/users')
      .set('Content-Type', 'application/json')
      .send({
        firstName: '',
        email: 'not-an-email',
        password: 'short',
      });

    expect(res.status).toBe(400);

    expect(res.headers['content-type']).toMatch(
      /application\/problem\+json/,
    );
  });

  it('POST /api/v1/users rejects fields that should not be set', async () => {
    const app = createApp();

    const res = await request(app)
      .post('/api/v1/users')
      .set('Content-Type', 'application/json')
      .send({
        firstName: 'Eve',
        lastName: 'H',
        email: 'eve@example.com',
        password: 'Secret123',
        role: 'admin',
      });

    expect(res.status).toBe(400);
    expect(res.body).toEqual(
      expect.objectContaining({
        errors: expect.arrayContaining([
          expect.objectContaining({
            field: 'role',
          }),
        ]),
      }),
    );
  });

  it('GET /api/v1/users/:id → 404 for a missing user', async () => {
    const app = createApp();

    const res = await request(app)
    .get('/api/v1/users/00000000-0000-0000-0000-000000000000');

    expect(res.status).toBe(404);
  });

  it('DELETE /api/v1/users/:id → 204 No Content', async () => {
    const app = createApp();

    const createRes = await request(app)
      .post('/api/v1/users')
      .set('Content-Type', 'application/json')
      .send({
        firstName: 'Delete',
        lastName: 'User',
        email: 'delete@example.com',
        password: 'Secret123',
      });

    const id = createRes.body.data.id;

    const deleteRes = await request(app)
      .delete(`/api/v1/users/${id}`);

    expect(deleteRes.status).toBe(204);

    const getRes = await request(app)
      .get(`/api/v1/users/${id}`);

    expect(getRes.status).toBe(404);
  });

  it('PATCH /api/v1/users/:id → 200 with updated data', async () => {
    const app = createApp();

    const createRes = await request(app)
      .post('/api/v1/users')
      .set('Content-Type', 'application/json')
      .send({
        firstName: 'Sita',
        lastName: 'Gurung',
        email: 'patch@example.com',
        password: 'Secret123',
      });

    expect(createRes.status).toBe(201);

    const id = createRes.body.data.id;

    const updateRes = await request(app)
      .patch(`/api/v1/users/${id}`)
      .set('Content-Type', 'application/json')
      .send({
        phone: '+977-9800000000',
      });

    expect(updateRes.status).toBe(200);

    expect(updateRes.body.data).toMatchObject({
      id,
      phone: '+977-9800000000',
    });

    expect(updateRes.body.data).not.toHaveProperty('password');
    expect(updateRes.body.data).not.toHaveProperty('passwordHash');
  });
});
