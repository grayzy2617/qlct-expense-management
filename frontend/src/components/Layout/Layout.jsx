import React from "react";
import { Outlet } from "react-router-dom";
import MenuFooter from "../MenuFooter";

const Layout = () => {
  return (
    <div style={{ paddingBottom: "80px", minHeight: "100vh" }}>
      <Outlet />
      <MenuFooter />
    </div>
  );
};

export default Layout;
