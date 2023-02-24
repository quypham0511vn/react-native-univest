export interface CityModal {
  id: number
  name: string
  slug: string
  type: string
  code: number
  name_with_type?: any
  status: string
  created_at: number
  updated_at: number
}

export interface DistrictModal {
  id: number
  name: string
  type: string
  slug: string
  name_with_type?: any
  path?: any
  path_with_type?: any
  code: number
  parent_code: number
  city_id: number
  status: string
  created_at: number
  updated_at: number
}

export interface WardModal {
    id: number;
    name: string;
    type: string;
    slug: string;
    name_with_type?: any;
    path?: any;
    path_with_type?: any;
    code: number;
    parent_code: number;
    district_id: number;
    status: string;
    created_at: number;
    updated_at: number;
  }
