import { BellRing, ExternalLink, FilePenIcon, History } from 'lucide-react'
import { Link } from 'react-router'

const RootPage = () => {
    return (
        <main className="flex grow flex-col items-center select-none">
            <section className="mt-20 flex flex-col items-center gap-6">
                <h1 className="text-center text-6xl font-extrabold text-slate-800">
                    No More Waiting in Zoom Calls.
                </h1>
                <p className="font-lightbold text-center text-slate-700">
                    Post your doubt, get back to work — we’ll notify you when
                    it’s your turn to join the session.
                </p>
                <Link className="btn bg-purple-400 text-white" to="/signup">
                    Post your doubt now{' '}
                    <ExternalLink size={16} className="inline" />
                </Link>
            </section>
            <section className="mt-20 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="flex w-xs flex-col items-center gap-2">
                    <h3 className="font-bold text-slate-700">
                        <FilePenIcon className="mr-2 inline" size={16} />
                        Post doubts easily
                    </h3>
                    <p className="text-center text-slate-500">
                        No more filling Google Forms! Submit your doubts
                        directly on the website in just a few clicks.
                    </p>
                </div>
                <div className="flex w-xs flex-col items-center gap-2 border-x-purple-400 md:border-l-1 lg:border-r-1">
                    <h3 className="font-bold text-slate-700">
                        <BellRing className="mr-2 inline" size={16} />
                        Real-Time Alerts
                    </h3>
                    <p className="text-center text-slate-500">
                        Stay focused on your work. You’ll get a notification
                        when it’s your turn to join the session.
                    </p>
                </div>
                <div className="flex flex-col items-center gap-2 md:col-span-full md:min-w-xs lg:col-auto lg:w-xs">
                    <h3 className="font-bold text-slate-700">
                        <History className="mr-2 inline" size={16} />
                        View Your Doubts Anytime
                    </h3>
                    <p className="text-center text-slate-500">
                        See all the doubts you’ve posted so far <br />
                        for reference, edits, or follow-up.
                    </p>
                </div>
            </section>
        </main>
    )
}

export default RootPage
