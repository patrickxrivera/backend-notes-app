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
  describe('ROOT', () => {
    it('should return a greeting', async () => {
      const route = '/';
      const res = await chai.request(app).get(route);

      expect(res).to.have.status(code.OK);
    });
  });
});
