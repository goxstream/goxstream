import { useState, useEffect } from "react";
import { scanAvailableDatabases } from "../db-scanner";
import type { DbTargetInfo, DbTarget } from "../types";

export function useDbScan(initialTarget?: DbTarget) {
  const [dbTargets, setDbTargets] = useState<DbTargetInfo[]>([]);
  const [selectedDb, setSelectedDb] = useState<DbTarget | undefined>(initialTarget);
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    async function initScan() {
      const scanned = await scanAvailableDatabases();
      setDbTargets(scanned);

      if (initialTarget && scanned.some((t) => t.id === initialTarget && t.isAvailable)) {
        setSelectedDb(initialTarget);
      } else {
        const available = scanned.filter((t) => t.isAvailable);
        if (available.length === 1) {
          setSelectedDb(available[0].id);
        }
      }
      setIsScanning(false);
    }
    initScan();
  }, [initialTarget]);

  return { dbTargets, selectedDb, setSelectedDb, isScanning };
}
