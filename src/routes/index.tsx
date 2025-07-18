import { publicRoutes } from "./publicRoutes";
import { privateRoutes, userRoutes } from "./privateRoutes";
import { RouteObject } from "react-router-dom";
import UnauthorizedPage from "../pages/public/UnauthorizedPage";
import { Navigate } from "react-router-dom";

// Define a catch-all unauthorized page
const unauthorizedRoute: RouteObject = {
  path: '/unauthorized',
  element: <UnauthorizedPage />
};

// Define a not-found (404) route
const notFoundRoute: RouteObject = {
  path: '*',
  element: <Navigate to="/" replace />
};

export const appRoutes: RouteObject[] = [
  publicRoutes,
  privateRoutes,
  userRoutes,
  unauthorizedRoute,
  notFoundRoute
];