import axios from "axios";

const BASE_URL = "http://localhost:5000/api/";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YzY1NTU3YjgzZjY4OGFiMjIwZTY5NCIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY5MDgzMDk3MiwiZXhwIjoxNjkxMDkwMTcyfQ.R9xW0zJ6ITGe2zb-CtOXv7qZy7YBc2wYwcDmgItK6DI"

export const publicRequest = axios.create({
    baseURL: BASE_URL,
});
export const userRequest = axios.create({
    baseURL: BASE_URL,
    headers: {token: `Bearer ${TOKEN}`},
});