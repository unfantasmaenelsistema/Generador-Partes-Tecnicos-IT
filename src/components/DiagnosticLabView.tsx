import React, { useState } from 'react';
import {
  CheckCircle2,
  FileWarning,
  FlaskConical,
  Play,
  Sparkles,
  Terminal,
  Wrench
} from 'lucide-react';
import { DIDACTIC_CASES } from '../data/didacticCases';
import { DidacticCase, LabProbe } from '../types/workOrder';

interface DiagnosticLabViewProps {
  activeCaseId: string;
  onSelectCaseMode: (
    didacticCase: DidacticCase,
    mode: 'flawed' | 'receptionOnly' | 'modelSolution'
  ) => void;
  onAppendTelemetryToOrder: (metricText: string, toolName: string) => void;
}

export const DiagnosticLabView: React.FC<DiagnosticLabViewProps> = ({
  activeCaseId,
  onSelectCaseMode,
  onAppendTelemetryToOrder
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(
    activeCaseId || DIDACTIC_CASES[0].id
  );
  const [executedProbes, setExecutedProbes] = useState<Record<string, boolean>>({
    [DIDACTIC_CASES[0].labProbes[0].id]: true
  });
  const [copiedMetric, setCopiedMetric] = useState<string | null>(null);

  const currentCase =
    DIDACTIC_CASES.find((c) => c.id === selectedCaseId) || DIDACTIC_CASES[0];

  const handleRunProbe = (probeId: string) => {
    setExecutedProbes((prev) => ({ ...prev, [probeId]: true }));
  };

  const handleRunAllProbes = () => {
    const next: Record<string, boolean> = { ...executedProbes };
    currentCase.labProbes.forEach((p) => {
      next[p.id] = true;
    });
    setExecutedProbes(next);
  };

  const handleSendMetric = (probe: LabProbe) => {
    const summaryLine = `[${probe.toolName}] ${probe.keyMetricsToCite.join(' · ')}`;
    onAppendTelemetryToOrder(summaryLine, probe.toolName);
    setCopiedMetric(probe.id);
    setTimeout(() => setCopiedMetric(null), 1800);
  };

  return (
    <div className="space-y-8">
      {/* Cabecera del Banco de Diagnóstico */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              SIMULADOR DE BANCO DE TALLER · ENTRENAMIENTO DE DIAGNÓSTICO CAUSA RAÍZ
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              Laboratorio de Casos Prácticos e Instrumentación IT
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
              Selecciona un escenario real de soporte técnico, ejecuta las pruebas de banco para obtener telemetría objetiva (S/N, SMART, temperaturas, tensiones o logs) y traslada los hallazgos al parte de trabajo.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRunAllProbes}
              className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              Ejecutar Todas las Pruebas del Caso
            </button>
          </div>
        </div>

        {/* Selector de Casos Didácticos */}
        <div className="mt-5">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2.5">
            Selecciona el Escenario de Taller ({DIDACTIC_CASES.length} casos curriculares disponibles):
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {DIDACTIC_CASES.map((item) => {
              const isSelected = item.id === currentCase.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedCaseId(item.id);
                    setExecutedProbes((prev) => ({
                      ...prev,
                      [item.labProbes[0].id]: true
                    }));
                  }}
                  className={`text-left p-4 rounded-lg border transition-colors ${
                    isSelected
                      ? 'bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 border-slate-900 dark:border-sky-400'
                      : 'bg-slate-50 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono opacity-80">
                    <span>
                      {item.code} · {item.difficulty}
                    </span>
                    <span>{item.id === activeCaseId ? '[ACTIVO]' : ''}</span>
                  </div>
                  <div className="text-xs font-semibold mt-1.5 line-clamp-2 leading-snug">
                    {item.title}
                  </div>
                  <div
                    className={`text-[11px] mt-2 ${
                      isSelected
                        ? 'text-slate-300 dark:text-slate-800'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Módulo: {item.moduleTag}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detalle del Caso Seleccionado y Modos de Práctica */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda: Contexto Pedagógico y Recepción */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-5">
          <div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {currentCase.code} · {currentCase.difficulty} · {currentCase.moduleTag}
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
              {currentCase.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
              {currentCase.summary}
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg space-y-1.5">
            <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Declaración Literal del Cliente en Mostrador (Síntoma Subjetivo)
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
              {currentCase.clientQuoteVerbal}
            </p>
          </div>

          <div className="p-4 bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/80 rounded-lg space-y-1.5">
            <div className="text-xs font-semibold text-sky-950 dark:text-sky-200">
              Objetivo Didáctico de Redacción
            </div>
            <p className="text-xs text-sky-900 dark:text-sky-300 leading-relaxed">
              {currentCase.learningObjective}
            </p>
          </div>

          {/* Botonera de Modos de Carga en el Editor */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Cargar este Escenario en el Formulario de Orden de Trabajo:
            </div>

            <button
              type="button"
              onClick={() => onSelectCaseMode(currentCase, 'flawed')}
              className="w-full p-3 text-left rounded-lg border border-amber-300 dark:border-amber-800 bg-amber-50/70 dark:bg-amber-950/40 hover:bg-amber-100/70 dark:hover:bg-amber-900/50 transition-colors flex items-start gap-3"
            >
              <FileWarning className="w-4 h-4 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-amber-950 dark:text-amber-200">
                  Modo 1: Corregir Parte Deficiente (Reto de Redacción)
                </div>
                <div className="text-xs text-amber-900 dark:text-amber-300/90 mt-0.5">
                  Carga un borrador con errores típicos (lenguaje coloquial, S/N omitido, diagnóstico ambiguo) para que lo corrijas hasta alcanzar nivel profesional.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectCaseMode(currentCase, 'receptionOnly')}
              className="w-full p-3 text-left rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors flex items-start gap-3"
            >
              <Wrench className="w-4 h-4 text-slate-800 dark:text-sky-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  Modo 2: Investigar y Redactar desde Recepción
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Carga solo los datos de entrada del cliente y su queja inicial; tú redactas desde cero el diagnóstico técnico, acciones, repuestos y QA.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => onSelectCaseMode(currentCase, 'modelSolution')}
              className="w-full p-3 text-left rounded-lg border border-emerald-300 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/40 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/50 transition-colors flex items-start gap-3"
            >
              <Sparkles className="w-4 h-4 text-emerald-800 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-emerald-950 dark:text-emerald-200">
                  Modo 3: Examinar Solución Modelo del Profesor (100/100)
                </div>
                <div className="text-xs text-emerald-900 dark:text-emerald-300/90 mt-0.5">
                  Carga el parte técnico ejemplar completo con terminología precisa, métricas verificables y desglose de garantías.
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Columna Derecha: Pruebas Interactivas de Banco */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-slate-700 dark:text-sky-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Pruebas de Diagnóstico en Banco ({currentCase.labProbes.length} verificaciones disponibles)
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Haz clic en cada prueba para inspeccionar el hardware
              </span>
            </div>

            <div className="divide-y divide-slate-200 dark:divide-slate-800 mt-2">
              {currentCase.labProbes.map((probe, idx) => {
                const isExecuted = !!executedProbes[probe.id];
                const isCopied = copiedMetric === probe.id;

                return (
                  <div key={probe.id} className="py-4 first:pt-2 last:pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                          PRUEBA 0{idx + 1} · {probe.category}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {probe.toolName}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                          Procedimiento: {probe.commandOrProcedure}
                        </p>
                      </div>

                      {!isExecuted ? (
                        <button
                          type="button"
                          onClick={() => handleRunProbe(probe.id)}
                          className="px-3.5 py-2 text-xs font-medium text-white dark:text-slate-950 bg-slate-900 dark:bg-sky-400 hover:bg-slate-800 dark:hover:bg-sky-300 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
                        >
                          <Terminal className="w-3.5 h-3.5" />
                          Ejecutar Diagnóstico
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendMetric(probe)}
                          className="px-3 py-1.5 text-xs font-medium text-sky-900 dark:text-sky-200 bg-sky-100 dark:bg-sky-950 border border-transparent dark:border-sky-800 hover:bg-sky-200 dark:hover:bg-sky-900 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {isCopied
                            ? 'Añadido a Telemetría del Parte'
                            : 'Enviar Hallazgos al Parte Activo'}
                        </button>
                      )}
                    </div>

                    {isExecuted && (
                      <div className="mt-3 space-y-2.5">
                        <pre className="p-3.5 bg-slate-900 dark:bg-slate-950 border border-transparent dark:border-slate-800 text-slate-100 rounded-md text-xs font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed">
                          {probe.rawOutput}
                        </pre>
                        <div className="p-3 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="text-slate-700 dark:text-slate-300">
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              Pista para tu Redacción Técnica:{' '}
                            </span>
                            {probe.interpretationHint}
                          </div>
                          <div className="font-mono text-slate-600 dark:text-sky-400 shrink-0">
                            Claves: {probe.keyMetricsToCite.join(' · ')}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Resumen de Comparación Pedagógica del Caso */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
            <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">
              Contraste Didáctico del Caso: Redacción Deficiente vs. Redacción Profesional IT
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/80 rounded-md space-y-1.5">
                <div className="font-semibold text-rose-950 dark:text-rose-200">
                  Ejemplo de Redacción Imprecisa (Evitar)
                </div>
                <p className="text-rose-900 dark:text-rose-300 italic">
                  «{currentCase.flawedDraftOrder.faultDiagnosis.technicalDiagnosis}»
                </p>
                <p className="text-rose-800 dark:text-rose-300/80 pt-1 border-t border-rose-200/70 dark:border-rose-800/60">
                  Acción mal documentada: «{currentCase.flawedDraftOrder.correctiveActions[0]?.technicalDescription}»
                </p>
              </div>

              <div className="p-3.5 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-md space-y-1.5">
                <div className="font-semibold text-emerald-950 dark:text-emerald-200">
                  Ejemplo de Redacción Técnica Profesional (Objetivo)
                </div>
                <p className="text-emerald-950 dark:text-emerald-200">
                  «{currentCase.modelSolutionOrder.faultDiagnosis.technicalDiagnosis}»
                </p>
                <p className="text-emerald-900 dark:text-emerald-300/90 pt-1 border-t border-emerald-200/70 dark:border-emerald-800/60">
                  Prueba QA cuantificada: «{currentCase.modelSolutionOrder.conformityChecks[0]?.measuredResult}»
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
