// Importar módulos
import { getClients, setClients, getInteractions, setInteractions } from './db.js';
import { openModal, closeModal, setupModalEvents } from './modals.js';
import { setupInteraccionesModule } from './interacciones.js';
import { setupProyectosModule } from './proyectos.js';
import { setupOportunidadesModule } from './oportunidades.js';

// --- Lógica principal del CRM ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Guardar Cliente (formulario) ---
    // Modular: lógica de formulario de cliente
    const clientForm = document.getElementById('client-form');
    if (clientForm) {
        clientForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = document.getElementById('client-name').value.trim();
            const company = document.getElementById('client-company').value.trim();
            const email = document.getElementById('client-email').value.trim();
            const phone = document.getElementById('client-phone').value.trim();
            const address = document.getElementById('client-address').value.trim();
            const status = document.getElementById('client-status').value;
            // source y notes pueden ser opcionales
            const source = document.getElementById('client-source')?.value || '';
            const notes = document.getElementById('client-notes').value.trim();
            if (!name || !email || !status) {
                showToast('Por favor, complete los campos obligatorios.');
                return;
            }
            const clients = getClients();
            const newClient = {
                id: clients.length ? Math.max(...clients.map(c => c.id)) + 1 : 1,
                name,
                company,
                email,
                phone,
                address,
                status,
                source,
                registrationDate: new Date().toISOString().slice(0, 10),
                notes,
                avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random()*90)}.jpg`
            };
            clients.push(newClient);
            setClients(clients);
            renderClientesTable(clients);
            showToast('Cliente guardado exitosamente.');
            closeModal('add-client-modal');
            clientForm.reset();
        });
    }
    // --- Sidebar Mejorada ---
    const sidebar = document.querySelector('.sidebar');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const mainContent = document.querySelector('.main-content');
    const navItems = document.querySelectorAll('.nav-item');
    const moduleContents = document.querySelectorAll('.module-content');
    const moduleTitle = document.getElementById('module-title');

    // Fondo overlay para sidebar en móvil
    let sidebarOverlay = document.getElementById('sidebar-overlay');
    if (!sidebarOverlay) {
        sidebarOverlay = document.createElement('div');
        sidebarOverlay.id = 'sidebar-overlay';
        sidebarOverlay.className = 'fixed inset-0 bg-black bg-opacity-40 z-40 hidden md:hidden';
        document.body.appendChild(sidebarOverlay);
    }

    // Mostrar/ocultar sidebar y overlay
    const openSidebar = () => {
        sidebar.classList.remove('collapsed');
        sidebar.classList.add('z-50');
        if (window.innerWidth <= 768) {
            sidebarOverlay.classList.remove('hidden');
        }
    };
    const closeSidebar = () => {
        sidebar.classList.add('collapsed');
        sidebar.classList.remove('z-50');
        sidebarOverlay.classList.add('hidden');
    };
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openSidebar();
        });
    }
    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeSidebar();
        });
    }
    sidebarOverlay.addEventListener('click', closeSidebar);
    // Cerrar sidebar tocando fuera en móvil (por overlay)
    if (mainContent) {
        mainContent.addEventListener('click', () => {
            if (window.innerWidth <= 768 && !sidebar.classList.contains('collapsed')) {
                closeSidebar();
            }
        });
    }
    // Estado inicial responsive
    const setInitialSidebarState = () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
            sidebar.classList.remove('z-50');
            sidebarOverlay.classList.add('hidden');
        } else {
            sidebar.classList.remove('collapsed');
            sidebar.classList.remove('z-50');
            sidebarOverlay.classList.add('hidden');
        }
    };
    setInitialSidebarState();
    window.addEventListener('resize', setInitialSidebarState);

    // --- Navegación entre módulos ---
    const setActiveModule = (moduleName) => {
        const activeNavItem = document.querySelector(`.nav-item[data-module="${moduleName}"]`);
        if (!activeNavItem) return;
        moduleTitle.textContent = activeNavItem.querySelector('.nav-text').textContent;
        navItems.forEach(item => item.classList.remove('active-nav'));
        activeNavItem.classList.add('active-nav');
        moduleContents.forEach(content => {
            content.classList.toggle('hidden', content.id !== `${moduleName}-module`);
        });
        // Inicializar lógica específica de cada módulo
        if (moduleName === 'interacciones') setupInteraccionesModule();
        if (moduleName === 'proyectos') setupProyectosModule();
        if (moduleName === 'oportunidades') setupOportunidadesModule();
        if (window.innerWidth <= 768) {
            closeSidebar();
        }
    };
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const moduleName = item.getAttribute('data-module');
            setActiveModule(moduleName);
        });
    });

    // Modular: eventos de modal de cliente
    setupModalEvents('add-client-btn', 'add-client-modal', 'close-client-modal', 'cancel-client');

    // Modular: eventos de modales de notificaciones y configuración
    setupModalEvents('notification-btn', 'notification-modal', 'close-notification-modal');
    setupModalEvents('settings-btn', 'settings-modal', 'close-settings-modal');

// (Removed duplicate block)

    // --- Búsqueda de Clientes (usando localStorage) ---
    const clientesTableBody = document.getElementById('clientes-table-body');
    function renderClientesTable(clients) {
        if (!clientesTableBody) return;
        clientesTableBody.innerHTML = '';
        if (!clients.length) {
            clientesTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-gray-500">No se encontraron clientes.</td></tr>';
            return;
        }
        clients.forEach(client => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <img class="h-10 w-10 rounded-full" src="${client.avatar}" alt="">
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">${client.name}</div>
                            <div class="text-sm text-gray-500">${client.email}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${client.company}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${client.phone}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${client.status === 'active' ? 'bg-green-100 text-green-800' : client.status === 'potential' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'}">${client.status === 'active' ? 'Activo' : client.status === 'potential' ? 'Potencial' : 'Inactivo'}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button class="text-blue-500 hover:text-blue-700 mr-2 view-client-btn" title="Ver"><i class="fas fa-eye"></i></button>
                    <button class="text-yellow-500 hover:text-yellow-700 mr-2 edit-client-btn" title="Editar"><i class="fas fa-edit"></i></button>
                    <button class="text-red-500 hover:text-red-700 delete-client-btn" title="Eliminar"><i class="fas fa-trash"></i></button>
                </td>
            `;
            // Botón eliminar
            tr.querySelector('.delete-client-btn').addEventListener('click', () => {
                if (confirm('¿Seguro que deseas eliminar este cliente?')) {
                    const updated = getClients().filter(c => c.id !== client.id);
                    setClients(updated);
                    renderClientesTable(updated);
                    showToast('Cliente eliminado.');
                }
            });
            // Botón editar
            tr.querySelector('.edit-client-btn').addEventListener('click', () => {
                // Rellenar el formulario con los datos del cliente
                document.getElementById('client-name').value = client.name;
                document.getElementById('client-company').value = client.company;
                document.getElementById('client-email').value = client.email;
                document.getElementById('client-phone').value = client.phone;
                document.getElementById('client-address').value = client.address;
                document.getElementById('client-status').value = client.status;
                document.getElementById('client-source').value = client.source;
                document.getElementById('client-notes').value = client.notes;
                document.getElementById('add-client-modal').classList.remove('hidden');
                // Cambiar el submit temporalmente para editar
                const clientForm = document.getElementById('client-form');
                const originalHandler = clientForm.onsubmit;
                clientForm.onsubmit = function(e) {
                    e.preventDefault();
                    client.name = document.getElementById('client-name').value.trim();
                    client.company = document.getElementById('client-company').value.trim();
                    client.email = document.getElementById('client-email').value.trim();
                    client.phone = document.getElementById('client-phone').value.trim();
                    client.address = document.getElementById('client-address').value.trim();
                    client.status = document.getElementById('client-status').value;
                    client.source = document.getElementById('client-source').value;
                    client.notes = document.getElementById('client-notes').value.trim();
                    // Actualizar en localStorage
                    const updated = getClients().map(c => c.id === client.id ? client : c);
                    setClients(updated);
                    renderClientesTable(updated);
                    showToast('Cliente actualizado.');
                    document.getElementById('add-client-modal').classList.add('hidden');
                    clientForm.reset();
                    clientForm.onsubmit = originalHandler;
                };
            });
            clientesTableBody.appendChild(tr);
        });
    }
    // Buscar clientes en localStorage
    const searchInput = document.getElementById('search-input');
    const searchIcon = document.getElementById('search-icon');
    function showToast(msg) {
        alert(msg);
    }
    function handleSearch() {
        const value = searchInput.value.trim().toLowerCase();
        if (!value) {
            showToast('Ingrese un término para buscar.');
            return;
        }
        const results = getClients().filter(c =>
            c.name.toLowerCase().includes(value) ||
            c.email.toLowerCase().includes(value) ||
            c.company.toLowerCase().includes(value)
        );
        setActiveModule('clientes');
        renderClientesTable(results);
        if (!results.length) {
            showToast('No se encontraron clientes.');
        }
    }
    searchInput?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    searchIcon?.addEventListener('click', handleSearch);

    // --- Configuración Inicial ---
    setActiveModule('dashboard');
});
