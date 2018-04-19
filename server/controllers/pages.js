const map = require('ramda/src/map');
const curry = require('ramda/src/curry');
const filter = require('ramda/src/filter');
const isNil = require('ramda/src/isNil');

const User = require('../models/User');
const Page = require('../models/Page');
const code = require('../utils/statusCodes');
const to = require('../utils/to');

const create = async ({ user, body }, res) => {
  const pageBody = { ...body, userId: user._id };

  let test = await Page.find({});

  const newPage = await Page.create(pageBody);

  const targetUser = await User.findById(user._id);

  // Add new page to targetUser's pages w/o mutating directly
  targetUser.pages = [...targetUser.pages, newPage];

  await targetUser.save();

  res.status(code.CREATED).send(newPage);
};

const read = async ({ user }, res) => {
  const targetUser = await User.findById(user._id).populate('pages');
  res.send(targetUser.pages);
};

// helper function for update that gets the target page
// and updates the page with the request body
const updateTargetPage = curry((body, page) => {
  if (page._id.equals(body._id)) {
    page.set(body);
  }
  return page;
});

const update = async ({ user, body }, res) => {
  const targetUser = await User.findById(user._id).populate('pages');

  const result = map(updateTargetPage(body), targetUser.pages);

  // Add updated page to targetUser's pages
  targetUser.pages = result;
  await targetUser.save();

  // Update the targetPage on the Page model
  const targetPage = await Page.findById(body._id);
  targetPage.set(body);
  const updatedPage = await targetPage.save();

  res.send(updatedPage);
};

const isTargetPage = curry((body, page) => page._id.equals(body._id));

const remove = async ({ user, body }, res) => {
  const [err, page] = await to(Page.findByIdAndRemove(body._id));

  if (err || isNil(page)) {
    res
      .status(code.USER_ERROR)
      .send({ error: 'You must provide a proper pageId.' });
    return;
  }

  const targetUser = await User.findById(user._id);
  targetUser.pages = filter(isTargetPage, targetUser.pages);

  await targetUser.save();

  res.status(code.ACCEPTED).send({ success: true });
};

module.exports = {
  create,
  read,
  update,
  remove
};
