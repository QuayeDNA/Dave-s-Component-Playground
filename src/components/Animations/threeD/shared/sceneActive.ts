import { createContext, useContext } from 'react';

export const SceneActive = createContext(false);

export const useSceneActive = () => useContext(SceneActive);
