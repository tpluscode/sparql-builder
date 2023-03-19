var chai = require("chai");
var sinonChai = require("sinon-chai");
var chaiAsPromised = require("chai-as-promised");
require('chai-snapshot-matcher');

chai.use(chaiAsPromised);
chai.use(sinonChai);
