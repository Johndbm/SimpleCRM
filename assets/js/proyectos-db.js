// proyectos-db.js - CRUD para proyectos
import { getDB, setDB } from './db.js';

export function getProyectos() {
    return getDB('crm_proyectos', []);
}
export function setProyectos(proyectos) {
    setDB('crm_proyectos', proyectos);
}
