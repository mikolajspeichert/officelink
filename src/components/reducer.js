import { ADD_PEER, REMOVE_PEER } from './actions'

var initialState = {
  connections: [],
  muted: true,
}

function connections(state = [], action) {
  switch (action.type) {
    case ADD_PEER:
      return Object.values(
        Object.assign(
          {},
          state,
          state.push({
            id: action.id,
            stream: action.stream,
          })
        )
      )
    case REMOVE_PEER:
      return state.filter(e => e.id !== action.id)
    default:
      return state
  }
}

export function main(state = initialState, action) {
  switch (action.type) {
    case ADD_PEER:
    case REMOVE_PEER:
      return Object.assign({}, state, {
        connections: connections(state.connections, action),
      })
    default:
      return state
  }
}
