export type RenderedText = {
  rendered: string;
};

export type WPBaseEntity = {
  id: number;
  slug: string;
  date?: string;
  modified?: string;
  title: RenderedText;
  excerpt?: RenderedText;
  content: RenderedText;
  acf?: Record<string, any>;
};

export type WPPost = WPBaseEntity;
export type WPPage = WPBaseEntity;

export type WPType = {
  slug: string;
  name: string;
  rest_base?: string;
  rest_namespace?: string;
  viewable?: boolean;
  hierarchical?: boolean;
};

export type WPTypesMap = Record<string, WPType>;

export type WCImage = {
  id: number;
  src: string;
  alt: string;
};

export type WCProductAttribute = {
  id: number;
  name: string;
  slug?: string;
  variation?: boolean;
  options?: string[];
};

export type WCVariationAttribute = {
  id?: number;
  name: string;
  slug?: string;
  option: string;
};

export type WCVariation = {
  id: number;
  price: string;
  regular_price?: string;
  sale_price?: string;
  on_sale?: boolean;
  stock_status?: string;
  image?: WCImage;
  attributes?: WCVariationAttribute[];
};

export type WCProduct = {
  id: number;
  name: string;
  slug: string;
  type?: string;
  permalink?: string;
  description: string;
  short_description: string;
  price: string;
  regular_price?: string;
  sale_price?: string;
  price_html?: string;
  on_sale?: boolean;
  stock_status?: string;
  sku?: string;
  categories?: WCCategory[];
  attributes?: WCProductAttribute[];
  images?: WCImage[];
};

export type WCCategory = {
  id: number;
  name: string;
  slug: string;
};
