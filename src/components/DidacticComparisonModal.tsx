import React from 'react';
import { CheckCircle2, FileCheck2, Sparkles, X } from 'lucide-react';
import {
  DidacticCase,
  DidacticReportEvaluation,
  WorkOrder
} from '../types/workOrder';

interface DidacticComparisonModalProps {
  currentOrder: WorkOrder;
  activeCase: DidacticCase;
  evaluation: DidacticReportEvaluation;
  onClose: () => void;
  onApplyModelSection: (
    section: 'equipment' | 'faultDiagnosis' | 'correctiveActions' | 'replacedParts' | 'conformityChecks'
  ) => void;
}

export const DidacticComparisonModal: React.FC<DidacticComparisonModalProps> = ({
  currentOrder,
  activeCase,
  evaluation,
  onClose,
  onApplyModelSection
}) => {
  const model = activeCase.modelSolutionOrder;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-slate-50 dark:bg-slate-800/80">
          <div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              COMPARADOR PEDAGÓGICO DE REDACCIÓN TÉCNICA · {activeCase.code}
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Tu Orden Actual ({evaluation.totalScore}/100 pts) vs. Solución Modelo del Profesor (100/100 pts)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenido Comparativo por Secciones */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-800 dark:text-slate-200">
          {/* 1. Identificación */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100">
                01. Identificación del Equipo y Estado en Recepción
              </span>
              <button
                type="button"
                onClick={() => onApplyModelSection('equipment')}
                className="px-2.5 py-1 text-xs font-medium text-emerald-950 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950 border border-transparent dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-900 rounded transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Aplicar Identificación Modelo
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
              <div className="p-4 space-y-1.5 bg-white dark:bg-slate-900">
                <div className="font-semibold text-slate-500 dark:text-slate-400">
                  TU REDACCIÓN ACTUAL:
                </div>
                <div>
                  <strong>Equipo:</strong> {currentOrder.equipment.brand}{' '}
                  {currentOrder.equipment.model} · <strong>S/N:</strong>{' '}
                  <span className="font-mono">{currentOrder.equipment.serialNumber}</span>
                </div>
                <div>
                  <strong>Specs:</strong> {currentOrder.equipment.cpu} ·{' '}
                  {currentOrder.equipment.ram} · {currentOrder.equipment.storage}
                </div>
                <div>
                  <strong>Recepción:</strong> {currentOrder.equipment.physicalIntakeState}
                </div>
                <div>
                  <strong>Accesorios:</strong> {currentOrder.equipment.accessoriesIncluded}
                </div>
              </div>

              <div className="p-4 space-y-1.5 bg-emerald-50/30 dark:bg-emerald-950/20">
                <div className="font-semibold text-emerald-900 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  SOLUCIÓN MODELO PROFESIONAL:
                </div>
                <div>
                  <strong>Equipo:</strong> {model.equipment.brand} {model.equipment.model} ·{' '}
                  <strong>S/N:</strong>{' '}
                  <span className="font-mono">{model.equipment.serialNumber}</span>
                </div>
                <div>
                  <strong>Specs:</strong> {model.equipment.cpu} · {model.equipment.ram} ·{' '}
                  {model.equipment.storage}
                </div>
                <div>
                  <strong>Recepción:</strong> {model.equipment.physicalIntakeState}
                </div>
                <div>
                  <strong>Accesorios:</strong> {model.equipment.accessoriesIncluded}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Síntoma vs Diagnóstico */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100">
                02. Contraste Síntoma del Cliente vs. Diagnóstico Real del Técnico
              </span>
              <button
                type="button"
                onClick={() => onApplyModelSection('faultDiagnosis')}
                className="px-2.5 py-1 text-xs font-medium text-emerald-950 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950 border border-transparent dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-900 rounded transition-colors flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Aplicar Diagnóstico Modelo
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
              <div className="p-4 space-y-2 bg-white dark:bg-slate-900">
                <div className="font-semibold text-slate-500 dark:text-slate-400">
                  TU REDACCIÓN ACTUAL:
                </div>
                <div>
                  <strong>Síntoma (2A):</strong> {currentOrder.faultDiagnosis.clientSymptom}
                </div>
                <div>
                  <strong>Telemetría:</strong>{' '}
                  <span className="font-mono">
                    {currentOrder.faultDiagnosis.telemetryAndErrorCodes}
                  </span>
                </div>
                <div>
                  <strong>Diagnóstico (2B):</strong>{' '}
                  {currentOrder.faultDiagnosis.technicalDiagnosis}
                </div>
              </div>

              <div className="p-4 space-y-2 bg-emerald-50/30 dark:bg-emerald-950/20">
                <div className="font-semibold text-emerald-900 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  SOLUCIÓN MODELO PROFESIONAL:
                </div>
                <div>
                  <strong>Síntoma (2A):</strong> {model.faultDiagnosis.clientSymptom}
                </div>
                <div>
                  <strong>Telemetría:</strong>{' '}
                  <span className="font-mono">
                    {model.faultDiagnosis.telemetryAndErrorCodes}
                  </span>
                </div>
                <div>
                  <strong>Diagnóstico (2B):</strong>{' '}
                  {model.faultDiagnosis.technicalDiagnosis}
                </div>
              </div>
            </div>
          </div>

          {/* 3. Acciones Correctivas y 5. Conformidad QA */}
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-slate-100">
                03 & 05. Acciones Correctivas y Prueba Final de Conformidad (QA)
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onApplyModelSection('correctiveActions')}
                  className="px-2.5 py-1 text-xs font-medium text-emerald-950 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950 border border-transparent dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-900 rounded transition-colors"
                >
                  Aplicar Acciones Modelo
                </button>
                <button
                  type="button"
                  onClick={() => onApplyModelSection('conformityChecks')}
                  className="px-2.5 py-1 text-xs font-medium text-emerald-950 dark:text-emerald-200 bg-emerald-100 dark:bg-emerald-950 border border-transparent dark:border-emerald-800 hover:bg-emerald-200 dark:hover:bg-emerald-900 rounded transition-colors"
                >
                  Aplicar Pruebas QA Modelo
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-700">
              <div className="p-4 space-y-2 bg-white dark:bg-slate-900">
                <div className="font-semibold text-slate-500 dark:text-slate-400">
                  TUS ACCIONES Y QA:
                </div>
                <ul className="list-disc pl-4 space-y-1">
                  {currentOrder.correctiveActions.map((a) => (
                    <li key={a.id}>
                      <strong>{a.actionVerb}:</strong> {a.technicalDescription}
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  <strong>Pruebas QA:</strong>
                  <ul className="list-disc pl-4 mt-1 space-y-1 font-mono">
                    {currentOrder.conformityChecks.map((c) => (
                      <li key={c.id}>
                        {c.code}: {c.measuredResult}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="p-4 space-y-2 bg-emerald-50/30 dark:bg-emerald-950/20">
                <div className="font-semibold text-emerald-900 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ACCIONES Y QA DEL PROFESOR:
                </div>
                <ul className="list-disc pl-4 space-y-1">
                  {model.correctiveActions.map((a) => (
                    <li key={a.id}>
                      <strong>{a.actionVerb}:</strong> {a.technicalDescription}
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-800/60">
                  <strong>Pruebas QA Cuantificadas:</strong>
                  <ul className="list-disc pl-4 mt-1 space-y-1 font-mono">
                    {model.conformityChecks.map((c) => (
                      <li key={c.id}>
                        {c.code}: {c.measuredResult}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pie del Modal */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
            <FileCheck2 className="w-4 h-4 text-slate-700 dark:text-sky-400" />
            Compara cómo cada afirmación del modelo se respalda con una magnitud física o referencia P/N.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-medium text-white dark:text-slate-950 bg-slate-900 dark:bg-sky-400 hover:bg-slate-800 dark:hover:bg-sky-300 rounded-md"
          >
            Volver al Editor
          </button>
        </div>
      </div>
    </div>
  );
};
