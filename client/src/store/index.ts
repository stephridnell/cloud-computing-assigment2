/* eslint-disable camelcase */
import { createStore } from 'vuex'
import { Song, User } from '../types'

interface State {
  user: User
  subscriptions: Song[]
}

const initialUser: User = {
  user_id: '',
  user_name: '',
  email: ''
}

export default createStore({
  state: {
    user: initialUser,
    subscriptions: []
  },
  getters: {
    currentUser (state: State): User {
      return state.user
    },
    subscriptions (state: State): Song[] {
      return state.subscriptions
    },
    subscriptionId:
      (state: State) => (musicId: string): string | undefined => {
        return state.subscriptions.find((song) => song.music_id === musicId)
          ?.sub_id
      }
  },
  mutations: {
    // setting the whole user in localstorage as a very budget way of persisting login without using jwt
    setCurrentUser (state: State, user: User) {
      window.localStorage.setItem('user', JSON.stringify(user))
      state.user = { ...user }
    },
    logout (state: State) {
      window.localStorage.removeItem('user')
      state.user = initialUser
    },
    setSubscriptions (state: State, subscriptions: Song[]) {
      state.subscriptions = [...subscriptions]
    }
  },
  actions: {},
  modules: {}
})
