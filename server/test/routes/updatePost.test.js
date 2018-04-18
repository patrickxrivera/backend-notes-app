const chai = require('chai');
const chaiHttp = require('chai-http');

const Page = require('../../models/Page');
const User = require('../../models/User');
const code = require('../../utils/statusCodes');
const app = require('../../app');

chai.use(chaiHttp);
const expect = chai.expect;

let token;

const firstSeededUser = {
  username: 'samantha',
  password: '314dsfadkfeaf',
  pages: []
};

const secondSeededUser = {
  username: 'billy',
  password: 'faeafejaif',
  pages: []
};

const createPageRoute = `/api/page/new`;

const signUpRoute = '/api/signup';

const createUser = (user) =>
  chai
    .request(app)
    .post(signUpRoute)
    .send(user);

const createPage = (page) =>
  chai
    .request(app)
    .post(createPageRoute)
    .set('authorization', token)
    .send(page);

describe('PUT /api/page', () => {
  let postId;

  before(async () => {
    let res = await createUser(firstSeededUser);
    await createUser(secondSeededUser);

    token = res.body.token;

    const firstPage = { parentId: null, title: 'Engineering' };
    const secondPage = { parentId: null, title: 'Cooking' };

    await createPage(firstPage);
    res = await createPage(secondPage);

    postId = res.body.pages[1]._id;
    return;
  });

  it('should update a page', async () => {
    const route = `/api/page`;

    const updatedPost = { _id: postId, title: 'Why I Love Programming' };

    const res = await chai
      .request(app)
      .put(route)
      .set('authorization', token)
      .send(updatedPost);

    expect(res).to.have.status(code.OK);
    expect(res.body.pages).to.have.length(1);
    expect(res.body.pages[0]).to.include(page);
  });

  xit('should thrown an error when given an invalid token', async () => {
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
  });
});
