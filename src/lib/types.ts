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

export type WCProduct = {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: string;
  price_html?: string;
  images?: WCImage[];
};

export type WCCategory = {
  id: number;
  name: string;
  slug: string;
};
