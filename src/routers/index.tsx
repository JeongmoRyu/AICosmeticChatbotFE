import { RouteObject, useRoutes } from 'react-router-dom';
import MainLayout from 'layouts/MainLayout';
import {
  HOME,
  SIGN_OUT,
  CHATROOM,
  CHATBUILDER,
  LOGIN,
  FUNCTIONS,
  ACCOUNT_ADMIN,
  EMBEDDING_RANKER,
  EMBEDDING_LEADERBOARD,
  EMBEDDING_HISTORY,
} from 'data/routers';
import SignOut from 'pages/signout';
import ProAI from 'pages';
import ChatRoom from 'pages/chatRoom';
import ChatUI from 'pages/chatUI';
import ChatBuilder from 'pages/chatBuilder';
import Login from 'pages/Login';
import Functions from 'pages/functions';
import Admin from 'pages/Admin';
import EmbeddingRanker from 'pages/EmbeddingRanker';
import EmbeddingLeaderboard from 'pages/EmbeddingLeaderboard';
import EmbeddingHistory from 'pages/EmbeddingHistory';
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
          path: FUNCTIONS,
          element: <Functions />,
        },
        {
          path: ACCOUNT_ADMIN,
          element: <Admin />,
        },
        {
          path: EMBEDDING_RANKER,
          element: <EmbeddingRanker />,
        },
        {
          path: EMBEDDING_LEADERBOARD,
          element: <EmbeddingLeaderboard />,
        },
        {
          path: EMBEDDING_HISTORY,
          element: <EmbeddingHistory />,
        },
      ],
    },
    {
      path: SIGN_OUT,
      index: true,
      element: <SignOut />,
    },
    {
      path: LOGIN,
      element: <Login />,
    },
  ];

  return useRoutes(routes);
}
