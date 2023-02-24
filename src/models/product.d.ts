export interface ProductModel {
    parent_title: string;
    parent_name: string;
    description: string;
    form: string;
    id: number;
    interest: string;
    name_parent: string;
    title: string;
    period: number;
    type_period: number;
    parent_id: number;
    parent_type: string;
    child?: any;
}
export interface ProductGroupModel {
    parent_id: number;
    parent_name: string;
    parent_title: string;
    child: ProductModel[];
    isExpanded?: boolean;
}


