import { useState } from "react";

const useVisualMode = function(initial) {

  const [history, setHistory] = useState([initial]);

  // replace is an optional parameter - if true, it will replace the current mode in the history, instead of being added in front of it
  const transition = (newMode, replace = false) => {
    setHistory(prev => {
      return replace ? [ newMode, ...prev.slice(1)]: [newMode, ...prev]
    });
  };

  const back = () => {
    setHistory(prev => {
      return prev.length > 1 ? [...prev.slice(1)] : [...prev];
    })
  };

  const mode = history[0];
  return {mode, transition, back};
};

export default useVisualMode;
