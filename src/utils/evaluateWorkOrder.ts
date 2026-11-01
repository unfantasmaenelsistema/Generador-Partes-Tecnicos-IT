import { COLLOQUIAL_RULES } from '../data/didacticCases';
import {
  ColloquialWarning,
  DidacticReportEvaluation,
  PillarEvaluation,
  WorkOrder
} from '../types/workOrder';

export function evaluateWorkOrder(order: WorkOrder): DidacticReportEvaluation {
  const colloquialWarnings: ColloquialWarning[] = [];

  // Check technical fields for colloquialisms (we don't penalize clientSymptom for colloquialisms since clients speak colloquially, though we DO check if clientSymptom is empty)
  const fieldsToScan: { label: string; text: string }[] = [
    { label: 'Estado físico de recepción', text: order.equipment.physicalIntakeState },
    { label: 'Telemetría y códigos de error', text: order.faultDiagnosis.telemetryAndErrorCodes },
    { label: 'Diagnóstico real del técnico', text: order.faultDiagnosis.technicalDiagnosis },
    {
      label: 'Acciones correctivas',
      text: order.correctiveActions.map((a) => `${a.actionVerb} ${a.technicalDescription}`).join(' ')
    },
    {
      label: 'Prueba final de conformidad',
      text: order.conformityChecks.map((c) => c.measuredResult).join(' ')
    },
    { label: 'Notas finales del técnico', text: order.finalTechnicianNotes }
  ];

  for (const field of fieldsToScan) {
    for (const rule of COLLOQUIAL_RULES) {
      const match = field.text.match(rule.pattern);
      if (match) {
        colloquialWarnings.push({
          termFound: match[0],
          fieldLabel: field.label,
          reason: rule.reason,
          suggestedReplacement: rule.suggestion
        });
      }
    }
  }

  const strengths: string[] = [];

  // 1. PILAR 1: Identificación del Equipo (Max 20)
  let p1Score = 0;
  const p1Feedback: string[] = [];
  const p1Missing: string[] = [];

  const sn = order.equipment.serialNumber.trim();
  const invalidSn = /no se ve|sin n[uú]mero|desconocido|nada|n\/a/i.test(sn);
  if (sn.length >= 5 && !invalidSn) {
    p1Score += 6;
    p1Feedback.push('Número de serie (S/N) identificable y válido para trazabilidad de garantía.');
  } else {
    p1Missing.push('Registra un Número de Serie (S/N) o Service Tag real y completo (mín. 5 caracteres alfanuméricos).');
  }

  if (order.equipment.brand.trim().length >= 2 && order.equipment.model.trim().length >= 5 && !/torre negra|pc gaming|caja negra/i.test(order.equipment.model)) {
    p1Score += 4;
  } else {
    p1Missing.push('Especifica Marca y Modelo comercial exacto (ej. "ThinkPad P15v Gen 3" en lugar de un nombre genérico).');
  }

  const specsDetailed =
    order.equipment.cpu.trim().length >= 6 &&
    order.equipment.ram.trim().length >= 5 &&
    order.equipment.storage.trim().length >= 6 &&
    !/dos discos/i.test(order.equipment.storage);
  if (specsDetailed) {
    p1Score += 5;
    p1Feedback.push('Especificaciones de CPU, RAM y Almacenamiento detalladas con modelo/capacidad.');
  } else {
    p1Missing.push('Detalla las especificaciones clave (generación/modelo de CPU, tipo/capacidad de RAM y tecnología de almacenamiento).');
  }

  if (order.equipment.physicalIntakeState.trim().length >= 18 && order.equipment.accessoriesIncluded.trim().length >= 8) {
    p1Score += 5;
    p1Feedback.push('Inspección estética de entrada y accesorios recepcionados bien documentados.');
  } else {
    p1Missing.push('Describe el estado estético de recepción (arañazos, golpes, tornillería) y detalla los accesorios entregados (cargador con W/P/N o recepción sin cables).');
  }

  // 2. PILAR 2: Contraste Síntoma del Usuario vs. Diagnóstico Real del Técnico (Max 25)
  let p2Score = 0;
  const p2Feedback: string[] = [];
  const p2Missing: string[] = [];

  const symptom = order.faultDiagnosis.clientSymptom.trim();
  const diagnosis = order.faultDiagnosis.technicalDiagnosis.trim();
  const telemetry = order.faultDiagnosis.telemetryAndErrorCodes.trim();

  if (symptom.length >= 35) {
    p2Score += 6;
    p2Feedback.push('Descripción del síntoma aportada por el cliente recogida con contexto claro.');
  } else {
    p2Missing.push('Amplía el síntoma reportado por el usuario: qué percibe el cliente y en qué situación ocurre.');
  }

  if (order.faultDiagnosis.diagnosticToolsUsed.length >= 1 && telemetry.length >= 20) {
    const hasMetrics = /(\d+\s*(°C|V|W|A|RPM|MB\/s|ms|GHz|MHz|%|GB|TB|sectores|errores)|ID\s*\d+|0x[0-9a-fA-F]+|PROCHOT|THERMTRIP|SMART|POST|RAID)/i.test(
      telemetry
    );
    if (hasMetrics) {
      p2Score += 8;
      p2Feedback.push('Telemetría e instrumentación documentadas con magnitudes o códigos verificables.');
    } else {
      p2Score += 3;
      p2Missing.push('Incluye en Telemetría valores medibles concretos (°C, Voltios, RPM, atributos SMART ID, códigos de evento o errores MemTest).');
    }
  } else {
    p2Missing.push('Selecciona las herramientas de diagnóstico empleadas y anota las mediciones o códigos obtenidos en el banco de pruebas.');
  }

  if (diagnosis.length >= 65 && diagnosis.toLowerCase() !== symptom.toLowerCase()) {
    const diagnosisHasColloquial = COLLOQUIAL_RULES.some((r) => r.pattern.test(diagnosis));
    if (!diagnosisHasColloquial) {
      p2Score += 11;
      p2Feedback.push('Diagnóstico técnico objetivo claramente diferenciado de la percepción subjetiva del cliente.');
    } else {
      p2Score += 5;
      p2Missing.push('Elimina expresiones coloquiales ("roto", "pelusa", "cacharrito", "iba mal") del diagnóstico técnico.');
    }
  } else {
    p2Missing.push('Redacta un diagnóstico técnico completo (mín. 65 caracteres) que explique la causa raíz física o lógica del fallo.');
  }

  // 3. PILAR 3: Acciones Correctivas Aplicadas (Max 20)
  let p3Score = 0;
  const p3Feedback: string[] = [];
  const p3Missing: string[] = [];

  const validActions = order.correctiveActions.filter(
    (a) => a.technicalDescription.trim().length >= 30 && !COLLOQUIAL_RULES.some((r) => r.pattern.test(a.technicalDescription))
  );

  if (order.correctiveActions.length >= 2 && validActions.length >= 2) {
    p3Score += 20;
    p3Feedback.push('Procedimiento correctivo desglosado por fases con terminología técnica rigurosa.');
  } else if (validActions.length === 1) {
    p3Score += 12;
    p3Missing.push('Desglosa la intervención en al menos 2 fases diferenciadas (ej. Desmontaje ESD + Intervención Hardware + Verificación lógica).');
  } else if (order.correctiveActions.every((a) => !a.technicalDescription.trim())) {
    // Sin ninguna acción redactada no hay nada que puntuar
    p3Missing.push('Registra las acciones correctivas realizadas, fase por fase, con vocabulario técnico preciso.');
  } else {
    p3Score += 4;
    p3Missing.push('Describe las acciones correctivas con vocabulario técnico preciso evitando frases informales ("echar pasta", "quitar polvo").');
  }

  // 4. PILAR 4: Trazabilidad de Piezas Sustituidas (Max 15)
  let p4Score = 0;
  const p4Feedback: string[] = [];
  const p4Missing: string[] = [];

  if (order.replacedParts.length === 0) {
    if (order.finalTechnicianNotes.trim().length >= 20) {
      p4Score = 12;
      p4Feedback.push('Sin sustitución de piezas; se documenta en notas finales del parte.');
      p4Missing.push('Si la avería requiere recambio o consumible, regístralo en la tabla de Piezas Sustituidas con su P/N.');
    } else {
      p4Score = 0;
      p4Missing.push('Registra las piezas o consumibles sustituidos (con su P/N o SKU) o justifica en Notas Finales por qué no se requirió recambio.');
    }
  } else {
    const completeParts = order.replacedParts.filter(
      (p) =>
        p.componentName.trim().length >= 5 &&
        p.partNumberOrSku.trim().length >= 4 &&
        !/sin referencia/i.test(p.partNumberOrSku) &&
        p.removedComponentRef.trim().length >= 4 &&
        p.installedComponentRef.trim().length >= 4
    );
    if (completeParts.length === order.replacedParts.length) {
      p4Score = 15;
      p4Feedback.push('Trazabilidad completa de repuestos: P/N (SKU), referencia retirada, referencia instalada y garantía.');
    } else {
      p4Score = 7;
      p4Missing.push('Completa el P/N (Part Number / FRU / SKU) y las referencias de la pieza retirada e instalada en todos los recambios.');
    }
  }

  // 5. PILAR 5: Prueba Final de Conformidad QA (Max 20)
  let p5Score = 0;
  const p5Feedback: string[] = [];
  const p5Missing: string[] = [];

  const passedChecks = order.conformityChecks.filter((c) => c.passed && c.measuredResult.trim().length >= 15);
  const quantifiedChecks = passedChecks.filter(
    (c) =>
      /(\d+\s*(°C|V|W|RPM|MB\/s|ms|min|h|pasadas|%|archivos|errores)|100%|0\s*errores|SALUDABLE)/i.test(c.measuredResult) &&
      !COLLOQUIAL_RULES.some((r) => r.pattern.test(c.measuredResult))
  );

  if (quantifiedChecks.length >= 2) {
    p5Score = 20;
    p5Feedback.push('Pruebas finales de conformidad (QA) superadas y respaldadas con métricas cuantitativas.');
  } else if (quantifiedChecks.length === 1) {
    p5Score = 13;
    p5Missing.push('Añade al menos una segunda verificación en la Prueba Final de Conformidad con valores medibles.');
  } else if (passedChecks.length >= 1) {
    p5Score = 6;
    p5Missing.push('Evita cierres genéricos ("todo ok", "funciona bien") en las pruebas de conformidad: anota la temperatura, velocidad o resultado numérico medido tras la reparación.');
  } else {
    p5Score = 0;
    p5Missing.push('Marca y documenta las pruebas finales de conformidad con los valores obtenidos antes de cerrar la orden de trabajo.');
  }

  // Una orden cerrada como «Conforme» no puede tener pruebas de conformidad sin superar
  const failedChecks = order.conformityChecks.filter((c) => !c.passed);
  if (order.status === 'Cerrado — Conforme' && failedChecks.length > 0) {
    p5Score = Math.min(p5Score, 6);
    p5Missing.push(
      `La orden figura como «Cerrado — Conforme» pero hay pruebas sin superar (${failedChecks.map((c) => c.code).join(', ')}): repite la verificación o cambia el estado.`
    );
  }

  const pillars: PillarEvaluation[] = [
    {
      id: 'pilar-identificacion',
      title: '1. Identificación del Equipo y Recepción',
      score: p1Score,
      maxScore: 20,
      feedback: p1Feedback,
      missingCriteria: p1Missing
    },
    {
      id: 'pilar-diagnostico',
      title: '2. Síntoma Usuario vs. Diagnóstico Técnico',
      score: p2Score,
      maxScore: 25,
      feedback: p2Feedback,
      missingCriteria: p2Missing
    },
    {
      id: 'pilar-acciones',
      title: '3. Acciones Correctivas Aplicadas',
      score: p3Score,
      maxScore: 20,
      feedback: p3Feedback,
      missingCriteria: p3Missing
    },
    {
      id: 'pilar-repuestos',
      title: '4. Piezas Sustituidas y Trazabilidad',
      score: p4Score,
      maxScore: 15,
      feedback: p4Feedback,
      missingCriteria: p4Missing
    },
    {
      id: 'pilar-conformidad',
      title: '5. Prueba Final de Conformidad (QA)',
      score: p5Score,
      maxScore: 20,
      feedback: p5Feedback,
      missingCriteria: p5Missing
    }
  ];

  const rawTotal = pillars.reduce((acc, p) => acc + p.score, 0);
  const penalty = Math.min(15, colloquialWarnings.length * 3);
  const totalScore = Math.max(0, rawTotal - penalty);

  for (const p of pillars) {
    if (p.score === p.maxScore) {
      strengths.push(p.title);
    }
  }

  let gradeLabel = 'En Elaboración — Requiere Mayor Rigor Técnico';
  if (totalScore >= 90) {
    gradeLabel = 'Excelente — Estándar Profesional de Auditoría IT';
  } else if (totalScore >= 75) {
    gradeLabel = 'Apto — Parte Técnico Sólido y Verificable';
  } else if (totalScore >= 50) {
    gradeLabel = 'Incompleto — Faltan Métricas o Precisión Terminológica';
  }

  return {
    totalScore,
    gradeLabel,
    pillars,
    colloquialWarnings,
    strengths
  };
}
