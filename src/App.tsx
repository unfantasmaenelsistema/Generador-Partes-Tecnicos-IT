/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Columns,
  ExternalLink,
  FileCode2,
  FilePlus2,
  Moon,
  Printer,
  Save,
  Sun,
  Wrench
} from 'lucide-react';
import { DidacticComparisonModal } from './components/DidacticComparisonModal';
import { DidacticEvaluatorSidebar } from './components/DidacticEvaluatorSidebar';
import { DiagnosticLabView } from './components/DiagnosticLabView';
import { PrintableWorkOrderSheet } from './components/PrintableWorkOrderSheet';
import { SavedOrdersArchiveView } from './components/SavedOrdersArchiveView';
import { WorkOrderFormEditor } from './components/WorkOrderFormEditor';
import { WritingGuideView } from './components/WritingGuideView';
import { createBlankWorkOrder, DIDACTIC_CASES } from './data/didacticCases';
import { DidacticCase, WorkOrder } from './types/workOrder';
import { evaluateWorkOrder } from './utils/evaluateWorkOrder';
import { downloadWorkOrderMarkdown } from './utils/exportMarkdown';

type WorkspaceTab = 'editor' | 'lab' | 'guide' | 'preview' | 'archive';

const STORAGE_KEY = 'ufees_it_work_orders_v1';
const ACTIVE_ORDER_KEY = 'ufees_active_work_order_v1';
const THEME_KEY = 'ufees_theme_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('editor');
  const [saveBanner, setSaveBanner] = useState<string | null>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState<boolean>(false);
  const [includeDidacticRubricOnPrint, setIncludeDidacticRubricOnPrint] =
    useState<boolean>(false);

  // Theme state (Light / Dark) synced with document.documentElement and localStorage
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved === 'dark') return true;
      if (saved === 'light') return false;
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    } catch {
      // Ignore storage error
    }
  }, [isDark]);

  // Initialize saved orders from localStorage or seed with model + challenge samples
  const [savedOrders, setSavedOrders] = useState<WorkOrder[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback to initial seeded orders
    }
    return [
      DIDACTIC_CASES[0].modelSolutionOrder,
      DIDACTIC_CASES[1].modelSolutionOrder,
      DIDACTIC_CASES[2].flawedDraftOrder
    ];
  });

  // Active work order being edited
  const [currentOrder, setCurrentOrder] = useState<WorkOrder>(() => {
    try {
      const raw = localStorage.getItem(ACTIVE_ORDER_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.orderNumber) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return structuredClone(DIDACTIC_CASES[0].flawedDraftOrder);
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedOrders));
    } catch {
      // Ignore quota errors
    }
  }, [savedOrders]);

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_ORDER_KEY, JSON.stringify(currentOrder));
    } catch {
      // Ignore quota errors
    }
  }, [currentOrder]);

  const evaluation = useMemo(
    () => evaluateWorkOrder(currentOrder),
    [currentOrder]
  );

  const activeCase = useMemo(
    () => DIDACTIC_CASES.find((c) => c.id === currentOrder.caseId),
    [currentOrder.caseId]
  );

  const showToast = (msg: string) => {
    setSaveBanner(msg);
    setTimeout(() => setSaveBanner(null), 2800);
  };

  const handleSaveCurrentOrder = () => {
    setSavedOrders((prev) => {
      const exists = prev.some((o) => o.id === currentOrder.id);
      if (exists) {
        return prev.map((o) => (o.id === currentOrder.id ? currentOrder : o));
      }
      return [currentOrder, ...prev];
    });
    showToast(`Orden ${currentOrder.orderNumber} guardada en el archivo local.`);
  };

  const handleSelectCaseMode = (
    didacticCase: DidacticCase,
    mode: 'flawed' | 'receptionOnly' | 'modelSolution'
  ) => {
    if (mode === 'flawed') {
      const copy = structuredClone(didacticCase.flawedDraftOrder);
      copy.id = `wo-${Date.now()}`;
      setCurrentOrder(copy);
      setActiveTab('editor');
      showToast(
        `${didacticCase.code} cargado en Modo Reto: corrige el borrador deficiente.`
      );
    } else if (mode === 'modelSolution') {
      const copy = structuredClone(didacticCase.modelSolutionOrder);
      copy.id = `wo-${Date.now()}`;
      setCurrentOrder(copy);
      setActiveTab('editor');
      showToast(
        `${didacticCase.code} cargado con la Solución Modelo del Profesor (100/100).`
      );
    } else {
      const base = structuredClone(didacticCase.modelSolutionOrder);
      const receptionOnly: WorkOrder = {
        ...base,
        id: `wo-${Date.now()}`,
        status: 'En Diagnóstico',
        technicianName: '',
        faultDiagnosis: {
          clientSymptom: base.faultDiagnosis.clientSymptom,
          symptomContextAndFrequency: '',
          diagnosticToolsUsed: [],
          telemetryAndErrorCodes: '',
          technicalDiagnosis: '',
          rootCauseCategory: base.faultDiagnosis.rootCauseCategory
        },
        correctiveActions: [
          {
            id: `ca-${Date.now()}`,
            stage: '1. Seguridad ESD y Desmontaje',
            actionVerb: 'Desmontaje y aislamiento ESD',
            technicalDescription: '',
            durationMinutes: 15
          }
        ],
        replacedParts: [],
        conformityChecks: [
          {
            id: `cc-${Date.now()}`,
            code: 'QA-01',
            testName: 'Prueba de estabilidad y verificación funcional post-reparación',
            passed: false,
            measuredResult: ''
          }
        ],
        finalTechnicianNotes: '',
        caseId: didacticCase.id
      };
      setCurrentOrder(receptionOnly);
      setActiveTab('editor');
      showToast(
        `${didacticCase.code} iniciado en Recepción: investiga en el Laboratorio y redacta el parte.`
      );
    }
  };

  const handleCreateBlank = () => {
    const nextSeq = 200 + savedOrders.length + 1;
    const blank = createBlankWorkOrder(nextSeq);
    setCurrentOrder(blank);
    setActiveTab('editor');
    showToast(`Nueva Orden en Blanco (${blank.orderNumber}) lista para redactar.`);
  };

  const handleAppendTelemetryFromLab = (metricText: string, toolName: string) => {
    setCurrentOrder((prev) => {
      const existingTelemetry = prev.faultDiagnosis.telemetryAndErrorCodes.trim();
      const updatedTelemetry = existingTelemetry
        ? `${existingTelemetry} · ${metricText}`
        : metricText;
      const tools = prev.faultDiagnosis.diagnosticToolsUsed;
      return {
        ...prev,
        faultDiagnosis: {
          ...prev.faultDiagnosis,
          telemetryAndErrorCodes: updatedTelemetry,
          diagnosticToolsUsed: tools
        }
      };
    });
    showToast(`Telemetría de "${toolName}" añadida al Parte Técnico activo.`);
  };

  const handleInsertActionTemplate = (verb: string, description: string) => {
    setCurrentOrder((prev) => ({
      ...prev,
      correctiveActions: [
        ...prev.correctiveActions,
        {
          id: `ca-${Date.now()}`,
          stage: '2. Intervención de Hardware',
          actionVerb: verb,
          technicalDescription: description,
          durationMinutes: 25
        }
      ]
    }));
    setActiveTab('editor');
    showToast(`Acción técnica "${verb}" insertada en la Orden de Trabajo.`);
  };

  const handleApplyModelSection = (
    section:
      | 'equipment'
      | 'faultDiagnosis'
      | 'correctiveActions'
      | 'replacedParts'
      | 'conformityChecks'
  ) => {
    if (!activeCase) return;
    const model = activeCase.modelSolutionOrder;
    setCurrentOrder((prev) => ({
      ...prev,
      [section]: structuredClone(model[section])
    }));
    showToast('Sección actualizada con la Solución Modelo del Profesor.');
  };

  const handlePrintOrder = () => {
    window.print();
  };

  const logoSrc = `${import.meta.env.BASE_URL}assets/aistudio/icono_81a3db5b.png`;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-150">
      {/* Top Bar Contract: 3 Zones separated by gap-8 */}
      <header className="no-print sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-3.5 flex items-center justify-between gap-8 transition-colors">
        {/* Zone 1: Single-line Brand Wordmark + User Logo */}
        <a
          href="https://www.unfantasmaenelsistema.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 text-base font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0"
        >
          <img
            src={logoSrc}
            alt="Un Fantasma en el Sistema"
            referrerPolicy="no-referrer"
            className="w-8 h-8 object-contain shrink-0"
          />
          <span>Un Fantasma en el Sistema</span>
        </a>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-400">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'editor'
                ? 'text-slate-900 dark:text-white border-slate-900 dark:border-sky-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Formulario de Parte
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('lab')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'lab'
                ? 'text-slate-900 dark:text-white border-slate-900 dark:border-sky-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Laboratorio de Diagnóstico
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'guide'
                ? 'text-slate-900 dark:text-white border-slate-900 dark:border-sky-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Guía de Redacción
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'preview'
                ? 'text-slate-900 dark:text-white border-slate-900 dark:border-sky-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Vista Previa A4
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('archive')}
            className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
              activeTab === 'archive'
                ? 'text-slate-900 dark:text-white border-slate-900 dark:border-sky-400 font-semibold'
                : 'border-transparent hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Archivo ({savedOrders.length})
          </button>
        </nav>

        {/* Zone 3: Theme Toggle + Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            title={isDark ? 'Modo Claro' : 'Modo Oscuro'}
            className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            {isDark ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700" />
                <span className="hidden sm:inline">Oscuro</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrintOrder}
            className="px-4 py-2 text-xs font-medium text-white dark:text-slate-950 bg-slate-900 dark:bg-sky-400 rounded-lg hover:bg-slate-800 dark:hover:bg-sky-300 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            Imprimir / PDF A4
          </button>
        </div>
      </header>

      {/* Sub-barra de Navegación Móvil */}
      <div className="no-print md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto">
        {(
          [
            { id: 'editor', label: 'Formulario' },
            { id: 'lab', label: 'Laboratorio' },
            { id: 'guide', label: 'Guía Redacción' },
            { id: 'preview', label: 'Documento A4' },
            { id: 'archive', label: `Archivo (${savedOrders.length})` }
          ] as { id: WorkspaceTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 ${
              activeTab === tab.id
                ? 'bg-slate-900 dark:bg-sky-400 text-white dark:text-slate-950'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Workspace Context & Didactic Scenario Toolbar */}
      <div className="no-print bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Metadata Line (Zero-Pill Unboxed Typography with separators) */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <span className="font-semibold text-slate-900 dark:text-slate-100">
              Generador de Partes Técnicos y Órdenes de Trabajo IT
            </span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-800 dark:text-sky-400 tabular-nums">
              {currentOrder.orderNumber}
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Calidad de Redacción:{' '}
              <strong className="font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                {evaluation.totalScore}/100 pts
              </strong>
            </span>
            <span aria-hidden="true">·</span>
            <a
              href="https://www.unfantasmaenelsistema.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-700 dark:text-sky-400 hover:underline inline-flex items-center gap-1 font-medium"
            >
              <span>unfantasmaenelsistema.com</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Selector Rápido de Escenarios y Utilidades de Taller */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={currentOrder.caseId || ''}
              onChange={(e) => {
                const val = e.target.value;
                if (!val) {
                  handleCreateBlank();
                } else {
                  const found = DIDACTIC_CASES.find((c) => c.id === val);
                  if (found) handleSelectCaseMode(found, 'flawed');
                }
              }}
              aria-label="Seleccionar caso práctico de taller"
              className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:border-slate-900 dark:focus:border-sky-400"
            >
              <option value="">Modo Libre — Parte en Blanco</option>
              {DIDACTIC_CASES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}: {c.title.slice(0, 48)}...
                </option>
              ))}
            </select>

            {activeCase && (
              <button
                type="button"
                onClick={() => setIsComparisonOpen(true)}
                className="px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <Columns className="w-3.5 h-3.5" />
                Comparar con Modelo
              </button>
            )}

            <button
              type="button"
              onClick={handleCreateBlank}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <FilePlus2 className="w-3.5 h-3.5" />
              Parte en Blanco
            </button>

            <button
              type="button"
              onClick={handleSaveCurrentOrder}
              className="px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              Guardar Parte
            </button>

            <button
              type="button"
              onClick={() => downloadWorkOrderMarkdown(currentOrder)}
              className="px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              Exportar .MD
            </button>
          </div>
        </div>
      </div>

      {/* Notificación de Acción */}
      {saveBanner && (
        <div className="no-print bg-slate-900 dark:bg-sky-950 border-b border-transparent dark:border-sky-800 text-white text-xs px-6 py-2.5">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              {saveBanner}
            </span>
            <button
              type="button"
              onClick={() => setSaveBanner(null)}
              className="text-slate-400 hover:text-white"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Contenedor Principal (1440px) */}
      <main className="no-print flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Columna Izquierda: Formulario de Taller IT (8 cols) */}
            <div className="lg:col-span-8">
              <WorkOrderFormEditor
                order={currentOrder}
                onChange={setCurrentOrder}
              />
            </div>

            {/* Columna Derecha: Evaluador Didáctico en Tiempo Real (4 cols) */}
            <div className="lg:col-span-4 lg:sticky lg:top-20">
              <DidacticEvaluatorSidebar
                evaluation={evaluation}
                activeCase={activeCase}
                onOpenLabForCase={() => setActiveTab('lab')}
                onOpenComparisonModal={() => setIsComparisonOpen(true)}
                onLoadModelSolution={() => {
                  if (activeCase) handleSelectCaseMode(activeCase, 'modelSolution');
                }}
                onLoadFlawedChallenge={() => {
                  if (activeCase) handleSelectCaseMode(activeCase, 'flawed');
                }}
              />
            </div>
          </div>
        )}

        {activeTab === 'lab' && (
          <DiagnosticLabView
            activeCaseId={currentOrder.caseId || DIDACTIC_CASES[0].id}
            onSelectCaseMode={handleSelectCaseMode}
            onAppendTelemetryToOrder={handleAppendTelemetryFromLab}
          />
        )}

        {activeTab === 'guide' && (
          <WritingGuideView
            onInsertActionTemplate={handleInsertActionTemplate}
          />
        )}

        {activeTab === 'preview' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 max-w-4xl mx-auto">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Vista Previa Oficial de Orden de Trabajo (Formato A4)
                </div>
                <label className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeDidacticRubricOnPrint}
                    onChange={(e) =>
                      setIncludeDidacticRubricOnPrint(e.target.checked)
                    }
                    className="rounded border-slate-300 dark:border-slate-600 text-slate-900 dark:text-sky-500 focus:ring-slate-900"
                  />
                  <span>
                    Incluir Certificado de Calificación Didáctica ({evaluation.totalScore}/100 pts) en la hoja A4 (para entrega al profesor)
                  </span>
                </label>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  Volver al Editor
                </button>
                <button
                  type="button"
                  onClick={handlePrintOrder}
                  className="px-3.5 py-1.5 text-xs font-medium text-white dark:text-slate-950 bg-slate-900 dark:bg-sky-400 hover:bg-slate-800 dark:hover:bg-sky-300 rounded-md whitespace-nowrap shrink-0 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Imprimir Documento A4
                </button>
              </div>
            </div>

            <PrintableWorkOrderSheet
              order={currentOrder}
              evaluation={evaluation}
              includeDidacticRubric={includeDidacticRubricOnPrint}
            />
          </div>
        )}

        {activeTab === 'archive' && (
          <SavedOrdersArchiveView
            savedOrders={savedOrders}
            activeOrderId={currentOrder.id}
            onLoadOrder={(ord) => {
              setCurrentOrder(structuredClone(ord));
              setActiveTab('editor');
              showToast(`Orden ${ord.orderNumber} cargada en el editor.`);
            }}
            onDeleteOrder={(id) => {
              setSavedOrders((prev) => prev.filter((o) => o.id !== id));
              showToast('Orden eliminada del archivo local.');
            }}
            onImportOrders={(imported) => {
              setSavedOrders((prev) => {
                const map = new Map<string, WorkOrder>();
                prev.forEach((o) => map.set(o.id, o));
                imported.forEach((o) =>
                  map.set(o.id || `wo-${Date.now()}-${Math.random()}`, o)
                );
                return Array.from(map.values());
              });
            }}
            onCreateBlankOrder={handleCreateBlank}
          />
        )}
      </main>

      {/* Modal Comparador Lado a Lado */}
      {isComparisonOpen && activeCase && (
        <DidacticComparisonModal
          currentOrder={currentOrder}
          activeCase={activeCase}
          evaluation={evaluation}
          onClose={() => setIsComparisonOpen(false)}
          onApplyModelSection={handleApplyModelSection}
        />
      )}

      {/* Hoja A4 exclusiva para Impresión (@media print) cuando el usuario imprime desde cualquier pestaña */}
      <div className="hidden print-only">
        <PrintableWorkOrderSheet
          order={currentOrder}
          evaluation={evaluation}
          includeDidacticRubric={includeDidacticRubricOnPrint}
        />
      </div>

      {/* Footer con Branding e Identidad de Un Fantasma en el Sistema */}
      <footer className="no-print bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12 transition-colors">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <img
              src={logoSrc}
              alt="Logo Un Fantasma en el Sistema"
              referrerPolicy="no-referrer"
              className="w-9 h-9 object-contain shrink-0"
            />
            <div>
              <div className="font-bold text-slate-900 dark:text-slate-100">
                Un Fantasma en el Sistema — Generador Didáctico de Partes Técnicos y Órdenes de Trabajo IT
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                Entrenamiento de redacción técnica precisa: trazabilidad S/N, síntoma vs. diagnóstico real, acciones correctivas, repuestos y conformidad QA.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <a
              href="https://www.unfantasmaenelsistema.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 font-medium text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <span>Visitar www.unfantasmaenelsistema.com</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
