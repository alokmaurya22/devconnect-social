import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getFollowers, getFollowings } from '../utils/followUtils';
import { db } from '../configuration/firebaseConfig';
import { FaUser, FaCommentDots } from 'react-icons/fa'; // for icons in buttons

const FollowersFollowingPage = () => {
    // Getting user ID from the URL
    const { userId: pageUserId } = useParams();

    // Getting current logged-in user's ID from session storage
    const sessionUserId = sessionStorage.getItem('userID');

    // Getting follow type (followers or following) from the query string
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialTab = searchParams.get('type') === 'followings' ? 'following' : 'followers';

    // States to store data and UI control
    const [selectedTab, setSelectedTab] = useState(initialTab);
    const [followers, setFollowers] = useState([]);
    const [followings, setFollowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // This runs when the component loads or pageUserId changes
    useEffect(() => {
        const fetchFollowData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Fetching followers and followings from Firestore
                const [fetchedFollowers, fetchedFollowings] = await Promise.all([
                    getFollowers(pageUserId),
                    getFollowings(pageUserId),
                ]);

                // Storing the data in state
                setFollowers(fetchedFollowers);
                setFollowings(fetchedFollowings);
            } catch (err) {
                setError("Failed to load data.");
                console.error("Fetch error", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFollowData();
    }, [pageUserId]);

    // This component is used to show one user from the list
    const UserListItem = ({ userId, followedAt }) => {
        const [userData, setUserData] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);

        // Fetching full data of a single user using their ID
        useEffect(() => {
            const fetchUserData = async () => {
                try {
                    const userDocRef = doc(db, 'users', userId);
                    const userSnap = await getDoc(userDocRef);
                    if (userSnap.exists()) {
                        setUserData(userSnap.data());
                    } else {
                        setError('User not found');
                    }
                } catch (err) {
                    setError('Failed to load user');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };

            fetchUserData();
        }, [userId]);

        if (loading) {
            return <li className="p-4 text-sm text-muted-foreground">Loading user...</li>;
        }

        if (error || !userData) {
            return <li className="p-4 text-sm text-red-500">Error loading user.</li>;
        }

        return (
            <li className="flex items-center justify-between px-4 py-2 border border-border bg-card rounded-md hover:bg-muted/50 transition group">
                {/* Showing user profile picture and name */}
                <div className="flex items-center">
                    <img
                        src={userData.dp || 'https://via.placeholder.com/50'}
                        alt={userData.name}
                        className="w-10 h-10 rounded-full mr-3 object-cover"
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-medium truncate text-foreground">{userData.fullName || userData.name}</p>
                        <p className="text-xs text-muted-foreground truncate">@{userData.username}</p>

                        {/* Showing followed date only when logged-in user matches the profile user */}
                        {sessionUserId === pageUserId && followedAt && (
                            <p className="text-[10px] text-muted-foreground pt-1">
                                Followed At: {followedAt.toDate().toLocaleString()}
                            </p>
                        )}
                    </div>
                </div>

                {/* Buttons to view profile and chat, shown on hover */}
                <div className="hidden group-hover:flex gap-2">
                    <Link
                        to={`/user/${userId}`}
                        className="w-8 h-8 flex items-center justify-center border border-border rounded-full bg-background hover:bg-accent transition"
                        title="View Profile"
                    >
                        <FaUser className="text-sm text-foreground" />
                    </Link>
                    <Link
                        to={`/chats/${userId}`}
                        className="w-8 h-8 flex items-center justify-center border border-border rounded-full bg-background hover:bg-accent transition"
                        title="Start Chat"
                    >
                        <FaCommentDots className="text-sm text-foreground" />
                    </Link>
                </div>
            </li>
        );
    };

    // This component will show a list of users
    const UserList = ({ users }) => {
        if (!users || users.length === 0) {
            return (
                <div className="p-4 text-muted-foreground text-sm">No users to display.</div>
            );
        }

        return (
            <ul className="p-4 space-y-2">
                {users.map((user, index) => (
                    <UserListItem
                        key={user.userId || index}
                        userId={user.userId}
                        followedAt={user.followedAt}
                    />
                ))}
            </ul>
        );
    };

    // Show loading spinner while data is being fetched
    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-5rem)] bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-brand-orange"></div>
            </div>
        );
    }

    // Show error message if something goes wrong
    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    // Main screen layout
    return (
        <div className="flex h-[calc(100vh-5rem)] md:h-[calc(100vh-5.6rem)] w-full bg-background text-foreground mt-9 relative">
            <div className="w-full md:w-[500px] mx-auto border border-border bg-card flex flex-col rounded-lg mt-1 shadow-sm h-full">
                {/* Tabs to switch between followers and following */}
                <div className="flex border-b border-border">
                    <button
                        onClick={() => setSelectedTab('followers')}
                        className={`w-1/2 py-3 text-sm font-semibold transition-colors
                            ${selectedTab === 'followers'
                                ? 'border-b-2 border-brand-orange text-brand-orange'
                                : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Followers
                    </button>
                    <button
                        onClick={() => setSelectedTab('following')}
                        className={`w-1/2 py-3 text-sm font-semibold transition-colors
                            ${selectedTab === 'following'
                                ? 'border-b-2 border-brand-orange text-brand-orange'
                                : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Following
                    </button>
                </div>

                {/* Display the correct list based on selected tab */}
                <div className="flex-1 overflow-y-auto">
                    {selectedTab === 'followers' && <UserList users={followers} />}
                    {selectedTab === 'following' && <UserList users={followings} />}
                </div>
            </div>
        </div>
    );
};

export default FollowersFollowingPage;