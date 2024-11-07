import { ORCHESTRA, APP_BUILDER, AI_SERVICE, MAUM_GPT, CLOUD_API, MAUM_DATA, CHATPLAY } from 'data/routers';

export const GNB = [
  {
    pathname: AI_SERVICE,
    class: 'ai',
    name: 'AI Service',
    path: 'aiService',
  },
  {
    pathname: APP_BUILDER,
    class: 'builder',
    name: 'APP Builder',
    path: 'appBuilder',
  },
  {
    pathname: '#ai-human-m3',
    class: 'm3',
    name: 'AI Human M3',
    path: 'AiHumanM3',
  },
  {
    pathname: MAUM_GPT,
    class: 'gpt',
    name: 'maum Chatbot',
    path: 'maumChatbot',
  },
  {
    pathname: ORCHESTRA,
    class: 'orchestra',
    name: 'Orchestra',
    path: 'orchestra',
  },
  {
    pathname: CLOUD_API,
    class: 'cloud',
    name: 'Cloud API',
    path: 'cloudApi',
  },
  {
    pathname: MAUM_DATA,
    class: 'data',
    name: 'maum Data',
    path: 'maumData',
  },
  // {
  //   pathname: CHATPLAY,
  //   class: "chatplay",
  //   name: "Chat Play",
  //   path: "chatplay"
  // },
  // {
  //   pathname: "#contact-us", // contact us 모달
  //   class: "contact",
  //   name: "Contact Us",
  //   path: "contactUs"
  // }
];
