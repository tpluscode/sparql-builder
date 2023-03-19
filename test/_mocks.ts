import sinon from 'sinon'

export function sparqlClient() {
  return {
    ask: sinon.stub(),
    select: sinon.stub(),
    construct: sinon.stub(),
    update: sinon.stub(),
  }
}
