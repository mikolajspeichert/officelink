import { ADD_PEER, REMOVE_PEER } from './actions'

export function main(state = [], action) {
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
