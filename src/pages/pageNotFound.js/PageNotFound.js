import { Link } from "react-router-dom";

export default function ErrorPage(props) {
    const network = props.network

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded-md">
                {!network && <>
                    <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
                    <h2 className="text-3xl font-bold text-gray-800 mb-2">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-lg text-gray-500 mb-4">
                        The page you're looking for <span className="font-bold">(url : {window.location.href})</span> doesn't exist
                    </p>
                </>}
                {<Link
                    onClick={() => {
                        if (network) {
                            window.location.reload()
                        }
                    }}
                    to="/"
                    className="px-5 py-2 rounded-md text-blue-100 bg-blue-600 hover:bg-blue-700"
                >
                    {network ? 'Something went wrong, Reload' : 'Home'}
                </Link>
                }
            </div>
        </div>
    )
}