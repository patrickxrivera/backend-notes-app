const chai = require('chai');
const chaiHttp = require('chai-http');

const User = require('../models/User');
const initTestSetup = require('./testSetup');
const code = require('../utils/statusCodes');
const app = require('../app');

initTestSetup();

chai.use(chaiHttp);
const expect = chai.expect;

describe('ROUTES', () => {
  const credentials = { username: 'bob', password: 'qoeru1934p' };
  const noUsername = { password: credentials.password };
  const noPassword = { username: credentials.username };
  const emptyPassword = { username: credentials.username, password: '' };
  const wrongUsername = { username: 'jill', password: credentials.password };
  const wrongPassword = { username: credentials.username, password: 'jlqer' };
  const seededUser = { username: 'samantha', password: '314dsfadkfeaf' };

  const errReq = async (body) => {
    const route = '/api/signup';

    const res = await chai
      .request(app)
      .post(route)
      .send(body);

    expect(res).to.have.status(code.USER_ERROR);
    expect(res.body.error).to.equal('You must provide a username and password');
  };

  before(async () => {
    const route = '/api/signup';

    const res = await chai
      .request(app)
      .post(route)
      .send(seededUser);

    return;
  });

  describe('ROOT', () => {
    it('should return a greeting', async () => {
      const route = '/';
      const res = await chai.request(app).get(route);

      expect(res).to.have.status(code.OK);
    });
  });

  describe('POST /api/signup', () => {
    it('should sign up a user', async () => {
      const route = '/api/signup';
      const res = await chai
        .request(app)
        .post(route)
        .send(credentials);

      expect(res).to.have.status(code.OK);
      expect(res.body.token).to.be.a('string');
    });

    it('should report no username', () => errReq(noUsername));

    it('should report no password', () => errReq(noPassword));

    it('should report empty password', () => errReq(emptyPassword));

    it('should report an unavailable username', async () => {
      const route = '/api/signup';
      const res = await chai
        .request(app)
        .post(route)
        .send(seededUser);

      expect(res).to.have.status(code.USER_ERROR);
      expect(res.body.error).to.equal(
        'Username already exists. Please try again.'
      );
    });
  });
});
