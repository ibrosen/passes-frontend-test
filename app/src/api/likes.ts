import axios from "axios";
import { SERVER_URL } from "../constants";

export const getLikesCount = async (likeId: number): Promise<number> => {
    return (await axios.get(`${SERVER_URL}/api/v1/like/${likeId}/count`)).data.data;
};

export const getLikesUserStatus = async (likeId: number, userId: number): Promise<boolean> => {
    return (await axios.get(`${SERVER_URL}/api/v1/like/${likeId}/user/${userId}`)).data.data;
};

export const postUserAddLike = async (likeId: number, userId: number): Promise<boolean> => {
    return (await axios.post(`${SERVER_URL}/api/v1/like/add`, { likeId, userId })).data.data;
};

export const postUserRemoveLike = async (likeId: number, userId: number): Promise<boolean> => {
    return (await axios.post(`${SERVER_URL}/api/v1/like/remove`, { likeId, userId })).data.data;
};