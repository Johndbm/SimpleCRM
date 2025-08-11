// oportunidades-db.js - CRUD para oportunidades
import { getDB, setDB } from './db.js';

export function getOportunidades() {
    return getDB('crm_oportunidades', []);
}
export function setOportunidades(oportunidades) {
    setDB('crm_oportunidades', oportunidades);
}
