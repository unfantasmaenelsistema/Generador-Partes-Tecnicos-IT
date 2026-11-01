import React from 'react';
import {
  CheckSquare,
  Clock,
  Cpu,
  Plus,
  RefreshCw,
  Stethoscope,
  Trash2,
  UserCheck,
  Wrench
} from 'lucide-react';
import {
  DIAGNOSTIC_TOOLS_CATALOG,
  TECHNICAL_ACTION_VERBS
} from '../data/didacticCases';
import {
  AssetCategory,
  ConformityCheckItem,
  CorrectiveActionItem,
  ReplacedPartItem,
  RootCauseCategory,
  ServicePriority,
  WorkOrder,
  WorkOrderStatus
} from '../types/workOrder';

interface WorkOrderFormEditorProps {
  order: WorkOrder;
  onChange: (updated: WorkOrder) => void;
}

const ASSET_CATEGORIES: AssetCategory[] = [
  'Portátil / Ultrabook',
  'Sobremesa / Workstation',
  'Servidor / NAS',
  'All-in-One / MiniPC',
  'Impresora / Periférico Industrial',
  'Red / Electrónica de Comunicaciones'
];

const PRIORITIES: ServicePriority[] = [
  'Estándar (48-72h)',
  'Preferente (24h)',
  'Crítica / Parada de Servicio (SLA 4h)'
];

const STATUSES: WorkOrderStatus[] = [
  'En Recepción',
  'En Diagnóstico',
  'Esperando Repuesto / Presupuesto',
  'En Reparación y Pruebas QA',
  'Cerrado — Conforme'
];

const ROOT_CAUSE_CATEGORIES: RootCauseCategory[] = [
  'Térmico / Disipación',
  'Almacenamiento / Integridad de Datos',
  'Eléctrico / Alimentación / VRM',
  'Memoria RAM / Bus de Sistema',
  'Mecánico / Soldadura / Conectores',
  'Firmware / BIOS / Sistema Operativo',
  'Red / Configuración de Servicios'
];

const COMMON_QA_PRESETS: { code: string; testName: string; sampleMetric: string }[] = [
  {
    code: 'QA-TERM',
    testName: 'Test de estrés térmico combinado CPU/GPU (OCCT 30 min)',
    sampleMetric: 'Tª máx. 73 °C al 100% TDP · 0% Thermal Throttling · Ventilación PWM estable.'
  },
  {
    code: 'QA-DISK',
    testName: 'Auditoría SMART e integridad del sistema de archivos',
    sampleMetric: 'Salud SMART 100% (0 sectores reasignados/pendientes) · Lectura 3.450 MB/s · SFC sin errores.'
  },
  {
    code: 'QA-MEM',
    testName: 'Verificación de memoria principal MemTest86+ v7.0',
    sampleMetric: '4 pasadas completas (13 algoritmos) con 0 errores de paridad ECC/Bit-Flip.'
  },
  {
    code: 'QA-ELEC',
    testName: 'Comprobación de tensiones y consumo bajo carga',
    sampleMetric: 'Raíles ATX estables (+12.06V, +5.01V, +3.31V) · Rizado < 20 mV · Sin microcortes.'
  }
];

const inputClass =
  'w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/90 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-slate-900 dark:focus:border-sky-400 transition-colors';

const compactInputClass =
  'w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-slate-900 dark:focus:border-sky-400 transition-colors';

export const WorkOrderFormEditor: React.FC<WorkOrderFormEditorProps> = ({
  order,
  onChange
}) => {
  const updateClient = (field: keyof WorkOrder['client'], value: string | boolean) => {
    onChange({
      ...order,
      client: { ...order.client, [field]: value }
    });
  };

  const updateEquipment = (field: keyof WorkOrder['equipment'], value: string) => {
    onChange({
      ...order,
      equipment: { ...order.equipment, [field]: value }
    });
  };

  const updateFault = (
    field: keyof WorkOrder['faultDiagnosis'],
    value: string | string[]
  ) => {
    onChange({
      ...order,
      faultDiagnosis: { ...order.faultDiagnosis, [field]: value }
    });
  };

  const toggleDiagnosticTool = (tool: string) => {
    const current = order.faultDiagnosis.diagnosticToolsUsed;
    const exists = current.includes(tool);
    const next = exists ? current.filter((t) => t !== tool) : [...current, tool];
    updateFault('diagnosticToolsUsed', next);
  };

  // Corrective actions handlers
  const handleAddAction = (presetVerb?: string, presetDesc?: string) => {
    const newItem: CorrectiveActionItem = {
      id: `ca-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      stage: '2. Intervención de Hardware',
      actionVerb: presetVerb || 'Intervención correctiva',
      technicalDescription: presetDesc || '',
      durationMinutes: 25
    };
    onChange({
      ...order,
      correctiveActions: [...order.correctiveActions, newItem]
    });
  };

  const handleUpdateAction = (
    id: string,
    field: keyof CorrectiveActionItem,
    value: string | number
  ) => {
    onChange({
      ...order,
      correctiveActions: order.correctiveActions.map((act) =>
        act.id === id ? { ...act, [field]: value } : act
      )
    });
  };

  const handleRemoveAction = (id: string) => {
    onChange({
      ...order,
      correctiveActions: order.correctiveActions.filter((act) => act.id !== id)
    });
  };

  const syncMinutesToLaborHours = () => {
    const totalMinutes = order.correctiveActions.reduce(
      (sum, a) => sum + (Number(a.durationMinutes) || 0),
      0
    );
    const hours = Math.max(0.5, Math.round((totalMinutes / 60) * 4) / 4);
    onChange({ ...order, laborHours: hours });
  };

  // Replaced parts handlers
  const handleAddPart = (preset?: Partial<ReplacedPartItem>) => {
    const newPart: ReplacedPartItem = {
      id: `rp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      componentName: preset?.componentName || '',
      partNumberOrSku: preset?.partNumberOrSku || '',
      removedComponentRef: preset?.removedComponentRef || '',
      installedComponentRef: preset?.installedComponentRef || '',
      condition: preset?.condition || 'Nuevo OEM',
      warrantyMonths: preset?.warrantyMonths ?? 24,
      quantity: preset?.quantity ?? 1,
      unitPriceEur: preset?.unitPriceEur ?? 0
    };
    onChange({
      ...order,
      replacedParts: [...order.replacedParts, newPart]
    });
  };

  const handleUpdatePart = (
    id: string,
    field: keyof ReplacedPartItem,
    value: string | number
  ) => {
    onChange({
      ...order,
      replacedParts: order.replacedParts.map((part) =>
        part.id === id ? { ...part, [field]: value } : part
      )
    });
  };

  const handleRemovePart = (id: string) => {
    onChange({
      ...order,
      replacedParts: order.replacedParts.filter((part) => part.id !== id)
    });
  };

  // Conformity checks handlers
  const handleAddCheck = (preset?: {
    code: string;
    testName: string;
    sampleMetric: string;
  }) => {
    const nextIdx = order.conformityChecks.length + 1;
    const newChk: ConformityCheckItem = {
      id: `cc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      code: preset?.code || `QA-0${nextIdx}`,
      testName: preset?.testName || '',
      passed: true,
      measuredResult: preset?.sampleMetric || ''
    };
    onChange({
      ...order,
      conformityChecks: [...order.conformityChecks, newChk]
    });
  };

  const handleUpdateCheck = (
    id: string,
    field: keyof ConformityCheckItem,
    value: string | boolean
  ) => {
    onChange({
      ...order,
      conformityChecks: order.conformityChecks.map((chk) =>
        chk.id === id ? { ...chk, [field]: value } : chk
      )
    });
  };

  const handleRemoveCheck = (id: string) => {
    onChange({
      ...order,
      conformityChecks: order.conformityChecks.filter((chk) => chk.id !== id)
    });
  };

  const partsSubtotal = order.replacedParts.reduce(
    (sum, p) => sum + p.quantity * p.unitPriceEur,
    0
  );
  const laborSubtotal = order.laborHours * order.hourlyRateEur;
  const taxableBase = partsSubtotal + laborSubtotal;
  const vatAmount = taxableBase * (order.vatPercent / 100);
  const grandTotal = taxableBase + vatAmount;

  return (
    <div className="space-y-6">
      {/* 00. Metadatos de Orden y Datos del Cliente */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              CABECERA ADMINISTRATIVA Y RECEPCIÓN DE TALLER
            </span>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              00. Control de Orden de Trabajo y Datos del Cliente
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-600 dark:text-slate-300 tabular-nums">
            REF ACTIVA: {order.orderNumber}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nº Orden de Trabajo (OT)
            </label>
            <input
              type="text"
              value={order.orderNumber}
              onChange={(e) => onChange({ ...order, orderNumber: e.target.value })}
              placeholder="OT-2026-0104"
              className={`${inputClass} font-mono tabular-nums`}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Técnico Especialista Asignado
            </label>
            <input
              type="text"
              value={order.technicianName}
              onChange={(e) => onChange({ ...order, technicianName: e.target.value })}
              placeholder="Nombre y Apellidos del Técnico"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Prioridad / SLA
            </label>
            <select
              value={order.priority}
              onChange={(e) =>
                onChange({ ...order, priority: e.target.value as ServicePriority })
              }
              className={inputClass}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Estado de la Orden
            </label>
            <select
              value={order.status}
              onChange={(e) =>
                onChange({ ...order, status: e.target.value as WorkOrderStatus })
              }
              className={inputClass}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Datos del Cliente */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nombre del Cliente / Solicitante
            </label>
            <input
              type="text"
              value={order.client.name}
              onChange={(e) => updateClient('name', e.target.value)}
              placeholder="Ej. Elena Vázquez Morales"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Empresa / Departamento
            </label>
            <input
              type="text"
              value={order.client.organization}
              onChange={(e) => updateClient('organization', e.target.value)}
              placeholder="Particular o Razón Social"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Teléfono de Contacto
            </label>
            <input
              type="text"
              value={order.client.contactPhone}
              onChange={(e) => updateClient('contactPhone', e.target.value)}
              placeholder="600 000 000"
              className={`${inputClass} font-mono tabular-nums`}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              value={order.client.contactEmail}
              onChange={(e) => updateClient('contactEmail', e.target.value)}
              placeholder="cliente@empresa.es"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-700 dark:text-slate-300">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={order.client.authorizedBackup}
              onChange={(e) => updateClient('authorizedBackup', e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-600 text-slate-900 dark:text-sky-500 focus:ring-slate-900"
            />
            <span>Autoriza acceso y respaldo temporal de datos conforme a RGPD</span>
          </label>

          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={order.client.warrantyClaim}
              onChange={(e) => updateClient('warrantyClaim', e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-600 text-slate-900 dark:text-sky-500 focus:ring-slate-900"
            />
            <span>Intervención solicitada bajo cobertura de Garantía / RMA</span>
          </label>
        </div>
      </section>

      {/* 01. Identificación del Equipo (Pilar Didáctico 1) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Cpu className="w-4 h-4 text-slate-800 dark:text-sky-400 shrink-0" />
            <div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                PILAR DIDÁCTICO 01 · TRAZABILIDAD DE HARDWARE (20 PTS)
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                01. Identificación Unívoca del Equipo y Estado en Recepción
              </h2>
            </div>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Registra S/N exacto, especificaciones completas y daños estéticos previos
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Categoría del Activo
            </label>
            <select
              value={order.equipment.category}
              onChange={(e) =>
                updateEquipment('category', e.target.value as AssetCategory)
              }
              className={inputClass}
            >
              {ASSET_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Marca / Fabricante
            </label>
            <input
              type="text"
              value={order.equipment.brand}
              onChange={(e) => updateEquipment('brand', e.target.value)}
              placeholder="Ej. Lenovo, Dell, HP, Synology, Custom"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Modelo Exacto y Part Number / Type
            </label>
            <input
              type="text"
              value={order.equipment.model}
              onChange={(e) => updateEquipment('model', e.target.value)}
              placeholder="Ej. ThinkPad P15v Gen 3 (Type 21D8)"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Número de Serie (S/N o Service Tag) *
            </label>
            <input
              type="text"
              value={order.equipment.serialNumber}
              onChange={(e) => updateEquipment('serialNumber', e.target.value)}
              placeholder="Ej. PF-3X98K2 / 8H4K9T3"
              className={`${inputClass} font-mono tabular-nums`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Procesador (CPU)
            </label>
            <input
              type="text"
              value={order.equipment.cpu}
              onChange={(e) => updateEquipment('cpu', e.target.value)}
              placeholder="Ej. Intel Core i7-12700H (14C/20T)"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Memoria Principal (RAM: Capacidad, Tipo, MHz)
            </label>
            <input
              type="text"
              value={order.equipment.ram}
              onChange={(e) => updateEquipment('ram', e.target.value)}
              placeholder="Ej. 32 GB DDR5-4800 MHz (2x16 GB SO-DIMM)"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Almacenamiento (Unidades, Interfaz, Modelo)
            </label>
            <input
              type="text"
              value={order.equipment.storage}
              onChange={(e) => updateEquipment('storage', e.target.value)}
              placeholder="Ej. 1 TB SSD NVMe PCIe 4.0 Samsung PM9A1"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Placa Base / Tarjeta Gráfica (GPU)
            </label>
            <input
              type="text"
              value={order.equipment.motherboardOrGpu}
              onChange={(e) => updateEquipment('motherboardOrGpu', e.target.value)}
              placeholder="Ej. NVIDIA T1200 4GB GDDR6 + Intel Iris Xe"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sistema Operativo / Versión de Firmware
            </label>
            <input
              type="text"
              value={order.equipment.operatingSystem}
              onChange={(e) => updateEquipment('operatingSystem', e.target.value)}
              placeholder="Ej. Windows 11 Pro 23H2 (64 bits)"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Etiqueta de Inventario (Asset Tag Corporativo)
            </label>
            <input
              type="text"
              value={order.equipment.assetTag}
              onChange={(e) => updateEquipment('assetTag', e.target.value)}
              placeholder="Ej. ARQ-WKS-04 o N/A"
              className={`${inputClass} font-mono tabular-nums`}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Inspección Física y Cosmética en Recepción (Arañazos, bisagras, tornillos)
            </label>
            <textarea
              rows={2}
              value={order.equipment.physicalIntakeState}
              onChange={(e) => updateEquipment('physicalIntakeState', e.target.value)}
              placeholder="Ej. Arañazo superficial de 3 cm en tapa superior; falta 1 tornillo M2x5 en esquina inferior derecha..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
              Accesorios Entregados con el Equipo (Cargador con W y P/N, cables, maletín)
            </label>
            <textarea
              rows={2}
              value={order.equipment.accessoriesIncluded}
              onChange={(e) => updateEquipment('accessoriesIncluded', e.target.value)}
              placeholder="Ej. Cargador original Lenovo 135W Slim Tip (P/N: ADL135NDC3A) con cable Schuko."
              className={inputClass}
            />
          </div>
        </div>
      </section>

      {/* 02. Síntoma Aportado por el Usuario vs. Diagnóstico Real del Técnico (Pilar Didáctico 2) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Stethoscope className="w-4 h-4 text-slate-800 dark:text-sky-400 shrink-0" />
            <div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                PILAR DIDÁCTICO 02 · SÍNTOMA SUBJETIVO VS. CAUSA RAÍZ OBJETIVA (25 PTS)
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                02. Descripción del Fallo (Usuario) frente al Diagnóstico Real (Técnico)
              </h2>
            </div>
          </div>
          <div className="text-xs">
            <select
              value={order.faultDiagnosis.rootCauseCategory}
              onChange={(e) =>
                updateFault('rootCauseCategory', e.target.value as RootCauseCategory)
              }
              className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md font-medium text-slate-800 dark:text-slate-200 focus:outline-none"
            >
              {ROOT_CAUSE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  Subsistema: {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cajas Lado a Lado: Usuario vs Técnico */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Lado A: Usuario */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                2A. Descripción del Fallo Aportada por el Usuario (Síntoma Percibido)
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Recoge de forma objetiva qué experimenta el cliente sin asumir todavía qué pieza interna ha fallado.
              </p>
            </div>
            <textarea
              rows={4}
              value={order.faultDiagnosis.clientSymptom}
              onChange={(e) => updateFault('clientSymptom', e.target.value)}
              placeholder="Ej. La usuaria reporta que al ejecutar software CAD 3D o videollamadas prolongadas el equipo sufre caídas de rendimiento, emite ruido mecánico y se apaga súbitamente..."
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-slate-900 dark:focus:border-sky-400 leading-relaxed"
            />
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Frecuencia y Condición de Reproducción en Banco
              </label>
              <input
                type="text"
                value={order.faultDiagnosis.symptomContextAndFrequency}
                onChange={(e) =>
                  updateFault('symptomContextAndFrequency', e.target.value)
                }
                placeholder="Ej. Reproducible sistemáticamente a los 120s de aplicar carga multinúcleo > 60% TDP."
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-slate-900 dark:focus:border-sky-400"
              />
            </div>
          </div>

          {/* Lado B: Técnico */}
          <div className="p-4 bg-sky-50/40 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/70 rounded-lg space-y-3">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-sky-100">
                2B. Diagnóstico Real del Técnico (Dictamen de Causa Raíz)
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                Explica la causa física o lógica exacta verificada con instrumentación. Evita términos coloquiales («roto», «pelusa», «iba mal»).
              </p>
            </div>
            <textarea
              rows={4}
              value={order.faultDiagnosis.technicalDiagnosis}
              onChange={(e) => updateFault('technicalDiagnosis', e.target.value)}
              placeholder="Ej. Incapacidad crítica de disipación en el conjunto térmico debido a: (1) fallo electromecánico del rodamiento del ventilador centrífugo de 5V DC, (2) obstrucción del 85% del radiador de cobre y (3) cristalización del compuesto térmico..."
              className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-slate-900 dark:focus:border-sky-400 leading-relaxed"
            />
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Telemetría, Mediciones y Códigos de Error (SMART / POST / Eventos / °C / V)
              </label>
              <input
                type="text"
                value={order.faultDiagnosis.telemetryAndErrorCodes}
                onChange={(e) =>
                  updateFault('telemetryAndErrorCodes', e.target.value)
                }
                placeholder="Ej. Tª CPU Carga: 100 °C (PROCHOT# / THERMTRIP#) · Fan1: 0-1150 RPM · Kernel-Power ID 41"
                className="w-full px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-slate-900 dark:focus:border-sky-400 tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Selector de Instrumentación de Diagnóstico */}
        <div className="space-y-2 pt-1">
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300">
            Instrumentación y Software de Diagnóstico Empleado en Taller (Selecciona los utilizados):
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DIAGNOSTIC_TOOLS_CATALOG.map((tool) => {
              const active = order.faultDiagnosis.diagnosticToolsUsed.includes(tool);
              return (
                <button
                  key={tool}
                  type="button"
                  onClick={() => toggleDiagnosticTool(tool)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md border transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-slate-900 dark:border-sky-400'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}
                >
                  {tool}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 03. Acciones Correctivas Aplicadas (Pilar Didáctico 3) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Wrench className="w-4 h-4 text-slate-800 dark:text-sky-400 shrink-0" />
            <div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                PILAR DIDÁCTICO 03 · PROCEDIMIENTO Y PROTOCOLO DE INTERVENCIÓN (20 PTS)
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                03. Acciones Correctivas Aplicadas
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={syncMinutesToLaborHours}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5" />
              Sincronizar Minutos con Mano de Obra
            </button>
            <button
              type="button"
              onClick={() => handleAddAction()}
              className="px-3 py-1.5 text-xs font-medium text-white dark:text-slate-950 bg-slate-900 dark:bg-sky-400 hover:bg-slate-800 dark:hover:bg-sky-300 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Añadir Fase / Acción
            </button>
          </div>
        </div>

        {/* Inserción Rápida de Verbos Técnicos */}
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Insertar plantilla de procedimiento técnico estándar:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TECHNICAL_ACTION_VERBS.slice(0, 6).map((preset) => (
              <button
                key={preset.verb}
                type="button"
                onClick={() => handleAddAction(preset.verb, preset.example)}
                className="px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded transition-colors whitespace-nowrap shrink-0"
              >
                + {preset.verb}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Acciones Correctivas */}
        <div className="space-y-3">
          {order.correctiveActions.map((act, index) => (
            <div
              key={act.id}
              className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3 text-xs"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                <div className="md:col-span-4">
                  <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Fase #{index + 1} del Protocolo
                  </label>
                  <select
                    value={act.stage}
                    onChange={(e) =>
                      handleUpdateAction(
                        act.id,
                        'stage',
                        e.target.value as CorrectiveActionItem['stage']
                      )
                    }
                    className={compactInputClass}
                  >
                    <option value="1. Seguridad ESD y Desmontaje">
                      1. Seguridad ESD y Desmontaje
                    </option>
                    <option value="2. Intervención de Hardware">
                      2. Intervención de Hardware
                    </option>
                    <option value="3. Firmware / Sistema">
                      3. Firmware / Sistema
                    </option>
                    <option value="4. Saneamiento y Montaje">
                      4. Saneamiento y Montaje
                    </option>
                  </select>
                </div>

                <div className="md:col-span-5">
                  <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Sustantivo / Verbo de Acción Técnica
                  </label>
                  <input
                    type="text"
                    value={act.actionVerb}
                    onChange={(e) =>
                      handleUpdateAction(act.id, 'actionVerb', e.target.value)
                    }
                    placeholder="Ej. Desobstrucción y saneamiento térmico"
                    className={`${compactInputClass} font-semibold`}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">
                    Duración (min)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={act.durationMinutes}
                    onChange={(e) =>
                      handleUpdateAction(
                        act.id,
                        'durationMinutes',
                        Number(e.target.value)
                      )
                    }
                    className={`${compactInputClass} font-mono tabular-nums`}
                  />
                </div>

                <div className="md:col-span-1 flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => handleRemoveAction(act.id)}
                    title="Eliminar acción"
                    className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Descripción Técnica Detallada del Procedimiento
                </label>
                <textarea
                  rows={2}
                  value={act.technicalDescription}
                  onChange={(e) =>
                    handleUpdateAction(act.id, 'technicalDescription', e.target.value)
                  }
                  placeholder="Describe con precisión técnica los componentes intervenidos, productos empleados (ej. IPA 99.9%) y parámetros configurados..."
                  className={compactInputClass}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 04. Piezas Sustituidas y Costes (Pilar Didáctico 4) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-4 h-4 text-slate-800 dark:text-sky-400 shrink-0" />
            <div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                PILAR DIDÁCTICO 04 · TRAZABILIDAD DE REPUESTOS Y GARANTÍA (15 PTS)
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                04. Piezas Sustituidas y Liquidación de Mano de Obra
              </h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() =>
                handleAddPart({
                  componentName: 'Consumible: Compuesto térmico alta conductividad (8.5 W/m·K)',
                  partNumberOrSku: 'CONS-TH-MX6',
                  removedComponentRef: 'Pasta OEM cristalizada',
                  installedComponentRef: 'Dosificación 0.4g nueva',
                  warrantyMonths: 12,
                  quantity: 1,
                  unitPriceEur: 6.5
                })
              }
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0"
            >
              + Consumible Térmico
            </button>
            <button
              type="button"
              onClick={() => handleAddPart()}
              className="px-3 py-1.5 text-xs font-medium text-white dark:text-slate-950 bg-slate-900 dark:bg-sky-400 hover:bg-slate-800 dark:hover:bg-sky-300 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Añadir Pieza Sustituida
            </button>
          </div>
        </div>

        {order.replacedParts.length > 0 ? (
          <div className="space-y-3">
            {order.replacedParts.map((part) => (
              <div
                key={part.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3 text-xs"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-5">
                    <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Denominación Técnica del Componente
                    </label>
                    <input
                      type="text"
                      value={part.componentName}
                      onChange={(e) =>
                        handleUpdatePart(part.id, 'componentName', e.target.value)
                      }
                      placeholder="Ej. Ventilador centrífugo CPU 5V DC 0.5A PWM"
                      className={compactInputClass}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">
                      P/N, FRU o SKU *
                    </label>
                    <input
                      type="text"
                      value={part.partNumberOrSku}
                      onChange={(e) =>
                        handleUpdatePart(part.id, 'partNumberOrSku', e.target.value)
                      }
                      placeholder="Ej. FRU-5H41B77292"
                      className={`${compactInputClass} font-mono tabular-nums`}
                    />
                  </div>

                  <div className="md:col-span-3">
                    <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Condición del Recambio
                    </label>
                    <select
                      value={part.condition}
                      onChange={(e) =>
                        handleUpdatePart(
                          part.id,
                          'condition',
                          e.target.value as ReplacedPartItem['condition']
                        )
                      }
                      className={compactInputClass}
                    >
                      <option value="Nuevo OEM">Nuevo OEM</option>
                      <option value="Nuevo Equivalente Certificado">
                        Nuevo Equivalente Certificado
                      </option>
                      <option value="Reacondicionado Testado">
                        Reacondicionado Testado
                      </option>
                    </select>
                  </div>

                  <div className="md:col-span-1 flex justify-end items-end pb-1">
                    <button
                      type="button"
                      onClick={() => handleRemovePart(part.id)}
                      title="Eliminar recambio"
                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="lg:col-span-2">
                    <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Ref. / S/N Pieza Retirada (Baja)
                    </label>
                    <input
                      type="text"
                      value={part.removedComponentRef}
                      onChange={(e) =>
                        handleUpdatePart(
                          part.id,
                          'removedComponentRef',
                          e.target.value
                        )
                      }
                      placeholder="Ej. S/N: ZFL4921M (Defectuoso)"
                      className={`${compactInputClass} font-mono`}
                    />
                  </div>

                  <div className="lg:col-span-1">
                    <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Ref. / S/N Instalada (Alta)
                    </label>
                    <input
                      type="text"
                      value={part.installedComponentRef}
                      onChange={(e) =>
                        handleUpdatePart(
                          part.id,
                          'installedComponentRef',
                          e.target.value
                        )
                      }
                      placeholder="Ej. S/N: S621NJ0W8"
                      className={`${compactInputClass} font-mono`}
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">
                      Garantía (Meses)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={part.warrantyMonths}
                      onChange={(e) =>
                        handleUpdatePart(
                          part.id,
                          'warrantyMonths',
                          Number(e.target.value)
                        )
                      }
                      className={`${compactInputClass} font-mono tabular-nums`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">
                        Cant.
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={part.quantity}
                        onChange={(e) =>
                          handleUpdatePart(part.id, 'quantity', Number(e.target.value))
                        }
                        className={`${compactInputClass} font-mono tabular-nums`}
                      />
                    </div>
                    <div>
                      <label className="block font-medium text-slate-600 dark:text-slate-300 mb-1">
                        Precio (€)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min={0}
                        value={part.unitPriceEur}
                        onChange={(e) =>
                          handleUpdatePart(
                            part.id,
                            'unitPriceEur',
                            Number(e.target.value)
                          )
                        }
                        className={`${compactInputClass} font-mono tabular-nums`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-300 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span>
              No hay repuestos registrados en esta orden. Si se sustituyó algún componente o consumible, añádelo con su P/N para mantener la trazabilidad.
            </span>
            <button
              type="button"
              onClick={() => handleAddPart()}
              className="px-3 py-1.5 font-medium text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md whitespace-nowrap shrink-0"
            >
              Registrar Repuesto
            </button>
          </div>
        )}

        {/* Mano de Obra y Resumen Económico */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs items-end">
          <div className="md:col-span-7 grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Horas Mano de Obra
              </label>
              <input
                type="number"
                step="0.25"
                min={0}
                value={order.laborHours}
                onChange={(e) =>
                  onChange({ ...order, laborHours: Number(e.target.value) })
                }
                className={`${inputClass} font-mono tabular-nums`}
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tarifa Hora (€/h)
              </label>
              <input
                type="number"
                step="1"
                min={0}
                value={order.hourlyRateEur}
                onChange={(e) =>
                  onChange({ ...order, hourlyRateEur: Number(e.target.value) })
                }
                className={`${inputClass} font-mono tabular-nums`}
              />
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Tipo IVA (%)
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={order.vatPercent}
                onChange={(e) =>
                  onChange({ ...order, vatPercent: Number(e.target.value) })
                }
                className={`${inputClass} font-mono tabular-nums`}
              />
            </div>
          </div>

          <div className="md:col-span-5 p-3.5 bg-slate-900 dark:bg-slate-950 border border-slate-800 text-white rounded-lg font-mono text-xs space-y-1 tabular-nums">
            <div className="flex justify-between text-slate-300">
              <span>Repuestos + Mano de Obra:</span>
              <span>
                {partsSubtotal.toFixed(2)} € + {laborSubtotal.toFixed(2)} €
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Base Imponible + IVA ({order.vatPercent}%):</span>
              <span>
                {taxableBase.toFixed(2)} € + {vatAmount.toFixed(2)} €
              </span>
            </div>
            <div className="flex justify-between text-sm font-bold text-white pt-1 border-t border-slate-700">
              <span>TOTAL PRESUPUESTO / ORDEN:</span>
              <span className="text-sky-400">{grandTotal.toFixed(2)} €</span>
            </div>
          </div>
        </div>
      </section>

      {/* 05. Prueba Final de Conformidad QA (Pilar Didáctico 5) */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <CheckSquare className="w-4 h-4 text-slate-800 dark:text-sky-400 shrink-0" />
            <div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                PILAR DIDÁCTICO 05 · VERIFICACIÓN FINAL Y MÉTRICAS POST-REPARACIÓN (20 PTS)
              </span>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                05. Prueba Final de Conformidad (Control de Calidad QA)
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleAddCheck()}
            className="px-3 py-1.5 text-xs font-medium text-white dark:text-slate-950 bg-slate-900 dark:bg-sky-400 hover:bg-slate-800 dark:hover:bg-sky-300 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Añadir Prueba de Conformidad
          </button>
        </div>

        {/* Plantillas de Pruebas QA */}
        <div className="space-y-1.5">
          <div className="text-xs font-medium text-slate-600 dark:text-slate-400">
            Añadir protocolo de verificación QA con estructura cuantificada:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {COMMON_QA_PRESETS.map((preset) => (
              <button
                key={preset.code}
                type="button"
                onClick={() => handleAddCheck(preset)}
                className="px-2.5 py-1 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded transition-colors whitespace-nowrap shrink-0"
              >
                + {preset.code}: {preset.testName}
              </button>
            ))}
          </div>
        </div>

        {/* Checklist QA */}
        <div className="space-y-3">
          {order.conformityChecks.map((chk) => (
            <div
              key={chk.id}
              className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs"
            >
              <div className="md:col-span-1 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={chk.passed}
                  onChange={(e) =>
                    handleUpdateCheck(chk.id, 'passed', e.target.checked)
                  }
                  className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-slate-900 dark:text-sky-500 focus:ring-slate-900 cursor-pointer"
                />
                <input
                  type="text"
                  value={chk.code}
                  onChange={(e) => handleUpdateCheck(chk.id, 'code', e.target.value)}
                  className="w-16 px-1.5 py-1 font-mono bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded text-[11px] tabular-nums"
                />
              </div>

              <div className="md:col-span-4">
                <input
                  type="text"
                  value={chk.testName}
                  onChange={(e) =>
                    handleUpdateCheck(chk.id, 'testName', e.target.value)
                  }
                  placeholder="Nombre del test (ej. Estrés OCCT 30 min)"
                  className={`${compactInputClass} font-medium`}
                />
              </div>

              <div className="md:col-span-6">
                <input
                  type="text"
                  value={chk.measuredResult}
                  onChange={(e) =>
                    handleUpdateCheck(chk.id, 'measuredResult', e.target.value)
                  }
                  placeholder="Valor medido (Ej. Tª máx. 71 °C · 0 errores · Lectura 3450 MB/s). ¡Evita poner solo 'Todo OK'!"
                  className={`${compactInputClass} font-mono tabular-nums`}
                />
              </div>

              <div className="md:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleRemoveCheck(chk.id)}
                  title="Eliminar prueba QA"
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Observaciones Finales y Recomendaciones Preventivas */}
        <div className="pt-2 text-xs">
          <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-slate-700 dark:text-sky-400" />
            <span>
              Notas Finales de Entrega y Recomendaciones Preventivas para el Cliente
            </span>
          </label>
          <textarea
            rows={2}
            value={order.finalTechnicianNotes}
            onChange={(e) =>
              onChange({ ...order, finalTechnicianNotes: e.target.value })
            }
            placeholder="Ej. Se recomienda limpieza preventiva cada 18 meses. Se entrega la pieza sustituida al cliente..."
            className={inputClass}
          />
        </div>
      </section>
    </div>
  );
};
