import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FollowersFollowingModal from "./FollowersFollowingModal";
import FollowersFollowingContent from "./FollowersFollowingContent";

const GlobalModalHandler = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);

    const showModal = searchParams.get("showModal") === "true";
    const type = searchParams.get("type");
    const userId = searchParams.get("userId");

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (showModal && userId) {
            setIsModalOpen(true);
        } else {
            setIsModalOpen(false);
        }
    }, [location]);

    const handleClose = () => {
        // Close modal and clean URL
        searchParams.delete("showModal");
        searchParams.delete("type");
        searchParams.delete("userId");

        navigate({
            pathname: location.pathname,
            search: searchParams.toString()
        }, { replace: true });
    };

    return (
        isModalOpen && (
            <FollowersFollowingModal isOpen={isModalOpen} onClose={handleClose}>
                <FollowersFollowingContent userId={userId} type={type} />
            </FollowersFollowingModal>
        )
    );
};

export default GlobalModalHandler;