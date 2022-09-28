/**
 * If the number is 4 digits, turn 1459 -> 1.4k.
 * Unsure what to do if > 4 digits, so not handling that case for now
 * @param numLikes Num of likes for this likeId
 * @returns
 */
export const shortenLikeNumber = (numLikes: number) =>
    numLikes > 999 ? `${(Math.floor(numLikes / 100) / 10).toFixed(1)}K` : numLikes.toString();