import { useEffect, useState } from 'react'

import { useOutletContext } from 'react-router'
import { ChevronRight, CircleHelp, Mailbox, Users, Video } from 'lucide-react'
import Loading from '../../components/Loading'

const Topic = ({ topic }) => {
    return (
        <li className="card text-base-300 cursor-pointer rounded bg-purple-500 shadow-sm hover:bg-purple-400">
            <a
                href={`${topic.liveURL}`}
                target="_blank"
                className="flex flex-row items-center justify-between p-4"
            >
                <span className="max-w-4/5 truncate font-bold text-nowrap">
                    {topic.name}
                </span>
                <ChevronRight />
            </a>
        </li>
    )
}

const TopicsList = () => {
    const [topics, setTopics] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchTopics = async () => {
        const response = await fetch('http://localhost:3000/topics')
        const topics = await response.json()
        setTopics(topics.data)
    }

    useEffect(() => {
        setIsLoading(true)
        fetchTopics()
        setIsLoading(false)
    }, [])

    return !isLoading ? (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {topics.map((topic) => (
                <Topic topic={topic} key={topic._id} />
            ))}
        </ul>
    ) : (
        <h3 style={{ textAlign: 'center' }}>Loading</h3>
    )
}

const Invite = ({ invite }) => {
    return (
        <li className="list-row text-slate-700">
            <div className="self-center">
                <Mailbox />
            </div>
            <h2 className="list-col-grow self-center text-lg font-bold">
                {invite.title}
            </h2>
            <div className="tooltip" data-tip="Question">
                <a
                    href={invite.questionURL}
                    target="_blank"
                    className="btn btn-ghost"
                >
                    <CircleHelp />
                </a>
            </div>
            <div className="tooltip" data-tip="Discussion">
                <a
                    href={invite.discussionURL}
                    target="_blank"
                    className="btn btn-ghost"
                >
                    <Users />
                </a>
            </div>
            <div className="tooltip" data-tip="Join">
                <a
                    href={invite.topic.liveURL}
                    target="_blank"
                    className="btn btn-ghost"
                >
                    <Video />
                </a>
            </div>
        </li>
    )
}

const InvitesList = () => {
    const { isLoading, invites } = useOutletContext()

    return isLoading ? (
        <Loading />
    ) : invites.length === 0 ? (
        <p className="mt-10 text-center text-slate-400">No Invites yet</p>
    ) : (
        <ul className="list rounded-box bg-base-100 shadow-md">
            {invites.map((eachInvite) => (
                <Invite key={eachInvite._id} invite={eachInvite} />
            ))}
        </ul>
    )
}

const StudentHomePage = () => {
    return (
        <div>
            <h1 className="my-4 text-2xl font-bold text-slate-700">
                Live Sessions
            </h1>
            <TopicsList />
            <h2 className="my-4 text-2xl font-bold text-slate-700">Invites</h2>
            <InvitesList />
        </div>
    )
}

export default StudentHomePage
