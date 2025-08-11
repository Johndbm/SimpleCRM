// oportunidades.js - Lógica CRUD para el módulo de oportunidades
import { getOportunidades, setOportunidades } from './oportunidades-db.js';
import { getClients } from './db.js';
import { openModal, closeModal, setupModalEvents } from './modals.js';

function renderOportunidadesList() {
    const list = document.getElementById('opportunities-table-body');
    if (!list) return;
    const oportunidades = getOportunidades();
    list.innerHTML = '';
    if (!oportunidades.length) {
        list.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-gray-500">No hay oportunidades registradas.</td></tr>';
        return;
    }
    oportunidades.forEach(opp => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">${opp.name}</td>
            <td class="px-6 py-4 whitespace-nowrap">${opp.clientName || ''}</td>
            <td class="px-6 py-4 whitespace-nowrap">€${opp.value}</td>
            <td class="px-6 py-4 whitespace-nowrap">${getStageLabel(opp.stage)}</td>
            <td class="px-6 py-4 whitespace-nowrap">${opp.probability}%</td>
            <td class="px-6 py-4 whitespace-nowrap">${opp.closeDate}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <button class="text-blue-500 hover:text-blue-700 mr-2 view-opportunity-btn"><i class="fas fa-eye"></i></button>
                <button class="text-yellow-500 hover:text-yellow-700 mr-2 edit-opportunity-btn"><i class="fas fa-edit"></i></button>
                <button class="text-red-500 hover:text-red-700 delete-opportunity-btn"><i class="fas fa-trash"></i></button>
            </td>
        `;
        // Eliminar
        tr.querySelector('.delete-opportunity-btn').addEventListener('click', () => {
            if (confirm('¿Eliminar esta oportunidad?')) {
                const updated = getOportunidades().filter(o => o.id !== opp.id);
                setOportunidades(updated);
                renderOportunidadesList();
            }
        });
        // Editar
        tr.querySelector('.edit-opportunity-btn').addEventListener('click', () => {
            fillOpportunityForm(opp);
            openModal('add-opportunity-modal');
            const form = document.getElementById('opportunity-form');
            const originalHandler = form.onsubmit;
            form.onsubmit = function(e) {
                e.preventDefault();
                updateOpportunity(opp.id);
                form.onsubmit = originalHandler;
            };
        });
        // Puedes agregar lógica para ver detalles
        list.appendChild(tr);
    });
}

function getStageLabel(stage) {
    switch(stage) {
        case 'new': return 'Nueva';
        case 'qualified': return 'Calificada';
        case 'negotiation': return 'En Negociación';
        case 'won': return 'Ganada';
        case 'lost': return 'Perdida';
        default: return stage;
    }
}

function fillOpportunityForm(opp) {
    document.getElementById('opportunity-name').value = opp.name;
    document.getElementById('opportunity-client').value = opp.clientId;
    document.getElementById('opportunity-value').value = opp.value;
    document.getElementById('opportunity-stage').value = opp.stage;
    document.getElementById('opportunity-probability').value = opp.probability;
    document.getElementById('opportunity-source').value = opp.source;
    document.getElementById('opportunity-close-date').value = opp.closeDate;
    document.getElementById('opportunity-description').value = opp.description;
}

function updateOpportunity(id) {
    const oportunidades = getOportunidades();
    const idx = oportunidades.findIndex(o => o.id === id);
    if (idx === -1) return;
    const updated = getOpportunityFormData(id);
    oportunidades[idx] = updated;
    setOportunidades(oportunidades);
    renderOportunidadesList();
    closeModal('add-opportunity-modal');
}

function getOpportunityFormData(id = null) {
    const clients = getClients();
    const clientId = parseInt(document.getElementById('opportunity-client').value);
    const client = clients.find(c => c.id === clientId);
    return {
        id: id || Date.now(),
        name: document.getElementById('opportunity-name').value.trim(),
        clientId,
        clientName: client ? client.name : '',
        value: document.getElementById('opportunity-value').value,
        stage: document.getElementById('opportunity-stage').value,
        probability: document.getElementById('opportunity-probability').value,
        source: document.getElementById('opportunity-source').value,
        closeDate: document.getElementById('opportunity-close-date').value,
        description: document.getElementById('opportunity-description').value.trim()
    };
}

function resetOpportunityForm() {
    document.getElementById('opportunity-form').reset();
}

function fillOpportunityClientOptions() {
    const select = document.getElementById('opportunity-client');
    if (!select) return;
    const clients = getClients();
    select.innerHTML = '<option value="">Seleccionar cliente...</option>' +
        clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function setupOpportunityForm() {
    fillOpportunityClientOptions();
    const form = document.getElementById('opportunity-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        const oportunidades = getOportunidades();
        const newOpp = getOpportunityFormData();
        oportunidades.push(newOpp);
        setOportunidades(oportunidades);
        renderOportunidadesList();
        closeModal('add-opportunity-modal');
        resetOpportunityForm();
    };
}

export function setupOportunidadesModule() {
    renderOportunidadesList();
    setupModalEvents('add-opportunity-btn', 'add-opportunity-modal', 'close-opportunity-modal', 'cancel-opportunity');
    setupOpportunityForm();
}
