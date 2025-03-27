import Header from "./Header";
import { Outlet } from "react-router-dom"
import Footer from "./Footer"
import ToastContainer from "@/components/ToastContainer";

const Layout = () => {
  return (
    <div className="min-w-2xs max-w-7xl w-full grid h-dvh grid-rows-[auto_1fr_auto]">
      <Header />
      <main className="w-full flex flex-col justify-center items-center">
        <Outlet />
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Layout;
