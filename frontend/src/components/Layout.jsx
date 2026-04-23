export default function Layout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100">

            {/* Sidebar */}
            <div className="w-64 bg-black text-white p-6">
                <h2 className="text-xl font-bold mb-6">RateVerse</h2>

                <nav className="space-y-3">
                    <a href="/stores">Stores</a>
                    <a href="/admin">Admin</a>
                    <a href="/owner">Owner</a>
                </nav>
            </div>

            {/* Main */}
            <div className="flex-1 p-6">
                {children}
            </div>
        </div>
    );
}