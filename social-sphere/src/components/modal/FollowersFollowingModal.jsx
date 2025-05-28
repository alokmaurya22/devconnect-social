const FollowersFollowingModal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop blur layer */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* Main Modal Box */}
            <div
                className="fixed top-1/2 left-1/2 w-[90%] max-w-md h-[450px]
                    -translate-x-1/2 -translate-y-1/2
                    bg-[#fff] dark:bg-[#141414] rounded-xl shadow-xl z-50 flex flex-col overflow-hidden"
            >
                {/* Header with close */}
                <div className="flex justify-end p-2 border-b border-gray-200 dark:border-gray-700">
                    <button
                        className="text-lg font-semibold text-gray-500 hover:text-black dark:hover:text-white"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                {/* Scrollable Content Section */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 px-3 py-2">
                    {children}
                </div>
            </div>
        </>
    );
};

export default FollowersFollowingModal;