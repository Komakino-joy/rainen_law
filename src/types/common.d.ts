export type ModalType = 'property' | 'client' 
export type TableRefs = 'counties' | 'pType' | 'pStat' | 'PAssign' | 'clientStat' | 'examiners' |'users';
export interface Property {
  p_input_date: string;
  CNAME: string;
  CNMBR: string;
  id: string;
  p_city: string;
  p_street: string;
  p_lot: string;
  p_condo: string;
  p_unit: string;
  p_state: string;
  p_zip: string;
  p_status: string;
  p_type: string;
  p_assign: string;
  p_comp_ref: string;
  p_instructions: string;
  p_number: string;
  p_requester: string;
  p_request_date: string;
  p_closed_date: string;
  p_file: string;
  c_file: string;
  p_book_1: string;
  p_book_2: string;
  p_page_1: string;
  p_page_2: string;
  p_cert_1: string;
  p_request_date: string;
  p_type: string;
  p_input_date: string;
  p_comp_ref: string;
  p_unit: string;
  p_condo: string;
  p_book_1: string;
  p_book_2: string;
  p_page_1: string;
  p_page_2: string;
  p_cert_1: string;
  seller_1: string;
  seller_2: string;
  seller_3: string;
  seller_4: string;
  buyer_1: string;
  buyer_2: string;
  p_instructions: string;
  CNAME: string;
  p_requester: string;
  c_file: string;
}

export interface ReportProperty {
  p_input_date: string;
  p_lot: string;
  p_street: string;
  p_city: string;
  county_code: string;
  county_name: string;
  p_comp_ref: number;
  p_number: number;
  CNAME: string;
  p_type: 'FT' | 'RD' | 'FC' | 'H';
  p_assign: string;
  p_assign2: string;
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
  CEMAIL: string;
  CNOTES: string;
  id: number;
  last_updated: string;
}

export interface ClientInfoSnippet {
  id:string;
  cnmbr: number | null;
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
  value: any;
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
  seller_1: string;
  seller_2: string;
  seller_3: string;
  seller_4: string;
  buyer_1: string;
  buyer_2: string;
}