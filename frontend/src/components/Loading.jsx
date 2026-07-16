function Loading({ message = 'Loading...' }) {
    return (
        <div className="text-center stext py-5">
            <div
                className="spinner-border stext"
                role="status"
            >
                <span className="visually-hidden">
                    Loading
                </span>
            </div>

            <p className="mt-3 stext">{message}</p>
        </div>
    );
}

export default Loading;