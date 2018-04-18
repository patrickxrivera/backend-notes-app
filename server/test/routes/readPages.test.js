const chai = require('chai');
const chaiHttp = require('chai-http');

const Page = require('../../models/Page');
const User = require('../../models/User');
const code = require('../../utils/statusCodes');
const app = require('../../app');

chai.use(chaiHttp);
const expect = chai.expect;

let token;

const seededUser = {
  username: 'samantha',
  password: '314dsfadkfeaf',
  pages: []
};

const createPageRoute = `/api/page/new`;

const createPage = (page) =>
  chai
    .request(app)
    .post(createPageRoute)
    .set('authorization', token)
    .send(page);

describe('GET /api/pages', () => {
  const firstPage = { parentId: null, title: 'Engineering' };
  const secondPage = { parentId: null, title: 'Cooking' };

  before(async () => {
    const signUpRoute = '/api/signup';

    const res = await chai
      .request(app)
      .post(signUpRoute)
      .send(seededUser);

    token = res.body.token;

    await createPage(firstPage);
    await createPage(secondPage);

    return;
  });

  it('should return all pages', async () => {
    const route = '/api/pages';

    const res = await chai
      .request(app)
      .get(route)
      .set('authorization', token);

    expect(res).to.have.status(code.OK);
    expect(res.body).to.have.length(2);
    expect(res.body[0]).to.include(firstPage);
  });

  it('should thrown an error when given an invalid token', async () => {
    const route = '/api/pages';

    const res = await chai
      .request(app)
      .get(route)
      .set('authorization', 123);

    expect(res).to.have.status(code.UNAUTHORIZED);
  });

  after(async () => {
    await User.remove({});
    await Page.remove({});
  });
});
