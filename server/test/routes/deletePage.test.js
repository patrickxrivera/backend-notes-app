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

describe('DELETE /api/page', () => {
  let pageId;

  before(async () => {
    let res = await createUser(firstSeededUser);
    await createUser(secondSeededUser);

    token = res.body.token;

    const firstPage = { parentId: null, title: 'Engineering' };
    const secondPage = { parentId: null, title: 'Cooking' };

    await createPage(firstPage);
    res = await createPage(secondPage);

    pageId = res.body._id;
    return;
  });

  const isTargetPage = curry((targetPageId, { _id }) =>
    _id.equals(targetPageId)
  );

  it('should delete a page', async () => {
    const route = `/api/page`;

    const oldCount = await Page.count();

    const pageToDelete = { _id: pageId };

    const res = await chai
      .request(app)
      .delete(route)
      .set('authorization', token)
      .send(pageToDelete);

    const newCount = await Page.count();

    expect(res).to.have.status(code.ACCEPTED);
    expect(res.body.success).to.be.true;
    expect(oldCount - 1).to.equal(newCount);
  });

  it('should return an error message when provided an incorrect page id', async () => {
    const route = `/api/page`;

    const oldCount = await Page.count();

    const pageToDelete = { _id: 123 };

    const res = await chai
      .request(app)
      .delete(route)
      .set('authorization', token)
      .send(pageToDelete);

    const newCount = await Page.count();

    expect(res).to.have.status(code.USER_ERROR);
    expect(res.body.error).to.equal('You must provide a proper pageId.');
    expect(oldCount).to.equal(newCount);
  });

  it('should return an error message when not provided a page id', async () => {
    const route = `/api/page`;

    const oldCount = await Page.count();

    const pageToDelete = {};

    const res = await chai
      .request(app)
      .delete(route)
      .set('authorization', token)
      .send(pageToDelete);

    const newCount = await Page.count();

    expect(res).to.have.status(code.USER_ERROR);
    expect(res.body.error).to.equal('You must provide a proper pageId.');
    expect(oldCount).to.equal(newCount);
  });

  it('should thrown an error when given an invalid token', async () => {
    const route = `/api/page`;

    const pageToDelete = { _id: pageId };

    const res = await chai
      .request(app)
      .delete(route)
      .set('authorization', 123)
      .send(pageToDelete);

    expect(res).to.have.status(code.UNAUTHORIZED);
  });

  after(async () => {
    await User.remove({});
    await Page.remove({});
  });
});
