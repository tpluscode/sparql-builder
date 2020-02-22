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

class ConstructResponse extends Response {
  quadStream = jest.fn()
}

export function sparqlClient(mockDefaults: SparqlClientDefaults = defaultDefaults) {
  return {
    updateQuery: jest.fn().mockResolvedValue(new Response(mockDefaults?.update?.body, mockDefaults?.update?.response)),
    selectQuery: jest.fn().mockResolvedValue(new Response(mockDefaults?.select?.body, mockDefaults?.select?.response)),
    constructQuery: jest.fn().mockResolvedValue(new ConstructResponse(mockDefaults?.construct?.body, mockDefaults?.construct?.response)),
  }
}
