import React, { createContext, useState, useEffect } from 'react';

import { useAPI } from '../custom-hooks/useAPI.js';

export const UserContext = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [companies, setCompanies] = useState(null);
  const [items, setItems] = useState(null);
  const [currentCompany, setCurrentCompany] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const { error, loading, cb: postDocument, data } = useAPI('GET', '/user');
  const getCompanies = useAPI('GET', `company/${user?.id}`);
  const getItems = useAPI('GET', `item/${currentCompany?.company_id}`);
  const getNotifications = useAPI('GET', `notifications/${currentCompany?.company_id}`);

  const getUser = async () => {
    try {
      setUserLoading(true);
      await postDocument(); // Call the API to fetch the user data
    } catch (err) {
      console.error('Failed to fetch user:', err);
    };
  };

  const getUserCompanies = async () => {
    try {
     await getCompanies.cb();
    } catch {
      console.error('Failed to fetch companies:', err);
    }
  };

  const getUserItems = async () => {
    try {
      await getItems.cb();
     } catch {
       console.error('Failed to fetch companies:', err);
     }
  };

  const getUserNotifications = async () => {
    try {
      await getNotifications.cb();
     } catch {
       console.error('Failed to fetch notifications:', err);
     }
  };

  useEffect(() => {
    if(data?.code === 200) {
      setUser(data?.user);
      setUserLoading(false);
    };
    if(error) {setUserLoading(false);};
  }, [data, error]);

  useEffect(() => {
    if(getNotifications.data) {setNotifications(getNotifications.data);};
  }, [getNotifications.data]);

  useEffect(() => {
    if(getItems.data) {setItems(getItems.data);};
  }, [getItems.data]);

  useEffect(() => {
    if(getCompanies.data){
      setCompanies(getCompanies.data);
      setCurrentCompany(getCompanies.data.companies[0]);
    };
  }, [getCompanies.data]);

  return (
    <UserContext.Provider value={{ user, setUser, getUser, getUserCompanies, companies, currentCompany, getUserNotifications, notifications, getUserItems, items, setCurrentCompany, userLoading}}>
      {children}
    </UserContext.Provider>
  );
};
