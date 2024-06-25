import { RouteObject, useRoutes } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout';
import { HOME, SIGN_OUT, CHATROOM, CHATBUILDER, ADDFUNCTIONS } from 'data/routers';
import SignOut from 'pages/signout';
import ProAI from 'pages';
import ChatRoom from 'pages/chatRoom';
import ChatUI from 'pages/chatUI';
import ChatBuilder from 'pages/chatBuilder';
import AddFunctions from 'pages/addFunctions';
export default function AppRouter() {
  const routes: RouteObject[] = [
    {
      path: HOME,
      element: <MainLayout />,
      children: [
        {
          path: HOME,
          element: <ProAI />,
        },
        {
          path: CHATROOM,
          children: [
            {
              index: true,
              element: <ChatRoom />,
            },
            {
              path: ':roomId',
              element: <ChatUI />,
            },
          ],
        },
        {
          path: CHATBUILDER,
          element: <ChatBuilder />,
        },
        {
          path: ADDFUNCTIONS,
          element: <AddFunctions />,
        },
      ],
    },
    {
      path: SIGN_OUT,
      index: true,
      element: <SignOut />,
    },
  ];

  return useRoutes(routes);
}
