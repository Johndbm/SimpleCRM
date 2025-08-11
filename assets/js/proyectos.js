// proyectos.js - Lógica CRUD para el módulo de proyectos
import { getProyectos, setProyectos } from './proyectos-db.js';
import { getClients } from './db.js';
import { openModal, closeModal, setupModalEvents } from './modals.js';

function renderProyectosList() {
    const list = document.getElementById('projects-list');
    if (!list) return;
    const proyectos = getProyectos();
    list.innerHTML = '';
    if (!proyectos.length) {
        list.innerHTML = '<div class="text-gray-500">No hay proyectos registrados.</div>';
        return;
    }
    proyectos.forEach(proj => {
        const div = document.createElement('div');
        div.className = 'bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between';
        div.innerHTML = `
            <div>
                <div class="font-medium">${proj.name}</div>
                <div class="text-sm text-gray-600">Cliente: ${proj.clientName || ''}</div>
                <div class="text-xs text-gray-400">${proj.startDate} - ${proj.endDate}</div>
                <div class="text-xs text-gray-400">Estado: ${getProjectStatusLabel(proj.status)}</div>
            </div>
            <div class="mt-2 md:mt-0 flex space-x-2">
                <button class="text-blue-500 hover:text-blue-700 view-project-btn"><i class="fas fa-eye"></i></button>
                <button class="text-yellow-500 hover:text-yellow-700 edit-project-btn"><i class="fas fa-edit"></i></button>
                <button class="text-red-500 hover:text-red-700 delete-project-btn"><i class="fas fa-trash"></i></button>
            </div>
        `;
        // Eliminar
        div.querySelector('.delete-project-btn').addEventListener('click', () => {
            if (confirm('¿Eliminar este proyecto?')) {
                const updated = getProyectos().filter(p => p.id !== proj.id);
                setProyectos(updated);
                renderProyectosList();
            }
        });
        // Editar (rellena el formulario y cambia el submit)
        div.querySelector('.edit-project-btn').addEventListener('click', () => {
            fillProjectForm(proj);
            openModal('add-project-modal');
            const form = document.getElementById('project-form');
            const originalHandler = form.onsubmit;
            form.onsubmit = function(e) {
                e.preventDefault();
                updateProject(proj.id);
                form.onsubmit = originalHandler;
            };
        });
        // Puedes agregar lógica para ver detalles
        list.appendChild(div);
    });
}

function getProjectStatusLabel(status) {
    switch(status) {
        case 'pending': return 'Pendiente';
        case 'in_progress': return 'En Progreso';
        case 'completed': return 'Completado';
        case 'delayed': return 'Atrasado';
        default: return status;
    }
}

function fillProjectForm(proj) {
    document.getElementById('project-name').value = proj.name;
    document.getElementById('project-client').value = proj.clientId;
    document.getElementById('project-manager').value = proj.manager;
    document.getElementById('project-start-date').value = proj.startDate;
    document.getElementById('project-end-date').value = proj.endDate;
    document.getElementById('project-status').value = proj.status;
    document.getElementById('project-budget').value = proj.budget;
    document.getElementById('project-description').value = proj.description;
}

function updateProject(id) {
    const proyectos = getProyectos();
    const idx = proyectos.findIndex(p => p.id === id);
    if (idx === -1) return;
    const updated = getProjectFormData(id);
    proyectos[idx] = updated;
    setProyectos(proyectos);
    renderProyectosList();
    closeModal('add-project-modal');
}

function getProjectFormData(id = null) {
    const clients = getClients();
    const clientId = parseInt(document.getElementById('project-client').value);
    const client = clients.find(c => c.id === clientId);
    return {
        id: id || Date.now(),
        name: document.getElementById('project-name').value.trim(),
        clientId,
        clientName: client ? client.name : '',
        manager: document.getElementById('project-manager').value,
        startDate: document.getElementById('project-start-date').value,
        endDate: document.getElementById('project-end-date').value,
        status: document.getElementById('project-status').value,
        budget: document.getElementById('project-budget').value,
        description: document.getElementById('project-description').value.trim()
    };
}

function resetProjectForm() {
    document.getElementById('project-form').reset();
}

function fillProjectClientOptions() {
    const select = document.getElementById('project-client');
    if (!select) return;
    const clients = getClients();
    select.innerHTML = '<option value="">Seleccionar cliente...</option>' +
        clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

function setupProjectForm() {
    fillProjectClientOptions();
    const form = document.getElementById('project-form');
    form.onsubmit = function(e) {
        e.preventDefault();
        const proyectos = getProyectos();
        const newProject = getProjectFormData();
        proyectos.push(newProject);
        setProyectos(proyectos);
        renderProyectosList();
        closeModal('add-project-modal');
        resetProjectForm();
    };
}

export function setupProyectosModule() {
    renderProyectosList();
    setupModalEvents('add-project-btn', 'add-project-modal', 'close-project-modal', 'cancel-project');
    setupProjectForm();
}
