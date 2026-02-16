import axios from "axios";
import { VITE_API_BASE_URL } from "./config/api";

export const API = axios.create({
  baseURL: API_BASE_URL
});
