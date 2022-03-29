import { useState } from "react";
import useInterval from "./use-interval";

const useRefreshOnInterval = (interval: number = 5000) => {
  const [refresh, setRefresh] = useState({ refresh: false });
  useInterval(() => setRefresh({ refresh: true }), interval);

  return refresh;
};

export default useRefreshOnInterval;
