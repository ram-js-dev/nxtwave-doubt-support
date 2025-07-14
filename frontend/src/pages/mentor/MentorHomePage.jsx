import { useContext, useEffect, useState } from 'react'
import { socket } from '../../socket'
import { formatDistance } from 'date-fns'
import toast from 'react-hot-toast'
import { CircleUser, Send, CircleCheckBig, ExternalLink } from 'lucide-react'
import AuthContext from '../../context/AuthContext'
import Loading from '../../components/Loading'
import notificationSound from '../../sounds/notificationAudio.mp3'
import { BASE_URL } from '../../constants'

const Doubt = ({ doubt, setDoubts }) => {
    const {
        auth: { jwtToken },
    } = useContext(AuthContext)
    const [isInvited, setIsInvited] = useState(doubt.isInvited)

    const handleInvite = async () => {
        const url = `${BASE_URL}/doubts/${doubt._id}`
        const options = {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${jwtToken}`,
            },
            method: 'PATCH',
            body: JSON.stringify({ isInvited: !isInvited }),
        }
        const response = await fetch(url, options)
        if (response.ok) {
            setIsInvited(!isInvited)
        }
    }

    const handleMarkAsResolved = async () => {
        const url = `${BASE_URL}/doubts/${doubt._id}`
        const options = {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${jwtToken}`,
            },
            method: 'PATCH',
            body: JSON.stringify({ status: 'RESOLVED', isInvited: false }),
        }
        const response = await fetch(url, options)
        const { data } = await response.json()

        setDoubts((dbtList) =>
            dbtList.filter((dbt) => dbt._id !== data.doubt._id)
        )
    }

    return (
        <li
            className={`card bg-white p-4 shadow-sm ${
                doubt.status === 'RESOLVED' ? 'order-1 opacity-40' : ''
            }`}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-baseline">
                    <p>
                        <CircleUser className="mr-2 inline text-slate-400" />
                    </p>
                    <p className="text-slate-800">{doubt.postedBy.username}</p>
                    <div className="mx-2 h-1 w-1 self-center rounded-[50%] bg-slate-200"></div>
                    <p className="text-sm text-slate-800">
                        {formatDistance(new Date(doubt.createdAt), new Date(), {
                            addSuffix: true,
                        })}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleInvite}
                    className="btn bg-purple-500 text-white"
                >
                    <Send size={14} /> {isInvited ? 'Undo' : 'Invite'}
                </button>
            </div>
            <p className="mb-2 text-xl font-bold text-slate-700">
                {doubt.title}
            </p>
            <p className="text-base font-medium text-slate-500">
                {doubt.description}
            </p>
            <div className="mt-4">
                <a
                    className="badge bg-gray-100 text-slate-600 shadow-sm"
                    href={doubt.questionURL}
                    target="_blank"
                >
                    Question
                    <ExternalLink className="inline" size={16} />
                </a>
                <a
                    className="badge mx-4 bg-gray-100 text-slate-600 shadow-sm"
                    href={doubt.discussionURL}
                    target="_blank"
                >
                    Discussion
                    <ExternalLink className="inline" size={16} />
                </a>

                <button
                    type="button"
                    onClick={handleMarkAsResolved}
                    className="btn btn-sm rounded bg-purple-500 text-white"
                >
                    <CircleCheckBig className="mr-1 inline" size={16} /> Mark as
                    resolved
                </button>
            </div>
        </li>
    )
}

const MentorHomePage = () => {
    const {
        auth: { jwtToken, authUser },
    } = useContext(AuthContext)
    const [doubts, setDoubts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchDoubts = async () => {
        setIsLoading(true)

        const url = `${BASE_URL}/doubts?topic=${authUser.specialization}&status=PENDING`
        const options = {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Beared ${jwtToken}`,
            },
            method: 'GET',
        }
        const response = await fetch(url, options)
        const { data } = await response.json()

        setIsLoading(false)
        setDoubts(data.doubts)
    }

    useEffect(() => {
        function onSpecialization(type, doubt) {
            switch (type) {
                case 'CREATE':
                    setDoubts((doubtsList) => [...doubtsList, doubt])
                    break
                case 'UPDATE':
                    setDoubts((doubtsList) =>
                        doubtsList.map((dbt) =>
                            dbt._id === doubt._id ? doubt : dbt
                        )
                    )
                    break
                case 'DELETE':
                    const audio = new Audio(notificationSound)
                    audio.play().then(() => {
                        toast.success(
                            `${doubt.postedBy.username} deleted his/her doubt`,
                            {
                                icon: '🔔',
                                className: '!text-purple-500',
                            }
                        )
                    })
                    setDoubts((doubtsList) =>
                        doubtsList.filter((dbt) => dbt._id != doubt._id)
                    )
                    break
                default:
                    console.log('INVALID TYPE')
            }
        }
        socket.on(authUser.specialization, onSpecialization)

        fetchDoubts()

        return () => {
            socket.off(authUser.specialization)
        }
    }, [])
    return isLoading ? (
        <Loading />
    ) : doubts.length === 0 ? (
        <p className="mt-20 text-center text-slate-400">No doubts posted!</p>
    ) : (
        <ul className="flex flex-col gap-4">
            {doubts.map((eachDoubt) => (
                <Doubt
                    key={eachDoubt._id}
                    doubt={eachDoubt}
                    setDoubts={setDoubts}
                />
            ))}
        </ul>
    )
}

export default MentorHomePage
