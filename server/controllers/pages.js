const map = require('ramda/src/map');
const when = require('ramda/src/when');
const curry = require('ramda/src/curry');
const equals = require('ramda/src/equals');
const merge = require('ramda/src/merge');

const User = require('../models/User');
const Page = require('../models/Page');
const code = require('../utils/statusCodes');
const to = require('../utils/to');

const create = async ({ user, body }, res) => {
  const pageBody = { ...body, userId: user._id };
  const newPage = await Page.create(pageBody);

  const userToUpdate = await User.findById(user._id);
  userToUpdate.pages = [...userToUpdate.pages, newPage];

  await userToUpdate.save();

  res.status(code.CREATED).send(userToUpdate);
};

const read = async ({ user: { pages } }, res) => {
  res.send(pages);
};

// const isTargetPage = (body, page) => page._id.equals(body._id);
//
// const updateUser = curry((body, page) => {
//   // console.log(page);
//   return isTargetPage(body, page) ? { ...page, ...body } : page;
// });
//
const update = async ({ user, body }, res) => {
  //   const targetUser = await User.findById(user.id);
  //   // const updatedPages = map(updateUser(body), targetUser.pages);
  //   // console.log(updatedPages);
  //   // targetUser.pages = updatedPages;
  //   //
  //   // const updatedUser = await targetUser.save();
  //
  //   const updatedPages = targetUser.pages.map((page) => {
  //     return isTargetPage(body, page) ? { ...page, ...body } : page;
  //   });
  res.send({});
};

module.exports = {
  create,
  read,
  update
};
