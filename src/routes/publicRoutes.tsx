import { PublicLayout } from "../layouts/PublicLayout";
import type { RouteObject } from "react-router-dom";
import Register from "../pages/public/Register";
import Login from "../pages/public/Login";
import ProductCatalogSimple from "../pages/public/ProductCatalogSimple";

export const publicRoutes: RouteObject = {
  path: "/",
  element: <PublicLayout />,
  children: [
    { index: true, element: <ProductCatalogSimple /> },
    { path: "login", element: <Login /> },
    { path: "register", element: <Register /> },
    { path: "products", element: <ProductCatalogSimple /> },
  ],
};