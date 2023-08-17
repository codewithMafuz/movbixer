import { Link } from "react-router-dom";

export default function ErrorPage() {
    const networkProblem = !navigator.onLine

    return (
        <div className="flex items-center justify-center h-screen m-auto">
            <div className="bg-dark p-8 rounded-md w-full flex flex-col items-center gap-4 h-full justify-center ">
                {!networkProblem && <>
                    <h1 className="text-6xl font-bold text-blue-700 mb-4 text-center">404</h1>
                    <h2 className="text-2xl font-bold text-gray-200 mb-2">
                        Oops! Page Not Found
                    </h2>
                    <p style={{ wordWrap: 'break-word', width: '100%' }} className="text-lg text-gray-300 mb-4">
                        The page you're looking for <span className="font-bold">(url : {window.location.href})</span> doesn't exist
                    </p>
                </>}
                {<Link
                    onClick={() => {
                        if (networkProblem) {
                            window.location.reload()
                        }
                    }}
                    to="/"
                    className="px-5 py-2 rounded-md text-blue-100 bg-blue-600 hover:bg-blue-700 text-center"
                >
                    {networkProblem ? 'Something went wrong, Reload' : 'Home'}
                </Link>
                }
            </div>
        </div>
    )
}