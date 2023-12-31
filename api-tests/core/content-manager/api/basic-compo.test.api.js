'use strict';

const { createTestBuilder } = require('api-tests/builder');
const { createStrapiInstance } = require('api-tests/strapi');
const { createAuthRequest } = require('api-tests/request');

const builder = createTestBuilder();
let strapi;
let rq;
const data = {
  productsWithCompo: [],
};

const compo = {
  displayName: 'compo',
  attributes: {
    name: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'text',
      minLength: 4,
      maxLength: 30,
    },
  },
};

const productWithCompo = {
  attributes: {
    name: {
      type: 'string',
    },
    description: {
      type: 'text',
    },
    compo: {
      component: 'default.compo',
      type: 'component',
      required: true,
    },
  },
  displayName: 'product with compo',
  singularName: 'product-with-compo',
  pluralName: 'product-with-compos',
  description: '',
  collectionName: '',
};

describe('CM API - Basic + compo', () => {
  beforeAll(async () => {
    await builder.addComponent(compo).addContentType(productWithCompo).build();

    strapi = await createStrapiInstance();
    rq = await createAuthRequest({ strapi });
  });

  afterAll(async () => {
    await strapi.destroy();
    await builder.cleanup();
  });

  test('Create product with compo', async () => {
    const product = {
      name: 'Product 1',
      description: 'Product description',
      compo: {
        name: 'compo name',
        description: 'short',
      },
    };
    const res = await rq({
      method: 'POST',
      url: '/content-manager/collection-types/api::product-with-compo.product-with-compo',
      body: product,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(product);
    expect(res.body.publishedAt).toBeUndefined();
    data.productsWithCompo.push(res.body);
  });

  test('Read product with compo', async () => {
    const res = await rq({
      method: 'GET',
      url: `/content-manager/collection-types/api::product-with-compo.product-with-compo/${data.productsWithCompo[0].id}`,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(data.productsWithCompo[0]);
    expect(res.body.publishedAt).toBeUndefined();
  });

  test('Update product with compo', async () => {
    const product = {
      name: 'Product 1 updated',
      description: 'Updated Product description',
      compo: {
        name: 'compo name updated',
        description: 'update',
      },
    };
    const res = await rq({
      method: 'PUT',
      url: `/content-manager/collection-types/api::product-with-compo.product-with-compo/${data.productsWithCompo[0].id}`,
      body: product,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(product);
    expect(res.body.id).toEqual(data.productsWithCompo[0].id);
    expect(res.body.publishedAt).toBeUndefined();
    data.productsWithCompo[0] = res.body;
  });

  test('Delete product with compo', async () => {
    const res = await rq({
      method: 'DELETE',
      url: `/content-manager/collection-types/api::product-with-compo.product-with-compo/${data.productsWithCompo[0].id}`,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(data.productsWithCompo[0]);
    expect(res.body.id).toEqual(data.productsWithCompo[0].id);
    expect(res.body.publishedAt).toBeUndefined();
    data.productsWithCompo.shift();
  });

  test('Clone product with compo', async () => {
    const product = {
      name: 'Product 1',
      description: 'Product description',
      compo: {
        name: 'compo name',
        description: 'short',
      },
    };
    const { body: createdProduct } = await rq({
      method: 'POST',
      url: '/content-manager/collection-types/api::product-with-compo.product-with-compo',
      body: product,
    });

    const res = await rq({
      method: 'POST',
      url: `/content-manager/collection-types/api::product-with-compo.product-with-compo/clone/${createdProduct.id}`,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(product);
  });

  describe('validation', () => {
    test('Cannot create product with compo - compo required', async () => {
      const product = {
        name: 'Product 1',
        description: 'Product description',
      };
      const res = await rq({
        method: 'POST',
        url: '/content-manager/collection-types/api::product-with-compo.product-with-compo',
        body: product,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({
        data: null,
        error: {
          message: 'compo must be defined.',
          name: 'ValidationError',
          details: {
            errors: [
              {
                path: ['compo'],
                message: 'compo must be defined.',
                name: 'ValidationError',
              },
            ],
          },
        },
      });
    });

    test('Cannot create product with compo - minLength', async () => {
      const product = {
        name: 'Product 1',
        description: 'Product description',
        compo: {
          name: 'compo name',
          description: '',
        },
      };
      const res = await rq({
        method: 'POST',
        url: '/content-manager/collection-types/api::product-with-compo.product-with-compo',
        body: product,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({
        data: null,
        error: {
          message: 'compo.description must be at least 4 characters',
          name: 'ValidationError',
          details: {
            errors: [
              {
                path: ['compo', 'description'],
                message: 'compo.description must be at least 4 characters',
                name: 'ValidationError',
              },
            ],
          },
        },
      });
    });

    test('Cannot create product with compo - maxLength', async () => {
      const product = {
        name: 'Product 1',
        description: 'Product description',
        compo: {
          name: 'compo name',
          description: 'A very long description that exceed the min length.',
        },
      };
      const res = await rq({
        method: 'POST',
        url: '/content-manager/collection-types/api::product-with-compo.product-with-compo',
        body: product,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({
        data: null,
        error: {
          message: 'compo.description must be at most 30 characters',
          name: 'ValidationError',
          details: {
            errors: [
              {
                path: ['compo', 'description'],
                message: 'compo.description must be at most 30 characters',
                name: 'ValidationError',
              },
            ],
          },
        },
      });
    });

    test('Cannot create product with compo - required', async () => {
      const product = {
        name: 'Product 1',
        description: 'Product description',
        compo: {
          description: 'short',
        },
      };
      const res = await rq({
        method: 'POST',
        url: '/content-manager/collection-types/api::product-with-compo.product-with-compo',
        body: product,
      });

      expect(res.statusCode).toBe(400);
      expect(res.body).toMatchObject({
        data: null,
        error: {
          message: 'compo.name must be defined.',
          name: 'ValidationError',
          details: {
            errors: [
              {
                path: ['compo', 'name'],
                message: 'compo.name must be defined.',
                name: 'ValidationError',
              },
            ],
          },
        },
      });
    });
  });
});
