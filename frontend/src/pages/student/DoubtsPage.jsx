import { useState, useEffect, useContext, useRef } from 'react'
import { useOutletContext } from 'react-router'

import { Users, CircleHelp, BookOpen, Pencil, Trash2, X } from 'lucide-react'
import { formatDistance } from 'date-fns'
import AuthContext from '../../context/AuthContext'
import DoubtForm from '../../components/DoubtForm'
import Loading from '../../components/Loading'
import { BASE_URL } from '../../constants'

const Doubt = ({ doubt, setDoubts }) => {
    const {
        auth: { jwtToken },
    } = useContext(AuthContext)
    const { setInvites } = useOutletContext()
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const {
        title,
        description,
        discussionURL,
        questionURL,
        createdAt,
        topic: { name: topicname },
    } = doubt

    const handleDeleteDoubt = async () => {
        setIsLoading(true)
        const url = `${BASE_URL}/doubts/${doubt._id}`
        const options = {
            headers: {
                'Content-Type': 'application/json',
                authorization: `Bearer ${jwtToken}`,
            },
            method: 'DELETE',
        }
        const response = await fetch(url, options)
        if (response.ok) {
            setDoubts((doubtsList) =>
                doubtsList.filter((eachDoubt) => eachDoubt._id !== doubt._id)
            )
            setInvites((invitesList) =>
                invitesList.filter((eachInvite) => eachInvite._id !== doubt._id)
            )
        }

        setIsLoading(false)
    }
    return isLoading ? (
        <Loading />
    ) : (
        <li className="card my-4 flex w-full flex-row border border-slate-300 bg-white p-4 shadow-sm">
            {isEditing ? (
                <div className="max-w-3/5 grow">
                    <DoubtForm
                        doubt={doubt}
                        setDoubts={setDoubts}
                        setIsEditing={setIsEditing}
                    />
                </div>
            ) : (
                <div className="max-w-3/5 grow">
                    <div className="mb-4 rounded-2xl">
                        <p className="w-fit max-w-full truncate rounded-2xl bg-purple-500 p-2 text-xs font-bold text-white select-none">
                            <BookOpen size={12} className="mx-1 inline" />
                            {topicname}
                        </p>
                    </div>

                    <p className="mb-2 text-xl font-bold text-slate-700">
                        {title}
                    </p>
                    <p className="mb-4 text-base font-medium text-slate-500">
                        {description}
                    </p>
                    <ul className="menu menu-horizontal px-0">
                        <li>
                            <a href={questionURL} target="_blank">
                                <CircleHelp
                                    size={16}
                                    className="text-slate-600"
                                />
                                <span className="font-medium text-slate-600">
                                    Question
                                </span>
                            </a>
                        </li>
                        <li>
                            <a href={discussionURL} target="_blank">
                                <Users size={16} className="text-slate-600" />
                                <span className="font-medium text-slate-600">
                                    Discussion
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
            )}
            <div className="ml-auto flex flex-col items-end justify-between">
                <div>
                    <button
                        className="mx-2 cursor-pointer p-2 md:mx-4"
                        type="button"
                        onClick={() => setIsEditing((prev) => !prev)}
                    >
                        {isEditing ? (
                            <X className="h-4 w-4 text-slate-700 md:h-5 md:w-5" />
                        ) : (
                            <Pencil className="h-4 w-4 text-slate-700 md:h-5 md:w-5" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={handleDeleteDoubt}
                        className="cursor-pointer p-2"
                    >
                        <Trash2 className="h-4 w-4 text-slate-700 md:h-5 md:w-5" />
                    </button>
                </div>
                {!isEditing && (
                    <p className="mb-4 text-xs font-bold text-slate-400 md:text-sm lg:text-base">
                        {formatDistance(new Date(createdAt), new Date(), {
                            addSuffix: true,
                        })}
                    </p>
                )}
            </div>
        </li>
    )
}

const DoubtsPage = () => {
    const {
        auth: { jwtToken, authUser },
    } = useContext(AuthContext)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [doubts, setDoubts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const fetchDoubts = async () => {
        setIsLoading(true)
        const url = `${BASE_URL}/doubts?postedBy=${authUser._id}&sort=-createdAt`
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
        fetchDoubts()
    }, [])

    return (
        <div>
            <div className="my-4 text-right">
                <label
                    htmlFor="my_modal_6"
                    className="btn rounded-3xl bg-purple-500 text-white"
                >
                    Ask Doubt
                </label>
            </div>
            <input
                onChange={() => setIsModalOpen((prev) => !prev)}
                type="checkbox"
                id="my_modal_6"
                className="modal-toggle"
                checked={isModalOpen}
            />
            <div className="modal" role="dialog">
                <div className="modal-box">
                    <DoubtForm
                        doubt={{
                            title: '',
                            description: '',
                            questionURL: '',
                            discussionURL: '',
                            topic: '',
                        }}
                        setDoubts={setDoubts}
                        closeDoubtModal={() => {
                            setIsModalOpen(false)
                        }}
                    />
                    <div className="modal-action">
                        <label htmlFor="my_modal_6" className="btn">
                            Close
                        </label>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <Loading />
            ) : doubts.length === 0 ? (
                <p className="mt-20 text-center text-slate-400">
                    No doubts posted!
                </p>
            ) : (
                <ul>
                    {doubts.map((doubt) => (
                        <Doubt
                            key={doubt._id}
                            doubt={doubt}
                            setDoubts={setDoubts}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

export default DoubtsPage
