import { useEffect, useState, useContext } from 'react'
import { Info, Link } from 'lucide-react'
import toast from 'react-hot-toast'
import AuthContext from '../context/AuthContext'
import validateDoubt from '../validations/validateDoubt'
import notificationSound from '../sounds/notificationAudio.mp3'

const TopicsInput = ({
    isTopicsLoading,
    setIsTopicsLoading,
    doubtInput,
    handleDoubtFormInput,
}) => {
    const [topics, setTopics] = useState([])

    const fetchTopics = async () => {
        setIsTopicsLoading(true)
        const response = await fetch('http://localhost:3000/topics')
        const topics = await response.json()
        setTopics(topics.data)
        setIsTopicsLoading(false)
    }

    useEffect(() => {
        fetchTopics()
    }, [])

    return isTopicsLoading ? (
        <div className="skeleton input w-full bg-blue-50"></div>
    ) : (
        <>
            <select
                name="topic"
                className="select custom-input w-full"
                value={doubtInput.topic}
                onChange={handleDoubtFormInput}
            >
                <option value="">Pick a Topic</option>
                {topics.map((topic) => (
                    <option key={topic._id} value={topic._id}>
                        {topic.name}
                    </option>
                ))}
            </select>
        </>
    )
}

const DoubtForm = ({ doubt, setDoubts, setIsEditing, closeDoubtModal }) => {
    const {
        auth: { jwtToken },
    } = useContext(AuthContext)
    const [doubtInput, setDoubtInput] = useState({
        title: doubt.title,
        description: doubt.description,
        questionURL: doubt.questionURL,
        discussionURL: doubt.discussionURL,
        topic: doubt.topic._id || '',
    })
    const [error, setError] = useState({})
    const [isLoading, setIsLoading] = useState(false)
    const [isTopicsLoading, setIsTopicsLoading] = useState(false)

    const handleDoubtFormInput = (e) => {
        setDoubtInput({ ...doubtInput, [e.target.name]: e.target.value })
    }

    const handleDoubtSubmission = async (e) => {
        e.preventDefault()
        const error = validateDoubt(doubtInput)
        setError(error) // sets and resets error

        if (Object.keys(error).length > 0) return

        setIsLoading(true)
        let url = ''
        let options = ''
        if (doubt._id) {
            url = `http://localhost:3000/doubts/${doubt._id}`
            options = {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${jwtToken}`,
                },
                method: 'PUT',
                body: JSON.stringify(doubtInput),
            }
        } else {
            url = 'http://localhost:3000/doubts'
            options = {
                headers: {
                    'Content-Type': 'application/json',
                    authorization: `Bearer ${jwtToken}`,
                },
                method: 'POST',
                body: JSON.stringify(doubtInput),
            }
        }
        const response = await fetch(url, options)
        const {
            data: { doubt: newDoubt },
        } = await response.json()
        const audio = new Audio(notificationSound)
        if (response.status === 201) {
            setDoubts((doubtList) => [newDoubt, ...doubtList])
            audio.play().then(() => {
                toast('Doubt posted successfully', {
                    icon: '🔔',
                    className: '!text-emerald-500',
                })
            })
            closeDoubtModal()
        } else {
            setDoubts((doubtList) =>
                doubtList.map((doubt) =>
                    doubt._id === newDoubt._id ? newDoubt : doubt
                )
            )
            audio.play().then(() => {
                toast('Doubt updated successfully', {
                    icon: '🔔',
                    className: '!text-emerald-500',
                })
            })

            setIsEditing(false)
        }
        setDoubtInput({
            title: '',
            description: '',
            questionURL: '',
            discussionURL: '',
            topic: '',
        })
        setIsLoading(false)
    }

    return (
        <form
            onSubmit={handleDoubtSubmission}
            className={isLoading ? 'opacity-60' : ''}
        >
            <div>
                <label className="floating-label">
                    <span className="floating-input-label">Title</span>
                    <input
                        type="text"
                        name="title"
                        value={doubtInput.title}
                        onChange={handleDoubtFormInput}
                        className="input custom-input w-full"
                        placeholder="Title"
                    />
                </label>
                {error.title && (
                    <p className="text-error error-msg">
                        <Info size={16} className="mr-1 inline" />
                        {error.title}
                    </p>
                )}
            </div>

            <div className="my-4">
                <label className="floating-label">
                    <span className="floating-input-label">Description</span>

                    <textarea
                        name="description"
                        value={doubtInput.description}
                        onChange={handleDoubtFormInput}
                        className="textarea custom-input w-full"
                        placeholder="Description"
                    ></textarea>
                </label>
                {error.description && (
                    <p className="text-error error-msg">
                        <Info size={16} className="mr-1 inline" />
                        {error.description}
                    </p>
                )}
            </div>
            <div>
                <label className="input custom-input w-full">
                    <span className="label badge !mr-0 bg-purple-500 !text-xs font-bold text-white">
                        <Link size={12} />
                        Question
                    </span>
                    <input
                        type="text"
                        name="questionURL"
                        value={doubtInput.questionURL}
                        onChange={handleDoubtFormInput}
                    />
                </label>

                {error.questionURL && (
                    <p className="text-error error-msg">
                        <Info size={16} className="mr-1 inline" />
                        {error.questionURL}
                    </p>
                )}
            </div>
            <div className="my-4">
                <label className="input custom-input w-full">
                    <span className="label badge !mr-0 bg-purple-500 !text-xs font-bold text-white">
                        <Link size={12} />
                        Discussion
                    </span>
                    <input
                        type="text"
                        name="discussionURL"
                        value={doubtInput.discussionURL}
                        onChange={handleDoubtFormInput}
                    />
                </label>

                {error.discussionURL && (
                    <p className="text-error error-msg">
                        <Info size={16} className="mr-1 inline" />
                        {error.discussionURL}
                    </p>
                )}
            </div>
            <div>
                <TopicsInput
                    isTopicsLoading={isTopicsLoading}
                    setIsTopicsLoading={setIsTopicsLoading}
                    doubtInput={doubtInput}
                    handleDoubtFormInput={handleDoubtFormInput}
                />
                {error.topic && (
                    <p className="text-error error-msg">
                        <Info size={16} className="mr-1 inline" />
                        {error.topic}
                    </p>
                )}
            </div>
            <button
                type="submit"
                disabled={isLoading}
                className="btn mt-4 w-full bg-purple-500 font-bold text-white"
            >
                {isLoading ? (
                    <span className="loading loading-dots loading-xs"></span>
                ) : (
                    'Save'
                )}
            </button>
        </form>
    )
}

export default DoubtForm
