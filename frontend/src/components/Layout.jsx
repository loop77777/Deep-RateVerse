import Navbar from "./Navbar";

/**
 * Layout Component - Wraps pages with navbar
 */
export default function Layout({ children }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="container mx-auto p-4">
                {children}
            </main>
        </div>
    );
}