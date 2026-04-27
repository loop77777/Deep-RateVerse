import { Link, useLocation } from "react-router-dom";
import { getUser } from "../utils/auth";
import { useState } from "react";
import { useSnackbar } from 'notistack';

export default function Navbar() {
    const user = getUser();
    const location = useLocation();
    const { enqueueSnackbar } = useSnackbar();
    const [menuOpen, setMenuOpen] = useState(false);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        enqueueSnackbar("Logged out successfully!", { variant: "success" });
        setTimeout(() => {
            window.location.href = "/";
        }, 500);
    };

    // Simple logo navbar for login/signup pages
    if (location.pathname === "/" || location.pathname === "/signup") {
        return (
            <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-lg">
                <div className="flex justify-between items-center container mx-auto">
                    <h1 className="text-2xl font-bold">RateVerse</h1>
                </div>
            </nav>
        );
    }

    // Full navbar for authenticated pages
    return (
        <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">RateVerse</h1>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-8">
                        {user && (
                            <div className="space-x-4 flex">
                                {user.role === "user" && (
                                    <Link to="/stores" className="hover:text-blue-200 transition font-semibold">
                                        Stores
                                    </Link>
                                )}

                                {user.role === "admin" && (
                                    <>
                                        <Link to="/admin" className="hover:text-blue-200 transition font-semibold">
                                            Dashboard
                                        </Link>
                                        <Link to="/admin/users" className="hover:text-blue-200 transition font-semibold">
                                            Users
                                        </Link>
                                        <Link to="/stores" className="hover:text-blue-200 transition font-semibold">
                                            Stores
                                        </Link>
                                    </>
                                )}

                                {user.role === "owner" && (
                                    <>
                                        <Link to="/owner" className="hover:text-blue-200 transition font-semibold">
                                            My Store
                                        </Link>
                                        <Link to="/stores" className="hover:text-blue-200 transition font-semibold">
                                            Stores
                                        </Link>
                                    </>
                                )}

                                <Link to="/settings" className="hover:text-blue-200 transition font-semibold">
                                    Settings
                                </Link>
                            </div>
                        )}

                        {user && (
                            <div className="flex items-center gap-4 border-l border-blue-400 pl-4">
                                <span className="text-sm text-blue-100">
                                    {user.name}
                                </span>
                                <button
                                    onClick={logout}
                                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition font-semibold"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Burger Menu */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="text-white focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-3 border-t border-blue-400 pt-4">
                        {user && (
                            <>
                                {user.role === "user" && (
                                    <Link
                                        to="/stores"
                                        className="block hover:text-blue-200 transition font-semibold"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Stores
                                    </Link>
                                )}

                                {user.role === "admin" && (
                                    <>
                                        <Link
                                            to="/admin"
                                            className="block hover:text-blue-200 transition font-semibold"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Dashboard
                                        </Link>
                                        <Link
                                            to="/stores"
                                            className="block hover:text-blue-200 transition font-semibold"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Stores
                                        </Link>
                                    </>
                                )}

                                {user.role === "owner" && (
                                    <>
                                        <Link
                                            to="/owner"
                                            className="block hover:text-blue-200 transition font-semibold"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            My Store
                                        </Link>
                                        <Link
                                            to="/stores"
                                            className="block hover:text-blue-200 transition font-semibold"
                                            onClick={() => setMenuOpen(false)}
                                        >
                                            Stores
                                        </Link>
                                    </>
                                )}

                                <Link
                                    to="/settings"
                                    className="block hover:text-blue-200 transition font-semibold"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Settings
                                </Link>

                                <button
                                    onClick={() => {
                                        logout();
                                        setMenuOpen(false);
                                    }}
                                    className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition font-semibold text-left"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}