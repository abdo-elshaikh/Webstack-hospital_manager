// src/services/ModalService.js
import React, { useState, createContext, useContext } from 'react';
import Modal from '../components/Modal';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [modalContent, setModalContent] = useState(null);

    const openModal = (content, autoCloseTime = null) => {
        setModalContent(content);
        setIsOpen(true);

        if (autoCloseTime) {
            setTimeout(() => {
                closeModal();
            }, autoCloseTime);
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        setModalContent(null);
    };

    return (
        <ModalContext.Provider value={{ isOpen, modalContent, openModal, closeModal }}>
            {children}
            <Modal isOpen={isOpen} onClose={closeModal}>
                {modalContent}
            </Modal>
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    return useContext(ModalContext);
};
