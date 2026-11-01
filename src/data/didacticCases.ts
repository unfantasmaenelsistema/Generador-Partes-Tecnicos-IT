import { DidacticCase, WorkOrder } from '../types/workOrder';

export const DIAGNOSTIC_TOOLS_CATALOG: string[] = [
  'HWiNFO64 / Sensores SMBus',
  'CrystalDiskInfo / smartctl (SMART)',
  'MemTest86+ v7.0 (Test EFI)',
  'Polímetro Digital TrueRMS / Tester ATX',
  'Fuente de Laboratorio Regulable (Consumo DC)',
  'Tarjeta POST PCIe / Analizador LPC',
  'Cámara Termográfica Infrarroja',
  'OCCT / Prime95 / FurMark (Stress Test)',
  'Visor de Eventos Windows / journalctl',
  'Microscopio Estereoscópico de Taller',
  'Analizador de Red / Fluke Cable Tester',
  'Osciloscopio Digital (Rizado VRM)',
  'WinDbg / Analizador de Volcados Minidump (BSOD)',
  'Autoruns / Sysinternals Process Explorer'
];

export const TECHNICAL_ACTION_VERBS: { verb: string; example: string }[] = [
  {
    verb: 'Desmontaje y aislamiento ESD',
    example: 'Desconexión de batería interna de polímero de litio (4 celdas) y descarga capacitiva previa a la manipulación de placa base.'
  },
  {
    verb: 'Desobstrucción y saneamiento térmico',
    example: 'Limpieza mecánica de aletas del radiador de cobre con aire seco comprimido y eliminación de compuesto térmico degradado con alcohol isopropílico (IPA 99.9%).'
  },
  {
    verb: 'Reaplicación de interfase térmica',
    example: 'Aplicación de compuesto térmico de cambio de fase / alta conductividad (8.5 W/m·K) sobre die de CPU/GPU y sustitución de thermal pads de 1.0 mm en fases VRM.'
  },
  {
    verb: 'Sustitución de componente electromecánico',
    example: 'Reemplazo de ventilador centrífugo de 5V DC (P/N: 01AW389) por unidad OEM nueva y verificación de curva PWM.'
  },
  {
    verb: 'Clonación forense y migración de datos',
    example: 'Volcado bit a bit mediante ddrescue desde unidad con sectores pendientes hacia nuevo soporte NVMe PCIe 4.0 y verificación de suma SHA-256.'
  },
  {
    verb: 'Reconstrucción y resincronización lógica',
    example: 'Sustitución en caliente (Hot-Swap) de disco degradado en bahía 2 y reconstrucción completa del volumen RAID 1 en mdadm / Synology DSM.'
  },
  {
    verb: 'Resoldado y reconstrucción de pistas',
    example: 'Desoldado de conector DC-Jack fracturado, limpieza de pads con malla desoldadora y soldadura con aleación Sn99Ag0.3Cu0.7 bajo microscopio.'
  },
  {
    verb: 'Actualización de microcódigo / UEFI',
    example: 'Flasheo de BIOS/UEFI a versión estable 1.24 (parche AGESA / microcódigo Intel) y configuración de perfil JEDEC/XMP estable.'
  },
  {
    verb: 'Sustitución de fuente conmutada ATX',
    example: 'Retirada de PSU con caída de tensión en raíl +12V y montaje de fuente certificada ATX 3.0 80 Plus Gold con cableado modular.'
  },
  {
    verb: 'Mantenimiento de kit fusor y arrastre',
    example: 'Sustitución del conjunto fusor térmico (220V), rodillo de transferencia y rodillos pickup de bandeja 2, más reinicio de contador NVRAM.'
  }
];

export interface ColloquialRule {
  pattern: RegExp;
  label: string;
  reason: string;
  suggestion: string;
}

export const COLLOQUIAL_RULES: ColloquialRule[] = [
  {
    pattern: /\b(cacharrito|cacharro|chisme|aparato|bicho|trasto)\b/i,
    label: 'Término coloquial ("cacharro / chisme / aparato")',
    reason: 'Resta rigor documental y genera ambigüedad sobre el componente intervenido.',
    suggestion: 'Usa la denominación técnica exacta: unidad base, chasis, módulo, subconjunto, fuente conmutada o periférico.'
  },
  {
    pattern: /\b(estaba roto|está roto|roto|rota)\b/i,
    label: 'Adjetivo impreciso ("roto/a")',
    reason: '"Roto" no especifica si se trata de fractura mecánica, cortocircuito eléctrico, degradación lógica o desgaste.',
    suggestion: 'Especifica el modo de fallo: en cortocircuito, con circuito abierto, grieta en soldadura, rodamiento gripado o sectores reasignados.'
  },
  {
    pattern: /\b(iba mal|va mal|iba lento|va fatal|hacía cosas raras|fallaba mucho)\b/i,
    label: 'Descripción subjetiva en campo técnico ("iba mal / lento / cosas raras")',
    reason: 'En el diagnóstico técnico o acciones correctivas no deben emplearse percepciones subjetivas sin cuantificar.',
    suggestion: 'Cuantifica la anomalía: latencia de lectura > 450 ms, estrangulamiento térmico (Thermal Throttling a 800 MHz) o pérdida de paquetes del 35%.'
  },
  {
    pattern: /\b(le pasé un programa|pasé el antivirus|le metí un programa)\b/i,
    label: 'Acción indeterminada ("le pasé un programa")',
    reason: 'No deja trazabilidad de qué herramienta diagnóstica o versión se ejecutó ni bajo qué parámetros.',
    suggestion: 'Indica software, versión y resultado: "Ejecución de diagnóstico SMART mediante smartctl 7.4" o "Análisis de superficie con Victoria SSD / MemTest86+".'
  },
  {
    pattern: /\b(le eché pasta|puse pasta|cambiar la pasta)\b/i,
    label: 'Expresión informal ("echar/poner pasta")',
    reason: 'Expresión de argot poco profesional para un informe auditable o de garantía.',
    suggestion: 'Redacta: "Limpieza de restos cristalizados con alcohol isopropílico 99% y reaplicación de compuesto térmico de alta conductividad sobre el die".'
  },
  {
    pattern: /\b(quité el polvo|limpié la pelusa|soplé el ventilador)\b/i,
    label: 'Expresión coloquial ("quitar pelusa / soplar ventilador")',
    reason: 'Describe una acción doméstica en lugar de un procedimiento técnico de mantenimiento preventivo/correctivo.',
    suggestion: 'Redacta: "Desobstrucción mecánica del disipador de aletas de cobre y turbina axial mediante aire seco presurizado con bloqueo de giro por inducción".'
  },
  {
    pattern: /\b(todo ok|todo bien|funciona bien|arreglado|ya va bien)\b/i,
    label: 'Cierre sin evidencia cuantitativa ("todo ok / funciona bien")',
    reason: 'Una prueba de conformidad requiere valores medibles que respalden la garantía de la reparación.',
    suggestion: 'Documenta el parámetro verificado: "Supera test de estrés OCCT durante 30 min con Tª máx. de 71 °C y estabilidad de raíles ATX dentro del ±3%".'
  }
];

export interface DidacticQuizQuestion {
  id: string;
  scenario: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export const DIDACTIC_QUIZ_QUESTIONS: DidacticQuizQuestion[] = [
  {
    id: 'q1',
    scenario: 'Un cliente trae un portátil que se apaga a los 10 minutos. Al abrirlo ves el disipador tapado de polvo y el ventilador no gira. ¿Qué debes escribir en el apartado «2A. Descripción del fallo aportada por el usuario»?',
    options: [
      {
        id: 'q1-a',
        text: 'El ventilador centrífugo está gripado y el radiador tiene un 85% de obstrucción.',
        isCorrect: false,
        explanation: 'Incorrecto: eso pertenece al «Diagnóstico Real del Técnico (2B)». El cliente en recepción no sabe qué ocurre dentro del chasis.'
      },
      {
        id: 'q1-b',
        text: 'El usuario reporta apagados súbitos tras ~10 minutos de uso bajo carga y temperatura elevada en la base inferior.',
        isCorrect: true,
        explanation: '¡Exacto! El apartado 2A registra fielmente el síntoma observable reportado por el cliente sin mezclar aún el dictamen interno.'
      },
      {
        id: 'q1-c',
        text: 'El portátil está roto porque tiene mucha pelusa dentro.',
        isCorrect: false,
        explanation: 'Incorrecto: mezcla lenguaje coloquial ("roto", "pelusa") con causas internas.'
      }
    ]
  },
  {
    id: 'q2',
    scenario: 'Has limpiado el disipador, aplicado Arctic MX-6 y cambiado el ventilador. ¿Cuál es la redacción profesional para «05. Prueba Final de Conformidad (QA)»?',
    options: [
      {
        id: 'q2-a',
        text: 'Todo OK. Ya no se calienta ni se apaga, funciona perfectamente.',
        isCorrect: false,
        explanation: 'Incorrecto: «Todo OK» no aporta ninguna métrica objetiva ante una reclamación en garantía.'
      },
      {
        id: 'q2-b',
        text: 'Le pasé un programa de pruebas un rato y dio bien.',
        isCorrect: false,
        explanation: 'Incorrecto: no especifica qué software de estrés se usó, durante cuánto tiempo ni qué temperatura máxima alcanzó.'
      },
      {
        id: 'q2-c',
        text: 'Supera test de estrés OCCT (30 min al 100% TDP) con Tª máx. de 74 °C (0% Throttling) y régimen estable a 4.350 RPM.',
        isCorrect: true,
        explanation: '¡Correcto! Incluye herramienta, duración, porcentaje de carga y valores térmicos y acústicos cuantificados.'
      }
    ]
  },
  {
    id: 'q3',
    scenario: 'Sustituyes un disco duro con sectores defectuosos por un SSD nuevo. ¿Qué datos son indispensables en la tabla de «04. Piezas Sustituidas»?',
    options: [
      {
        id: 'q3-a',
        text: 'Poner «Disco SSD de 2TB nuevo» y el precio.',
        isCorrect: false,
        explanation: 'Insuficiente: sin Part Number (P/N) ni números de serie no hay trazabilidad ante un RMA de fabricante.'
      },
      {
        id: 'q3-b',
        text: 'Denominación exacta, P/N o SKU del fabricante, S/N del disco retirado (baja), S/N del SSD instalado (alta) y meses de garantía.',
        isCorrect: true,
        explanation: '¡Exacto! Así queda vinculado inequívocamente qué número de serie salió del equipo y cuál entró cubierto por garantía.'
      },
      {
        id: 'q3-c',
        text: 'Solo la marca del disco y decir que el viejo estaba en rojo.',
        isCorrect: false,
        explanation: 'Incorrecto: carece de rigor técnico y de referencias alfanuméricas auditables.'
      }
    ]
  }
];

export const DIDACTIC_CASES: DidacticCase[] = [
  {
    id: 'case-thermal-laptop',
    code: 'CASO-01',
    title: 'Apagado súbito bajo carga en portátil corporativo (Throttling y THERMTRIP)',
    difficulty: 'Inicial (FP Básica / Grado Medio)',
    moduleTag: 'Montaje y Mantenimiento de Equipos',
    summary: 'Una arquitecta reporta que su estación móvil se apaga de golpe al renderizar planos 3D y la base quema al tacto.',
    learningObjective: 'Distinguir la queja subjetiva del usuario ("se apaga solo y quema") del diagnóstico térmico cuantificado (PROCHOT#, pasta cristalizada y fallo de rodamiento PWM) y documentar métricas antes/después.',
    clientQuoteVerbal: '«Cuando abro AutoCAD o hago una videollamada larga, el portátil empieza a ir a tirones, hace un ruido como de carraca por detrás y a los diez minutos se apaga de golpe como si le quitaran la batería. Además, por debajo quema muchísimo.»',
    labProbes: [
      {
        id: 'probe-1',
        toolName: 'Inspección Física y Desmontaje ESD',
        category: 'Inspección Visual / ESD',
        commandOrProcedure: 'Inspección ocular de chasis, apertura de tapa inferior Torx T5 y revisión del módulo térmico.',
        rawOutput: 'Equipo: Lenovo ThinkPad P15v Gen 3 (Type 21D8) | S/N: PF-3X98K2\nEstado físico: Arañazo superficial de 3 cm en tapa superior; falta 1 tornillo en esquina inferior derecha; incluye cargador Slim Tip 135W original (P/N: ADL135NDC3A).\nInterior: Colchón compacto de polvo y fibras obstruyendo el 85% del radiador de cobre. Pasta térmica de fábrica totalmente seca y agrietada en die de CPU. Ventilador con holgura axial en el eje.',
        interpretationHint: 'Registra el S/N exacto, el cargador de 135W y el estado cosmético en Recepción para evitar reclamaciones posteriores.',
        keyMetricsToCite: ['PF-3X98K2', 'ADL135NDC3A', 'Obstrucción 85%', 'Pasta térmica cristalizada']
      },
      {
        id: 'probe-2',
        toolName: 'Telemetría Térmica HWiNFO64',
        category: 'Sensores / Eléctrico',
        commandOrProcedure: 'Monitorización de sensores SMBus durante carga sintética Cinebench R23 Multi-Core.',
        rawOutput: 'CPU: Intel Core i7-12700H (14C/20T) | RAM: 32GB DDR5-4800 (2x16GB) | SSD: 1TB NVMe Samsung PM9A1\nTemp Reposo (Idle): 68 °C\nTemp Carga (90 seg): 100 °C (Core Max) -> Activación flag PROCHOT# (Thermal Throttling severo a 1.1 GHz)\nVelocidad Fan1 (PWM 100%): Oscila erráticamente entre 0 y 1.150 RPM (Nominal: 4.400 RPM) con ruido mecánico.\nA los 140 seg: Disparo de protección térmica de emergencia (THERMTRIP#) -> Apagado forzado.',
        interpretationHint: 'Aquí tienes la causa raíz objetiva: disparo de THERMTRIP# a 100 °C por fallo del ventilador (1150 RPM vs 4400 RPM) y pérdida de transferencia térmica.',
        keyMetricsToCite: ['100 °C', 'PROCHOT# / THERMTRIP#', '1.150 RPM']
      },
      {
        id: 'probe-3',
        toolName: 'Verificación de Almacenamiento SMART',
        category: 'Almacenamiento / Memoria',
        commandOrProcedure: 'Lectura de registros NVMe Health Log con smartctl -a /dev/nvme0n1',
        rawOutput: 'Model: SAMSUNG MZVL21T0HCLR-00BL7 (1024 GB)\nCritical Warning: 0x00 | Percentage Used: 4% | Media and Data Integrity Errors: 0\nUnsafe Shutdowns: 19 (Coinciden con los apagados térmicos bruscos)\nTemp sensor SSD: 54 °C',
        interpretationHint: 'El SSD está sano (0 errores de integridad), pero registra 19 apagados inseguros derivados del corte térmico. Conviene ejecutar chkdsk / sfc preventivo.',
        keyMetricsToCite: ['0 errores de integridad', '19 apagados inseguros']
      },
      {
        id: 'probe-4',
        toolName: 'Visor de Eventos del Sistema',
        category: 'Logs / Firmware / Red',
        commandOrProcedure: 'Filtrado de eventos Críticos en registro Sistema (Eventvwr.msc)',
        rawOutput: 'Evento ID 41 (Kernel-Power): El sistema se ha reiniciado sin cerrarse limpiamente primero.\nEvento ID 37 (Kernel-Processor-Power): La velocidad del procesador 0 del grupo 0 está limitada por el firmware del sistema (Thermal Zone ACPI\\_TZ.TZ01 = 373K / 100°C).',
        interpretationHint: 'El Evento ID 41 (apagado sin cierre limpio) y el ID 37 (CPU limitada por el firmware) confirman documentalmente el origen térmico de los apagados.',
        keyMetricsToCite: ['Kernel-Power ID 41', 'ACPI TZ01 100°C']
      }
    ],
    flawedDraftOrder: {
      id: 'draft-case-01',
      orderNumber: 'OT-2026-0104',
      createdAt: '2026-11-01T09:15',
      completedAt: '2026-11-01T13:30',
      technicianName: 'Alumno en Prácticas',
      technicianId: 'TEC-09',
      priority: 'Preferente (24h)',
      status: 'En Reparación y Pruebas QA',
      laborHours: 1.5,
      hourlyRateEur: 42,
      vatPercent: 21,
      client: {
        name: 'Elena Vázquez Morales',
        organization: 'Estudio Vázquez Arquitectura SLP',
        contactPhone: '612 448 901',
        contactEmail: 'elena@vazquezestudio.es',
        authorizedBackup: true,
        warrantyClaim: false
      },
      equipment: {
        category: 'Portátil / Ultrabook',
        brand: 'Lenovo',
        model: 'ThinkPad',
        serialNumber: 'No se ve bien',
        assetTag: '',
        cpu: 'i7',
        ram: '32 GB',
        storage: '1 TB',
        motherboardOrGpu: 'Integrada + Nvidia',
        operatingSystem: 'Windows 11',
        physicalIntakeState: 'Normal, usado.',
        accessoriesIncluded: 'Con su cargador.',
        biosOrSystemPasswordNote: 'Sin clave'
      },
      faultDiagnosis: {
        clientSymptom: 'Tiene el ventilador roto y mucha pelusa dentro.',
        symptomContextAndFrequency: 'Siempre que trabaja.',
        diagnosticToolsUsed: ['HWiNFO64 / Sensores SMBus'],
        telemetryAndErrorCodes: 'Se pone muy caliente.',
        technicalDiagnosis: 'El portátil iba mal y se apagaba porque tenía un montón de pelusa y el ventilador estaba roto y hacía ruido.',
        rootCauseCategory: 'Térmico / Disipación'
      },
      correctiveActions: [
        {
          id: 'ca-1',
          stage: '2. Intervención de Hardware',
          actionVerb: 'Limpieza',
          technicalDescription: 'Quité el polvo de dentro, le eché pasta nueva y puse un ventilador nuevo.',
          durationMinutes: 60
        }
      ],
      replacedParts: [
        {
          id: 'rp-1',
          componentName: 'Ventilador',
          partNumberOrSku: 'Sin referencia',
          removedComponentRef: 'Viejo',
          installedComponentRef: 'Nuevo',
          condition: 'Nuevo OEM',
          warrantyMonths: 6,
          quantity: 1,
          unitPriceEur: 28.5
        }
      ],
      conformityChecks: [
        {
          id: 'cc-1',
          code: 'QA-TERM',
          testName: 'Prueba de estabilidad térmica bajo carga',
          passed: true,
          measuredResult: 'Todo ok, ya no se apaga y funciona bien.'
        }
      ],
      finalTechnicianNotes: 'Arreglado. Se entrega al cliente.',
      caseId: 'case-thermal-laptop'
    },
    modelSolutionOrder: {
      id: 'model-case-01',
      orderNumber: 'OT-2026-0104',
      createdAt: '2026-11-01T09:15',
      completedAt: '2026-11-01T13:30',
      technicianName: 'Javier Pérez — Especialista Sistemas IT',
      technicianId: 'TEC-01',
      priority: 'Preferente (24h)',
      status: 'Cerrado — Conforme',
      laborHours: 1.5,
      hourlyRateEur: 42,
      vatPercent: 21,
      client: {
        name: 'Elena Vázquez Morales',
        organization: 'Estudio Vázquez Arquitectura SLP',
        contactPhone: '612 448 901',
        contactEmail: 'elena@vazquezestudio.es',
        authorizedBackup: true,
        warrantyClaim: false
      },
      equipment: {
        category: 'Portátil / Ultrabook',
        brand: 'Lenovo',
        model: 'ThinkPad P15v Gen 3 (Type 21D8)',
        serialNumber: 'PF-3X98K2',
        assetTag: 'ARQ-WKS-04',
        cpu: 'Intel Core i7-12700H (14C/20T, hasta 4.7 GHz)',
        ram: '32 GB DDR5-4800 MHz (2x 16 GB SO-DIMM)',
        storage: '1 TB SSD NVMe PCIe 4.0 Samsung PM9A1 (MZVL21T0HCLR)',
        motherboardOrGpu: 'NVIDIA T1200 4GB GDDR6 + Intel Iris Xe',
        operatingSystem: 'Windows 11 Pro 23H2 (64 bits)',
        physicalIntakeState: 'Arañazo superficial de 3 cm en cubierta superior; ausencia de 1 tornillo M2x5 en esquina inferior derecha de tapa base. Pantalla y bisagras en buen estado.',
        accessoriesIncluded: 'Adaptador AC original Lenovo 135W Slim Tip (P/N: ADL135NDC3A) con cable tripolar Schuko.',
        biosOrSystemPasswordNote: 'PIN temporal de soporte facilitado por cliente; BIOS libre de bloqueo supervisor.'
      },
      faultDiagnosis: {
        clientSymptom: 'La usuaria reporta que al ejecutar software CAD 3D o videollamadas prolongadas el equipo sufre caídas de rendimiento, emite ruido mecánico en la zona trasera y se apaga súbitamente tras ~10 minutos de uso, apreciándose temperatura excesiva en la carcasa inferior.',
        symptomContextAndFrequency: 'Reproducible sistemáticamente a los 120-140 segundos de aplicar carga multinúcleo superior al 60% de TDP.',
        diagnosticToolsUsed: [
          'HWiNFO64 / Sensores SMBus',
          'CrystalDiskInfo / smartctl (SMART)',
          'Visor de Eventos Windows / journalctl',
          'OCCT / Prime95 / FurMark (Stress Test)'
        ],
        telemetryAndErrorCodes: 'Tª CPU Idle: 68 °C · Tª Carga: 100 °C (disparo de señales PROCHOT# y apagado de emergencia THERMTRIP#) · Régimen ventilador: 0-1.150 RPM erráticas (nominal 4.400 RPM) · Eventos Kernel-Power ID 41 y Kernel-Processor-Power ID 37 · SMART NVMe: 0 errores de medios, 19 apagados inseguros.',
        technicalDiagnosis: 'Incapacidad crítica de disipación en el conjunto térmico debido a: (1) fallo electromecánico del rodamiento del ventilador centrífugo de 5V DC con pérdida del 74% de caudal nominal, (2) obstrucción del 85% de las aletas del radiador de cobre por acumulación de polvo y fibras, y (3) degradación por cristalización del compuesto térmico sobre los dies de CPU y GPU dedicada.',
        rootCauseCategory: 'Térmico / Disipación'
      },
      correctiveActions: [
        {
          id: 'ca-sol-1',
          stage: '1. Seguridad ESD y Desmontaje',
          actionVerb: 'Desmontaje y aislamiento ESD',
          technicalDescription: 'Inhabilitación de batería interna desde BIOS UEFI, apertura de cubierta inferior, desconexión física del conector de batería y descarga capacitiva en banco protegido ESD.',
          durationMinutes: 15
        },
        {
          id: 'ca-sol-2',
          stage: '2. Intervención de Hardware',
          actionVerb: 'Desobstrucción y saneamiento térmico',
          technicalDescription: 'Desmontaje del bloque disipador dual-heatpipe, desobstrucción completa de las aletas de cobre mediante aire seco presurizado y limpieza de compuesto térmico degradado en CPU/GPU con alcohol isopropílico IPA 99.9%.',
          durationMinutes: 25
        },
        {
          id: 'ca-sol-3',
          stage: '2. Intervención de Hardware',
          actionVerb: 'Sustitución de componente electromecánico',
          technicalDescription: 'Sustitución del módulo ventilador centrífugo defectuoso por recambio original OEM Lenovo (FRU 5H41B77292) y aplicación de compuesto térmico Arctic MX-6 (8.5 W/m·K) junto con reposición del tornillo M2x5 ausente en chasis.',
          durationMinutes: 30
        },
        {
          id: 'ca-sol-4',
          stage: '3. Firmware / Sistema',
          actionVerb: 'Verificación de integridad lógica',
          technicalDescription: 'Comprobación y reparación del sistema de archivos NTFS (chkdsk /f) y almacén de componentes (DISM / sfc /scannow) tras los 19 apagados bruscos registrados en SMART.',
          durationMinutes: 20
        }
      ],
      replacedParts: [
        {
          id: 'rp-sol-1',
          componentName: 'Ventilador centrífugo CPU/GPU 5V DC 0.5A PWM',
          partNumberOrSku: 'FRU-5H41B77292',
          removedComponentRef: 'Delta ND75C38 (Rodamiento gripado)',
          installedComponentRef: 'Lenovo OEM 5H41B77292 (Lote 2026-04)',
          condition: 'Nuevo OEM',
          warrantyMonths: 12,
          quantity: 1,
          unitPriceEur: 34.0
        },
        {
          id: 'rp-sol-2',
          componentName: 'Consumible: Compuesto térmico alta densidad + Tornillería M2x5',
          partNumberOrSku: 'CONS-TH-MX6',
          removedComponentRef: 'Compuesto OEM degradado',
          installedComponentRef: 'Dosificación 0.4g alta conductividad',
          condition: 'Nuevo OEM',
          warrantyMonths: 12,
          quantity: 1,
          unitPriceEur: 6.5
        }
      ],
      conformityChecks: [
        {
          id: 'cc-sol-1',
          code: 'QA-01',
          testName: 'Test de estrés combinado CPU+GPU (OCCT 30 minutos)',
          passed: true,
          measuredResult: 'Tª máx. CPU: 76 °C (0% Throttling, paquete estable a 45W) · Tª máx. GPU: 69 °C · Ruido acústico normal (4.350 RPM estables).'
        },
        {
          id: 'cc-sol-2',
          code: 'QA-02',
          testName: 'Temperaturas en reposo (Idle escritorio)',
          passed: true,
          measuredResult: 'Reducción de 68 °C iniciales a 41 °C en reposo (Delta térmico de mejora: -27 °C).'
        },
        {
          id: 'cc-sol-3',
          code: 'QA-03',
          testName: 'Integridad del sistema de archivos y lectura NVMe',
          passed: true,
          measuredResult: 'SFC sin infracciones de integridad · Lectura secuencial 3.480 MB/s · 0 errores críticos en Visor de Eventos.'
        }
      ],
      finalTechnicianNotes: 'Se recomienda mantenimiento preventivo del sistema de refrigeración cada 18 meses debido al uso intensivo de renderizado CAD. Se adjunta el ventilador sustituido a disposición del cliente.',
      caseId: 'case-thermal-laptop'
    }
  },
  {
    id: 'case-storage-cad',
    code: 'CASO-02',
    title: 'Congelaciones y corrupción de proyectos por degradación crítica de disco (SMART ID 05 / C5)',
    difficulty: 'Inicial (FP Básica / Grado Medio)',
    moduleTag: 'Sistemas Operativos y Almacenamiento',
    summary: 'Un diseñador industrial indica que su PC tarda 10 minutos en abrir carpetas del disco D: y que Windows muestra mensajes de "No responde".',
    learningObjective: 'Documentar fallos físicos de almacenamiento mediante atributos SMART exactos (Sectores Reasignados ID 05 y Pendientes ID C5), diferenciando problema de software vs fallo de superficie magnética/NAND.',
    clientQuoteVerbal: '«El ordenador arranca rápido en el escritorio, pero en cuanto intento abrir mis carpetas de proyectos del disco de Datos (D:) se queda la ruedecita girando cinco minutos, la ventana pone "No responde" y ayer me salió un cartel diciendo que no se podía leer el archivo.»',
    labProbes: [
      {
        id: 'probe-2-1',
        toolName: 'Inspección Física de Estación de Trabajo',
        category: 'Inspección Visual / ESD',
        commandOrProcedure: 'Inspección de torre ATX, cableado SATA3 y bahías de 3.5 pulgadas.',
        rawOutput: 'Equipo: Workstation Dell Precision 3660 Tower | Service Tag (S/N): 8H4K9T3\nConfiguración: Intel Core i7-13700 · 32GB DDR5 · Unidad C: SSD NVMe 512GB SK Hynix · Unidad D: HDD 2TB Seagate Barracuda ST2000DM008 (S/N: ZFL4921M).\nEstado recepción: Sin golpes externos; se entrega únicamente la torre sin cables ni periféricos.',
        interpretationHint: 'Observa que el sistema tiene dos unidades: el NVMe de arranque (C:) y el HDD mecánico secundario (D:) donde residen los proyectos.',
        keyMetricsToCite: ['Service Tag 8H4K9T3', 'ST2000DM008', 'S/N: ZFL4921M']
      },
      {
        id: 'probe-2-2',
        toolName: 'Auditoría SMART con smartctl / CrystalDiskInfo',
        category: 'Almacenamiento / Memoria',
        commandOrProcedure: 'Lectura de tabla de atributos S.M.A.R.T. en /dev/sda (Unidad D: 2TB)',
        rawOutput: 'Unidad C: (NVMe 512GB): Salud 99% BUENO.\nUnidad D: (Seagate ST2000DM008 - S/N: ZFL4921M - 14.280 horas encendido):\nEstado Global SMART: RIESGO / CRITICO\nID 05 (Reallocated_Sector_Ct): Valor Crudo = 184 sectores reasignados\nID C5 (Current_Pending_Sector): Valor Crudo = 47 sectores inestables pendientes\nID C6 (Offline_Uncorrectable): Valor Crudo = 19 sectores incorregibles\nLatencia media de acceso en zonas LBA 450.000.000+: > 1.850 ms con reintentos de cabezal.',
        interpretationHint: 'Los atributos SMART 05 (184), C5 (47) y C6 (19) demuestran degradación física irreversible de los platos magnéticos en la unidad D:. No debe ejecutarse desfragmentación ni escritura intensiva.',
        keyMetricsToCite: ['ID 05: 184 sectores', 'ID C5: 47 pendientes', 'ID C6: 19 incorregibles', 'Latencia > 1.850 ms']
      },
      {
        id: 'probe-2-3',
        toolName: 'Visor de Eventos de Almacenamiento (StorAHCI / Disk)',
        category: 'Logs / Firmware / Red',
        commandOrProcedure: 'Consulta de eventos de subsistema de E/S en Registro de Sistema.',
        rawOutput: 'Evento ID 7 (Disk): El dispositivo \\Device\\Harddisk1\\DR1 tiene un bloque defectuoso.\nEvento ID 153 (Disk): Se reintentó la operación de E/S en la dirección de bloque lógico 0x1a8f4200 para el Disco 1.\nEvento ID 129 (storahci): Se emitió un restablecimiento al dispositivo \\Device\\RaidPort0 (Timeout de lectura > 30s).',
        interpretationHint: 'Los congelamientos ("No responde") ocurren porque el controlador SATA espera hasta 30 segundos intentando leer los bloques defectuosos antes de lanzar un reset ID 129.',
        keyMetricsToCite: ['Disk ID 7 / ID 153', 'storahci ID 129']
      }
    ],
    flawedDraftOrder: {
      id: 'draft-case-02',
      orderNumber: 'OT-2026-0108',
      createdAt: '2026-11-01T10:00',
      completedAt: '2026-11-01T16:00',
      technicianName: 'Alumno en Prácticas',
      technicianId: 'TEC-09',
      priority: 'Preferente (24h)',
      status: 'En Reparación y Pruebas QA',
      laborHours: 2,
      hourlyRateEur: 42,
      vatPercent: 21,
      client: {
        name: 'Carlos Mendoza Ruiz',
        organization: 'Mendoza Diseño Industrial',
        contactPhone: '655 819 203',
        contactEmail: 'cmendoza@mendozadiseno.com',
        authorizedBackup: true,
        warrantyClaim: false
      },
      equipment: {
        category: 'Sobremesa / Workstation',
        brand: 'Dell',
        model: 'Torre negra',
        serialNumber: '8H4K9T3',
        assetTag: '',
        cpu: 'Intel i7',
        ram: '32GB',
        storage: 'Dos discos',
        motherboardOrGpu: 'De serie',
        operatingSystem: 'Windows 11',
        physicalIntakeState: 'Bien.',
        accessoriesIncluded: 'Nada.',
        biosOrSystemPasswordNote: '1234'
      },
      faultDiagnosis: {
        clientSymptom: 'El disco duro está roto y tiene sectores malos.',
        symptomContextAndFrequency: 'Al abrir cosas del disco D.',
        diagnosticToolsUsed: ['CrystalDiskInfo / smartctl (SMART)'],
        telemetryAndErrorCodes: 'Sale en rojo en el programa.',
        technicalDiagnosis: 'El ordenador iba lento porque el disco duro secundario estaba roto. Le pasé un programa y salía en rojo.',
        rootCauseCategory: 'Almacenamiento / Integridad de Datos'
      },
      correctiveActions: [
        {
          id: 'ca-2-1',
          stage: '2. Intervención de Hardware',
          actionVerb: 'Cambio de disco',
          technicalDescription: 'Cambié el disco roto por un SSD nuevo y copié las carpetas del cliente.',
          durationMinutes: 120
        }
      ],
      replacedParts: [
        {
          id: 'rp-2-1',
          componentName: 'Disco de 2TB',
          partNumberOrSku: '',
          removedComponentRef: 'Seagate viejo',
          installedComponentRef: 'Nuevo 2TB',
          condition: 'Nuevo OEM',
          warrantyMonths: 24,
          quantity: 1,
          unitPriceEur: 125
        }
      ],
      conformityChecks: [
        {
          id: 'cc-2-1',
          code: 'QA-DISK',
          testName: 'Comprobación de archivos',
          passed: true,
          measuredResult: 'Todo bien, abre rápido las carpetas.'
        }
      ],
      finalTechnicianNotes: 'Listo.',
      caseId: 'case-storage-cad'
    },
    modelSolutionOrder: {
      id: 'model-case-02',
      orderNumber: 'OT-2026-0108',
      createdAt: '2026-11-01T10:00',
      completedAt: '2026-11-01T16:00',
      technicianName: 'Javier Pérez — Especialista Sistemas IT',
      technicianId: 'TEC-01',
      priority: 'Preferente (24h)',
      status: 'Cerrado — Conforme',
      laborHours: 2.0,
      hourlyRateEur: 42,
      vatPercent: 21,
      client: {
        name: 'Carlos Mendoza Ruiz',
        organization: 'Mendoza Diseño Industrial',
        contactPhone: '655 819 203',
        contactEmail: 'cmendoza@mendozadiseno.com',
        authorizedBackup: true,
        warrantyClaim: false
      },
      equipment: {
        category: 'Sobremesa / Workstation',
        brand: 'Dell',
        model: 'Precision 3660 Tower',
        serialNumber: '8H4K9T3',
        assetTag: 'MDI-CAD-01',
        cpu: 'Intel Core i7-13700 (16C/24T)',
        ram: '32 GB DDR5-4400 (2x 16 GB UDIMM no ECC)',
        storage: 'C: 512 GB NVMe SK Hynix + D: 2 TB HDD SATA3 Seagate ST2000DM008 (S/N: ZFL4921M)',
        motherboardOrGpu: 'Chipset Intel W680 + NVIDIA RTX A2000 12GB',
        operatingSystem: 'Windows 11 Pro for Workstations',
        physicalIntakeState: 'Chasis ATX en perfecto estado estético, sin golpes ni abolladuras. Precinto trasero intacto.',
        accessoriesIncluded: 'Recepción exclusiva de unidad central (torre), sin cable de alimentación IEC C13 ni periféricos.',
        biosOrSystemPasswordNote: 'Cuenta local de mantenimiento habilitada con autorización firmada para volcado de datos (RGPD).'
      },
      faultDiagnosis: {
        clientSymptom: 'El cliente reporta bloqueos prolongados del Explorador de archivos ("No responde" durante varios minutos) exclusivamente al acceder a directorios alojados en el volumen secundario D:, acompañados de errores puntuales de lectura al abrir ensamblajes CAD.',
        symptomContextAndFrequency: 'Fallo constante al realizar operaciones de lectura/escritura en el volumen de datos D:; el arranque del SO en la unidad C: no presenta anomalías.',
        diagnosticToolsUsed: [
          'CrystalDiskInfo / smartctl (SMART)',
          'Visor de Eventos Windows / journalctl'
        ],
        telemetryAndErrorCodes: 'Unidad D: (Seagate ST2000DM008, S/N ZFL4921M) -> SMART Crítico: ID 05 (Sectores Reasignados) = 184 · ID C5 (Sectores Pendientes) = 47 · ID C6 (Incorregibles) = 19 · Latencia de lectura > 1.850 ms · Eventos Críticos Disk ID 7 y storahci ID 129/153 (Timeouts de bus SATA).',
        technicalDiagnosis: 'Degradación física severa de la superficie magnética en la unidad secundaria de almacenamiento HDD de 2 TB (Seagate ST2000DM008). Los bloqueos del sistema se producen por agotamiento de tiempo de espera (Timeouts de 30s en bus AHCI) cuando el cabezal lector reintenta leer los 47 sectores inestables pendientes de reasignación. La unidad principal NVMe (C:) se encuentra al 99% de salud sin errores.',
        rootCauseCategory: 'Almacenamiento / Integridad de Datos'
      },
      correctiveActions: [
        {
          id: 'ca-sol-2-1',
          stage: '3. Firmware / Sistema',
          actionVerb: 'Clonación forense y migración de datos',
          technicalDescription: 'Montaje de la unidad defectuosa ST2000DM008 en modo solo lectura y ejecución de volcado en dos fases con GNU ddrescue hacia imagen de respaldo, recuperando el 99.98% de la superficie (solo 3 archivos temporales .bak afectados, documentados en anexo).',
          durationMinutes: 65
        },
        {
          id: 'ca-sol-2-2',
          stage: '2. Intervención de Hardware',
          actionVerb: 'Sustitución de unidad de almacenamiento',
          technicalDescription: 'Retirada del disco mecánico HDD de 3.5" defectuoso e instalación de nueva unidad de estado sólido empresarial Samsung 870 EVO 2 TB SATA3 (con adaptador de bahía 2.5" a 3.5" y cable SATA3 6Gbps con clip metálico).',
          durationMinutes: 25
        },
        {
          id: 'ca-sol-2-3',
          stage: '3. Firmware / Sistema',
          actionVerb: 'Restauración de estructura y asignación de volumen',
          technicalDescription: 'Inicialización en tabla GPT, formateo NTFS con tamaño de clúster de 4 KB, asignación de letra de unidad D: para preservar rutas de referencias CAD y volcado verificado de los 1.14 TB de proyectos del cliente.',
          durationMinutes: 30
        }
      ],
      replacedParts: [
        {
          id: 'rp-sol-2-1',
          componentName: 'Unidad SSD 2 TB 2.5" SATA3 6Gb/s Samsung 870 EVO',
          partNumberOrSku: 'MZ-77E2T0B/EU',
          removedComponentRef: 'HDD Seagate ST2000DM008 (S/N: ZFL4921M)',
          installedComponentRef: 'SSD Samsung 870 EVO (S/N: S621NJ0W812904)',
          condition: 'Nuevo OEM',
          warrantyMonths: 36,
          quantity: 1,
          unitPriceEur: 142.0
        },
        {
          id: 'rp-sol-2-2',
          componentName: 'Bastidor adaptador metálico 2.5" a 3.5" + Cable SATA3 con cierre',
          partNumberOrSku: 'ACC-BRK-SATA3',
          removedComponentRef: 'Cable SATA sin pestaña de retención',
          installedComponentRef: 'Kit fijación bahía Dell + Cable SATA3 50cm',
          condition: 'Nuevo OEM',
          warrantyMonths: 24,
          quantity: 1,
          unitPriceEur: 9.5
        }
      ],
      conformityChecks: [
        {
          id: 'cc-sol-2-1',
          code: 'QA-01',
          testName: 'Auditoría SMART y Benchmark de velocidad en nueva unidad D:',
          passed: true,
          measuredResult: 'Salud SMART 100% (0 errores CRC/Reasignados) · Lectura secuencial: 558 MB/s · Escritura: 531 MB/s · Tiempo de acceso: 0.06 ms.'
        },
        {
          id: 'cc-sol-2-2',
          code: 'QA-02',
          testName: 'Verificación de integridad de árbol de directorios y vínculos CAD',
          passed: true,
          measuredResult: '48.320 archivos verificados (1.14 TB) sin errores de lectura ni eventos ID 7/129/153 en Visor de Eventos.'
        }
      ],
      finalTechnicianNotes: 'Se entrega el disco HDD retirado (S/N: ZFL4921M) debidamente etiquetado como "DEFECTUOSO - NO CONECTAR EN PRODUCCIÓN". Se aconseja configurar copia de seguridad automática 3-2-1 hacia NAS corporativo.',
      caseId: 'case-storage-cad'
    }
  },
  {
    id: 'case-no-post-ram',
    code: 'CASO-03',
    title: 'Equipo enciende ventiladores y LEDs pero no da señal de vídeo (Fallo POST DRAM)',
    difficulty: 'Intermedio (SMR / ASIR)',
    moduleTag: 'Diagnóstico de Placa Base y Memoria',
    summary: 'Tras mover la torre para limpiar su despacho, el cliente indica que el monitor dice "Sin señal".',
    learningObjective: 'Utilizar indicadores de diagnóstico de placa (EZ-Debug LED / códigos POST y MemTest86+) para aislar un fallo en un módulo DIMM y el canal de memoria, evitando diagnósticos genéricos de "placa o gráfica rota".',
    clientQuoteVerbal: '«El viernes limpiamos la oficina y movimos los ordenadores. Hoy al encenderlo se iluminan las luces de dentro y giran los ventiladores, pero la pantalla se queda negra diciendo "No Signal DisplayPort". He probado con otro cable y otro monitor y sigue igual.»',
    labProbes: [
      {
        id: 'probe-3-1',
        toolName: 'Inspección Visual de Placa Base y Slots',
        category: 'Inspección Visual / ESD',
        commandOrProcedure: 'Apertura de panel lateral de vidrio templado y revisión de fijaciones PCIe y DIMM.',
        rawOutput: 'Equipo: Sobremesa Custom Pro / Placa MSI PRO B650-P WIFI (S/N Placa: 601-7D78-020B2309) | Chasis S/N: NX-2025-8812\nCPU: AMD Ryzen 7 7700X | GPU: RTX 4060 Ti 16GB | PSU: Corsair RM750e\nObservación visual: El módulo DIMM instalado en el zócalo DIMMA2 presenta la pestaña inferior ligeramente abierta (desencajado parcial por vibración en traslado). Al encender, el LED de diagnóstico EZ-Debug en placa permanece fijo en AMARILLO (DRAM) + ROJO intermitente.',
        interpretationHint: 'El LED EZ-Debug DRAM amarillo fijo indica que la placa base no supera la fase de entrenamiento de memoria (esta placa no tiene display de códigos POST: el LED es la única pista) y por tanto nunca llega a inicializar la tarjeta gráfica (VGA).',
        keyMetricsToCite: ['EZ-Debug LED DRAM fijo', 'Zócalo DIMMA2 desencajado', 'S/N: NX-2025-8812']
      },
      {
        id: 'probe-3-2',
        toolName: 'Aislamiento por Bancos y MemTest86+ v7.0',
        category: 'Almacenamiento / Memoria',
        commandOrProcedure: 'Limpieza de contactos con limpiador de residuo cero y test individual en DIMMA2.',
        rawOutput: 'Kit instalado: 2x 16GB Corsair Vengeance DDR5-6000 CL36 (P/N: CMK32GX5M2D6000C36).\n- Módulo 1 (S/N: 234109881A) en DIMMA2: Supera POST y completa 4 pasadas de MemTest86+ con 0 errores.\n- Módulo 2 (S/N: 234109881B) en DIMMA2 o DIMMB2: Supera POST tras reasentamiento, pero arroja 412 errores de bit (bit-flip) en Test #6 y Test #8 de MemTest86+ incluso a la velocidad base JEDEC DDR5-4800 (Dirección de fallo: 0x00038A41F20).',
        interpretationHint: 'Además de haberse movido en el traslado, el segundo módulo (terminado en 881B) presenta celdas de memoria defectuosas incluso a la velocidad base JEDEC DDR5-4800 (no es un problema de perfil XMP/EXPO).',
        keyMetricsToCite: ['412 errores en MemTest86+ (Tests #6 y #8)', 'Fallo en módulo S/N 234109881B incluso a JEDEC DDR5-4800']
      },
      {
        id: 'probe-3-3',
        toolName: 'Comprobación de Tensiones PSU (Tester ATX / Multímetro)',
        category: 'Sensores / Eléctrico',
        commandOrProcedure: 'Medición de raíles principales en conector ATX 24 pines y EPS 8 pines.',
        rawOutput: 'Raíl +12V: 12.08 V\nRaíl +5V: 5.02 V\nRaíl +3.3V: 3.31 V\n+5VSB: 5.04 V\nPower Good (PG) según el tester ATX: 290 ms (el estándar ATX exige 100-500 ms).\n[El rizado no se puede medir con multímetro ni tester: requiere osciloscopio]',
        interpretationHint: 'La fuente de alimentación Corsair RM750e entrega voltajes perfectos; se descarta problema eléctrico en PSU.',
        keyMetricsToCite: ['+12.08V / +5.02V / +3.31V', 'PG: 290 ms']
      }
    ],
    flawedDraftOrder: {
      id: 'draft-case-03',
      orderNumber: 'OT-2026-0115',
      createdAt: '2026-11-01T11:30',
      completedAt: '2026-11-01T17:15',
      technicianName: 'Alumno en Prácticas',
      technicianId: 'TEC-09',
      priority: 'Estándar (48-72h)',
      status: 'En Reparación y Pruebas QA',
      laborHours: 1.5,
      hourlyRateEur: 42,
      vatPercent: 21,
      client: {
        name: 'Roberto Gómez Alarcón',
        organization: 'Agencia Creativa PixelSur',
        contactPhone: '678 112 390',
        contactEmail: 'rgomez@pixelsur.es',
        authorizedBackup: false,
        warrantyClaim: true
      },
      equipment: {
        category: 'Sobremesa / Workstation',
        brand: 'Clónico',
        model: 'PC Gaming',
        serialNumber: 'Sin número',
        assetTag: '',
        cpu: 'Ryzen 7',
        ram: '32GB',
        storage: '1TB',
        motherboardOrGpu: 'MSI y RTX 4060',
        operatingSystem: 'Windows 11',
        physicalIntakeState: 'Bien',
        accessoriesIncluded: 'Nada',
        biosOrSystemPasswordNote: 'No hace falta'
      },
      faultDiagnosis: {
        clientSymptom: 'La RAM estaba suelta y rota.',
        symptomContextAndFrequency: 'No encendía la pantalla.',
        diagnosticToolsUsed: ['MemTest86+ v7.0 (Test EFI)'],
        telemetryAndErrorCodes: 'Daba errores en la memoria.',
        technicalDiagnosis: 'No se veía la pantalla porque una memoria estaba mal puesta y además estaba rota.',
        rootCauseCategory: 'Memoria RAM / Bus de Sistema'
      },
      correctiveActions: [
        {
          id: 'ca-3-1',
          stage: '2. Intervención de Hardware',
          actionVerb: 'Cambio de RAM',
          technicalDescription: 'Puse dos memorias nuevas y actualicé la BIOS.',
          durationMinutes: 90
        }
      ],
      replacedParts: [
        {
          id: 'rp-3-1',
          componentName: 'Memoria RAM 32GB',
          partNumberOrSku: '',
          removedComponentRef: 'Las que tenía',
          installedComponentRef: 'Nuevas',
          condition: 'Nuevo OEM',
          warrantyMonths: 24,
          quantity: 1,
          unitPriceEur: 118
        }
      ],
      conformityChecks: [
        {
          id: 'cc-3-1',
          code: 'QA-RAM',
          testName: 'Prueba de encendido',
          passed: true,
          measuredResult: 'Ya da vídeo y funciona bien.'
        }
      ],
      finalTechnicianNotes: 'Todo ok.',
      caseId: 'case-no-post-ram'
    },
    modelSolutionOrder: {
      id: 'model-case-03',
      orderNumber: 'OT-2026-0115',
      createdAt: '2026-11-01T11:30',
      completedAt: '2026-11-01T17:15',
      technicianName: 'Javier Pérez — Especialista Sistemas IT',
      technicianId: 'TEC-01',
      priority: 'Estándar (48-72h)',
      status: 'Cerrado — Conforme',
      laborHours: 1.5,
      hourlyRateEur: 42,
      vatPercent: 21,
      client: {
        name: 'Roberto Gómez Alarcón',
        organization: 'Agencia Creativa PixelSur',
        contactPhone: '678 112 390',
        contactEmail: 'rgomez@pixelsur.es',
        authorizedBackup: false,
        warrantyClaim: true
      },
      equipment: {
        category: 'Sobremesa / Workstation',
        brand: 'Custom Workstation (Placa MSI)',
        model: 'PRO B650-P WIFI / Chasis NZXT H5 Flow',
        serialNumber: 'NX-2025-8812 (S/N Placa: 601-7D78-020B2309)',
        assetTag: 'PXL-EDT-03',
        cpu: 'AMD Ryzen 7 7700X (8C/16T, Socket AM5)',
        ram: '32 GB (2x16 GB) Corsair Vengeance DDR5-6000 CL36 (CMK32GX5M2D6000C36)',
        storage: '1 TB NVMe WD Black SN850X PCIe 4.0',
        motherboardOrGpu: 'MSI PRO B650-P WIFI + NVIDIA GeForce RTX 4060 Ti 16GB',
        operatingSystem: 'Windows 11 Pro 23H2',
        physicalIntakeState: 'Lateral de cristal templado intacto; sin daños cosméticos exteriores. En inspección interna se observa pestaña inferior del zócalo DIMMA2 parcialmente abierta.',
        accessoriesIncluded: 'Solo torre central (sin cable IEC ni periféricos).',
        biosOrSystemPasswordNote: 'No requiere acceso al SO; pruebas ejecutadas sobre entorno pre-boot UEFI.'
      },
      faultDiagnosis: {
        clientSymptom: 'El cliente indica que tras reubicar físicamente el equipo en la oficina, la torre enciende la iluminación interna y los ventiladores al pulsar el botón de encendido, pero el monitor muestra "No Signal DisplayPort" incluso probando otro cable y pantalla.',
        symptomContextAndFrequency: 'Bloqueo total en fase de arranque inicial (No-POST / Sin señal de vídeo) en el 100% de los ciclos de encendido.',
        diagnosticToolsUsed: [
          'MemTest86+ v7.0 (Test EFI)',
          'Polímetro Digital TrueRMS / Tester ATX',
          'Tarjeta POST PCIe / Analizador LPC'
        ],
        telemetryAndErrorCodes: 'Indicador EZ-Debug LED en placa base bloqueado en estado DRAM (Amarillo fijo) · Tensiones PSU nominales (+12.08V, +5.02V, +3.31V, PG 290ms) · Módulo 1 (S/N 234109881A): 0 errores · Módulo 2 (S/N 234109881B): 412 errores de celda en Tests #6 y #8 de MemTest86+ a la velocidad base JEDEC DDR5-4800.',
        technicalDiagnosis: 'Fallo en la secuencia de Power-On Self-Test (POST) en la fase de inicialización de memoria DRAM causado por desencajamiento parcial del módulo en DIMMA2 durante el traslado y degradación física de chips de memoria en el segundo módulo DIMM (P/N CMK32GX5M2D6000C36, S/N 234109881B), el cual arroja 412 errores de bit en MemTest86+ incluso a la velocidad base JEDEC DDR5-4800.',
        rootCauseCategory: 'Memoria RAM / Bus de Sistema'
      },
      correctiveActions: [
        {
          id: 'ca-sol-3-1',
          stage: '1. Seguridad ESD y Desmontaje',
          actionVerb: 'Desmontaje y limpieza de contactos',
          technicalDescription: 'Extracción de ambos módulos DDR5 en banco protegido ESD y limpieza de los zócalos DIMMA2/DIMMB2 con limpiador de contactos dieléctrico de residuo cero.',
          durationMinutes: 20
        },
        {
          id: 'ca-sol-3-2',
          stage: '2. Intervención de Hardware',
          actionVerb: 'Sustitución de kit de memoria en garantía',
          technicalDescription: 'Sustitución del kit emparejado dual-channel 2x16 GB DDR5-6000 (se reemplaza la pareja completa para garantizar compatibilidad de subtimings en Dual Channel) e inserción firme en slots DIMMA2 y DIMMB2 con cierre completo de pestañas de retención.',
          durationMinutes: 20
        },
        {
          id: 'ca-sol-3-3',
          stage: '3. Firmware / Sistema',
          actionVerb: 'Actualización de microcódigo / UEFI',
          technicalDescription: 'Actualización de BIOS MSI a versión 7D78v1E (AGESA ComboPI 1.1.0.2b) para optimizar el entrenamiento de memoria DDR5 (Memory Context Restore habilitado) y activación de perfil AMD EXPO I a 6000 MT/s.',
          durationMinutes: 50
        }
      ],
      replacedParts: [
        {
          id: 'rp-sol-3-1',
          componentName: 'Kit Memoria RAM 32GB (2x16GB) Corsair Vengeance DDR5-6000 CL36',
          partNumberOrSku: 'CMK32GX5M2D6000C36',
          removedComponentRef: 'Kit S/N: 234109881A / 234109881B (Defectuoso)',
          installedComponentRef: 'Kit Nuevo S/N: 241804512A / 241804512B',
          condition: 'Nuevo OEM',
          warrantyMonths: 36,
          quantity: 1,
          unitPriceEur: 0.0
        }
      ],
      conformityChecks: [
        {
          id: 'cc-sol-3-1',
          code: 'QA-01',
          testName: 'Verificación exhaustiva MemTest86+ v7.0 con perfil EXPO 6000 MT/s activo',
          passed: true,
          measuredResult: '4 pasadas completas (13/13 algoritmos) finalizadas con 0 errores (Duración: 1h 12m).'
        },
        {
          id: 'cc-sol-3-2',
          code: 'QA-02',
          testName: 'Tiempo de arranque POST y salida de vídeo DisplayPort',
          passed: true,
          measuredResult: 'Supera POST en 14 segundos (Memory Context Restore activo) con señal estable 2560x1440 @ 144Hz en RTX 4060 Ti.'
        }
      ],
      finalTechnicianNotes: 'Sustitución del kit de memoria cubierta en garantía del fabricante (RMA tramitado, importe 0,00 € en pieza). Se instruye al cliente para transportar el equipo siempre en posición horizontal y verificar anclajes.',
      caseId: 'case-no-post-ram'
    }
  },
  {
    id: 'case-power-dcjack',
    code: 'CASO-04',
    title: 'Fallo intermitente de carga por fractura de soldadura en DC-Jack / Etapa de entrada',
    difficulty: 'Intermedio (SMR / ASIR)',
    moduleTag: 'Electrónica y Alimentación',
    summary: 'El estudiante universitario dice que la batería no carga salvo que sujete el cable doblado hacia un lado y que la punta del cargador se calienta mucho.',
    learningObjective: 'Medir tensión en vacío vs bajo carga, identificar falsos contactos por fatiga mecánica en el conector DC-Jack y documentar una reparación electrónica o sustitución de arnés de carga con pruebas de consumo.',
    clientQuoteVerbal: '«Para que cargue tengo que poner un libro apretando el cable del cargador hacia atrás, porque si lo suelto se quita el icono de cargando. Además la puntita del enchufe que entra al portátil se pone ardiendo y huele un poco a plástico.»',
    labProbes: [
      {
        id: 'probe-4-1',
        toolName: 'Inspección bajo Microscopio Estereoscópico',
        category: 'Inspección Visual / ESD',
        commandOrProcedure: 'Inspección de puerto de carga lateral y conector en placa base.',
        rawOutput: 'Equipo: ASUS VivoBook Pro 15 OLED (K3500PC) | S/N: MBN0CX049218\nEspecificaciones: Intel Core i5-11300H · 16GB RAM · 512GB NVMe · GPU RTX 3050\nHallazgo óptico: El conector DC-Jack cilíndrico de 4.5x3.0mm (soldado en placa hija / arnés flexible P/N: 14028-00180100) presenta el pin central desplazado, plástico aislante oscurecido por arco eléctrico y fractura anular (grieta fría) en la soldadura del terminal positivo (+19V).',
        interpretationHint: 'La resistencia de contacto provocada por la soldadura fracturada genera efecto Joule (calor y arco eléctrico), calentando la clavija.',
        keyMetricsToCite: ['S/N: MBN0CX049218', 'P/N: 14028-00180100', 'Fractura de soldadura y arco eléctrico en pin central']
      },
      {
        id: 'probe-4-2',
        toolName: 'Medición con Polímetro TrueRMS y Fuente de Laboratorio',
        category: 'Sensores / Eléctrico',
        commandOrProcedure: 'Medición de caída de tensión en MOSFETs de entrada y salida del adaptador AC.',
        rawOutput: 'Adaptador AC original ASUS 120W (19.0V - 6.32A):\n- Tensión en vacío: 19.15 V DC (Correcta, pero el conector macho de 4.5mm presenta picaduras por chispazo).\n- Tensión tras DC-Jack en placa al mover el cable: Caídas abruptas de 19.1V a 4.2V y 0V.\n- Con alimentación directa desde fuente de laboratorio a 19.0V: El circuito charger (BQ24780S) conmuta correctamente los MOSFETs de entrada y carga la batería a 2.15A constantes.',
        interpretationHint: 'El circuito integrado de carga BQ24780S y la placa base están intactos; el fallo reside en el conector DC-Jack y el deterioro térmico de la clavija del cargador.',
        keyMetricsToCite: ['Caída de 19.1V a 4.2V/0V en DC-Jack', 'IC Charger BQ24780S operativo a 2.15A']
      }
    ],
    flawedDraftOrder: {
      id: 'draft-case-04',
      orderNumber: 'OT-2026-0122',
      createdAt: '2026-11-01T12:00',
      completedAt: '2026-11-01T18:00',
      technicianName: 'Alumno en Prácticas',
      technicianId: 'TEC-09',
      priority: 'Estándar (48-72h)',
      status: 'En Reparación y Pruebas QA',
      laborHours: 1.5,
      hourlyRateEur: 42,
      vatPercent: 21,
      client: {
        name: 'Lucía Fernández Torres',
        organization: 'Particular (Estudiante Ingeniería)',
        contactPhone: '699 304 118',
        contactEmail: 'lucia.ft@correo.es',
        authorizedBackup: false,
        warrantyClaim: false
      },
      equipment: {
        category: 'Portátil / Ultrabook',
        brand: 'ASUS',
        model: 'VivoBook',
        serialNumber: 'MBN0CX049218',
        assetTag: '',
        cpu: 'i5',
        ram: '16GB',
        storage: '512GB',
        motherboardOrGpu: 'RTX 3050',
        operatingSystem: 'Windows 11',
        physicalIntakeState: 'El agujero del cargador está quemado.',
        accessoriesIncluded: 'Cargador',
        biosOrSystemPasswordNote: ''
      },
      faultDiagnosis: {
        clientSymptom: 'El enchufe del portátil está roto.',
        symptomContextAndFrequency: 'Al enchufarlo.',
        diagnosticToolsUsed: ['Polímetro Digital TrueRMS / Tester ATX'],
        telemetryAndErrorCodes: 'No pasan los voltios bien.',
        technicalDiagnosis: 'El cacharrito donde se enchufa el cargador estaba roto y quemado por dentro.',
        rootCauseCategory: 'Mecánico / Soldadura / Conectores'
      },
      correctiveActions: [
        {
          id: 'ca-4-1',
          stage: '2. Intervención de Hardware',
          actionVerb: 'Soldar conector',
          technicalDescription: 'Cambié el enchufe de carga de dentro y ya carga.',
          durationMinutes: 60
        }
      ],
      replacedParts: [
        {
          id: 'rp-4-1',
          componentName: 'Conector de carga',
          partNumberOrSku: '',
          removedComponentRef: 'Quemado',
          installedComponentRef: 'Nuevo',
          condition: 'Nuevo OEM',
          warrantyMonths: 6,
          quantity: 1,
          unitPriceEur: 18
        }
      ],
      conformityChecks: [
        {
          id: 'cc-4-1',
          code: 'QA-CHG',
          testName: 'Prueba de carga',
          passed: true,
          measuredResult: 'Carga bien sin moverse.'
        }
      ],
      finalTechnicianNotes: 'Arreglado.',
      caseId: 'case-power-dcjack'
    },
    modelSolutionOrder: {
      id: 'model-case-04',
      orderNumber: 'OT-2026-0122',
      createdAt: '2026-11-01T12:00',
      completedAt: '2026-11-01T18:00',
      technicianName: 'Javier Pérez — Especialista Sistemas IT',
      technicianId: 'TEC-01',
      priority: 'Estándar (48-72h)',
      status: 'Cerrado — Conforme',
      laborHours: 1.5,
      hourlyRateEur: 42,
      vatPercent: 21,
      client: {
        name: 'Lucía Fernández Torres',
        organization: 'Particular (Estudiante Ingeniería)',
        contactPhone: '699 304 118',
        contactEmail: 'lucia.ft@correo.es',
        authorizedBackup: false,
        warrantyClaim: false
      },
      equipment: {
        category: 'Portátil / Ultrabook',
        brand: 'ASUS',
        model: 'VivoBook Pro 15 OLED (K3500PC)',
        serialNumber: 'MBN0CX049218',
        assetTag: 'N/A (Particular)',
        cpu: 'Intel Core i5-11300H (4C/8T)',
        ram: '16 GB DDR4-3200 MHz integrados',
        storage: '512 GB SSD NVMe Intel 670p',
        motherboardOrGpu: 'NVIDIA GeForce RTX 3050 Laptop 4GB',
        operatingSystem: 'Windows 11 Home 23H2',
        physicalIntakeState: 'Chasis de aluminio sin abolladuras; el puerto lateral de alimentación DC presenta signos de carbonización térmica en el anillo aislante interior.',
        accessoriesIncluded: 'Adaptador AC ASUS 120W 19V-6.32A (clavija 4.5x3.0mm con desgaste por chispazo en el pin interior).',
        biosOrSystemPasswordNote: 'No se requiere acceso a sesión de usuario.'
      },
      faultDiagnosis: {
        clientSymptom: 'La clienta manifiesta que el equipo solo recibe carga si se fuerza mecánicamente el cable del cargador hacia un ángulo concreto, detectando además sobrecalentamiento acusado y olor a plástico quemado en el extremo de la clavija.',
        symptomContextAndFrequency: 'Interrupción continua de alimentación AC al menor movimiento del cable; riesgo de cortocircuito en etapa de entrada de 19V.',
        diagnosticToolsUsed: [
          'Microscopio Estereoscópico de Taller',
          'Polímetro Digital TrueRMS / Tester ATX',
          'Fuente de Laboratorio Regulable (Consumo DC)',
          'Cámara Termográfica Infrarroja'
        ],
        telemetryAndErrorCodes: 'Caída de tensión post-conector de 19.15V a 4.2V/0V por falso contacto · Temperatura en clavija antes de reparar: 84 °C por resistencia de contacto (efecto Joule) · Circuito controlador de carga BQ24780S y MOSFETs de entrada operativos con consumo de carga estable de 2.15A (41W).',
        technicalDiagnosis: 'Fallo electromecánico en el conector de alimentación DC-Jack (4.5x3.0mm) por fatiga mecánica y fractura anular de la soldadura del pin central positivo (+19V). La elevada resistencia de contacto originó microarcos eléctricos y calentamiento por efecto Joule, deteriorando térmicamente tanto el zócalo hembra en placa como el recubrimiento interno del conector macho del cable DC.',
        rootCauseCategory: 'Mecánico / Soldadura / Conectores'
      },
      correctiveActions: [
        {
          id: 'ca-sol-4-1',
          stage: '1. Seguridad ESD y Desmontaje',
          actionVerb: 'Desmontaje y aislamiento ESD',
          technicalDescription: 'Apertura de carcasa inferior, desconexión de batería de 63Wh y extracción de la placa base para trabajo en estación de soldadura.',
          durationMinutes: 20
        },
        {
          id: 'ca-sol-4-2',
          stage: '2. Intervención de Hardware',
          actionVerb: 'Resoldado y reconstrucción de pistas',
          technicalDescription: 'Desoldado del zócalo DC-Jack dañado mediante aire caliente y malla desoldadora, saneamiento de pads de masa y línea +19V, y soldadura de conector DC-Jack OEM nuevo (P/N 14028-00180100) con refuerzo mecánico en anclajes de chasis.',
          durationMinutes: 45
        },
        {
          id: 'ca-sol-4-3',
          stage: '2. Intervención de Hardware',
          actionVerb: 'Sustitución de latiguillo DC del adaptador',
          technicalDescription: 'Sustitución del cable de salida DC 4.5x3.0mm del cargador de 120W (cuya punta presentaba picaduras por arco eléctrico) para evitar que dañe el nuevo zócalo instalado.',
          durationMinutes: 25
        }
      ],
      replacedParts: [
        {
          id: 'rp-sol-4-1',
          componentName: 'Conector DC-Jack 4.5x3.0mm de alta corriente ASUS K3500',
          partNumberOrSku: '14028-00180100',
          removedComponentRef: 'DC-Jack original (Pin central carbonizado)',
          installedComponentRef: 'Nuevo OEM 14028-00180100',
          condition: 'Nuevo OEM',
          warrantyMonths: 12,
          quantity: 1,
          unitPriceEur: 16.5
        },
        {
          id: 'rp-sol-4-2',
          componentName: 'Cable de reparación DC 4.5x3.0mm con pin central 120W (6.32A)',
          partNumberOrSku: 'CBL-DC-AS4530',
          removedComponentRef: 'Latiguillo con aislamiento fundido',
          installedComponentRef: 'Latiguillo blindado 16AWG nuevo',
          condition: 'Nuevo Equivalente Certificado',
          warrantyMonths: 12,
          quantity: 1,
          unitPriceEur: 12.0
        }
      ],
      conformityChecks: [
        {
          id: 'cc-sol-4-1',
          code: 'QA-01',
          testName: 'Estabilidad de tensión +19V ante esfuerzo axial/lateral moderado',
          passed: true,
          measuredResult: '19.12 V constantes en bobina de entrada sin fluctuaciones ni microcortes de conmutación AC/BAT.'
        },
        {
          id: 'cc-sol-4-2',
          code: 'QA-02',
          testName: 'Inspección termográfica del conector tras 45 min a 100W de carga',
          passed: true,
          measuredResult: 'Temperatura máxima en cuerpo del DC-Jack: 34.5 °C (reducción de 49.5 °C respecto a la avería inicial).'
        }
      ],
      finalTechnicianNotes: 'Se advierte a la usuaria de la importancia de no forzar lateralmente la clavija del cargador al utilizar el equipo sobre superficies blandas.',
      caseId: 'case-power-dcjack'
    }
  },
  {
    id: 'case-nas-raid',
    code: 'CASO-05',
    title: 'Inaccesibilidad a carpetas compartidas SMB y pitido de alarma en NAS Pyme (RAID 1 + Conflicto IP)',
    difficulty: 'Avanzado (Soporte Nivel 2-3)',
    moduleTag: 'Servicios en Red y Almacenamiento RAID',
    summary: 'Una gestoría cambia de operador de fibra y, además de no poder entrar a las carpetas de red, el servidor NAS pita cada 5 segundos.',
    learningObjective: 'Diagnosticar incidencias concurrentes (capa de red IPv4 tras cambio de gateway/subred + degradación de matriz RAID 1 en almacenamiento) documentando direccionamiento y estado del pool.',
    clientQuoteVerbal: '«Ayer vino el instalador de la compañía telefónica a cambiarnos el router de fibra y desde entonces ningún ordenador de la oficina puede abrir la unidad Z: de Contabilidad. Encima, la cajita negra del servidor que está en el armario no para de pitar y tiene una luz naranja parpadeando.»',
    labProbes: [
      {
        id: 'probe-5-1',
        toolName: 'Auditoría de Red y Tabla ARP',
        category: 'Logs / Firmware / Red',
        commandOrProcedure: 'Escaneo de subred LAN, comprobación de puerta de enlace y acceso por puerto serie/consola local.',
        rawOutput: 'Equipo: Synology DiskStation DS723+ (2 Bahías) | S/N: 2350TW891204\n- Router antiguo: Subred 192.168.1.0/24 · Router nuevo del ISP: Subred 192.168.18.0/24 (DHCP activo .18.100-.18.200).\n- El NAS tenía IP estática configurada en 192.168.1.250/24 con Gateway 192.168.1.1 -> Inalcanzable desde los puestos que ahora reciben IP en el rango 192.168.18.x.',
        interpretationHint: 'Primera causa raíz: desalineación de subred IPv4 tras la sustitución del router del ISP (192.168.1.0/24 vs 192.168.18.0/24).',
        keyMetricsToCite: ['S/N: 2350TW891204', 'Conflicto de subred 192.168.1.250/24 vs 192.168.18.0/24']
      },
      {
        id: 'probe-5-2',
        toolName: 'Estado del Pool de Almacenamiento (mdadm / DSM Storage Manager)',
        category: 'Almacenamiento / Memoria',
        commandOrProcedure: 'Inspección del Storage Pool 1 (SHR / RAID 1 Btrfs) tras acceso directo por interfaz Ethernet.',
        rawOutput: 'Estado del Pool 1 (RAID 1 - 4TB Btrfs): DEGRADADO (Alarma acústica activa, LED Status Ámbar).\n- Bahía 1 (WD Red Plus WD40EFPX - S/N: WD-WCC7K2019): Saludable (Normal, 36 °C).\n- Bahía 2 (WD Red Plus WD40EFPX - S/N: WD-WCC7K2044): FALLO DE PARTICIÓN DE SISTEMA E I/O -> Desconectado del array RAID 1 tras corte eléctrico realizado por el instalador al desenchufar la regleta del rack sin apagar el NAS.\nSMART Bahía 2: ID C5 = 12 sectores pendientes, errores de escritura Aborted Command.',
        interpretationHint: 'Segunda causa raíz concurrente: el corte brusco de suministro durante el cambio de router provocó la caída de la unidad de la Bahía 2 (S/N WD-WCC7K2044) con 12 sectores pendientes, dejando el RAID 1 degradado.',
        keyMetricsToCite: ['RAID 1 Degradado', 'Bahía 2 WD40EFPX (S/N WD-WCC7K2044)', 'ID C5 = 12 tras corte eléctrico']
      }
    ],
    flawedDraftOrder: {
      id: 'draft-case-05',
      orderNumber: 'OT-2026-0130',
      createdAt: '2026-11-01T08:45',
      completedAt: '2026-11-01T14:30',
      technicianName: 'Alumno en Prácticas',
      technicianId: 'TEC-09',
      priority: 'Crítica / Parada de Servicio (SLA 4h)',
      status: 'En Reparación y Pruebas QA',
      laborHours: 2.5,
      hourlyRateEur: 55,
      vatPercent: 21,
      client: {
        name: 'Miguel Ángel Soto',
        organization: 'Asesoría Fiscal Soto & Asociados',
        contactPhone: '914 220 815',
        contactEmail: 'it@asesoriasoto.es',
        authorizedBackup: true,
        warrantyClaim: false
      },
      equipment: {
        category: 'Servidor / NAS',
        brand: 'Synology',
        model: 'Caja negra 2 discos',
        serialNumber: '2350TW891204',
        assetTag: '',
        cpu: 'AMD',
        ram: '2GB',
        storage: '4TB',
        motherboardOrGpu: 'N/A',
        operatingSystem: 'Synology',
        physicalIntakeState: 'Pitando.',
        accessoriesIncluded: 'En el rack.',
        biosOrSystemPasswordNote: 'admin'
      },
      faultDiagnosis: {
        clientSymptom: 'El router nuevo cambió la IP y un disco estaba roto.',
        symptomContextAndFrequency: 'Desde ayer.',
        diagnosticToolsUsed: ['Analizador de Red / Fluke Cable Tester'],
        telemetryAndErrorCodes: 'Luz naranja.',
        technicalDiagnosis: 'El aparato pitaba porque se rompió un disco al apagarlo mal y además no iba internet hacia las carpetas porque cambiaron el router.',
        rootCauseCategory: 'Red / Configuración de Servicios'
      },
      correctiveActions: [
        {
          id: 'ca-5-1',
          stage: '3. Firmware / Sistema',
          actionVerb: 'Configurar red y disco',
          technicalDescription: 'Cambié la IP del NAS y metí un disco nuevo para que dejara de pitar.',
          durationMinutes: 150
        }
      ],
      replacedParts: [
        {
          id: 'rp-5-1',
          componentName: 'Disco 4TB',
          partNumberOrSku: '',
          removedComponentRef: 'Disco 2',
          installedComponentRef: 'Nuevo 4TB',
          condition: 'Nuevo OEM',
          warrantyMonths: 36,
          quantity: 1,
          unitPriceEur: 138
        }
      ],
      conformityChecks: [
        {
          id: 'cc-5-1',
          code: 'QA-NAS',
          testName: 'Probar unidad Z',
          passed: true,
          measuredResult: 'Todo ok, ya entran todos y no pita.'
        }
      ],
      finalTechnicianNotes: 'Arreglado.',
      caseId: 'case-nas-raid'
    },
    modelSolutionOrder: {
      id: 'model-case-05',
      orderNumber: 'OT-2026-0130',
      createdAt: '2026-11-01T08:45',
      completedAt: '2026-11-01T14:30',
      technicianName: 'Javier Pérez — Especialista Sistemas IT',
      technicianId: 'TEC-01',
      priority: 'Crítica / Parada de Servicio (SLA 4h)',
      status: 'Cerrado — Conforme',
      laborHours: 2.5,
      hourlyRateEur: 55,
      vatPercent: 21,
      client: {
        name: 'Miguel Ángel Soto',
        organization: 'Asesoría Fiscal Soto & Asociados',
        contactPhone: '914 220 815',
        contactEmail: 'it@asesoriasoto.es',
        authorizedBackup: true,
        warrantyClaim: false
      },
      equipment: {
        category: 'Servidor / NAS',
        brand: 'Synology',
        model: 'DiskStation DS723+ (2-Bay NAS)',
        serialNumber: '2350TW891204',
        assetTag: 'SOTO-NAS-01',
        cpu: 'AMD Ryzen Embedded R1600 Dual-Core 2.6 GHz',
        ram: '2 GB DDR4 ECC SO-DIMM',
        storage: '2x 4 TB WD Red Plus SATA3 CMR (WD40EFPX) en RAID 1 Btrfs',
        motherboardOrGpu: 'Doble interfaz 1GbE RJ-45',
        operatingSystem: 'Synology DSM 7.2.1-69057 Update 5',
        physicalIntakeState: 'Alojado en armario rack mural 6U sin daños físicos; LED frontal STATUS en ámbar parpadeante y señal acústica activa. Sin SAI (UPS) de respaldo conectado.',
        accessoriesIncluded: 'Fuente externa original 65W 12V y latiguillo Cat6 conectado a switch principal.',
        biosOrSystemPasswordNote: 'Credenciales de administrador DSM verificadas con responsable IT de la gestoría.'
      },
      faultDiagnosis: {
        clientSymptom: 'El cliente reporta que tras la sustitución del router de fibra por parte de la operadora ningún equipo de la oficina puede acceder a la unidad de red compartida (Z: Contabilidad), y que el servidor NAS emite un pitido continuo con un indicador luminoso naranja.',
        symptomContextAndFrequency: 'Pérdida del 100% de conectividad SMB en los 8 puestos de trabajo desde el cambio de router del ISP.',
        diagnosticToolsUsed: [
          'Analizador de Red / Fluke Cable Tester',
          'CrystalDiskInfo / smartctl (SMART)',
          'Visor de Eventos Windows / journalctl'
        ],
        telemetryAndErrorCodes: 'Desalineación de subred IPv4: NAS estático en 192.168.1.250/24 frente a nuevo direccionamiento LAN 192.168.18.0/24 · Estado Storage Pool 1 (RAID 1): DEGRADADO · Bahía 2 (WD40EFPX, S/N WD-WCC7K2044) expulsada del array con SMART ID C5 = 12 sectores pendientes tras corte eléctrico sin apagado ordenado.',
        technicalDiagnosis: 'Incidencia doble concurrente originada durante el cambio de router: (1) Aislamiento en capa de red IPv4 debido a que el nuevo router del ISP opera en la subred 192.168.18.0/24 mientras el NAS mantenía IP fija en 192.168.1.250/24; y (2) Degradación del volumen espejo RAID 1 (que dispara la alarma acústica y el LED ámbar) por fallo de sectores pendientes (SMART ID C5 = 12) en el disco de la Bahía 2 tras sufrir un corte brusco de alimentación eléctrica durante la intervención del instalador.',
        rootCauseCategory: 'Red / Configuración de Servicios'
      },
      correctiveActions: [
        {
          id: 'ca-sol-5-1',
          stage: '3. Firmware / Sistema',
          actionVerb: 'Reconfiguración de direccionamiento IPv4 y SMB',
          technicalDescription: 'Acceso directo por consola Ethernet, reconfiguración de la LAN del router ISP al rango histórico corporativo 192.168.1.0/24 con reserva DHCP estática para el NAS en 192.168.1.250/24 (evitando reconfigurar impresoras de red y mapeos GPO en los 8 puestos).',
          durationMinutes: 35
        },
        {
          id: 'ca-sol-5-2',
          stage: '2. Intervención de Hardware',
          actionVerb: 'Sustitución en caliente (Hot-Swap) de unidad RAID',
          technicalDescription: 'Verificación previa de copia de seguridad externa, extracción de la unidad degradada de la Bahía 2 (S/N: WD-WCC7K2044) e inserción de disco nuevo WD Red Plus 4 TB CMR (WD40EFPX).',
          durationMinutes: 25
        },
        {
          id: 'ca-sol-5-3',
          stage: '3. Firmware / Sistema',
          actionVerb: 'Reconstrucción y resincronización lógica',
          technicalDescription: 'Inicio del proceso de reparación y resincronización del Storage Pool 1 (RAID 1 Btrfs) en DSM y ejecución de Data Scrubbing (inspección de sumas de verificación Btrfs).',
          durationMinutes: 90
        }
      ],
      replacedParts: [
        {
          id: 'rp-sol-5-1',
          componentName: 'Disco Duro NAS 4 TB 3.5" WD Red Plus SATA3 CMR 5400 RPM',
          partNumberOrSku: 'WD40EFPX-68C6CN0',
          removedComponentRef: 'WD40EFPX S/N: WD-WCC7K2044 (12 sectores C5)',
          installedComponentRef: 'WD40EFPX S/N: WD-WCC7K88912 (Nuevo)',
          condition: 'Nuevo OEM',
          warrantyMonths: 36,
          quantity: 1,
          unitPriceEur: 136.0
        }
      ],
      conformityChecks: [
        {
          id: 'cc-sol-5-1',
          code: 'QA-01',
          testName: 'Estado del Pool RAID 1 y Salud SMART de ambas bahías',
          passed: true,
          measuredResult: 'Pool 1: SALUDABLE (Resincronización 100% completada, 0 errores de suma Btrfs) · Bahía 1 y 2 a 35 °C.'
        },
        {
          id: 'cc-sol-5-2',
          code: 'QA-02',
          testName: 'Acceso a recursos compartidos SMB3 (Unidad Z:) desde los 8 puestos',
          passed: true,
          measuredResult: 'Ping 192.168.1.250 < 1 ms (0% pérdida) · Transferencia sostenida SMB3: 112 MB/s.'
        }
      ],
      finalTechnicianNotes: 'Se presupuesta e insta encarecidamente a la instalación de un SAI (UPS) de al menos 750VA con comunicación USB al NAS Synology para automatizar el apagado seguro ante cortes eléctricos.',
      caseId: 'case-nas-raid'
    }
  },
  {
    id: 'case-psu-bsod',
    code: 'CASO-06',
    title: 'Pantallazos azules (VIDEO_TDR_FAILURE) y reinicios al exportar vídeo 4K (Caída raíl +12V PSU)',
    difficulty: 'Avanzado (Soporte Nivel 2-3)',
    moduleTag: 'Fuentes Conmutadas y Estabilidad GPU',
    summary: 'Un editor de vídeo reporta que al exportar en DaVinci Resolve la pantalla parpadea en negro, sale pantalla azul o se reinicia el PC.',
    learningObjective: 'Relacionar fallos aparentes de tarjeta gráfica (TDR Timeout 0x116) con su verdadera causa eléctrica en la fuente de alimentación ATX (caída en el raíl de +12V a 11.08V y rizado excesivo bajo picos transitorios).',
    clientQuoteVerbal: '«Mientras corto clips en DaVinci Resolve va perfecto, pero cuando le doy al botón de Renderizar en 4K, al minuto la pantalla se pone negra, a veces sale un pantallazo azul que dice algo de nvlddmkm.sys y otras veces se reinicia entero. Creo que se me ha roto la tarjeta gráfica.»',
    labProbes: [
      {
        id: 'probe-6-1',
        toolName: 'Análisis de Volcados de Memoria (WinDbg Minidump)',
        category: 'Logs / Firmware / Red',
        commandOrProcedure: 'Inspección de C:\\Windows\\Minidump\\110126-14200-01.dmp y Eventos WHEA.',
        rawOutput: 'Equipo: Workstation Edición Vídeo Custom | Chasis Fractal North (S/N: FD-N-2023-4410)\nCPU: Intel Core i9-12900K | GPU: NVIDIA RTX 3080 10GB (TDP 320W) | PSU: Fuente 650W 80+ Bronze (5 años de antigüedad, S/N: PSU-B650-9912).\nBugCheck 0x116 (VIDEO_TDR_FAILURE) en módulo nvlddmkm.sys · Evento ID 4101 (Display): El controlador de pantalla nvlddmkm dejó de responder.',
        interpretationHint: 'Un BugCheck 0x116 indica que la GPU dejó de responder al sistema operativo, pero puede deberse tanto a fallo de la propia GPU como a falta de alimentación eléctrica en los conectores PCIe de 8 pines.',
        keyMetricsToCite: ['S/N: FD-N-2023-4410', 'BugCheck 0x116 (VIDEO_TDR_FAILURE)', 'Evento Display ID 4101']
      },
      {
        id: 'probe-6-2',
        toolName: 'Medición Bajo Carga con Osciloscopio y Sensores HWiNFO64',
        category: 'Sensores / Eléctrico',
        commandOrProcedure: 'Monitorización del raíl +12V PCIe durante carga combinada FurMark + Prime95.',
        rawOutput: 'En reposo (Idle 65W): Raíl +12V = 11.88 V.\nAl aplicar carga en RTX 3080 (Pico de 320W): El raíl +12V cae abruptamente a 11.08 V (fuera de la tolerancia ATX ±5% cuyo mínimo admisible es 11.40 V) con rizado de alta frecuencia de 165 mVpp (máximo ATX: 120 mVpp).\nNota de cableado: La RTX 3080 estaba conectada usando un único cable PCIe en guirnalda (daisy-chain) desde una fuente de 650W con condensadores secundarios electrolíticos abombados.',
        interpretationHint: '¡La tarjeta gráfica está sana! El fallo se produce porque la fuente de 650W cae a 11.08V (por debajo del mínimo ATX de 11.40V) y tiene un rizado de 165 mVpp, además de usar un solo cable PCIe en daisy-chain.',
        keyMetricsToCite: ['Caída +12V a 11.08 V (Mín. ATX 11.40 V)', 'Rizado 165 mVpp', 'Conexión PCIe en daisy-chain']
      }
    ],
    flawedDraftOrder: {
      id: 'draft-case-06',
      orderNumber: 'OT-2026-0141',
      createdAt: '2026-11-01T09:00',
      completedAt: '2026-11-01T15:00',
      technicianName: 'Alumno en Prácticas',
      technicianId: 'TEC-09',
      priority: 'Preferente (24h)',
      status: 'En Reparación y Pruebas QA',
      laborHours: 1.5,
      hourlyRateEur: 42,
      vatPercent: 21,
      client: {
        name: 'Daniela Ortiz Vega',
        organization: 'Productora Audiovisual FrameLab',
        contactPhone: '644 902 117',
        contactEmail: 'dortiz@framelab.tv',
        authorizedBackup: false,
        warrantyClaim: false
      },
      equipment: {
        category: 'Sobremesa / Workstation',
        brand: 'Fractal',
        model: 'Torre edición',
        serialNumber: 'FD-N-2023-4410',
        assetTag: '',
        cpu: 'i9',
        ram: '64GB',
        storage: '2TB',
        motherboardOrGpu: 'RTX 3080',
        operatingSystem: 'Windows 11',
        physicalIntakeState: 'Bien',
        accessoriesIncluded: 'Ninguno',
        biosOrSystemPasswordNote: 'Sin clave'
      },
      faultDiagnosis: {
        clientSymptom: 'La fuente estaba rota y no daba suficientes vatios a la gráfica.',
        symptomContextAndFrequency: 'Al hacer vídeos.',
        diagnosticToolsUsed: ['OCCT / Prime95 / FurMark (Stress Test)'],
        telemetryAndErrorCodes: 'Pantallazo azul.',
        technicalDiagnosis: 'El ordenador daba pantallazo azul y se apagaba porque la fuente de alimentación era vieja y estaba rota.',
        rootCauseCategory: 'Eléctrico / Alimentación / VRM'
      },
      correctiveActions: [
        {
          id: 'ca-6-1',
          stage: '2. Intervención de Hardware',
          actionVerb: 'Cambiar fuente',
          technicalDescription: 'Puse una fuente más potente de 850W y enchufé bien la gráfica.',
          durationMinutes: 60
        }
      ],
      replacedParts: [
        {
          id: 'rp-6-1',
          componentName: 'Fuente 850W',
          partNumberOrSku: '',
          removedComponentRef: 'Vieja 650W',
          installedComponentRef: 'Nueva 850W',
          condition: 'Nuevo OEM',
          warrantyMonths: 24,
          quantity: 1,
          unitPriceEur: 135
        }
      ],
      conformityChecks: [
        {
          id: 'cc-6-1',
          code: 'QA-PSU',
          testName: 'Renderizar vídeo',
          passed: true,
          measuredResult: 'Todo ok, ya no sale pantalla azul.'
        }
      ],
      finalTechnicianNotes: 'Arreglado.',
      caseId: 'case-psu-bsod'
    },
    modelSolutionOrder: {
      id: 'model-case-06',
      orderNumber: 'OT-2026-0141',
      createdAt: '2026-11-01T09:00',
      completedAt: '2026-11-01T15:00',
      technicianName: 'Javier Pérez — Especialista Sistemas IT',
      technicianId: 'TEC-01',
      priority: 'Preferente (24h)',
      status: 'Cerrado — Conforme',
      laborHours: 1.5,
      hourlyRateEur: 42,
      vatPercent: 21,
      client: {
        name: 'Daniela Ortiz Vega',
        organization: 'Productora Audiovisual FrameLab',
        contactPhone: '644 902 117',
        contactEmail: 'dortiz@framelab.tv',
        authorizedBackup: false,
        warrantyClaim: false
      },
      equipment: {
        category: 'Sobremesa / Workstation',
        brand: 'Custom Workstation (Chasis Fractal North)',
        model: 'ASUS ProArt Z690-Creator / RTX 3080',
        serialNumber: 'FD-N-2023-4410',
        assetTag: 'FML-VFX-02',
        cpu: 'Intel Core i9-12900K (16C/24T)',
        ram: '64 GB DDR5-5200 MHz (2x32 GB)',
        storage: '2 TB NVMe Samsung 980 PRO PCIe 4.0',
        motherboardOrGpu: 'NVIDIA GeForce RTX 3080 10GB GDDR6X (TDP 320W)',
        operatingSystem: 'Windows 11 Pro 23H2',
        physicalIntakeState: 'Chasis con frontal de madera y malla lateral en buen estado cosmético. En inspección interior se observa conexión PCIe de GPU mediante cable único en bifurcación (daisy-chain).',
        accessoriesIncluded: 'Recepción exclusiva de torre central sin cables externos.',
        biosOrSystemPasswordNote: 'Sesión de prueba habilitada para test de renderizado.'
      },
      faultDiagnosis: {
        clientSymptom: 'La clienta reporta que durante la edición ligera el equipo opera con normalidad, pero al iniciar exportaciones 4K en DaVinci Resolve la pantalla pierde señal tras ~60 segundos, mostrando pantallazos azules (nvlddmkm.sys) o reinicios abruptos.',
        symptomContextAndFrequency: 'Fallo sistemático al demandar carga combinada CPU+GPU superior a 420W.',
        diagnosticToolsUsed: [
          'WinDbg / Analizador de Volcados Minidump (BSOD)',
          'Osciloscopio Digital (Rizado VRM)',
          'HWiNFO64 / Sensores SMBus',
          'OCCT / Prime95 / FurMark (Stress Test)'
        ],
        telemetryAndErrorCodes: 'Minidump BugCheck 0x116 (VIDEO_TDR_FAILURE en nvlddmkm.sys) y Evento Display ID 4101 · Caída de tensión en raíl +12V PCIe bajo carga a 11.08 V (inferior al mínimo estándar ATX de 11.40 V) · Rizado de línea +12V: 165 mVpp (límite ATX: 120 mVpp).',
        technicalDiagnosis: 'Inestabilidad eléctrica severa en la fuente de alimentación conmutada de 650W (S/N PSU-B650-9912) por agotamiento de condensadores electrolíticos de filtrado en el secundario. Al solicitar la GPU RTX 3080 picos de 320W a través de un único latiguillo PCIe en guirnalda (daisy-chain), la línea de +12V cae a 11.08V con rizado de 165 mVpp, provocando el bloqueo del controlador gráfico (TDR 0x116). Se descarta avería en la tarjeta gráfica.',
        rootCauseCategory: 'Eléctrico / Alimentación / VRM'
      },
      correctiveActions: [
        {
          id: 'ca-sol-6-1',
          stage: '1. Seguridad ESD y Desmontaje',
          actionVerb: 'Desmontaje de fuente ATX y cableado modular',
          technicalDescription: 'Desconexión de líneas ATX 24p, EPS 8+4p y PCIe, y extracción de la fuente de alimentación de 650W degradada.',
          durationMinutes: 25
        },
        {
          id: 'ca-sol-6-2',
          stage: '2. Intervención de Hardware',
          actionVerb: 'Sustitución de fuente conmutada ATX',
          technicalDescription: 'Instalación de fuente certificada Corsair RM850x SHIFT 850W 80 Plus Gold ATX 3.0 y conexionado de la GPU RTX 3080 mediante dos líneas PCIe 8 pines independientes (eliminando la configuración daisy-chain).',
          durationMinutes: 40
        },
        {
          id: 'ca-sol-6-3',
          stage: '3. Firmware / Sistema',
          actionVerb: 'Reinstalación limpia de controlador NVIDIA Studio',
          technicalDescription: 'Desinstalación completa de controlador gráfico previo en Modo Seguro mediante DDU e instalación de controlador certificado NVIDIA Studio Driver 560.81 para DaVinci Resolve.',
          durationMinutes: 25
        }
      ],
      replacedParts: [
        {
          id: 'rp-sol-6-1',
          componentName: 'Fuente de Alimentación 850W Corsair RM850x 80 Plus Gold ATX 3.0 Modular',
          partNumberOrSku: 'CP-9020252-EU',
          removedComponentRef: 'PSU 650W 80+ Bronze (S/N: PSU-B650-9912)',
          installedComponentRef: 'Corsair RM850x (S/N: 240971820041)',
          condition: 'Nuevo OEM',
          warrantyMonths: 36,
          quantity: 1,
          unitPriceEur: 149.0
        }
      ],
      conformityChecks: [
        {
          id: 'cc-sol-6-1',
          code: 'QA-01',
          testName: 'Test de estrés eléctrico OCCT Power Supply (45 min a 540W continuos)',
          passed: true,
          measuredResult: 'Raíl +12V estable en 12.04 V (caída máx. 0.4%) · Rizado medido: 22 mVpp · 0 errores WHEA/TDR.'
        },
        {
          id: 'cc-sol-6-2',
          code: 'QA-02',
          testName: 'Renderizado de proyecto 4K ProRes en DaVinci Resolve Studio',
          passed: true,
          measuredResult: 'Exportación continua de 30 minutos completada sin artefactos ni reinicios; Tª GPU: 70 °C.'
        }
      ],
      finalTechnicianNotes: 'Se confirma que la tarjeta gráfica RTX 3080 opera al 100% de sus especificaciones una vez restablecida la alimentación +12V con cables PCIe independientes.',
      caseId: 'case-psu-bsod'
    }
  }
];

export function createBlankWorkOrder(orderSeq = 201): WorkOrder {
  const now = new Date();
  const isoLocal = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return {
    id: `wo-${Date.now()}`,
    orderNumber: `OT-2026-0${orderSeq}`,
    createdAt: isoLocal,
    completedAt: isoLocal,
    technicianName: '',
    technicianId: 'TEC-01',
    priority: 'Estándar (48-72h)',
    status: 'En Diagnóstico',
    laborHours: 1.0,
    hourlyRateEur: 42,
    vatPercent: 21,
    client: {
      name: '',
      organization: '',
      contactPhone: '',
      contactEmail: '',
      authorizedBackup: true,
      warrantyClaim: false
    },
    equipment: {
      category: 'Portátil / Ultrabook',
      brand: '',
      model: '',
      serialNumber: '',
      assetTag: '',
      cpu: '',
      ram: '',
      storage: '',
      motherboardOrGpu: '',
      operatingSystem: '',
      physicalIntakeState: '',
      accessoriesIncluded: '',
      biosOrSystemPasswordNote: ''
    },
    faultDiagnosis: {
      clientSymptom: '',
      symptomContextAndFrequency: '',
      diagnosticToolsUsed: [],
      telemetryAndErrorCodes: '',
      technicalDiagnosis: '',
      rootCauseCategory: 'Térmico / Disipación'
    },
    correctiveActions: [
      {
        id: `ca-${Date.now()}-1`,
        stage: '1. Seguridad ESD y Desmontaje',
        actionVerb: 'Desmontaje y aislamiento ESD',
        technicalDescription: '',
        durationMinutes: 15
      }
    ],
    replacedParts: [],
    conformityChecks: [
      {
        id: `cc-${Date.now()}-1`,
        code: 'QA-01',
        testName: 'Prueba de estabilidad y verificación funcional post-intervención',
        passed: false,
        measuredResult: ''
      }
    ],
    finalTechnicianNotes: ''
  };
}
