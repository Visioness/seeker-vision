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

const createInitialBoard = (rows, cols) => {
  const initialBoard = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => 'shadow')
  );

  initialBoard[1][1] = 'start';
  initialBoard[rows - 2][cols - 2] = 'end';

  return initialBoard;
};

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
  const stepIndex = useRef(0);
  const interval = useRef(null);

  useEffect(() => {
    clearInterval(interval.current);
    interval.current = null;
    stepIndex.current = 0;
    pathfinder.current = null;
    actions.current = null;

    setVisualState('idle');
    if (board.dimensions.rows && board.dimensions.cols) {
      initializeBoard();
    }
  }, [board.dimensions]);

  const initializeBoard = useCallback(() => {
    setBoard((previous) => ({
      ...previous,
      state: createInitialBoard(
        previous.dimensions.rows,
        previous.dimensions.cols
      ),
    }));
  }, []);

  const initializePathfinder = useCallback(
    (boardState) => {
      pathfinder.current = new model(boardState);
      pathfinder.current.initialize();
    },
    [model]
  );

  const runModel = useCallback(() => {
    if (!pathfinder.current) {
      initializePathfinder(board.state);
      actions.current = pathfinder.current.run();
    }
  }, [board.state, initializePathfinder]);

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
    setVisualState('playing');

    runModel();

    interval.current = setInterval(() => {
      nextStep();
    }, delay);
  }, [delay, nextStep, runModel]);

  const pause = useCallback(() => {
    setVisualState('paused');

    clearInterval(interval.current);
    interval.current = null;
  }, []);

  const stepForward = useCallback(() => {
    setVisualState((previous) => (previous !== 'paused' ? 'paused' : previous));

    runModel();

    nextStep();
  }, [nextStep, runModel]);

  const reset = useCallback(() => {
    setVisualState('idle');

    clearInterval(interval.current);
    interval.current = null;
    pathfinder.current = null;
    actions.current = null;
    stepIndex.current = 0;

    initializeBoard();
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
