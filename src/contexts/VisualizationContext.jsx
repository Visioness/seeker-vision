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

const createInitialBoard = (board) => {
  const initialBoard = Array.from({ length: board.dimensions.rows }, () =>
    Array.from({ length: board.dimensions.cols }, () => 'shadow')
  );

  initialBoard[board.positions.start.row][board.positions.start.col] =
    'start shadow';
  initialBoard[board.positions.end.row][board.positions.end.col] = 'end shadow';

  return initialBoard;
};

const VisualizationContext = createContext({
  play: () => {},
  pause: () => {},
  stepForward: () => {},
  reset: () => {},
  resetAll: () => {},
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
      state: createInitialBoard(previous),
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
      const result = pathfinder.current.run();
      actions.current = result.visitedStates.concat(result.solution);
    }
  }, [board.state, initializePathfinder]);

  const updateBoard = useCallback(() => {
    const coordinate = actions.current[stepIndex.current];
    const [targetRow, targetCol] = coordinate.split('-').map(Number);

    setBoard((previous) => ({
      ...previous,
      state: previous.state.map((row, rowIndex) =>
        rowIndex === targetRow
          ? row.map((cell, colIndex) => {
              if (colIndex === targetCol) {
                if (cell.includes('shadow')) {
                  return cell.replace('shadow', 'visited');
                }

                return cell + ' path';
              }

              return cell;
            })
          : row
      ),
    }));
  }, [setBoard]);

  const nextStep = useCallback(() => {
    if (stepIndex.current < actions.current.length) {
      updateBoard();
      stepIndex.current++;
    } else {
      setVisualState('finished');
      clearInterval(interval.current);
      interval.current = null;
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

  // Reset only visited and path cells
  const reset = useCallback(() => {
    setVisualState('idle');
    resetModel();
    setBoard((previous) => ({
      ...previous,
      state: previous.state.map((row) => {
        if (row.some((cell) => cell.includes('visited'))) {
          return row.map((cell) => {
            if (cell.includes('visited')) {
              return cell.replace('visited', 'shadow').replace(' path', '');
            }

            return cell;
          });
        }

        return row;
      }),
    }));
  }, []);

  const resetAll = useCallback(() => {
    setVisualState('idle');
    resetModel();
    initializeBoard();
  }, [initializeBoard]);

  const resetModel = useCallback(() => {
    clearInterval(interval.current);
    interval.current = null;
    pathfinder.current = null;
    actions.current = null;
    stepIndex.current = 0;
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
      resetAll,
      visualState,
    }),
    [play, pause, stepForward, reset, resetAll, visualState]
  );

  return (
    <VisualizationContext.Provider value={value}>
      {children}
    </VisualizationContext.Provider>
  );
};

export { useVisualization, VisualizationProvider };
