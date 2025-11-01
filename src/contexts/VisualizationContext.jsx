import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useSettings } from './SettingsContext';

const VisualizationContext = createContext({
  play: () => {},
  pause: () => {},
  stepForward: () => {},
  reset: () => {},
  visualState: 'idle',
});

const useVisualization = () => {
  const context = useContext(VisualizationContext);

  if (!context) {
    throw new Error(
      'useVisualization must be used within VisualizationProvider'
    );
  }
  return context;
};

const VisualizationProvider = ({ board, children, setBoard }) => {
  const { model, delay } = useSettings();
  const [visualState, setVisualState] = useState('idle');
  const pathfinder = useRef(null);
  const actions = useRef({ visitedStates: null, solution: null });
  const stepIndex = useRef(null);
  const interval = useRef(null);

  useEffect(() => {
    clearInterval(interval.current);
    interval.current = null;
    stepIndex.current = null;
    pathfinder.current = null;
    actions.current = null;

    setVisualState('idle');
  }, [board.dimensions]);

  const initializePathfinder = useCallback(
    (boardState) => {
      pathfinder.current = new model(boardState);
      pathfinder.current.initialize();
    },
    [model]
  );

  const updateBoard = useCallback(() => {
    const coordinate = actions.current.visitedStates[stepIndex.current];
    const [targetRow, targetCol] = coordinate.split('-').map(Number);

    setBoard((previous) => {
      return {
        ...previous,
        state: previous.state.map((row, rowIndex) =>
          rowIndex === targetRow
            ? row.map((cell, colIndex) =>
                colIndex === targetCol ? 'visited' : cell
              )
            : row
        ),
      };
    });
  }, [setBoard]);

  const nextStep = useCallback(() => {
    if (stepIndex.current < actions.current.visitedStates.length) {
      updateBoard();
      stepIndex.current++;
    } else {
      setVisualState('finished');
    }
  }, [updateBoard, setVisualState]);

  const play = useCallback(() => {
    if (!pathfinder.current) {
      initializePathfinder(board.state);
      actions.current = pathfinder.current.run();
      stepIndex.current = 0;
    }

    setVisualState('playing');

    interval.current = setInterval(() => {
      nextStep();
    }, delay);
  }, [board.state, delay, initializePathfinder, nextStep]);

  const pause = useCallback(() => {
    clearInterval(interval.current);
    interval.current = null;
    setVisualState('paused');
  }, []);

  const stepForward = useCallback(() => {
    if (!pathfinder.current) {
      initializePathfinder(board.state);
      actions.current = pathfinder.current.run();
      stepIndex.current = 0;
    }

    setVisualState((previous) => (previous !== 'paused' ? 'paused' : previous));

    nextStep();
  }, [board.state, initializePathfinder, nextStep]);

  const reset = useCallback(() => {
    clearInterval(interval.current);
    interval.current = null;
    stepIndex.current = null;
    pathfinder.current = null;
    actions.current = null;

    setVisualState('idle');
    setBoard({ state: null, dimensions: { rows: 0, cols: 0 } });
  }, []);

  useEffect(() => {
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      play,
      pause,
      stepForward,
      reset,
      visualState,
    }),
    [play, pause, stepForward, reset, visualState]
  );

  return (
    <VisualizationContext.Provider value={value}>
      {children}
    </VisualizationContext.Provider>
  );
};

export { useVisualization, VisualizationProvider };
