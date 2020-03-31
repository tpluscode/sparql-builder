interface SparqlClientResponseInit {
  body?: string
  response?: ResponseInit
}

interface SparqlClientDefaults {
  update?: SparqlClientResponseInit
  select?: SparqlClientResponseInit
  construct?: SparqlClientResponseInit
}

const defaultDefaults: SparqlClientDefaults = {
  update: {
    body: '{}',
  },
  select: {
    body: JSON.stringify({
      results: {
        bindings: [],
      },
    }),
  },
  construct: {
    body: '',
  },
}

export function sparqlClient(mockDefaults: SparqlClientDefaults = defaultDefaults) {
  return {
    ask: jest.fn(),
    select: jest.fn(),
    construct: jest.fn(),
    update: jest.fn(),
  }
}
