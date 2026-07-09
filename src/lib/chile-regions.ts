export type ShippingZone = 'metropolitana' | 'regiones' | 'extrema';

export type Comuna = {
  name: string;
  code: string;
};

export type Region = {
  name: string;
  code: string;
  zone: ShippingZone;
  comunas: Comuna[];
};

export const SHIPPING_ZONES: Record<ShippingZone, { label: string; price: number; days: string }> = {
  metropolitana: { label: 'Región Metropolitana', price: 2990, days: '1-2 días hábiles' },
  regiones:      { label: 'Regiones (Chile central)', price: 3990, days: '2-4 días hábiles' },
  extrema:       { label: 'Zonas extremas', price: 4990, days: '4-7 días hábiles' },
};

export const REGIONS: Region[] = [
  {
    name: 'Región Metropolitana de Santiago',
    code: 'RM',
    zone: 'metropolitana',
    comunas: [
      { name: 'Santiago', code: '13101' },
      { name: 'Cerrillos', code: '13102' },
      { name: 'Cerro Navia', code: '13103' },
      { name: 'Conchalí', code: '13104' },
      { name: 'El Bosque', code: '13105' },
      { name: 'Estación Central', code: '13106' },
      { name: 'Huechuraba', code: '13107' },
      { name: 'Independencia', code: '13108' },
      { name: 'La Cisterna', code: '13109' },
      { name: 'La Florida', code: '13110' },
      { name: 'La Granja', code: '13111' },
      { name: 'La Pintana', code: '13112' },
      { name: 'La Reina', code: '13113' },
      { name: 'Las Condes', code: '13114' },
      { name: 'Lo Barnechea', code: '13115' },
      { name: 'Lo Espejo', code: '13116' },
      { name: 'Lo Prado', code: '13117' },
      { name: 'Macul', code: '13118' },
      { name: 'Maipú', code: '13119' },
      { name: 'Ñuñoa', code: '13120' },
      { name: 'Pedro Aguirre Cerda', code: '13121' },
      { name: 'Peñalolén', code: '13122' },
      { name: 'Providencia', code: '13123' },
      { name: 'Pudahuel', code: '13124' },
      { name: 'Quilicura', code: '13125' },
      { name: 'Quinta Normal', code: '13126' },
      { name: 'Recoleta', code: '13127' },
      { name: 'Renca', code: '13128' },
      { name: 'San Joaquín', code: '13129' },
      { name: 'San Miguel', code: '13130' },
      { name: 'San Ramón', code: '13131' },
      { name: 'Vitacura', code: '13132' },
      { name: 'Puente Alto', code: '13201' },
      { name: 'San Bernardo', code: '13401' },
      { name: 'Buin', code: '13402' },
      { name: 'Calera de Tango', code: '13403' },
      { name: 'Paine', code: '13404' },
      { name: 'Colina', code: '13301' },
      { name: 'Lampa', code: '13302' },
      { name: 'Til Til', code: '13303' },
      { name: 'Pirque', code: '13202' },
      { name: 'San José de Maipo', code: '13203' },
      { name: 'Alhué', code: '13501' },
      { name: 'Curacaví', code: '13502' },
      { name: 'María Pinto', code: '13503' },
      { name: 'Melipilla', code: '13504' },
      { name: 'San Pedro', code: '13505' },
      { name: 'El Monte', code: '13601' },
      { name: 'Isla de Maipo', code: '13602' },
      { name: 'Padre Hurtado', code: '13603' },
      { name: 'Peñaflor', code: '13604' },
      { name: 'Talagante', code: '13605' },
    ],
  },
  {
    name: 'Región de Valparaíso',
    code: 'V',
    zone: 'regiones',
    comunas: [
      { name: 'Valparaíso', code: '05101' },
      { name: 'Viña del Mar', code: '05109' },
      { name: 'Quilpué', code: '05801' },
      { name: 'Villa Alemana', code: '05804' },
      { name: 'Concón', code: '05103' },
      { name: 'San Antonio', code: '05601' },
      { name: 'Quillota', code: '05501' },
      { name: 'Los Andes', code: '05301' },
      { name: 'Rancagua', code: '06101' },
      { name: 'San Fernando', code: '06201' },
      { name: 'Curicó', code: '07301' },
      { name: 'Talca', code: '07101' },
      { name: 'Linares', code: '07401' },
    ],
  },
  {
    name: "Región del Libertador Bernardo O'Higgins",
    code: 'VI',
    zone: 'regiones',
    comunas: [
      { name: 'Rancagua', code: '06101' },
      { name: 'Machalí', code: '06102' },
      { name: 'San Fernando', code: '06201' },
      { name: 'Rengo', code: '06115' },
      { name: 'Pichilemu', code: '06301' },
    ],
  },
  {
    name: 'Región del Maule',
    code: 'VII',
    zone: 'regiones',
    comunas: [
      { name: 'Talca', code: '07101' },
      { name: 'Curicó', code: '07301' },
      { name: 'Linares', code: '07401' },
      { name: 'Cauquenes', code: '07201' },
      { name: 'Constitución', code: '07102' },
    ],
  },
  {
    name: 'Región del Biobío',
    code: 'VIII',
    zone: 'regiones',
    comunas: [
      { name: 'Concepción', code: '08101' },
      { name: 'Talcahuano', code: '08108' },
      { name: 'Chillán', code: '08301' },
      { name: 'Los Ángeles', code: '08201' },
      { name: 'San Pedro de la Paz', code: '08107' },
      { name: 'Hualpén', code: '08112' },
      { name: 'Coronel', code: '08102' },
      { name: 'Tomé', code: '08109' },
    ],
  },
  {
    name: 'Región de La Araucanía',
    code: 'IX',
    zone: 'regiones',
    comunas: [
      { name: 'Temuco', code: '09101' },
      { name: 'Padre Las Casas', code: '09122' },
      { name: 'Villarrica', code: '09203' },
      { name: 'Pucón', code: '09202' },
      { name: 'Angol', code: '09201' },
    ],
  },
  {
    name: 'Región de Los Ríos',
    code: 'XIV',
    zone: 'regiones',
    comunas: [
      { name: 'Valdivia', code: '14101' },
      { name: 'La Unión', code: '14201' },
      { name: 'Panguipulli', code: '14105' },
    ],
  },
  {
    name: 'Región de Los Lagos',
    code: 'X',
    zone: 'regiones',
    comunas: [
      { name: 'Puerto Montt', code: '10101' },
      { name: 'Osorno', code: '10201' },
      { name: 'Puerto Varas', code: '10106' },
      { name: 'Castro', code: '10301' },
      { name: 'Ancud', code: '10302' },
    ],
  },
  {
    name: 'Región de Coquimbo',
    code: 'IV',
    zone: 'regiones',
    comunas: [
      { name: 'La Serena', code: '04101' },
      { name: 'Coquimbo', code: '04102' },
      { name: 'Ovalle', code: '04201' },
      { name: 'Illapel', code: '04301' },
    ],
  },
  {
    name: 'Región de Atacama',
    code: 'III',
    zone: 'regiones',
    comunas: [
      { name: 'Copiapó', code: '03101' },
      { name: 'Caldera', code: '03102' },
      { name: 'Vallenar', code: '03201' },
    ],
  },
  {
    name: 'Región de Antofagasta',
    code: 'II',
    zone: 'extrema',
    comunas: [
      { name: 'Antofagasta', code: '02101' },
      { name: 'Calama', code: '02201' },
      { name: 'Tocopilla', code: '02301' },
      { name: 'San Pedro de Atacama', code: '02203' },
    ],
  },
  {
    name: 'Región de Tarapacá',
    code: 'I',
    zone: 'extrema',
    comunas: [
      { name: 'Iquique', code: '01101' },
      { name: 'Alto Hospicio', code: '01107' },
    ],
  },
  {
    name: 'Región de Arica y Parinacota',
    code: 'XV',
    zone: 'extrema',
    comunas: [
      { name: 'Arica', code: '15101' },
      { name: 'Putre', code: '15201' },
    ],
  },
  {
    name: 'Región de Aysén',
    code: 'XI',
    zone: 'extrema',
    comunas: [
      { name: 'Coyhaique', code: '11101' },
      { name: 'Puerto Aysén', code: '11201' },
    ],
  },
  {
    name: 'Región de Magallanes',
    code: 'XII',
    zone: 'extrema',
    comunas: [
      { name: 'Punta Arenas', code: '12101' },
      { name: 'Puerto Natales', code: '12201' },
      { name: 'Porvenir', code: '12301' },
    ],
  },
];

export function getZoneByRegionCode(code: string): ShippingZone {
  return REGIONS.find((r) => r.code === code)?.zone ?? 'regiones';
}

export function getComunasByRegion(regionCode: string): Comuna[] {
  return REGIONS.find((r) => r.code === regionCode)?.comunas ?? [];
}