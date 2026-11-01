import { WorkOrder } from '../types/workOrder';

const isObj = (v: unknown): v is Record<string, unknown> => typeof v === 'object' && v !== null && !Array.isArray(v);
const allStrings = (o: Record<string, unknown>, keys: string[]) => keys.every((k) => typeof o[k] === 'string');

// Comprueba que un objeto importado (JSON o localStorage) tiene la forma de una orden de
// trabajo: si se aceptara cualquier cosa, el evaluador fallaría y la app quedaría en blanco
// incluso tras recargar, porque el dato inválido ya estaría guardado en el navegador.
export function isWorkOrder(value: unknown): value is WorkOrder {
  if (!isObj(value)) return false;
  const { client, equipment, faultDiagnosis } = value;
  return (
    allStrings(value, ['id', 'orderNumber', 'createdAt', 'completedAt', 'technicianName', 'technicianId', 'priority', 'status', 'finalTechnicianNotes']) &&
    ['laborHours', 'hourlyRateEur', 'vatPercent'].every((k) => typeof value[k] === 'number' && Number.isFinite(value[k])) &&
    isObj(client) &&
    allStrings(client, ['name', 'organization', 'contactPhone', 'contactEmail']) &&
    isObj(equipment) &&
    allStrings(equipment, ['category', 'brand', 'model', 'serialNumber', 'assetTag', 'cpu', 'ram', 'storage', 'motherboardOrGpu', 'operatingSystem', 'physicalIntakeState', 'accessoriesIncluded', 'biosOrSystemPasswordNote']) &&
    isObj(faultDiagnosis) &&
    allStrings(faultDiagnosis, ['clientSymptom', 'symptomContextAndFrequency', 'telemetryAndErrorCodes', 'technicalDiagnosis', 'rootCauseCategory']) &&
    Array.isArray(faultDiagnosis.diagnosticToolsUsed) &&
    Array.isArray(value.correctiveActions) &&
    value.correctiveActions.every((a) => isObj(a) && allStrings(a, ['id', 'stage', 'actionVerb', 'technicalDescription']) && typeof a.durationMinutes === 'number') &&
    Array.isArray(value.replacedParts) &&
    value.replacedParts.every(
      (p) =>
        isObj(p) &&
        allStrings(p, ['id', 'componentName', 'partNumberOrSku', 'removedComponentRef', 'installedComponentRef', 'condition']) &&
        ['warrantyMonths', 'quantity', 'unitPriceEur'].every((k) => typeof p[k] === 'number')
    ) &&
    Array.isArray(value.conformityChecks) &&
    value.conformityChecks.every((c) => isObj(c) && allStrings(c, ['id', 'code', 'testName', 'measuredResult']) && typeof c.passed === 'boolean')
  );
}
