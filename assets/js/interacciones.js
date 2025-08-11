// interacciones.js - Lógica CRUD para el módulo de interacciones
import { getInteractions, setInteractions, getClients } from './db.js';
import { openModal, closeModal, setupModalEvents } from './modals.js';

function renderInteraccionesList() {
    const list = document.getElementById('interactions-list');
    if (!list) return;
    const interacciones = getInteractions();
    list.innerHTML = '';
    if (!interacciones.length) {
        list.innerHTML = '<div class="text-gray-500">No hay interacciones registradas.</div>';
        return;
    }
    interacciones.forEach(inter => {
        const div = document.createElement('div');
        div.className = 'bg-gray-50 p-4 rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between';
        div.innerHTML = `
            <div>
                <div class="font-medium">${inter.clientName}</div>
                <div class="text-sm text-gray-600">${inter.subject}</div>
                <div class="text-xs text-gray-400">${inter.date} ${inter.time}</div>
            </div>
            <div class="mt-2 md:mt-0 flex space-x-2">
                <button class="text-blue-500 hover:text-blue-700 view-interaction-btn"><i class="fas fa-eye"></i></button>
                <button class="text-yellow-500 hover:text-yellow-700 edit-interaction-btn"><i class="fas fa-edit"></i></button>
                <button class="text-red-500 hover:text-red-700 delete-interaction-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
        // Eliminar
        div.querySelector('.delete-interaction-btn').addEventListener('click', () => {
            if (confirm('¿Eliminar esta interacción?')) {
                const updated = getInteractions().filter(i => i.id !== inter.id);
                setInteractions(updated);
                renderInteraccionesList();
            }
        });
        // Editar
        div.querySelector('.edit-interaction-btn').addEventListener('click', () => {
            fillInteractionForm(inter);
            openModal('add-interaction-modal');
            const form = document.getElementById('interaction-form');
            const originalHandler = form.onsubmit;
            form.onsubmit = function(e) {
                e.preventDefault();
                updateInteraction(inter.id);
                form.onsubmit = originalHandler;
            };
        });
        // Puedes agregar lógica para ver detalles
        list.appendChild(div);
    });
}

function fillInteractionForm(inter) {
    document.getElementById('interaction-client').value = inter.clientId;
    document.getElementById('interaction-type').value = inter.type;
    document.getElementById('interaction-date').value = inter.date;
    document.getElementById('interaction-time').value = inter.time;
    document.getElementById('interaction-subject').value = inter.subject;
    document.getElementById('interaction-description').value = inter.description;
    document.getElementById('interaction-outcome').value = inter.outcome;
}

function updateInteraction(id) {
    const interacciones = getInteractions();
    const idx = interacciones.findIndex(i => i.id === id);
    if (idx === -1) return;
    const updated = getInteractionFormData(id);
    interacciones[idx] = updated;
    setInteractions(interacciones);
    renderInteraccionesList();
    closeModal('add-interaction-modal');
}

function getInteractionFormData(id = null) {
    const clients = getClients();
    const clientId = parseInt(document.getElementById('interaction-client').value);
    const client = clients.find(c => c.id === clientId);
    return {
        id: id || Date.now(),
        clientId,
        clientName: client ? client.name : '',
        clientCompany: client ? client.company : '',
        type: document.getElementById('interaction-type').value,
        date: document.getElementById('interaction-date').value,
        time: document.getElementById('interaction-time').value,
        subject: document.getElementById('interaction-subject').value.trim(),
        description: document.getElementById('interaction-description').value.trim(),
        outcome: document.getElementById('interaction-outcome').value.trim()
    };
}

function resetInteractionForm() {
    document.getElementById('interaction-form').reset();
}

function fillInteractionClientOptions() {
    const select = document.getElementById('interaction-client');
    if (!select) return;
    const clients = getClients();
    select.innerHTML = '<option value="">Seleccionar cliente...</option>' +
        clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function setupInteractionForm() {
    fillInteractionClientOptions();
    const form = document.getElementById('interaction-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        const interacciones = getInteractions();
        const newInter = getInteractionFormData();
        interacciones.push(newInter);
        setInteractions(interacciones);
        renderInteraccionesList();
        closeModal('add-interaction-modal');
        resetInteractionForm();
    };
}

export function setupInteraccionesModule() {
    renderInteraccionesList();
    setupModalEvents('add-interaction-btn', 'add-interaction-modal', 'close-interaction-modal', 'cancel-interaction');
    setupInteractionForm();
}
