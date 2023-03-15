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
  PTDATE: string | null;
  PLOT: string | null;
  PSTRET: string;
  PCITY: string;
  county_code: string;
  county_name: string;
  PCOMPREF: number;
  PNMBR: number;
  CNAME: string | null;
  PTYPE: string | null;
  PASIGN: string | null;
  PASIGN2: string | null;
}