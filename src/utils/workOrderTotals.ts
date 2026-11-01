import { WorkOrder } from '../types/workOrder';
import { DIAGNOSTIC_TOOLS_CATALOG } from '../data/didacticCases';

export interface WorkOrderTotals {
  partsSubtotal: number;
  laborSubtotal: number;
  taxableBase: number;
  vatAmount: number;
  grandTotal: number;
}

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

// Importes del parte (el formulario, el documento A4 y el Markdown usan el mismo cálculo):
// cada importe se redondea a céntimos, como en una factura, antes de sumar el IVA
export function computeTotals(order: WorkOrder): WorkOrderTotals {
  const partsSubtotal = round2(
    order.replacedParts.reduce((sum, p) => sum + round2(p.quantity * p.unitPriceEur), 0)
  );
  const laborSubtotal = round2(order.laborHours * order.hourlyRateEur);
  const taxableBase = round2(partsSubtotal + laborSubtotal);
  const vatAmount = round2(taxableBase * (order.vatPercent / 100));
  return { partsSubtotal, laborSubtotal, taxableBase, vatAmount, grandTotal: round2(taxableBase + vatAmount) };
}

// 1234.5 -> «1.234,50 €» (formato español; Intl en es-ES no agrupa las cifras de 4 dígitos)
export function formatEur(value: number): string {
  const [int, dec] = Math.abs(round2(value)).toFixed(2).split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${value < 0 ? '-' : ''}${grouped},${dec} €`;
}

// Herramienta del catálogo que corresponde a una prueba del laboratorio (para registrarla
// automáticamente al copiar su telemetría al parte)
const TOOL_KEYWORDS: [RegExp, string][] = [
  [/hwinfo/i, 'HWiNFO64'],
  [/smart|smartctl|crystaldisk/i, 'CrystalDiskInfo'],
  [/memtest/i, 'MemTest86+'],
  [/mult[ií]metro|pol[ií]metro|tester atx|tensiones psu/i, 'Polímetro'],
  [/fuente de laboratorio/i, 'Fuente de Laboratorio'],
  [/tarjeta post|lpc/i, 'Tarjeta POST'],
  [/termogr[aá]fica|infrarroj/i, 'Cámara Termográfica'],
  [/occt|prime95|furmark|estr[eé]s/i, 'OCCT'],
  [/visor de eventos|journalctl|eventos del sistema/i, 'Visor de Eventos'],
  [/microscopio/i, 'Microscopio'],
  [/\bred\b|fluke|cable tester/i, 'Analizador de Red'],
  [/osciloscopio/i, 'Osciloscopio'],
  [/windbg|minidump|bugcheck/i, 'WinDbg'],
  [/autoruns|sysinternals|process explorer/i, 'Autoruns'],
];

export function catalogToolsForProbe(probeToolName: string): string[] {
  const found = new Set<string>();
  for (const [re, prefix] of TOOL_KEYWORDS) {
    if (re.test(probeToolName)) {
      const tool = DIAGNOSTIC_TOOLS_CATALOG.find((t) => t.startsWith(prefix));
      if (tool) found.add(tool);
    }
  }
  return [...found];
}
