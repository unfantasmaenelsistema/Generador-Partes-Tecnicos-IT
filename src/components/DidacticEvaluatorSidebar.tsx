import React from 'react';
import {
  AlertTriangle,
  Award,
  CheckCircle2,
  Columns,
  Eye,
  FlaskConical,
  Sparkles
} from 'lucide-react';
import { DidacticCase, DidacticReportEvaluation } from '../types/workOrder';

interface DidacticEvaluatorSidebarProps {
  evaluation: DidacticReportEvaluation;
  activeCase?: DidacticCase;
  onOpenLabForCase: () => void;
  onOpenComparisonModal: () => void;
  onLoadModelSolution: () => void;
  onLoadFlawedChallenge: () => void;
}

export const DidacticEvaluatorSidebar: React.FC<DidacticEvaluatorSidebarProps> = ({
  evaluation,
  activeCase,
  onOpenLabForCase,
  onOpenComparisonModal,
  onLoadModelSolution,
  onLoadFlawedChallenge
}) => {
  const scoreColor =
    evaluation.totalScore >= 85
      ? 'text-emerald-700 dark:text-emerald-400'
      : evaluation.totalScore >= 60
      ? 'text-amber-700 dark:text-amber-400'
      : 'text-rose-700 dark:text-rose-400';

  const barColor =
    evaluation.totalScore >= 85
      ? 'bg-emerald-600 dark:bg-emerald-500'
      : evaluation.totalScore >= 60
      ? 'bg-amber-500 dark:bg-amber-400'
      : 'bg-rose-600 dark:bg-rose-500';

  return (
    <aside className="space-y-5">
      {/* Tarjeta Principal de Evaluación Didáctica */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              AUDITORÍA DIDÁCTICA EN TIEMPO REAL
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              Rúbrica de Redacción Técnica IT
            </h3>
          </div>
          <div className={`text-2xl font-mono font-bold tabular-nums ${scoreColor}`}>
            {evaluation.totalScore}
            <span className="text-xs text-slate-400 dark:text-slate-500 font-normal">
              /100
            </span>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="space-y-1.5">
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${barColor}`}
              style={{ width: `${evaluation.totalScore}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {evaluation.gradeLabel}
            </span>
            <span className="font-mono text-slate-500 dark:text-slate-400 tabular-nums">
              {evaluation.colloquialWarnings.length === 0
                ? '0 coloquialismos'
                : `-${Math.min(15, evaluation.colloquialWarnings.length * 3)} pts jerga`}
            </span>
          </div>
        </div>

        {/* Alerta de Expresiones Coloquiales Detectadas */}
        {evaluation.colloquialWarnings.length > 0 && (
          <div className="p-3.5 bg-amber-50/90 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 rounded-md space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-950 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-700 dark:text-amber-400 shrink-0" />
              <span>
                Lenguaje Coloquial o Impreciso Detectado ({evaluation.colloquialWarnings.length})
              </span>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {evaluation.colloquialWarnings.map((warn, idx) => (
                <div
                  key={`${warn.termFound}-${idx}`}
                  className="text-xs bg-white/90 dark:bg-slate-900/90 border border-amber-200 dark:border-amber-800/60 rounded p-2.5 space-y-1"
                >
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    «{warn.termFound}»{' '}
                    <span className="text-slate-500 dark:text-slate-400 font-normal">
                      en {warn.fieldLabel}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                    {warn.reason}
                  </p>
                  <p className="text-emerald-900 dark:text-emerald-300 font-medium text-[11px]">
                    Alternativa profesional: {warn.suggestedReplacement}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Desglose de los 5 Pilares Didácticos */}
        <div className="divide-y divide-slate-200 dark:divide-slate-800 pt-1">
          {evaluation.pillars.map((pillar) => {
            const isComplete = pillar.score === pillar.maxScore;
            return (
              <div key={pillar.id} className="py-3 first:pt-1 last:pb-0 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    {isComplete ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <span className="w-3.5 h-3.5 inline-flex items-center justify-center font-mono text-[10px] text-amber-700 dark:text-amber-400 border border-amber-400 dark:border-amber-600 rounded-full shrink-0">
                        !
                      </span>
                    )}
                    {pillar.title}
                  </span>
                  <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                    {pillar.score}/{pillar.maxScore}
                  </span>
                </div>

                {pillar.missingCriteria.length > 0 ? (
                  <ul className="space-y-1 pl-5 text-[11px] text-slate-600 dark:text-slate-400 list-disc">
                    {pillar.missingCriteria.map((miss, i) => (
                      <li key={i} className="leading-snug">
                        {miss}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="pl-5 text-[11px] text-emerald-800 dark:text-emerald-400">
                    {pillar.feedback[0] || 'Criterio técnico cumplido con rigor.'}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Tarjeta de Contexto del Caso Activo y Acciones Didácticas */}
      {activeCase && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 space-y-3.5">
          <div>
            <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
              ESCENARIO VINCULADO · {activeCase.code}
            </div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-0.5">
              {activeCase.title}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 italic mt-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded">
              Queja verbal del cliente: {activeCase.clientQuoteVerbal}
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={onOpenComparisonModal}
              className="w-full px-3 py-2 text-xs font-medium text-white dark:text-slate-950 bg-slate-900 dark:bg-sky-400 hover:bg-slate-800 dark:hover:bg-sky-300 rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Columns className="w-3.5 h-3.5" />
              Comparar Lado a Lado con Solución Modelo
            </button>

            <button
              type="button"
              onClick={onOpenLabForCase}
              className="w-full px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              Ver Telemetría y Pruebas en Laboratorio
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onLoadFlawedChallenge}
                className="px-2.5 py-2 text-xs font-medium text-amber-950 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded-md transition-colors flex items-center justify-center gap-1 whitespace-nowrap shrink-0"
              >
                <Eye className="w-3.5 h-3.5" />
                Borrador Deficiente
              </button>
              <button
                type="button"
                onClick={onLoadModelSolution}
                className="px-2.5 py-2 text-xs font-medium text-emerald-950 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-md transition-colors flex items-center justify-center gap-1 whitespace-nowrap shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                Solución Modelo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sello Educativo Un Fantasma en el Sistema */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 flex items-center gap-3.5">
        <Award className="w-5 h-5 text-slate-700 dark:text-sky-400 shrink-0" />
        <div className="text-xs">
          <div className="font-semibold text-slate-900 dark:text-slate-100">
            Recurso Didáctico para Profesionales y FP IT
          </div>
          <a
            href="https://www.unfantasmaenelsistema.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-700 dark:text-sky-400 hover:underline font-mono text-[11px]"
          >
            unfantasmaenelsistema.com
          </a>
        </div>
      </div>
    </aside>
  );
};
