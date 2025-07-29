import React, { createContext, useContext, useState } from "react";

export type Task = {
    id: string;
    name: string;
    duration: number;
    isRunning: boolean;
    projectId: string;
    createdAt: Date;
}

export type Project = {
    id: string;
    name: string;
    tasks: Task[];
    clientId: string;
}

export type Client = {
  id: string;
  name: string;
  email?: string;
};

type AppContextType = {
    projects: Project[];
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>
    clients: Client[];
    setClients: React.Dispatch<React.SetStateAction<Client[]>>
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [clients, setClients] = useState<Client[]>([]);

    return (
        <AppContext.Provider value={{projects, setProjects, clients, setClients}}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
}