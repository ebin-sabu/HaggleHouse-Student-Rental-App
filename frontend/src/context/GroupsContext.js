import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { createGroup, joinGroup, leaveGroup, getGroupDetails } from '../api/axios';
import { toast } from 'react-toastify';

const GroupsContext = createContext();

export function useGroups() {
    return useContext(GroupsContext);
}

export const GroupsProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const [group, setGroup] = useState(null);

    // Function to create a group
    const handleCreateGroup = async () => {
        if (!currentUser) {
            console.error("No current user found.");
            return; // Exit the function if currentUser is null or undefined
        }

        try {
            const response = await createGroup(currentUser.id);
            setGroup(response);
        } catch (error) {
            console.error("Error creating group:", error);
            // Handle error (e.g., show notification)
        }
    };

    // Function to join a group
    const handleJoinGroup = async (joinCode) => {
        if (!currentUser) {
            console.error("No current user found.");
            return; // Exit the function if currentUser is null or undefined
        }

        try {
            const response = await joinGroup(currentUser.id, joinCode);
            setGroup(response);
        } catch (error) {
            console.error("Error joining group:", error);
            // Handle error (e.g., show notification)
        }
    };

    // Function to leave a group
    const handleLeaveGroup = async () => {
        if (!currentUser) {
            console.error("No current user found.");
            return; // Exit the function if currentUser is null or undefined
        }

        try {
            await leaveGroup(currentUser.id);
            setGroup(null); // Reset group state
        } catch (error) {
            console.error("Error leaving group:", error);
            // Handle error (e.g., show notification)
        }
    };

    // Updated handleGetGroupDetails function with currentUser check
    const handleGetGroupDetails = useCallback(async () => {
        if (!currentUser) {
            console.error("No current user found.");
            return; // Exit the function if currentUser is null or undefined
        }

        try {
            const response = await getGroupDetails(currentUser.id);
            if (response && response.length > 0) {
                setGroup(response[0]); // Assuming the user is part of one group
            }
        } catch (error) {
            console.error("Error fetching group details:", error);
            // Handle error (e.g., show notification)
        }
    }, [currentUser]);

    useEffect(() => {
        if (currentUser) {
            handleGetGroupDetails();
        }
    }, [currentUser, handleGetGroupDetails]);

    return (
        <GroupsContext.Provider value={{
            groupDetails: group,
            createGroup: handleCreateGroup,
            joinGroup: handleJoinGroup,
            leaveGroup: handleLeaveGroup,
            getGroupDetails: handleGetGroupDetails
        }}>
            {children}
        </GroupsContext.Provider>
    );
};
