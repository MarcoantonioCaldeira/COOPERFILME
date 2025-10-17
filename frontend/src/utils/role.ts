export type FrontRole = 'ANALISTA' | 'REVISOR' | 'APROVADOR';

export function mapCargoToFrontRole(cargo: string): FrontRole {
  const map: Record<string, FrontRole> = {
    ANALISTA: 'ANALISTA',
    REVISOR: 'REVISOR',
    APROVADOR: 'APROVADOR',
  };
  return map[cargo] ?? 'ANALISTA';
}
