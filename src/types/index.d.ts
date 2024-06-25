interface ChatType {
  chat_id: string;
  prompt: string;
  answer: string[];
  created_at: string;
  updated_at: string;
}

interface RoomType {
  session_id: string;
  chat_room_id: string;
  engine: string;
  title: string;
  chats: ChatType[];
  created_at: string;
  updated_at: string;
}

interface ChatHistoryType {
  [key: string]: string | string[] | number;
}
