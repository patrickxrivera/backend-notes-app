const filter = require('ramda/src/filter');
const curry = require('ramda/src/curry');
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
  let pageId;

  before(async () => {
    let res = await createUser(firstSeededUser);
    await createUser(secondSeededUser);

    token = res.body.token;

    const firstPage = { parentId: null, title: 'Engineering' };
    const secondPage = { parentId: null, title: 'Cooking' };

    await createPage(firstPage);
    res = await createPage(secondPage);

    pageId = res.body[1];
    return;
  });

  const isTargetPage = curry((targetPageId, { _id }) =>
    _id.equals(targetPageId)
  );

  it('should update a page', async () => {
    const route = `/api/page`;

    const updatedPage = { _id: pageId, title: 'Why I Love Programming' };

    const res = await chai
      .request(app)
      .put(route)
      .set('authorization', token)
      .send(updatedPage);

    const user = await User.findById(res.body.userId).populate('pages');
    const targetPage = filter(isTargetPage(res.body._id), user.pages);

    expect(res).to.have.status(code.OK);
    expect(res.body).to.include(updatedPage);
    expect(targetPage[0].title).to.equal(updatedPage.title);
  });

  it('should thrown an error when given an invalid token', async () => {
    const route = `/api/page`;

    const updatedPage = { _id: pageId, title: 'Why I Love Programming' };

    const res = await chai
      .request(app)
      .put(route)
      .set('authorization', 123)
      .send(updatedPage);

    expect(res).to.have.status(code.UNAUTHORIZED);
  });

  after(async () => {
    await User.remove({});
    await Page.remove({});
  });
});
