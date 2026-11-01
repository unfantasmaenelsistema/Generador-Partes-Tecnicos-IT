import React, { useRef, useState } from 'react';
import {
  Download,
  FilePlus2,
  FolderOpen,
  Search,
  Trash2,
  Upload
} from 'lucide-react';
import { WorkOrder } from '../types/workOrder';
import { evaluateWorkOrder } from '../utils/evaluateWorkOrder';

interface SavedOrdersArchiveViewProps {
  savedOrders: WorkOrder[];
  activeOrderId: string;
  onLoadOrder: (order: WorkOrder) => void;
  onDeleteOrder: (id: string) => void;
  onImportOrders: (orders: WorkOrder[]) => void;
  onCreateBlankOrder: () => void;
}

export const SavedOrdersArchiveView: React.FC<SavedOrdersArchiveViewProps> = ({
  savedOrders,
  activeOrderId,
  onLoadOrder,
  onDeleteOrder,
  onImportOrders,
  onCreateBlankOrder
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Todos');
  const [importFeedback, setImportFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const statuses = [
    'Todos',
    'En Recepción',
    'En Diagnóstico',
    'Esperando Repuesto / Presupuesto',
    'En Reparación y Pruebas QA',
    'Cerrado — Conforme'
  ];

  const filteredOrders = savedOrders.filter((ord) => {
    const matchesStatus = statusFilter === 'Todos' || ord.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchesQuery =
      !q ||
      ord.orderNumber.toLowerCase().includes(q) ||
      ord.client.name.toLowerCase().includes(q) ||
      ord.equipment.brand.toLowerCase().includes(q) ||
      ord.equipment.model.toLowerCase().includes(q) ||
      ord.equipment.serialNumber.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const handleExportAllJson = () => {
    const dataStr = JSON.stringify(savedOrders, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `partes-tecnicos-it-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(String(ev.target?.result));
        if (Array.isArray(parsed)) {
          onImportOrders(parsed);
          setImportFeedback(`Se han importado ${parsed.length} órdenes de trabajo correctamente.`);
        } else if (parsed && typeof parsed === 'object' && parsed.orderNumber) {
          onImportOrders([parsed as WorkOrder]);
          setImportFeedback(`Orden ${parsed.orderNumber} importada correctamente.`);
        } else {
          setImportFeedback('El archivo JSON no tiene un formato de Orden de Trabajo válido.');
        }
      } catch {
        setImportFeedback('Error al leer el archivo JSON. Verifica su sintaxis.');
      }
      setTimeout(() => setImportFeedback(null), 4000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              REGISTRO LOCAL DE ÓRDENES DE TRABAJO · PERSISTENCIA EN NAVEGADOR
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              Archivo de Partes Técnicos y Respaldo JSON
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Gestiona las órdenes guardadas en tu sesión local, exporta copias de seguridad en JSON para entregar tus prácticas o restaura partes previos.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onCreateBlankOrder}
              className="px-3.5 py-2 text-xs font-medium text-white dark:text-slate-950 bg-slate-900 dark:bg-sky-400 hover:bg-slate-800 dark:hover:bg-sky-300 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              Nueva Orden en Blanco
            </button>
            <button
              type="button"
              onClick={handleExportAllJson}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar Archivo JSON
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Importar JSON
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        {importFeedback && (
          <div className="mt-4 p-3 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 rounded-md text-xs text-sky-900 dark:text-sky-200">
            {importFeedback}
          </div>
        )}

        {/* Controles de Búsqueda y Filtro */}
        <div className="mt-5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            {statuses.map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  statusFilter === st
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por OT, S/N, cliente o modelo..."
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-slate-900 dark:focus:border-sky-400 w-full md:w-72"
            />
          </div>
        </div>

        {/* Tabla de Órdenes Guardadas */}
        {filteredOrders.length > 0 ? (
          <div className="mt-5 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  <th className="py-3 px-4 font-semibold">Orden / Fecha</th>
                  <th className="py-3 px-4 font-semibold">Cliente / Entidad</th>
                  <th className="py-3 px-4 font-semibold">Equipo y S/N</th>
                  <th className="py-3 px-4 font-semibold">Estado Operativo</th>
                  <th className="py-3 px-4 font-semibold text-right">Calidad Técnica</th>
                  <th className="py-3 px-4 font-semibold text-right">Total (IVA inc.)</th>
                  <th className="py-3 px-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredOrders.map((ord) => {
                  const evalResult = evaluateWorkOrder(ord);
                  const partsSub = ord.replacedParts.reduce(
                    (s, p) => s + p.quantity * p.unitPriceEur,
                    0
                  );
                  const laborSub = ord.laborHours * ord.hourlyRateEur;
                  const total = (partsSub + laborSub) * (1 + ord.vatPercent / 100);
                  const isCurrent = ord.id === activeOrderId;

                  return (
                    <tr
                      key={ord.id}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${
                        isCurrent ? 'bg-sky-50/40 dark:bg-sky-950/30' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono tabular-nums">
                        <div className="font-bold text-slate-900 dark:text-slate-100">
                          {ord.orderNumber}
                          {isCurrent ? ' · [EN EDICIÓN]' : ''}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {ord.createdAt ? ord.createdAt.replace('T', ' ') : '—'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {ord.client.name || 'Sin titular'}
                        </div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {ord.client.organization || 'Particular'}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          {ord.equipment.brand} {ord.equipment.model}
                        </div>
                        <div className="font-mono text-slate-500 dark:text-slate-400 text-[11px] tabular-nums">
                          S/N: {ord.equipment.serialNumber || 'No registrado'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                        <div>{ord.status}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">
                          {ord.priority}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-right tabular-nums">
                        <span
                          className={`font-bold ${
                            evalResult.totalScore >= 85
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : evalResult.totalScore >= 60
                              ? 'text-amber-700 dark:text-amber-400'
                              : 'text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {evalResult.totalScore}/100 pts
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-right text-slate-900 dark:text-slate-100 tabular-nums">
                        {total.toFixed(2)} €
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onLoadOrder(ord)}
                            className="px-2.5 py-1 text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1"
                          >
                            <FolderOpen className="w-3 h-3" />
                            Abrir
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteOrder(ord.id)}
                            title="Eliminar orden del archivo"
                            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-700 dark:hover:text-rose-400 rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-5 p-10 border border-slate-200 dark:border-slate-800 rounded-lg text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/40">
            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              No se encontraron órdenes de trabajo con los criterios actuales
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Puedes crear un nuevo parte técnico en blanco o cargar cualquiera de los 6 escenarios reales del Laboratorio de Diagnóstico.
            </p>
            <div>
              <button
                type="button"
                onClick={onCreateBlankOrder}
                className="px-4 py-2 text-xs font-medium text-white dark:text-slate-950 bg-slate-900 dark:bg-sky-400 hover:bg-slate-800 dark:hover:bg-sky-300 rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                Crear Primera Orden de Trabajo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
