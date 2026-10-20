import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";
import ScrollToTop from "../components/ScrollTop";

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen bg-bg text-text">
            <ScrollToTop/>
            {/* ── Navbar ── */}
            <Navbar />

            {/* ── Main Content ── */}
            <main className="flex-1 ">
                <div className="">
                    <Outlet />
                </div>
            </main>

            {/* ── Footer ── */}
            <Footer />
        </div>
    );
}
