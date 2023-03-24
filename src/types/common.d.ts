export type ModalType = 'property' | 'client' | 'ins-title'
export type TableRefs = 'companies'| 'counties' | 'pType' | 'pStat' | 'PAssign' | 'clientStat' | 'insTitleStat' | 'insTitleAssign';
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

export interface CompanyActivityReportTotDollarsEntry {
  tnmbr: string;
  tticoname: string;
  avg_prem: number;
  selected_period: number;
  qtr_1: number;
  qtr_2: number;
  qtr_3: number;
  qtr_4: number;
  qtr_1_af: number;
  qtr_2_af: number;
  qtr_3_af: number;
  qtr_4_af: number;
}


export interface CompanyActivityReportTotDollarsPctEntry  {
  tnmbr: string;
  tticoname: string;
  avg_pct_all: number;
  selected_period: number;
  qtr_1: number;
  qtr_2: number;
  qtr_3: number;
  qtr_4: number;
}

export interface CompanyActivityReportYearlyTotalEntry {
  tnmbr: string;
  tticoname: string;
  total_prem_ytd: number;
  total_agent_fee_ytd: number;
  total_prem_past_12_months: number;
  average_prem: number;
  total_prem_ytd_af: number;
  total_prem_past_12_months_af: number;
  average_prem_af: number;
}


export interface ClientStatus {
  id: number;
  'status_code': string;
  'status_desc': string;
}

export interface InsStatus {
  id: number;
  'status_code': string;
  'status_desc': string;
}

export interface PropertyStatus {
  id: number;
  'status_code': string;
  'status_desc': string;
}

export interface PropertyType {
  id: number;
  'type_code': string;
  'type_desc': string;
}

export interface County {
  id: number;
  code: string;
  county:string;
}