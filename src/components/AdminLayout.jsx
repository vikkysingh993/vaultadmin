import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
// import Footer from "./Footer";

export default function AdminLayout() {
  return (
    <>
      <Header />
      <Sidebar />
      <main id="main" className="main">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
}
