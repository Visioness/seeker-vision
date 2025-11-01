import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import MODELS from '../algorithms/models';

const SettingsContext = createContext({
  changeAlgorithm: () => {},
  changeDelay: () => {},
  delay: 60,
  model: () => MODELS['bfs'],
});

const useSettings = () => {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }

  return context;
};

const SettingsProvider = ({ children }) => {
  const [algorithmName, setAlgorithmName] = useState('bfs');
  const [model, setModel] = useState(() => MODELS['bfs']);
  const [delay, setDelay] = useState(60);

  const changeAlgorithm = useCallback((name) => {
    setAlgorithmName(name);
    setModel(() => MODELS[name]);
  }, []);

  const changeDelay = useCallback((value) => {
    setDelay(value);
  }, []);

  const value = useMemo(
    () => ({
      algorithmName,
      changeAlgorithm,
      changeDelay,
      delay,
      model,
    }),
    [algorithmName, changeAlgorithm, changeDelay, delay, model]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export { useSettings, SettingsProvider };
