import { describe, expect, it } from 'vitest';
import { createBlankWorkOrder, DIAGNOSTIC_TOOLS_CATALOG, DIDACTIC_CASES } from '../data/didacticCases';
import { WorkOrder } from '../types/workOrder';
import { evaluateWorkOrder } from './evaluateWorkOrder';
import { buildWorkOrderMarkdown } from './exportMarkdown';
import { catalogToolsForProbe, computeTotals, formatEur } from './workOrderTotals';
import { isWorkOrder } from './workOrderSchema';

const clone = <T,>(v: T): T => structuredClone(v);

describe('evaluador por rúbrica', () => {
  for (const c of DIDACTIC_CASES) {
    it(`${c.code}: el borrador suspende y la solución modelo saca 100`, () => {
      expect(evaluateWorkOrder(c.flawedDraftOrder).totalScore).toBeLessThan(50);
      const model = evaluateWorkOrder(c.modelSolutionOrder);
      expect(model.totalScore).toBe(100);
      expect(model.colloquialWarnings).toEqual([]);
    });
  }

  it('un parte en blanco no puntúa en acciones ni en piezas', () => {
    const e = evaluateWorkOrder(createBlankWorkOrder(201));
    const pillar = (id: string) => e.pillars.find((p) => p.id === id)!;
    expect(pillar('pilar-acciones').score).toBe(0);
    expect(pillar('pilar-repuestos').score).toBe(0);
    expect(e.totalScore).toBeLessThan(15);
  });

  it('cerrar como «Conforme» con una prueba sin superar penaliza la conformidad', () => {
    const order = clone(DIDACTIC_CASES[0].modelSolutionOrder);
    order.conformityChecks[0].passed = false;
    const e = evaluateWorkOrder(order);
    const qa = e.pillars.find((p) => p.id === 'pilar-conformidad')!;
    expect(qa.score).toBeLessThanOrEqual(6);
    expect(qa.missingCriteria.join(' ')).toContain('QA-01');
  });

  it('detecta expresiones coloquiales en campos técnicos', () => {
    const order = clone(DIDACTIC_CASES[0].modelSolutionOrder);
    order.finalTechnicianNotes = 'Arreglado, todo ok.';
    expect(evaluateWorkOrder(order).colloquialWarnings.length).toBeGreaterThan(0);
  });
});

describe('importes', () => {
  it('base, IVA y total redondeados a céntimos', () => {
    const order = clone(DIDACTIC_CASES[0].modelSolutionOrder);
    // 34 + 6,50 de piezas y 1,5 h × 42 €/h de mano de obra
    expect(computeTotals(order)).toEqual({
      partsSubtotal: 40.5,
      laborSubtotal: 63,
      taxableBase: 103.5,
      vatAmount: 21.74,
      grandTotal: 125.24,
    });
  });

  it('formato español con coma decimal y separador de miles', () => {
    expect(formatEur(1234.5)).toBe('1.234,50 €');
    expect(formatEur(21.735)).toBe('21,74 €');
    expect(formatEur(0)).toBe('0,00 €');
  });
});

describe('exportación Markdown', () => {
  it('incluye los importes en formato español y escapa las barras de las celdas', () => {
    const order = clone(DIDACTIC_CASES[0].modelSolutionOrder);
    order.correctiveActions[0].technicalDescription = 'Prueba A | B con barra';
    const md = buildWorkOrderMarkdown(order);
    expect(md).toContain('**TOTAL ORDEN DE TRABAJO:** **125,24 €**');
    expect(md).toContain('Prueba A \\| B con barra');
  });
});

describe('validación de órdenes importadas', () => {
  it('acepta las órdenes de los casos y rechaza objetos incompletos', () => {
    for (const c of DIDACTIC_CASES) {
      expect(isWorkOrder(c.flawedDraftOrder)).toBe(true);
      expect(isWorkOrder(c.modelSolutionOrder)).toBe(true);
    }
    expect(isWorkOrder(createBlankWorkOrder(1))).toBe(true);
    expect(isWorkOrder({ orderNumber: 'OT-1' })).toBe(false);
    const broken = clone(DIDACTIC_CASES[0].modelSolutionOrder) as unknown as Record<string, unknown>;
    delete (broken.equipment as Record<string, unknown>).serialNumber;
    expect(isWorkOrder(broken as unknown as WorkOrder)).toBe(false);
  });
});

describe('telemetría del laboratorio', () => {
  it('cada prueba del laboratorio con instrumento se asocia a herramientas del catálogo', () => {
    for (const c of DIDACTIC_CASES) {
      for (const probe of c.labProbes) {
        for (const tool of catalogToolsForProbe(probe.toolName)) {
          expect(DIAGNOSTIC_TOOLS_CATALOG).toContain(tool);
        }
      }
    }
    expect(catalogToolsForProbe('Medición Bajo Carga con Osciloscopio y Sensores HWiNFO64')).toEqual([
      'HWiNFO64 / Sensores SMBus',
      'Osciloscopio Digital (Rizado VRM)',
    ]);
    expect(catalogToolsForProbe('Comprobación de Tensiones PSU (Tester ATX / Multímetro)')).toEqual([
      'Polímetro Digital TrueRMS / Tester ATX',
    ]);
  });
});
