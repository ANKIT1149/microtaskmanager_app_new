import React from "react";
import { ViewStyle } from "react-native";

export interface PageWrapperProps{
    children: React.ReactNode
    onRefresh?: () => void
    style?: ViewStyle
    scrollable: boolean
}