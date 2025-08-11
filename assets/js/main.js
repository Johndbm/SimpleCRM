// --- Simulación de base de datos usando localStorage ---
const SAMPLE_CLIENTS = [
    {
        id: 1,
        name: "Laura Pérez",
        email: "laura@ejemplo.com",
        phone: "+34 123 456 789",
        company: "TechSolutions",
        address: "Calle Principal 123, Madrid",
        status: "active",
        source: "website",
        registrationDate: "2023-03-10",
        notes: "Cliente importante con varios proyectos en curso.",
        avatar: "https://randomuser.me/api/portraits/women/12.jpg"
    },
    {
        id: 2,
        name: "Juan Gómez",
        email: "juan@ejemplo.com",
        phone: "+34 987 654 321",
        company: "Consulting Corp",
        address: "Avenida Central 456, Barcelona",
        status: "active",
        source: "referral",
        registrationDate: "2023-02-15",
        notes: "Interesado en servicios de consultoría estratégica.",
        avatar: "https://randomuser.me/api/portraits/men/42.jpg"
    },
    {
        id: 3,
        name: "Ana Martínez",
        email: "ana@ejemplo.com",
        phone: "+34 555 123 456",
        company: "Business Advisors",
        address: "Plaza Mayor 789, Valencia",
        status: "potential",
        source: "event",
        registrationDate: "2023-04-05",
        notes: "Contactada en el evento de negocios. Seguimiento necesario.",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
        id: 4,
        name: "Carlos Rodríguez",
        email: "carlos@ejemplo.com",
        phone: "+34 111 222 333",
        company: "Digital Solutions",
        address: "Calle Tecnológica 101, Sevilla",
        status: "active",
        source: "social",
        registrationDate: "2023-01-20",
        notes: "Cliente satisfecho con el último proyecto.",
        avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
        id: 5,
        name: "María González",
        email: "maria@ejemplo.com",
        phone: "+34 444 555 666",
        company: "Innovate Corp",
        address: "Paseo de la Innovación 202, Bilbao",
        status: "inactive",
        source: "other",
        registrationDate: "2022-11-30",
        notes: "No ha respondido a los últimos contactos.",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    }
];

const SAMPLE_INTERACTIONS = [
    {
        id: 1,
        clientId: 1,
        type: "meeting",
        date: "2023-06-15",
        time: "10:30",
        subject: "Reunión para discutir el proyecto de consultoría",
        description: "Reunión presencial para revisar los requisitos del nuevo proyecto de consultoría.",
        outcome: "Cliente interesado en avanzar. Enviar propuesta formal.",
        clientName: "Laura Pérez",
        clientCompany: "TechSolutions"
    },
    {
        id: 2,
        clientId: 2,
        type: "call",
        date: "2023-06-18",
        time: "15:00",
        subject: "Llamada de seguimiento",
        description: "Llamada telefónica para dar seguimiento a la propuesta enviada.",
        outcome: "Cliente solicitó más información sobre el alcance.",
        clientName: "Juan Gómez",
        clientCompany: "Consulting Corp"
    },
    {
        id: 3,
        clientId: 3,
        type: "email",
        date: "2023-06-20",
        time: "09:00",
        subject: "Envío de presentación de servicios",
        description: "Se envió un correo con la presentación de servicios de la empresa.",
        outcome: "Cliente agradeció la información y quedó en responder.",
        clientName: "Ana Martínez",
        clientCompany: "Business Advisors"
    },
    {
        id: 4,
        clientId: 4,
        type: "note",
        date: "2023-06-22",
        time: "",
        subject: "Nota interna",
        description: "El cliente está satisfecho con el último proyecto, posible oportunidad de upselling.",
        outcome: "Pendiente preparar propuesta de nuevos servicios.",
        clientName: "Carlos Rodríguez",
        clientCompany: "Digital Solutions"
    },
    {
        id: 5,
        clientId: 5,
        type: "meeting",
        date: "2023-06-25",
        time: "11:00",
        subject: "Reunión de reactivación",
        description: "Reunión para intentar reactivar al cliente inactivo.",
        outcome: "Cliente no asistió a la reunión.",
        clientName: "María González",
        clientCompany: "Innovate Corp"
    }
];

// Utilidades para localStorage
function getDB(key, fallback) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
}
function setDB(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Inicializar datos de muestra si no existen
if (!localStorage.getItem('crm_clients')) {
    setDB('crm_clients', SAMPLE_CLIENTS);
}
if (!localStorage.getItem('crm_interactions')) {
    setDB('crm_interactions', SAMPLE_INTERACTIONS);
}

// Acceso principal a los datos
function getClients() {
    return getDB('crm_clients', []);
}
function setClients(clients) {
    setDB('crm_clients', clients);
}
function getInteractions() {
    return getDB('crm_interactions', []);
}
function setInteractions(interactions) {
    setDB('crm_interactions', interactions);
}

// --- Lógica principal del CRM ---
document.addEventListener('DOMContentLoaded', () => {
    // --- Guardar Cliente (formulario) ---
    const clientForm = document.getElementById('client-form');
    if (clientForm) {
        clientForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Obtener valores del formulario
            const name = document.getElementById('client-name').value.trim();
            const company = document.getElementById('client-company').value.trim();
            const email = document.getElementById('client-email').value.trim();
            const phone = document.getElementById('client-phone').value.trim();
            const address = document.getElementById('client-address').value.trim();
            const status = document.getElementById('client-status').value;
            const source = document.getElementById('client-source').value;
            const notes = document.getElementById('client-notes').value.trim();
            if (!name || !email || !status) {
                showToast('Por favor, complete los campos obligatorios.');
                return;
            }
            // Crear nuevo cliente
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
            // Cerrar modal y resetear formulario
            document.getElementById('add-client-modal').classList.add('hidden');
            clientForm.reset();
        });
    }
    // --- Sidebar ---
    const sidebar = document.querySelector('.sidebar');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const mainContent = document.querySelector('.main-content');
    const navItems = document.querySelectorAll('.nav-item');
    const moduleContents = document.querySelectorAll('.module-content');
    const moduleTitle = document.getElementById('module-title');

    const toggleSidebar = () => {
        sidebar.classList.toggle('collapsed');
    };
    toggleSidebarBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleSidebar();
    });
    const setInitialSidebarState = () => {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }
    };
    setInitialSidebarState();
    window.addEventListener('resize', setInitialSidebarState);
    mainContent.addEventListener('click', () => {
        if (window.innerWidth <= 768 && !sidebar.classList.contains('collapsed')) {
            sidebar.classList.add('collapsed');
        }
    });

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
        if (window.innerWidth <= 768) {
            sidebar.classList.add('collapsed');
        }
    };
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const moduleName = item.getAttribute('data-module');
            setActiveModule(moduleName);
        });
    });

    // --- Modal Nuevo Cliente ---
    const addClientModal = document.getElementById('add-client-modal');
    const openClientBtns = [
        ...document.querySelectorAll('#add-client-btn'),
        ...document.querySelectorAll('.bg-blue-500 i.fa-plus')
    ];
    const closeClientModalBtn = document.getElementById('close-client-modal');
    const cancelClientBtn = document.getElementById('cancel-client');
    openClientBtns.forEach(btn => {
        btn.closest('button')?.addEventListener('click', (e) => {
            e.preventDefault();
            addClientModal.classList.remove('hidden');
        });
    });
    [closeClientModalBtn, cancelClientBtn].forEach(btn => {
        btn?.addEventListener('click', () => {
            addClientModal.classList.add('hidden');
        });
    });
    addClientModal.addEventListener('click', (e) => {
        if (e.target === addClientModal) addClientModal.classList.add('hidden');
    });

    // --- Modal Notificaciones ---
    let notificationModal = document.getElementById('notification-modal');
    if (!notificationModal) {
        notificationModal = document.createElement('div');
        notificationModal.id = 'notification-modal';
        notificationModal.className = 'fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 hidden';
        notificationModal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div class="flex justify-between items-center p-4 border-b">
                    <h3 class="text-lg font-bold">Notificaciones</h3>
                    <button id="close-notification-modal" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i></button>
                </div>
                <ul class="divide-y divide-gray-200 max-h-80 overflow-y-auto" id="notification-list">
                    <li class="p-4 text-gray-700">No hay notificaciones nuevas.</li>
                </ul>
            </div>
        `;
        document.body.appendChild(notificationModal);
    }
    function openNotificationModal() {
        notificationModal.classList.remove('hidden');
    }
    function closeNotificationModal() {
        notificationModal.classList.add('hidden');
    }
    document.getElementById('close-notification-modal')?.addEventListener('click', closeNotificationModal);
    notificationModal.addEventListener('click', (e) => {
        if (e.target === notificationModal) closeNotificationModal();
    });

    // --- Modal Configuración ---
    let settingsModal = document.getElementById('settings-modal');
    if (!settingsModal) {
        settingsModal = document.createElement('div');
        settingsModal.id = 'settings-modal';
        settingsModal.className = 'fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 hidden';
        settingsModal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div class="flex justify-between items-center p-4 border-b">
                    <h3 class="text-lg font-bold">Configuración</h3>
                    <button id="close-settings-modal" class="text-gray-500 hover:text-gray-700"><i class="fas fa-times"></i></button>
                </div>
                <div class="p-4 text-gray-700">
                    <p>Opciones de configuración próximamente disponibles.</p>
                </div>
            </div>
        `;
        document.body.appendChild(settingsModal);
    }
    function openSettingsModal() {
        settingsModal.classList.remove('hidden');
    }
    function closeSettingsModal() {
        settingsModal.classList.add('hidden');
    }
    document.getElementById('close-settings-modal')?.addEventListener('click', closeSettingsModal);
    settingsModal.addEventListener('click', (e) => {
        if (e.target === settingsModal) closeSettingsModal();
    });

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
