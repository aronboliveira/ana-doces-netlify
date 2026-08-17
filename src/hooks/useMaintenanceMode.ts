import { useState, useCallback } from "react";

const STORAGE_KEY = "ana-doces-maintenance-dismissed";

export default function useMaintenanceMode() {
  const [isModalOpen, setIsModalOpen] = useState(() => {
    try {
      return !sessionStorage.getItem(STORAGE_KEY);
    } catch {
      return true;
    }
  });
  const [isBarVisible, setIsBarVisible] = useState(false);

  const dismissModal = useCallback(() => {
    setIsModalOpen(false);
    setIsBarVisible(true);
    try {
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // sessionStorage unavailable
    }
  }, []);

  const reopenModal = useCallback(() => {
    setIsModalOpen(true);
    setIsBarVisible(false);
  }, []);

  const hideBar = useCallback(() => {
    setIsBarVisible(false);
  }, []);

  return { isModalOpen, isBarVisible, dismissModal, reopenModal, hideBar };
}
