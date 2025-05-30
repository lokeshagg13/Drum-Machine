import { createContext, useState } from "react";

const ModalContext = createContext({
  modalType: null,
  showModal: (type) => { },
  hideModals: () => { },
});

export function ModalContextProvider(props) {
  const [modalType, setModalType] = useState(null);

  function showModal(type) {
    if (type === "save") {
      setModalType("save");
    } else if (type === "load") {
      setModalType("load");
    } else if (type === "clear") {
      setModalType("clear");
    }
  }

  function hideModals() {
    setModalType(null);
  }

  const currentModalContext = {
    modalType,
    showModal,
    hideModals,
  };

  return (
    <ModalContext.Provider value={currentModalContext}>
      {props.children}
    </ModalContext.Provider>
  );
}

export default ModalContext;
