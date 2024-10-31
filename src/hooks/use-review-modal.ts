import { create } from "zustand";

interface ReviewModalProps {
  isOpen: boolean;
  openReviewModal: () => void;
  closeReviewModal: () => void;
}

export const useReviewModal = create<ReviewModalProps>((set) => ({
  isOpen: false,
  openReviewModal: () => set({ isOpen: true }),
  closeReviewModal: () => set({ isOpen: false }),
}));
