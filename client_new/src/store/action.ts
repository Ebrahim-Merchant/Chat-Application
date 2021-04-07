import { createAction } from "@reduxjs/toolkit";
import { IUser } from "./types";

export const setCurrentRecipient = createAction<IUser & { conversationId: string }>('SET_CURRENT_RECIPIENT')