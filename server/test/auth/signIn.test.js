const chai = require('chai');
const chaiHttp = require('chai-http');

const User = require('../../models/User');
const initTestSetup = require('../testSetup');
const code = require('../../utils/statusCodes');
const app = require('../../app');

chai.use(chaiHttp);
const expect = chai.expect;

const signUpCredentials = { firstName: 'Bob', username: 'bob', password: 'qoeru1934p' };
const signInCredentials = { username: 'bob', password: 'qoeru1934p' };
const wrongPassword = { username: 'bob', password: 'wrongpassword' };

describe('POST /api/signin', () => {
  before(async () => {
    const route = '/api/signup';

    await chai
      .request(app)
      .post(route)
      .send(signUpCredentials);

    return;
  });

  it('should sign in a user', async () => {
    const signInRoute = '/api/signin';

    const res = await chai
      .request(app)
      .post(signInRoute)
      .send(signInCredentials);

    expect(res).to.have.status(code.OK);
    expect(res.body.username).to.be.equal(signUpCredentials.username);
    expect(res.body.firstName).to.equal(signUpCredentials.firstName);
    expect(res.body.userId).to.be.a('string');
    expect(res.body.token).to.be.a('string');
  });

  it('should handle wrong password', async () => {
    const signInRoute = '/api/signin';

    const res = await chai
      .request(app)
      .post(signInRoute)
      .send(wrongPassword);

    expect(res).to.have.status(code.UNAUTHORIZED);
  });

  after(async () => {
    await User.remove({});
  });
});
