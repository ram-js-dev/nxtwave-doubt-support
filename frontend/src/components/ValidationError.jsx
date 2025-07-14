const ValidationError = ({ errors }) => {
    return errors ? (
        <ul>
            {errors.map((err, idx) => (
                <li key={idx} className="text-error">
                    *{err}
                </li>
            ))}
        </ul>
    ) : null
}
export default ValidationError
