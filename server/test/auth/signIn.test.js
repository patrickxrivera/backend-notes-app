const chai = require('chai');
const chaiHttp = require('chai-http');

const User = require('../../models/User');
const initTestSetup = require('../testSetup');
const code = require('../../utils/statusCodes');
const app = require('../../app');

chai.use(chaiHttp);
const expect = chai.expect;

const credentials = { username: 'bob', password: 'qoeru1934p' };

describe('POST /api/signin', () => {
  const signInRoute = '/api/signin';

  before(async () => {
    const route = '/api/signup';

    const res = await chai
      .request(app)
      .post(route)
      .send(credentials);

    return;
  });

  it('should sign in a user', async () => {
    const res = await chai
      .request(app)
      .post(signInRoute)
      .send(credentials);

    expect(res).to.have.status(code.OK);
    expect(res.body.token).to.be.a('string');
  });

  after(async () => {
    await User.remove({});
  });
});
