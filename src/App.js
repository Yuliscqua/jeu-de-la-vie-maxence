import React, { useState, useEffect } from 'react';
import './style.css';

let startGrid = [];
for (let i = 0; i < 10; i++) {
  startGrid[i] = [];
  for (let j = 0; j < 10; j++) {
    startGrid[i][j] = {
      coord: [i, j],
      isAlive: false,
    };
  }
}

const Grid = ({ grid, setGrid }) => {
  const [mouseDown, setMouseDown] = useState(false);
  const [coords, setCoords] = useState([0, 0]);

  function handleChangeGrid(placement) {
    const nextGrid = grid.map((row) => {
      return row.map((column) => {
        if (placement.coord === column.coord) {
          return {
            ...column,
            isAlive: !placement.isAlive,
          };
        } else {
          return column;
        }
      });
    });
    setGrid(nextGrid);
  }

  return (
    <div className="grid">
      {grid.map((rows) => (
        <div className="row">
          {rows.map((columns) => (
            <button
              className={columns.isAlive ? 'column isAlive' : 'column isDead'}
              key={columns.coord}
              onMouseUp={() => {
                setMouseDown(false);
              }}
              onMouseDown={() => {
                setMouseDown(true);
                handleChangeGrid(columns);
              }}
              onMouseOver={() => {
                if (mouseDown) {
                  handleChangeGrid(columns);
                }
                setCoords(columns.coord);
              }}
            >
              -
            </button>
          ))}
        </div>
      ))}
      <div style={{ color: '#f5f7fa' }}>
        {coords[1] + 1},{coords[0] + 1}
      </div>
    </div>
  );
};

const StartAndStop = ({ onClick }) => {
  return <button onClick={onClick}>Start</button>;
};

const Reset = ({ onClick }) => {
  return (
    <button className="btn reset-btn" onClick={onClick}>
      Reset
    </button>
  );
};

const Speed = ({ onChange }) => {
  return (
    <select className="btn speed-btn" onChange={onChange} name="speed">
      <option value="1000">x1</option>
      <option value="500">x2</option>
      <option value="250">x4</option>
      <option value="125">x8</option>
      <option value="100">x10</option>
      <option value="62,5">x16</option>
      <option value="50">x20</option>
      <option value="40">x25</option>
    </select>
  );
};

const Height = ({ onChange }) => {
  return (
    <select className="btn height-btn" onChange={onChange} name="speed">
      <option value="10">10x10</option>
      <option value="15">15x15</option>
      <option value="20">20x20</option>
      <option value="30">30x30</option>
      <option value="50">50x50</option>
      <option value="90">90x90</option>
      <option value="150">150x150</option>
      <option value="230">230x230</option>
      <option value="380">380x380</option>
      <option value="500">500x500</option>
    </select>
  );
};

function App() {
  const [grid, setGrid] = useState(startGrid);
  const [isRunning, setisRunning] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [step, setStep] = useState(0);

  function count(row, column, newGrid) {
    const neighbours = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    return neighbours.reduce((nbr_alive, [x, y]) => {
      const newRow = row + x;
      const newCol = column + y;

      if (
        newRow >= 0 &&
        newRow < newGrid.length &&
        newCol >= 0 &&
        newCol < newGrid.length &&
        newGrid[newRow][newCol].isAlive
      ) {
        nbr_alive++;
      }

      return nbr_alive;
    }, 0);
  }

  useEffect(() => {
    let intervalId = null;
    if (isRunning) {
      intervalId = setInterval(() => {
        setStep((step) => {
          return step + 1;
        });
        setGrid((grid) => {
          const nextGrid = grid.map((row, rowIndex) => {
            return row.map((column, columnIndex) => {
              let n_alive = count(rowIndex, columnIndex, grid);
              if (column.isAlive) {
                if (n_alive < 2 || n_alive > 3) {
                  return {
                    ...column,
                    isAlive: false,
                  };
                } else {
                  return {
                    ...column,
                  };
                }
              } else {
                if (n_alive === 3) {
                  return {
                    ...column,
                    isAlive: true,
                  };
                } else {
                  return {
                    ...column,
                  };
                }
              }
            });
          });
          return nextGrid;
        });
      }, speed);
      return () => clearInterval(intervalId);
    }
  }, [isRunning]);

  function resetAll() {
    const nextGrid = grid.map((row) => {
      return row.map((column) => {
        return {
          ...column,
          isAlive: false,
        };
      });
    });
    setGrid(nextGrid);
    setisRunning(false);
    setStep(0);
  }

  function changeHeight(taille) {
    let nextGrid = [];
    for (let i = 0; i < taille; i++) {
      nextGrid[i] = [];
      for (let j = 0; j < taille; j++) {
        nextGrid[i][j] = {
          coord: [i, j],
          isAlive: false,
        };
      }
    }
    setGrid(nextGrid);
  }
  return (
    <div className="app">
      <h1>Jeu de la vie, en l'an : {step}</h1>
      <Grid grid={grid} setGrid={setGrid}></Grid>
      <span className="components">
        <button
          className={isRunning ? 'btn stop-btn' : 'btn start-btn'}
          onClick={() => (isRunning ? setisRunning(false) : setisRunning(true))}
        >
          {isRunning ? 'Stop' : 'Start'}
        </button>
        <Reset onClick={resetAll}></Reset>
        <Speed onChange={(ev) => setSpeed(ev.target.value)}></Speed>
        <Height onChange={(ev) => changeHeight(ev.target.value)}></Height>
      </span>
    </div>
  );
}

export default App;
