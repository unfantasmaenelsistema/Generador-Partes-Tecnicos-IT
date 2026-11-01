import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  HelpCircle,
  Search,
  XCircle
} from 'lucide-react';
import {
  DIDACTIC_QUIZ_QUESTIONS,
  TECHNICAL_ACTION_VERBS
} from '../data/didacticCases';

interface GlossaryTranslation {
  id: string;
  category: 'Térmico' | 'Almacenamiento' | 'Eléctrico / Placa' | 'Memoria / Vídeo' | 'Red / Sistema';
  userOrColloquialPhrase: string;
  professionalDiagnosisPhrase: string;
  professionalActionPhrase: string;
  qaVerificationMetric: string;
}

const TECHNICAL_TRANSLATIONS: GlossaryTranslation[] = [
  {
    id: 'tr-1',
    category: 'Térmico',
    userOrColloquialPhrase: '«Se calienta muchísimo, hace ruido el ventilador y se apaga solo.» / «Le quité la pelusa y le eché pasta nueva.»',
    professionalDiagnosisPhrase: 'Estrangulamiento térmico severo (Thermal Throttling / PROCHOT#) y apagado de protección (THERMTRIP# a 100 °C) por obstrucción de aletas del radiador, cristalización de pasta térmica y holgura axial en rodamiento de turbina PWM.',
    professionalActionPhrase: 'Desmontaje del conjunto disipador bajo protocolo ESD, desobstrucción con aire seco comprimido, limpieza con alcohol isopropílico IPA 99.9% y aplicación de compuesto térmico de alta conductividad (8.5 W/m·K).',
    qaVerificationMetric: 'Supera test de estrés OCCT (30 min al 100% TDP) con Tª máxima de 74 °C (reducción de 26 °C) y régimen PWM estable.'
  },
  {
    id: 'tr-2',
    category: 'Almacenamiento',
    userOrColloquialPhrase: '«Va súper lento al abrir carpetas y el disco sale en amarillo/rojo en el programa.» / «El disco duro estaba roto.»',
    professionalDiagnosisPhrase: 'Degradación física de superficie magnética / celdas NAND con presencia de sectores reasignados (SMART ID 05) y sectores pendientes inestables (SMART ID C5), provocando timeouts de E/S en el bus AHCI/NVMe (Eventos ID 7 y 153).',
    professionalActionPhrase: 'Clonación forense sector a sector en modo solo lectura mediante ddrescue, sustitución física por unidad SSD/NVMe de grado certificado y verificación de integridad del sistema de archivos NTFS/GPT.',
    qaVerificationMetric: 'Estado SMART 100% Saludable (0 errores CRC/Reasignados) · Velocidad secuencial verificada: 3.450 MB/s lectura / 3.100 MB/s escritura.'
  },
  {
    id: 'tr-3',
    category: 'Eléctrico / Placa',
    userOrColloquialPhrase: '«No carga si no doblo el cable del cargador.» / «El agujerito del cargador estaba suelto y lo soldé.»',
    professionalDiagnosisPhrase: 'Interrupción intermitente en la etapa de entrada DC (+19.0V) por fractura de soldadura (soldadura fría) por fatiga mecánica en el terminal positivo del zócalo DC-Jack y sobrecalentamiento por resistencia de contacto (efecto Joule).',
    professionalActionPhrase: 'Extracción de placa base, desoldado del zócalo DC-Jack deteriorado, limpieza de pads de cobre y soldadura de conector OEM nuevo con aleación Sn99Ag0.3Cu0.7 y refuerzo de anclajes mecánicos.',
    qaVerificationMetric: 'Tensión de entrada constante a 19.12 V DC ante esfuerzo lateral moderado · Corriente de carga estable a 2.15 A · Tª en conector < 35 °C.'
  },
  {
    id: 'tr-4',
    category: 'Memoria / Vídeo',
    userOrColloquialPhrase: '«Enciende las luces pero la pantalla se queda en negro.» / «Una memoria estaba rota o suelta.»',
    professionalDiagnosisPhrase: 'Fallo de inicialización en secuencia Power-On Self-Test (POST) retenido en fase DRAM (indicador EZ-Debug DRAM activo) debido a errores de celda de memoria detectados en el módulo DIMM (canal A2) incluso a perfil base JEDEC.',
    professionalActionPhrase: 'Limpieza de contactos de zócalos DIMM con dieléctrico de residuo cero, sustitución del kit emparejado Dual-Channel DDR4/DDR5, actualización de microcódigo UEFI/AGESA y configuración de perfil XMP/EXPO.',
    qaVerificationMetric: 'Supera 4 pasadas completas de MemTest86+ v7.0 (13 tests) con 0 errores de memoria · Tiempo de POST: 12 segundos.'
  },
  {
    id: 'tr-5',
    category: 'Red / Sistema',
    userOrColloquialPhrase: '«No podemos entrar a las carpetas del servidor desde que cambiaron el router y la caja pita.»',
    professionalDiagnosisPhrase: 'Pérdida de conectividad a recursos SMB por desalineación de direccionamiento IPv4 tras cambio de puerta de enlace del ISP, concurrente con degradación del volumen RAID 1 por caída de la unidad de la Bahía 2 tras corte eléctrico.',
    professionalActionPhrase: 'Alineación de rango LAN y reserva DHCP estática para el servidor NAS, sustitución Hot-Swap del disco degradado por unidad CMR para NAS y reconstrucción completa con verificación de sumas Btrfs (Data Scrubbing).',
    qaVerificationMetric: 'Matriz RAID 1 en estado SALUDABLE (100% resincronizada) · Latencia ICMP < 1 ms · Transferencia SMB3 sostenida a 112 MB/s.'
  },
  {
    id: 'tr-6',
    category: 'Eléctrico / Placa',
    userOrColloquialPhrase: '«Sale pantallazo azul al exportar vídeo 4K, seguro que la gráfica está rota.»',
    professionalDiagnosisPhrase: 'Fallo de tiempo de espera del controlador gráfico (BugCheck 0x116 VIDEO_TDR_FAILURE) originado por caída de tensión en el raíl +12V PCIe de la fuente ATX (11.08 V < 11.40 V mín.) y rizado superior a 160 mVpp bajo carga transitoria.',
    professionalActionPhrase: 'Sustitución de fuente conmutada por unidad ATX 3.0 80 Plus Gold y alimentación de la GPU mediante líneas PCIe 8-pin dedicadas independientes (eliminando cableado daisy-chain).',
    qaVerificationMetric: 'Raíl +12V estable en 12.04 V bajo carga continua de 540W en OCCT Power Supply (45 min) · Rizado < 25 mVpp · 0 eventos WHEA/TDR.'
  }
];

interface WritingGuideViewProps {
  onInsertActionTemplate: (verb: string, description: string) => void;
}

export const WritingGuideView: React.FC<WritingGuideViewProps> = ({
  onInsertActionTemplate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  const categories = [
    'Todas',
    'Térmico',
    'Almacenamiento',
    'Eléctrico / Placa',
    'Memoria / Vídeo',
    'Red / Sistema'
  ];

  const filteredTranslations = TECHNICAL_TRANSLATIONS.filter((item) => {
    const matchesCategory =
      selectedCategory === 'Todas' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.userOrColloquialPhrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.professionalDiagnosisPhrase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.professionalActionPhrase.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1600);
  };

  return (
    <div className="space-y-8">
      {/* Introducción Pedagógica */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6">
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
              MANUAL DE ESTILO Y PROTOCOLO DOCUMENTAL DE TALLER IT
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              Guía Didáctica de Redacción Técnica, Traductor de Jerga y Autoevaluación
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
              Un parte técnico profesional es un documento con validez contractual, contable y de garantía. Aprende a separar lo que el cliente percibe (síntoma subjetivo) de lo que el técnico comprueba instrumentalmente (diagnóstico objetivo).
            </p>
          </div>
          <BookOpen className="w-6 h-6 text-slate-400 dark:text-slate-500 shrink-0 hidden sm:block" />
        </div>

        {/* Los 5 Principios de Oro */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 pt-5 text-xs">
          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md">
            <div className="font-mono text-slate-500 dark:text-slate-400">01 · TRAZABILIDAD</div>
            <div className="font-bold text-slate-900 dark:text-slate-100 mt-1">
              Identificación Unívoca
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Nunca anotes solo «Portátil HP». Registra modelo exacto, S/N completo, estado cosmético previo y P/N del cargador.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md">
            <div className="font-mono text-slate-500 dark:text-slate-400">02 · OBJETIVIDAD</div>
            <div className="font-bold text-slate-900 dark:text-slate-100 mt-1">
              Síntoma ≠ Diagnóstico
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              El usuario describe el efecto («se apaga»). El técnico dictamina la causa física respaldada por telemetría («100 °C PROCHOT#»).
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md">
            <div className="font-mono text-slate-500 dark:text-slate-400">03 · METODOLOGÍA</div>
            <div className="font-bold text-slate-900 dark:text-slate-100 mt-1">
              Sustantivos Técnicos
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Sustituye «quitar polvo y echar pasta» por «desobstrucción con aire seco y aplicación de interfase térmica».
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md">
            <div className="font-mono text-slate-500 dark:text-slate-400">04 · REPUESTOS</div>
            <div className="font-bold text-slate-900 dark:text-slate-100 mt-1">
              P/N, FRU y Garantía
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Documenta el Part Number (P/N o SKU), el número de serie de la pieza retirada y el de la nueva pieza instalada.
            </p>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-md">
            <div className="font-mono text-slate-500 dark:text-slate-400">05 · CONFORMIDAD QA</div>
            <div className="font-bold text-slate-900 dark:text-slate-100 mt-1">
              Cierre Cuantificado
            </div>
            <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              Evita cerrar con «Todo OK». Registra el valor final medido («Tª máx. 71 °C tras 30 min en OCCT · 0 errores»).
            </p>
          </div>
        </div>
      </div>

      {/* Traductor Interactivo de Jerga Coloquial a Redacción Profesional */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Traductor de Expresiones Coloquiales a Terminología Técnica IT
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
              Consulta cómo transformar expresiones informales en diagnósticos, acciones y pruebas de conformidad de nivel profesional.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar término (ej. pasta, disco, negro)..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-300 dark:border-slate-700 rounded-md focus:outline-none focus:border-slate-900 dark:focus:border-sky-400 w-64"
              />
            </div>
          </div>
        </div>

        {/* Filtro por Categoría */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tabla Comparativa */}
        <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
          {filteredTranslations.map((row) => (
            <div key={row.id} className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs">
              <div className="lg:col-span-3 space-y-1">
                <div className="font-mono text-slate-500 dark:text-slate-400">
                  {row.category}
                </div>
                <div className="font-semibold text-rose-900 dark:text-rose-400">
                  Expresión Coloquial / Usuario:
                </div>
                <p className="text-slate-700 dark:text-slate-300 italic">
                  {row.userOrColloquialPhrase}
                </p>
              </div>

              <div className="lg:col-span-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    Diagnóstico Técnico Preciso:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(`${row.id}-diag`, row.professionalDiagnosisPhrase)
                    }
                    className="text-[11px] text-sky-700 dark:text-sky-400 hover:underline flex items-center gap-1"
                  >
                    {copiedId === `${row.id}-diag` ? (
                      <>
                        <Check className="w-3 h-3" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copiar
                      </>
                    )}
                  </button>
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                  {row.professionalDiagnosisPhrase}
                </p>
              </div>

              <div className="lg:col-span-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    Acción Correctiva Formal:
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(`${row.id}-act`, row.professionalActionPhrase)
                    }
                    className="text-[11px] text-sky-700 dark:text-sky-400 hover:underline flex items-center gap-1"
                  >
                    {copiedId === `${row.id}-act` ? (
                      <>
                        <Check className="w-3 h-3" /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copiar
                      </>
                    )}
                  </button>
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                  {row.professionalActionPhrase}
                </p>
              </div>

              <div className="lg:col-span-3 space-y-1">
                <div className="font-semibold text-emerald-900 dark:text-emerald-400">
                  Métrica de Conformidad (QA):
                </div>
                <p className="font-mono text-slate-800 dark:text-slate-200 leading-relaxed tabular-nums">
                  {row.qaVerificationMetric}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Test Interactivo de Autoevaluación Terminológica */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-slate-200 dark:border-slate-800">
          <HelpCircle className="w-5 h-5 text-slate-800 dark:text-sky-400 shrink-0" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Autoevaluación Rápida: ¿Sabes Redactar como un Técnico Auditor?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Selecciona la opción correcta en cada situación real de taller para comprobar tu dominio documental.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {DIDACTIC_QUIZ_QUESTIONS.map((q, qIdx) => {
            const chosenId = selectedAnswers[q.id];
            const chosenOption = q.options.find((o) => o.id === chosenId);

            return (
              <div
                key={q.id}
                className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg flex flex-col justify-between space-y-4 text-xs"
              >
                <div className="space-y-2">
                  <div className="font-mono text-slate-500 dark:text-slate-400">
                    PREGUNTA 0{qIdx + 1}
                  </div>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 leading-relaxed">
                    {q.scenario}
                  </p>

                  <div className="space-y-2 pt-2">
                    {q.options.map((opt) => {
                      const isSelected = chosenId === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            setSelectedAnswers((prev) => ({
                              ...prev,
                              [q.id]: opt.id
                            }))
                          }
                          className={`w-full text-left p-2.5 rounded-md border transition-colors leading-snug ${
                            isSelected
                              ? opt.isCorrect
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-600 text-emerald-950 dark:text-emerald-200 font-medium'
                                : 'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-200 font-medium'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {chosenOption && (
                  <div
                    className={`p-3 rounded-md border flex items-start gap-2 ${
                      chosenOption.isCorrect
                        ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                        : 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                    }`}
                  >
                    {chosenOption.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-700 dark:text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <p className="leading-relaxed">{chosenOption.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Catálogo de Verbos de Acción Técnica */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Banco de Verbos y Procedimientos Estándar para Acciones Correctivas
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
            Puedes insertar cualquiera de estas estructuras base en tu Orden de Trabajo activa y adaptarla a los datos de tu equipo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TECHNICAL_ACTION_VERBS.map((item) => (
            <div
              key={item.verb}
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg flex flex-col justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/50"
            >
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {item.verb}
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {item.example}
                </p>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => onInsertActionTemplate(item.verb, item.example)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors whitespace-nowrap shrink-0"
                >
                  Añadir como Acción al Parte Activo
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
