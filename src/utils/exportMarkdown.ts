import { WorkOrder } from '../types/workOrder';
import { evaluateWorkOrder } from './evaluateWorkOrder';
import { computeTotals, formatEur } from './workOrderTotals';

// Texto seguro dentro de una celda de tabla Markdown: | y saltos de línea romperían la tabla
const cell = (text: string) => text.replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
// Texto seguro dentro de un `código en línea`
const code = (text: string) => text.replace(/`/g, "'").replace(/\r?\n/g, ' ');

export function buildWorkOrderMarkdown(order: WorkOrder): string {
  const evaluation = evaluateWorkOrder(order);
  const { partsSubtotal, laborSubtotal, taxableBase, vatAmount, grandTotal } = computeTotals(order);

  const lines: string[] = [
    `# ORDEN DE TRABAJO E INFORME TÉCNICO IT — ${order.orderNumber}`,
    ``,
    `> Generado con **Un Fantasma en el Sistema** (https://www.unfantasmaenelsistema.com/)`,
    `> - **Fecha Recepción:** ${order.createdAt.replace('T', ' ')} | **Fecha Cierre QA:** ${order.completedAt.replace('T', ' ')}`,
    `> - **Técnico Responsable:** ${order.technicianName || 'Sin asignar'} (${order.technicianId})`,
    `> - **Estado:** ${order.status} | **Prioridad:** ${order.priority}`,
    `> - **Puntuación Didáctica de Rigor Técnico:** ${evaluation.totalScore}/100 (${evaluation.gradeLabel})`,
    ``,
    `---`,
    ``,
    `## 01. Titular e Identificación Técnica del Equipo`,
    ``,
    `- **Cliente / Entidad:** ${order.client.name || '—'} (${order.client.organization || 'Particular'})`,
    `- **Contacto:** ${order.client.contactPhone || '—'} · ${order.client.contactEmail || '—'}`,
    `- **Autorización Respaldo RGPD:** ${order.client.authorizedBackup ? 'Sí' : 'No'} | **Garantía / RMA:** ${order.client.warrantyClaim ? 'Sí' : 'No'}`,
    `- **Categoría:** ${order.equipment.category}`,
    `- **Marca y Modelo:** ${order.equipment.brand} ${order.equipment.model}`,
    `- **Número de Serie (S/N):** \`${order.equipment.serialNumber || 'NO REGISTRADO'}\` | **Asset Tag:** \`${order.equipment.assetTag || 'N/A'}\``,
    `- **Procesador (CPU):** ${order.equipment.cpu || '—'}`,
    `- **Memoria RAM:** ${order.equipment.ram || '—'}`,
    `- **Almacenamiento:** ${order.equipment.storage || '—'}`,
    `- **Placa Base / GPU:** ${order.equipment.motherboardOrGpu || '—'}`,
    `- **Sistema Operativo / Firmware:** ${order.equipment.operatingSystem || '—'}`,
    `- **Estado Estético en Recepción:** ${order.equipment.physicalIntakeState || '—'}`,
    `- **Accesorios Entregados:** ${order.equipment.accessoriesIncluded || '—'}`,
    ``,
    `## 02. Síntoma Aportado por el Usuario vs. Diagnóstico Real del Técnico`,
    ``,
    `### 2A. Descripción del Fallo Aportada por el Usuario (Síntoma Subjetivo)`,
    `> «${order.faultDiagnosis.clientSymptom || 'Sin descripción'}»`,
    `- **Condición de reproducción:** ${order.faultDiagnosis.symptomContextAndFrequency || '—'}`,
    ``,
    `### 2B. Diagnóstico Real del Técnico (Causa Raíz Objetiva — ${order.faultDiagnosis.rootCauseCategory})`,
    `${order.faultDiagnosis.technicalDiagnosis || 'Pendiente'}`,
    ``,
    `- **Instrumentación empleada:** ${order.faultDiagnosis.diagnosticToolsUsed.join(', ') || 'No especificada'}`,
    `- **Telemetría y códigos verificados:** \`${code(order.faultDiagnosis.telemetryAndErrorCodes) || '—'}\``,
    ``,
    `## 03. Acciones Correctivas Aplicadas`,
    ``,
    `| Fase | Acción Técnica | Procedimiento Detallado | Duración |`,
    `| :--- | :--- | :--- | :---: |`,
    ...order.correctiveActions.map(
      (a) =>
        `| ${cell(a.stage)} | **${cell(a.actionVerb)}** | ${cell(a.technicalDescription)} | ${a.durationMinutes} min |`
    ),
    ``,
    `## 04. Piezas Sustituidas y Liquidación Económica`,
    ``
  ];

  if (order.replacedParts.length > 0) {
    lines.push(
      `| Componente | P/N o SKU | Retirado (Baja) | Instalado (Alta) | Garantía | Cant. | Subtotal |`,
      `| :--- | :--- | :--- | :--- | :---: | :---: | :---: |`,
      ...order.replacedParts.map(
        (p) =>
          `| ${cell(p.componentName)} (${p.condition}) | \`${cell(code(p.partNumberOrSku))}\` | \`${cell(code(p.removedComponentRef))}\` | \`${cell(code(p.installedComponentRef))}\` | ${p.warrantyMonths} m | ${p.quantity} | ${formatEur(p.quantity * p.unitPriceEur)} |`
      ),
      ``
    );
  } else {
    lines.push(`*Intervención completada sin sustitución de repuestos físicos.*`, ``);
  }

  lines.push(
    `- **Subtotal Repuestos:** ${formatEur(partsSubtotal)}`,
    `- **Mano de Obra (${String(order.laborHours).replace('.', ',')} h × ${formatEur(order.hourlyRateEur)}/h):** ${formatEur(laborSubtotal)}`,
    `- **Base Imponible:** ${formatEur(taxableBase)}`,
    `- **IVA (${order.vatPercent} %):** ${formatEur(vatAmount)}`,
    `- **TOTAL ORDEN DE TRABAJO:** **${formatEur(grandTotal)}**`,
    ``,
    `## 05. Prueba Final de Conformidad (QA)`,
    ``,
    ...order.conformityChecks.map(
      (c) =>
        `- [${c.passed ? 'x' : ' '}] **${c.code} — ${c.testName}:** \`${code(c.measuredResult)}\``
    ),
    ``,
    `### Observaciones Finales y Recomendaciones Preventivas`,
    `${order.finalTechnicianNotes || 'Ninguna.'}`,
    ``
  );

  return lines.join('\n');
}

export function downloadWorkOrderMarkdown(order: WorkOrder): void {
  const blob = new Blob([buildWorkOrderMarkdown(order)], {
    type: 'text/markdown;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  // Nombre de archivo sin caracteres que Windows no admite
  link.download = `${(order.orderNumber || 'parte-tecnico').replace(/[\\/:*?"<>|]+/g, '-')}.md`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
