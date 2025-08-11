// db.js - CRUD y persistencia para entidades CRM

export function getDB(key, fallback) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
}
export function setDB(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getClients() {
    return getDB('crm_clients', []);
}
export function setClients(clients) {
    setDB('crm_clients', clients);
}
export function getInteractions() {
    return getDB('crm_interactions', []);
}
export function setInteractions(interactions) {
    setDB('crm_interactions', interactions);
}
// Puedes agregar más funciones para proyectos, oportunidades, etc.
