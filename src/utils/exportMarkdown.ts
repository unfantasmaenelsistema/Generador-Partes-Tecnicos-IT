import { WorkOrder } from '../types/workOrder';
import { evaluateWorkOrder } from './evaluateWorkOrder';

export function downloadWorkOrderMarkdown(order: WorkOrder): void {
  const evaluation = evaluateWorkOrder(order);
  const partsSubtotal = order.replacedParts.reduce(
    (sum, p) => sum + p.quantity * p.unitPriceEur,
    0
  );
  const laborSubtotal = order.laborHours * order.hourlyRateEur;
  const taxableBase = partsSubtotal + laborSubtotal;
  const vatAmount = taxableBase * (order.vatPercent / 100);
  const grandTotal = taxableBase + vatAmount;

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
    `- **Telemetría y códigos verificados:** \`${order.faultDiagnosis.telemetryAndErrorCodes || '—'}\``,
    ``,
    `## 03. Acciones Correctivas Aplicadas`,
    ``,
    `| Fase | Acción Técnica | Procedimiento Detallado | Duración |`,
    `| :--- | :--- | :--- | :---: |`,
    ...order.correctiveActions.map(
      (a) =>
        `| ${a.stage} | **${a.actionVerb}** | ${a.technicalDescription} | ${a.durationMinutes} min |`
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
          `| ${p.componentName} (${p.condition}) | \`${p.partNumberOrSku}\` | \`${p.removedComponentRef}\` | \`${p.installedComponentRef}\` | ${p.warrantyMonths} m | ${p.quantity} | ${(p.quantity * p.unitPriceEur).toFixed(2)} € |`
      ),
      ``
    );
  } else {
    lines.push(`*Intervención completada sin sustitución de repuestos físicos.*`, ``);
  }

  lines.push(
    `- **Subtotal Repuestos:** ${partsSubtotal.toFixed(2)} €`,
    `- **Mano de Obra (${order.laborHours}h × ${order.hourlyRateEur} €/h):** ${laborSubtotal.toFixed(2)} €`,
    `- **Base Imponible:** ${taxableBase.toFixed(2)} €`,
    `- **IVA (${order.vatPercent}%):** ${vatAmount.toFixed(2)} €`,
    `- **TOTAL ORDEN DE TRABAJO:** **${grandTotal.toFixed(2)} €**`,
    ``,
    `## 05. Prueba Final de Conformidad (QA)`,
    ``,
    ...order.conformityChecks.map(
      (c) =>
        `- [${c.passed ? 'x' : ' '}] **${c.code} — ${c.testName}:** \`${c.measuredResult}\``
    ),
    ``,
    `### Observaciones Finales y Recomendaciones Preventivas`,
    `${order.finalTechnicianNotes || 'Ninguna.'}`,
    ``
  );

  const blob = new Blob([lines.join('\n')], {
    type: 'text/markdown;charset=utf-8'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${order.orderNumber || 'parte-tecnico'}.md`;
  link.click();
  URL.revokeObjectURL(url);
}
