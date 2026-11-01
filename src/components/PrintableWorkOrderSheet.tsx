import React from 'react';
import { DidacticReportEvaluation, WorkOrder } from '../types/workOrder';
import { computeTotals, formatEur } from '../utils/workOrderTotals';

interface PrintableWorkOrderSheetProps {
  order: WorkOrder;
  evaluation?: DidacticReportEvaluation;
  includeDidacticRubric?: boolean;
}

export const PrintableWorkOrderSheet: React.FC<PrintableWorkOrderSheetProps> = ({
  order,
  evaluation,
  includeDidacticRubric = false
}) => {
  const { partsSubtotal, laborSubtotal, taxableBase, vatAmount, grandTotal } = computeTotals(order);

  const totalActionMinutes = order.correctiveActions.reduce(
    (sum, act) => sum + (Number(act.durationMinutes) || 0),
    0
  );

  const logoSrc = `${import.meta.env.BASE_URL}assets/aistudio/icono_81a3db5b.png`;

  return (
    <div className="print-sheet bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-none sm:rounded-lg p-6 sm:p-10 max-w-4xl mx-auto text-sm leading-relaxed transition-colors">
      {/* Cabecera del Documento Oficial */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-slate-900 dark:border-slate-200">
        <div className="flex items-start gap-4">
          <img
            src={logoSrc}
            alt="Logo Un Fantasma en el Sistema"
            referrerPolicy="no-referrer"
            className="w-16 h-16 object-contain shrink-0 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded p-1"
          />
          <div>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400">
              ORDEN DE TRABAJO E INFORME DE INTERVENCIÓN TÉCNICA IT
            </p>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mt-0.5">
              Un Fantasma en el Sistema
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Laboratorio de Diagnóstico Hardware, Sistemas y Mantenimiento Microinformático
            </p>
            <a
              href="https://www.unfantasmaenelsistema.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono text-sky-700 dark:text-sky-400 hover:underline mt-0.5 inline-block"
            >
              https://www.unfantasmaenelsistema.com/
            </a>
          </div>
        </div>

        <div className="sm:text-right font-mono text-xs space-y-1 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-200 dark:border-slate-800">
          <div className="text-base font-bold text-slate-900 dark:text-white tabular-nums">
            REF: {order.orderNumber || 'OT-2026-S/N'}
          </div>
          <div className="text-slate-600 dark:text-slate-300 tabular-nums">
            Recepción: {order.createdAt ? order.createdAt.replace('T', ' ') : '—'}
          </div>
          <div className="text-slate-600 dark:text-slate-300 tabular-nums">
            Cierre QA: {order.completedAt ? order.completedAt.replace('T', ' ') : '—'}
          </div>
          <div className="text-slate-700 dark:text-slate-200 font-medium">
            Estado: {order.status} · Prioridad: {order.priority}
          </div>
          <div className="text-slate-600 dark:text-slate-300">
            Técnico: {order.technicianName || 'Sin asignar'} ({order.technicianId || 'TEC'})
          </div>
        </div>
      </div>

      {/* Bloque Opcional de Calificación Didáctica (para entregas de alumnos/FP) */}
      {includeDidacticRubric && evaluation && (
        <div className="my-5 p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 rounded text-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-700">
            <div>
              <span className="font-mono text-slate-500 dark:text-slate-400 block">
                CERTIFICADO DE EVALUACIÓN DIDÁCTICA · REDACCIÓN TÉCNICA IT
              </span>
              <strong className="text-sm text-slate-900 dark:text-white">
                Dictamen: {evaluation.gradeLabel}
              </strong>
            </div>
            <div className="font-mono text-lg font-bold text-slate-900 dark:text-emerald-400 tabular-nums">
              CALIFICACIÓN: {evaluation.totalScore} / 100 PTS
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 font-mono tabular-nums">
            {evaluation.pillars.map((p) => (
              <div
                key={p.id}
                className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded"
              >
                <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                  {p.title}
                </div>
                <div className="font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {p.score} / {p.maxScore} pts
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 01. Datos de Cliente e Identificación del Equipo */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-5 border-b border-slate-200 dark:border-slate-800">
        <div className="md:col-span-5 space-y-2">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            01A. Titular y Condiciones de Recepción
          </h2>
          <dl className="text-xs space-y-1.5">
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Cliente / Contacto:</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100 text-right">
                {order.client.name || '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Entidad / Dpto.:</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100 text-right">
                {order.client.organization || 'Particular'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Teléfono / Email:</dt>
              <dd className="font-mono text-slate-800 dark:text-slate-200 text-right tabular-nums">
                {order.client.contactPhone || '—'} · {order.client.contactEmail || '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Respaldo Datos RGPD:</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100 text-right">
                {order.client.authorizedBackup ? 'Autorizado por cliente' : 'No requerido / Declinado'}
              </dd>
            </div>
            <div className="flex justify-between gap-2">
              <dt className="text-slate-500 dark:text-slate-400">Régimen Intervención:</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100 text-right">
                {order.client.warrantyClaim ? 'Trámite en Garantía / RMA' : 'Cargo Ordinario de Taller'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="md:col-span-7 space-y-2 md:border-l md:border-slate-200 dark:md:border-slate-800 md:pl-6">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            01B. Identificación Técnica del Equipo (Trazabilidad de Activo)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Categoría:</span>
              <span className="font-medium text-slate-900 dark:text-slate-100">
                {order.equipment.category}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Marca y Modelo:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">
                {order.equipment.brand} {order.equipment.model}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Número de Serie (S/N):</span>
              <span className="font-mono font-semibold text-slate-900 dark:text-sky-400 tabular-nums">
                {order.equipment.serialNumber || 'NO REGISTRADO'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Procesador (CPU):</span>
              <span className="text-slate-800 dark:text-slate-200">{order.equipment.cpu || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Memoria Principal (RAM):</span>
              <span className="text-slate-800 dark:text-slate-200">{order.equipment.ram || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Almacenamiento:</span>
              <span className="text-slate-800 dark:text-slate-200">{order.equipment.storage || '—'}</span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Placa Base / Gráficos:</span>
              <span className="text-slate-800 dark:text-slate-200">
                {order.equipment.motherboardOrGpu || '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Sistema Operativo / Firmware:</span>
              <span className="text-slate-800 dark:text-slate-200">
                {order.equipment.operatingSystem || '—'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Etiqueta Inventario:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200 tabular-nums">
                {order.equipment.assetTag || 'N/A'}
              </span>
            </div>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 text-xs space-y-1">
            <p>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Estado Estético en Recepción:{' '}
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                {order.equipment.physicalIntakeState || 'Sin observaciones registradas.'}
              </span>
            </p>
            <p>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Accesorios Entregados:{' '}
              </span>
              <span className="text-slate-800 dark:text-slate-200">
                {order.equipment.accessoriesIncluded || 'Ninguno.'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 02. Síntoma Aportado por el Usuario vs. Diagnóstico Real del Técnico */}
      <div className="py-5 border-b border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            02. Contraste de Incidencia: Declaración del Usuario vs. Diagnóstico Técnico de Causa Raíz
          </h2>
          <span className="text-xs font-mono text-slate-600 dark:text-slate-300">
            Subsistema Causa Raíz: {order.faultDiagnosis.rootCauseCategory}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              2A. Descripción del Fallo Aportada por el Usuario (Síntoma Subjetivo)
            </div>
            <p className="text-xs text-slate-800 dark:text-slate-200 italic">
              «{order.faultDiagnosis.clientSymptom || 'Sin descripción registrada.'}»
            </p>
            {order.faultDiagnosis.symptomContextAndFrequency && (
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-700">
                <span className="font-medium text-slate-700 dark:text-slate-200">
                  Condición de reproducción:{' '}
                </span>
                {order.faultDiagnosis.symptomContextAndFrequency}
              </p>
            )}
          </div>

          <div className="p-3.5 bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 rounded">
            <div className="text-xs font-semibold text-slate-900 dark:text-sky-400 mb-1">
              2B. Diagnóstico Real del Técnico (Causa Raíz Objetiva)
            </div>
            <p className="text-xs text-slate-900 dark:text-slate-100">
              {order.faultDiagnosis.technicalDiagnosis || 'Pendiente de diagnóstico técnico.'}
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded text-xs space-y-1">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Instrumentación y Herramientas Empleadas:{' '}
            </span>
            <span className="text-slate-800 dark:text-slate-200">
              {order.faultDiagnosis.diagnosticToolsUsed.length > 0
                ? order.faultDiagnosis.diagnosticToolsUsed.join(' · ')
                : 'No especificadas'}
            </span>
          </div>
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Telemetría, Códigos de Error y Mediciones:{' '}
            </span>
            <span className="font-mono text-slate-900 dark:text-sky-300 tabular-nums">
              {order.faultDiagnosis.telemetryAndErrorCodes || 'Sin telemetría registrada.'}
            </span>
          </div>
        </div>
      </div>

      {/* 03. Acciones Correctivas Aplicadas */}
      <div className="py-5 border-b border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            03. Acciones Correctivas y Procedimientos Técnicos Aplicados
          </h2>
          <span className="text-xs font-mono text-slate-600 dark:text-slate-300 tabular-nums">
            Tiempo técnico registrado: {totalActionMinutes} min
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                <th className="py-2 pr-3 font-semibold w-44">Fase / Protocolo</th>
                <th className="py-2 px-3 font-semibold w-48">Acción Técnica</th>
                <th className="py-2 px-3 font-semibold">Descripción Detallada del Procedimiento</th>
                <th className="py-2 pl-3 font-semibold text-right w-20">Tiempo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {order.correctiveActions.map((act) => (
                <tr key={act.id}>
                  <td className="py-2 pr-3 font-medium text-slate-700 dark:text-slate-300 align-top">
                    {act.stage}
                  </td>
                  <td className="py-2 px-3 font-semibold text-slate-900 dark:text-slate-100 align-top">
                    {act.actionVerb}
                  </td>
                  <td className="py-2 px-3 text-slate-800 dark:text-slate-200 align-top">
                    {act.technicalDescription}
                  </td>
                  <td className="py-2 pl-3 font-mono text-right text-slate-700 dark:text-slate-300 align-top tabular-nums">
                    {act.durationMinutes} min
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 04. Piezas Sustituidas y Liquidación */}
      <div className="py-5 border-b border-slate-200 dark:border-slate-800 space-y-3">
        <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          04. Trazabilidad de Piezas Sustituidas y Desglose Económico
        </h2>

        {order.replacedParts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                  <th className="py-2 pr-2 font-semibold">Componente / Recambio</th>
                  <th className="py-2 px-2 font-semibold">P/N o SKU</th>
                  <th className="py-2 px-2 font-semibold">Retirado vs. Instalado (S/N)</th>
                  <th className="py-2 px-2 font-semibold text-right">Garantía</th>
                  <th className="py-2 px-2 font-semibold text-right">Ud.</th>
                  <th className="py-2 pl-2 font-semibold text-right">Importe</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {order.replacedParts.map((part) => (
                  <tr key={part.id}>
                    <td className="py-2 pr-2 font-medium text-slate-900 dark:text-slate-100">
                      {part.componentName}
                      <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                        {part.condition}
                      </span>
                    </td>
                    <td className="py-2 px-2 font-mono text-slate-800 dark:text-sky-400 tabular-nums">
                      {part.partNumberOrSku || '—'}
                    </td>
                    <td className="py-2 px-2 text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                      <div>Baja: {part.removedComponentRef || '—'}</div>
                      <div>Alta: {part.installedComponentRef || '—'}</div>
                    </td>
                    <td className="py-2 px-2 font-mono text-right text-slate-700 dark:text-slate-300 tabular-nums">
                      {part.warrantyMonths} meses
                    </td>
                    <td className="py-2 px-2 font-mono text-right text-slate-700 dark:text-slate-300 tabular-nums">
                      {part.quantity}
                    </td>
                    <td className="py-2 pl-2 font-mono font-medium text-right text-slate-900 dark:text-slate-100 tabular-nums">
                      {formatEur(part.quantity * part.unitPriceEur)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-600 dark:text-slate-400 italic">
            Intervención realizada sin sustitución de repuestos de hardware.
          </p>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="text-slate-600 dark:text-slate-300 max-w-md">
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              Observaciones y Recomendaciones Preventivas:{' '}
            </span>
            {order.finalTechnicianNotes || 'Ninguna observación adicional.'}
          </div>
          <div className="w-full sm:w-64 space-y-1 font-mono tabular-nums">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal Repuestos:</span>
              <span>{formatEur(partsSubtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Mano de Obra ({order.laborHours}h × {order.hourlyRateEur}€):</span>
              <span>{formatEur(laborSubtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Base Imponible:</span>
              <span>{formatEur(taxableBase)}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>IVA ({order.vatPercent}%):</span>
              <span>{formatEur(vatAmount)}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-1 border-t border-slate-900 dark:border-slate-200">
              <span>TOTAL ORDEN:</span>
              <span>{formatEur(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 05. Prueba Final de Conformidad y Firmas */}
      <div className="pt-5 space-y-5">
        <div>
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
            05. Prueba Final de Conformidad (Control de Calidad QA Post-Intervención)
          </h2>
          <div className="border border-slate-200 dark:border-slate-700 rounded divide-y divide-slate-200 dark:divide-slate-700 text-xs">
            {order.conformityChecks.map((chk) => (
              <div
                key={chk.id}
                className="p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono font-bold text-slate-900 dark:text-emerald-400">
                    {chk.passed ? '[SUPERADO]' : '[PENDIENTE]'}
                  </span>
                  <span className="font-mono text-slate-500 dark:text-slate-400">{chk.code}</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">
                    {chk.testName}
                  </span>
                </div>
                <div className="font-mono text-slate-700 dark:text-slate-300 sm:text-right tabular-nums">
                  {chk.measuredResult || 'Sin métrica registrada'}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 text-xs">
          <div className="border border-slate-300 dark:border-slate-700 rounded p-4 h-28 flex flex-col justify-between">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              Conformidad Técnica — Especialista IT
            </div>
            <div className="flex justify-between items-end text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span>
                {order.technicianName || 'Técnico Responsable'} ({order.technicianId})
              </span>
              <span>Sello y Firma</span>
            </div>
          </div>

          <div className="border border-slate-300 dark:border-slate-700 rounded p-4 h-28 flex flex-col justify-between">
            <div className="font-semibold text-slate-700 dark:text-slate-300">
              Conformidad de Recepción y Prueba Final — Cliente
            </div>
            <div className="flex justify-between items-end text-[11px] text-slate-500 dark:text-slate-400 font-mono">
              <span>Recibido conforme: {order.client.name || 'Cliente'}</span>
              <span>Fecha y Firma</span>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center pt-2 border-t border-slate-200 dark:border-slate-800">
          Documento generado con el Entrenador Didáctico de Partes Técnicos IT · Un Fantasma en el Sistema (
          <a
            href="https://www.unfantasmaenelsistema.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-slate-700 dark:text-slate-300"
          >
            www.unfantasmaenelsistema.com
          </a>
          ) · Garantía de reparación conforme a normativa vigente.
        </div>
      </div>
    </div>
  );
};
