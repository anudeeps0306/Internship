import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../index.js';

chai.use(chaiHttp);
const expect = chai.expect;

describe('API', () => {
  describe('GET /products', () => {
    it('should retrieve all products', (done) => {
      chai.request(app)
        .get('/products')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  describe('GET /products/:id', () => {
    it('should retrieve a single product by ID', (done) => {
      const productId = 'your-product-id-here';

      chai.request(app)
        .get(`/products/${productId}`)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });

    it('should return an error for a non-existent product ID', (done) => {
      const nonExistentId = 'non-existent-id';

      chai.request(app)
        .get(`/products/${nonExistentId}`)
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error').that.equals('Product not found');
          done();
        });
    });
  });

  describe('PUT /products/:id', () => {
    it('should update the price of a product', (done) => {
      const productId = 'your-product-id-here';
      const updatedPrice = 19.99;

      chai.request(app)
        .put(`/products/${productId}`)
        .send({ price: updatedPrice })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          done();
        });
    });

    it('should return an error for updating a non-existent product ID', (done) => {
      const nonExistentId = 'non-existent-id';
      const updatedPrice = 19.99;

      chai.request(app)
        .put(`/products/${nonExistentId}`)
        .send({ price: updatedPrice })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body).to.have.property('error').that.equals('Product not found');
          done();
        });
    });
  });
});
