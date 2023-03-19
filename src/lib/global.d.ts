import type { Record } from "pocketbase";

export interface User extends Record {
  id: string,
  username?: string,
  typing?: boolean,
}

export interface Message extends Record {
  expand: {
    user_id?: User
  }
}
