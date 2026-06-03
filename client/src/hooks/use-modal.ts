import { useCallback, useState } from "react";

export const MODAL_TYPE = {
  CREATE: "create",
  EDIT: "edit",
  DELETE: "delete",
  VIEW: "view",
} as const;

export const MODEL_INITIAL_STATE = {
  [MODAL_TYPE.CREATE]: false,
  [MODAL_TYPE.EDIT]: false,
  [MODAL_TYPE.DELETE]: false,
};

export type ModalState = {
  [key in (typeof MODAL_TYPE)[keyof typeof MODAL_TYPE]]: boolean;
};

export const VIEW_MODAL_INITIAL_STATE: ModalState = {
  create: false,
  edit: false,
  delete: false,
  view: false,
};

export const useModal = (
  initialState: ModalState = VIEW_MODAL_INITIAL_STATE
) => {
  const [modalState, setModalState] = useState(initialState);

  const modalStateHandler = useCallback(
    (key: keyof ModalState, val: boolean) =>
      setModalState((prev) => ({
        ...prev,
        [key]: val,
      })),
    []
  );

  return {
    modalState,
    setModalState,
    modalStateHandler,
  };
};
