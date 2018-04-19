const chai = require('chai');
const chaiHttp = require('chai-http');

const Page = require('../../models/Page');
const User = require('../../models/User');
const code = require('../../utils/statusCodes');
const app = require('../../app');

chai.use(chaiHttp);
const expect = chai.expect;

const seededUser = {
  username: 'samantha',
  password: '314dsfadkfeaf',
  pages: []
};

describe('POST /api/page/new', () => {
  let token;

  before(async () => {
    const route = '/api/signup';

    const res = await chai
      .request(app)
      .post(route)
      .send(seededUser);

    token = res.body.token;
    return;
  });

  it('should create a new page', async () => {
    const page = { parentId: null, title: 'Engineering' };

    const route = `/api/page/new`;
    const res = await chai
      .request(app)
      .post(route)
      .set('authorization', token)
      .send(page);

    expect(res).to.have.status(code.CREATED);
    expect(res.body).to.have.length(1);
  });

  it('should thrown an error when given an invalid token', async () => {
    const page = { parentId: null, title: 'Engineering' };

    const route = `/api/page/new`;
    const res = await chai
      .request(app)
      .post(route)
      .set('authorization', 123)
      .send(page);

    expect(res).to.have.status(code.UNAUTHORIZED);
  });

  after(async () => {
    await User.remove({});
    await Page.remove({});
  });
});
