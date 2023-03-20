export interface Property {
  CNAME: string;
  CNMBR: string;
  PROPID: string;
  PCITY: string;
  PSTRET: string;
  PLOT: string;
  PCONDO: string;
  PUNIT: string;
  PSTATE: string;
  PZIP: string;
  PSTAT: string;
  PTYPE: string;
  PASIGN: string;
  PCOMPREF: string;
  PINSTR: string;
  PNMBR: string;
  PREQ: string;
  PRDATE: string;
  PCDATE: string;
  PFILE: string;
  CFILE: string;
  PBOOK1: string;
  PBOOK2: string;
  PDOCNUM: string;
  PPAGE1: string;
  PPAGE2: string;
  PCERT1: string;
  QBEXPORT: string;
}

export interface ReportProperty {
  PTDATE: string;
  PLOT: string;
  PSTRET: string;
  PCITY: string;
  county_code: string;
  county_name: string;
  PCOMPREF: number;
  PNMBR: number;
  CNAME: string;
  PTYPE: 'FT' | 'RD' | 'FC' | 'H';
  PASIGN: string;
  PASIGN2: string;
}

export interface Client {
  CNMBR: number;
  CNAME: string;
  CADD1: string;
  CADD2: string;
  CCITY: string;
  CSTATE: string;
  CZIP: string;
  CPHONE: string;
  CFAX: string;
  CCNTCT: string;
  CSTAT: string;
  CSTATTO: string;
  CSEARCH: string;
  EXPORT: boolean;
  CEMAIL: string;
  CNOTES: string;
  id: number;
  LAST_UPDATED: string;
}

export interface INSTitle {
  tticoname: string;
  INMBR: string; 
  ISTAT: string; 
  ISTATE: string; 
  IZIP: string; 
  IREMIT: string;
  TITLECO: string;
  IPOLDATE: string;
  ILOT: string;
  ISTRET: string;
  ICITY: string;
  PREMDUE: number;
  LPOLICYAMT: number
  LPOLICYNUM: string;
  OPOLICYAMT: number;
  OPOLICYNUM: string
  CNAME: string;
}

export interface LabelValuePair {
  label: string;
  value: string;
}

export interface Company {
  tnmbr: number;
  tticoname: string;
  tcity: string;
  tadd1: string;
  tzip: string;
  tpercent: number;
  tproduct1: number;
  tproduct2: number;
  tproduct3: number;
  tproduct4: number;
  tstat: string;
}