import { useCallback, useEffect, useState } from 'react';
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
    const [debounceLastCall, setDebounceLastCall] = useState(0);
    const [shouldPulse, setShouldPulse] = useState(false);

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
        // If < 300ms has passed since last click, do nothing
        if (Date.now() - debounceLastCall < LIKE_DEBOUNCE_AMOUNT_MS) return;

        try {
            if (!hasUserLiked) {
                await postUserAddLike(likeId, userId);
                setHasUserLiked(true);
            } else {
                await postUserRemoveLike(likeId, userId);
                setHasUserLiked(false);
            }
            setNumLikes(await getLikesCount(likeId));
            // Set new debounce last time
            setDebounceLastCall(Date.now());

            // Toggle the pulse animation on the heart
            setShouldPulse(true);
            setTimeout(() => setShouldPulse(false), 400);

        } catch (e) {
            // Catch and show an error toast
            console.log(e);
        }

    }, [userId, likeId, hasUserLiked, debounceLastCall]);

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
