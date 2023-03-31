export type ModalType = 'property' | 'client' 
export type TableRefs = 'counties' | 'pType' | 'pStat' | 'PAssign' | 'clientStat' | 'examiners' |'users';
export interface Property {
  PTDATE: string;
  CNAME: string;
  CNMBR: string;
  id: string;
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
  PRDATE: string;
  PTYPE: string;
  PTDATE: string;
  PCOMPREF: string;
  PUNIT: string;
  PCONDO: string;
  PBOOK1: string;
  PBOOK2: string;
  PPAGE1: string;
  PPAGE2: string;
  PCERT1: string;
  PSELR1: string;
  PSELR2: string;
  PSELR3: string;
  PSELR4: string;
  PBUYR1: string;
  PBUYR2: string;
  PINSTR: string;
  CNAME: string;
  PREQ: string;
  CFILE: string;
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
  last_updated: string;
}

export interface ClientInfoSnippet {
  id:string;
  cnmbr: string | null;
  clientName: string | null;
  lastUpdated: {
    date:string, 
    time:string
  } | null;
}

export interface INSTitle {
  id: string;
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
  IFILE: string;
  AGENTFEE: string;
  PREMPAID: string;
}

export interface OutstandingInsTitleReportEntry {
  CNAME: string;
  CADD1: string;
  CADD2: string;
  CCITY: string;
  CSTATE: string;
  CZIP: string;
  CCNTCT: string;
  ISTRET: string;
  ICITY: string;
  OPOLICYNUM: string;
  LPOLICYNUM: string;
  OPOLICYAMT: number;
  LPOLICYAMT: number;
  IFILE: number;
  ILOT: string;
  IPOLDATE: string;
  PREMDUE: number;
  IBILL: number;
  PREMPAID: number;
  filter: number;
}

export interface LabelValuePair {
  label: string;
  value: string;
}

export interface Policy {
  id: string;
  tticoname: string,
  IPOLDATE: string;
  IFILE: string;
  ICITY: string;
  ISTRET: string;
  ILOT: string;
  ICONDO: string;
  IUNIT: string;
  INMBR: string;
  PREMDUE: string;
  PREMPAID: string;
  AGENTFEE: string;
  TICOFEE: string;
  RWFEE: string;
  TITLECO: string;
  OPOLICYNUM: string;
  LPOLICYNUM: string;
  OPOLICYAMT: string;
  LPOLICYAMT: string;
  ISTAT: string;
  DATEBILLED: string;
  DATEPAID: string;
  IBILL: string;
  POLICYDATE: string;
  IREMIT: string;
  ISTATE: string;
  IZIP: string;
  CNAME: string;
  IPDATE: string;
  INOTES: string;
  ICDATE: string;
}

export interface RemittanceReportEntry {
  CNAME: string;
  CADD1: string;
  CADD2: string;
  CCITY: string;
  CSTATE: string;
  CZIP: string;
  CCNTCT: string;
  ISTRET: string;
  ICITY: string;
  OPOLICYNUM: string;
  LPOLICYNUM: string;
  OPOLICYAMT: number;
  LPOLICYAMT: number;
  IFILE: string;
  ILOT: string;
  IPOLDATE: string;
  PREMDUE: number;
  IBILL: number;
  PREMPAID: number;
  filter: number;
  tticoname: string;
  tadd1: string;
  tcity: string;
  tstate: string;
  tzip: string;
  AGENTFEE: number;
}

export interface ClientStatus {
  id: number;
  status_code: string;
  status_desc: string;
}

export interface InsStatus {
  id: number;
  status_code: string;
  status_desc: string;
}

export interface PropertyStatus {
  id: number;
  status_code: string;
  status_desc: string;
}

export interface PropertyType {
  id: number;
  type_code: string;
  type_desc: string;
}

export interface County {
  id: number;
  code: string;
  county:string;
}

export interface Examiner {
  id: string;
  name:string;
  code:string;
  type:string;
  compensate:string;
  last_updated:string;
  created_at:string;
  is_active: boolean;
}

export interface User {
  id: string;
  username: string;
  f_name: string;
  l_name: string;
}

export interface BuyerSeller {
  id: string;
  PSELR1: string;
  PSELR2: string;
  PSELR3: string;
  PSELR4: string;
  PBUYR1: string;
  PBUYR2: string;
}