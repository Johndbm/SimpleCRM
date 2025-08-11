// modals.js - Lógica para abrir/cerrar modales

export function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove('hidden');
        // Focus automático en el primer input visible
        setTimeout(() => {
            const firstInput = modal.querySelector('input, select, textarea, button');
            if (firstInput) firstInput.focus();
        }, 100);
        // Cerrar con Escape
        function escListener(e) {
            if (e.key === 'Escape') {
                closeModal(id);
                document.removeEventListener('keydown', escListener);
            }
        }
        document.addEventListener('keydown', escListener);
    }
}
export function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('hidden');
}
export function setupModalEvents(openBtnId, modalId, closeBtnId, cancelBtnId) {
    // Permite múltiples botones de apertura (ej: varios "Nuevo Cliente")
    const openBtns = document.querySelectorAll(`#${openBtnId}, .${openBtnId}`);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeBtnId);
    const cancelBtn = document.getElementById(cancelBtnId);
    openBtns.forEach(openBtn => {
        if (openBtn && modal) {
            openBtn.addEventListener('click', (e) => {
                e.preventDefault();
                openModal(modalId);
            });
        }
    });
    [closeBtn, cancelBtn].forEach(btn => {
        if (btn) btn.addEventListener('click', () => closeModal(modalId));
    });
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modalId);
        });
    }
}
