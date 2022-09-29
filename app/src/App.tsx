import { useCallback, useEffect, useRef, useState } from 'react';
import { getLikesCount, getLikesUserStatus, postUserAddLike, postUserRemoveLike } from './api/likes';
import './App.css';
import LikeIcon from './components/LikeIcon';
import { shortenLikeNumber } from './utils';

const LIKE_DEBOUNCE_AMOUNT_MS = 300;

function App() {
    // Both of these are currently hard-coded, so the set functions are unused
    const [likeId, setLikeId] = useState(1);
    const [userId, setUserId] = useState(1);
    // Number of likes for this likeId
    const [numLikes, setNumLikes] = useState(0);
    const [hasUserLiked, setHasUserLiked] = useState(false);
    // Track the last click of the button
    // const [debounceLastCall, setDebounceLastCall] = useState(0);
    const [shouldPulse, setShouldPulse] = useState(false);
    const updateLikeDebounceRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        const getInitLikeData = async () => {
            try {
                setHasUserLiked(await getLikesUserStatus(likeId, userId));
                setNumLikes(await getLikesCount(likeId));
            } catch (e) {
                // Catch and show an error toast
                console.log(e);
            }
        };

        getInitLikeData();

    }, []);


    const onUserClick = useCallback(async () => {
        const saveHasHuserLiked = hasUserLiked;

        if (!saveHasHuserLiked) {
            setHasUserLiked(true);
            setNumLikes(numLikes + 1);
        }
        else {
            setHasUserLiked(false);
            setNumLikes(numLikes - 1);
        }
        // Toggle the pulse animation on the heart
        setShouldPulse(true);
        setTimeout(() => setShouldPulse(false), 400);

        // Debounced API call
        clearTimeout(updateLikeDebounceRef.current);
        updateLikeDebounceRef.current = setTimeout(async () => {
            try {
                if (!saveHasHuserLiked) {
                    await postUserAddLike(likeId, userId);
                } else {
                    await postUserRemoveLike(likeId, userId);
                }
                setNumLikes(await getLikesCount(likeId));
                setHasUserLiked(await getLikesUserStatus(likeId, userId));
            } catch (e) {
                // Catch and show an error toast
                console.log(e);
            }
        }, LIKE_DEBOUNCE_AMOUNT_MS);

    }, [userId, likeId, hasUserLiked]);

    return (
        <div className="app">
            <button className="like-button" tabIndex={0} onClick={onUserClick}>
                <LikeIcon pulse={shouldPulse} isActive={hasUserLiked} />
                <div className='like-text'>{shortenLikeNumber(numLikes)}</div>
            </button>
        </div>
    );
}

export default App;
