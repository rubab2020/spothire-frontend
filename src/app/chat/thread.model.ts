export class Thread {
  id: string;
  // avatar: string;
  creatorId: string;
  lastMessage: string;
  lastMsgTime: Date;
  members: Object;
  lastSeenMsgTime: Object;
  deletedByMembers?: Object;
  sender?: any;
}