export type AssetCategory =
  | 'Portátil / Ultrabook'
  | 'Sobremesa / Workstation'
  | 'Servidor / NAS'
  | 'All-in-One / MiniPC'
  | 'Impresora / Periférico Industrial'
  | 'Red / Electrónica de Comunicaciones';

export type ServicePriority = 'Estándar (48-72h)' | 'Preferente (24h)' | 'Crítica / Parada de Servicio (SLA 4h)';

export type WorkOrderStatus =
  | 'En Recepción'
  | 'En Diagnóstico'
  | 'Esperando Repuesto / Presupuesto'
  | 'En Reparación y Pruebas QA'
  | 'Cerrado — Conforme';

export type RootCauseCategory =
  | 'Térmico / Disipación'
  | 'Almacenamiento / Integridad de Datos'
  | 'Eléctrico / Alimentación / VRM'
  | 'Memoria RAM / Bus de Sistema'
  | 'Mecánico / Soldadura / Conectores'
  | 'Firmware / BIOS / Sistema Operativo'
  | 'Red / Configuración de Servicios';

export interface ClientInfo {
  name: string;
  organization: string;
  contactPhone: string;
  contactEmail: string;
  authorizedBackup: boolean;
  warrantyClaim: boolean;
}

export interface EquipmentIdentification {
  category: AssetCategory;
  brand: string;
  model: string;
  serialNumber: string;
  assetTag: string;
  cpu: string;
  ram: string;
  storage: string;
  motherboardOrGpu: string;
  operatingSystem: string;
  physicalIntakeState: string;
  accessoriesIncluded: string;
  biosOrSystemPasswordNote: string;
}

export interface FaultAndDiagnosis {
  clientSymptom: string;
  symptomContextAndFrequency: string;
  diagnosticToolsUsed: string[];
  telemetryAndErrorCodes: string;
  technicalDiagnosis: string;
  rootCauseCategory: RootCauseCategory;
}

export interface CorrectiveActionItem {
  id: string;
  stage: '1. Seguridad ESD y Desmontaje' | '2. Intervención de Hardware' | '3. Firmware / Sistema' | '4. Saneamiento y Montaje';
  actionVerb: string;
  technicalDescription: string;
  durationMinutes: number;
}

export interface ReplacedPartItem {
  id: string;
  componentName: string;
  partNumberOrSku: string;
  removedComponentRef: string;
  installedComponentRef: string;
  condition: 'Nuevo OEM' | 'Nuevo Equivalente Certificado' | 'Reacondicionado Testado';
  warrantyMonths: number;
  quantity: number;
  unitPriceEur: number;
}

export interface ConformityCheckItem {
  id: string;
  code: string;
  testName: string;
  passed: boolean;
  measuredResult: string;
}

export interface WorkOrder {
  id: string;
  orderNumber: string;
  createdAt: string;
  completedAt: string;
  technicianName: string;
  technicianId: string;
  priority: ServicePriority;
  status: WorkOrderStatus;
  laborHours: number;
  hourlyRateEur: number;
  vatPercent: number;
  client: ClientInfo;
  equipment: EquipmentIdentification;
  faultDiagnosis: FaultAndDiagnosis;
  correctiveActions: CorrectiveActionItem[];
  replacedParts: ReplacedPartItem[];
  conformityChecks: ConformityCheckItem[];
  finalTechnicianNotes: string;
  caseId?: string;
}

export interface LabProbe {
  id: string;
  toolName: string;
  category: 'Inspección Visual / ESD' | 'Sensores / Eléctrico' | 'Almacenamiento / Memoria' | 'Logs / Firmware / Red';
  commandOrProcedure: string;
  rawOutput: string;
  interpretationHint: string;
  keyMetricsToCite: string[];
}

export interface DidacticCase {
  id: string;
  code: string;
  title: string;
  difficulty: 'Inicial (FP Básica / Grado Medio)' | 'Intermedio (SMR / ASIR)' | 'Avanzado (Soporte Nivel 2-3)';
  moduleTag: string;
  summary: string;
  learningObjective: string;
  clientQuoteVerbal: string;
  labProbes: LabProbe[];
  flawedDraftOrder: WorkOrder;
  modelSolutionOrder: WorkOrder;
}

export interface ColloquialWarning {
  termFound: string;
  fieldLabel: string;
  reason: string;
  suggestedReplacement: string;
}

export interface PillarEvaluation {
  id: string;
  title: string;
  score: number;
  maxScore: number;
  feedback: string[];
  missingCriteria: string[];
}

export interface DidacticReportEvaluation {
  totalScore: number;
  gradeLabel: string;
  pillars: PillarEvaluation[];
  colloquialWarnings: ColloquialWarning[];
  strengths: string[];
}
