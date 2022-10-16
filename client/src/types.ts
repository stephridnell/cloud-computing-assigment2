/* eslint-disable camelcase */
export interface User {
  user_id: string
  user_name: string
  email: string
}

export interface Song {
  web_url: string
  artist: string
  music_id: string
  year: string
  img_url: string
  title: string
  sub_id?: string
}
