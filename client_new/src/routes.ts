import ChatPage from "./pages/ChatPage";
import LoginPage from "./pages/LoginPage";

export const Routes = {
  LOGIN: "/login",
  REGISTER: "/register",
  RESET: "/reset/:id",
  CHAT: "/chat",
};

export const AUTH_GUARD = [Routes.CHAT];

export const RouteConfig = [
  {
    path: Routes.LOGIN,
    component: LoginPage,
  },
  {
    path: Routes.CHAT,
    component: ChatPage,
    requiresAuth: true,
  },
];
