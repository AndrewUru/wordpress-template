"use client";

import { useMemo, useState } from "react";
import type { WCProduct, WCVariation } from "@/lib/types";

type ProductDetailClientProps = {
  product: WCProduct;
  variations: WCVariation[];
  wpBaseUrl: string;
};

type AttributeGroup = {
  name: string;
  slug: string;
  options: string[];
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function buildAttributeGroups(product: WCProduct, variations: WCVariation[]): AttributeGroup[] {
  const fromProduct = product.attributes
    ?.filter((attribute) => attribute.variation)
    .map((attribute) => ({
      name: attribute.name,
      slug: attribute.slug || slugify(attribute.name),
      options: attribute.options || []
    })) || [];

  if (!variations.length) {
    return fromProduct;
  }

  const map = new Map<string, AttributeGroup>();
  fromProduct.forEach((group) => map.set(group.name, { ...group, options: [...group.options] }));

  variations.forEach((variation) => {
    (variation.attributes || []).forEach((attribute) => {
      if (!attribute.option) return;
      const key = attribute.name;
      const current = map.get(key) || {
        name: key,
        slug: attribute.slug || slugify(key),
        options: []
      };
      if (!current.options.includes(attribute.option)) {
        current.options.push(attribute.option);
      }
      map.set(key, current);
    });
  });

  return Array.from(map.values()).filter((group) => group.options.length > 0);
}

export function ProductDetailClient({ product, variations, wpBaseUrl }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(product.images?.[0]?.src || "");
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const attributeGroups = useMemo(() => buildAttributeGroups(product, variations), [product, variations]);

  const matchingVariation = useMemo(() => {
    if (!variations.length || !attributeGroups.length) return null;
    const hasAllSelections = attributeGroups.every((group) => selectedOptions[group.name]);
    if (!hasAllSelections) return null;

    return (
      variations.find((variation) =>
        attributeGroups.every((group) => {
          const selected = selectedOptions[group.name];
          const varAttribute = (variation.attributes || []).find(
            (attribute) => attribute.name === group.name || (attribute.slug && attribute.slug === group.slug)
          );
          return selected && varAttribute?.option === selected;
        })
      ) || null
    );
  }, [attributeGroups, selectedOptions, variations]);

  const currentImage = matchingVariation?.image?.src || selectedImage || product.images?.[0]?.src || "";
  const currentPrice = matchingVariation?.price || product.price;
  const isVariable = product.type === "variable" && attributeGroups.length > 0;
  const canPurchase = !isVariable || Boolean(matchingVariation);

  const params = new URLSearchParams();
  params.set("add-to-cart", String(product.id));
  params.set("quantity", "1");

  if (matchingVariation) {
    params.set("variation_id", String(matchingVariation.id));
    attributeGroups.forEach((group) => {
      const selected = selectedOptions[group.name];
      if (selected) {
        params.set(`attribute_${group.slug}`, selected);
      }
    });
  }

  const addToCartUrl = `${wpBaseUrl}/?${params.toString()}`;
  const checkoutUrl = `${wpBaseUrl}/checkout/?${params.toString()}`;

  return (
    <section className="productPageShell">
      <div className="productGallery card">
        {currentImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={currentImage}
            alt={product.name}
            className="productPageMainImage"
          />
        ) : (
          <div className="productImagePlaceholder">Sin imagen</div>
        )}

        {product.images && product.images.length > 1 ? (
          <div className="productThumbGrid">
            {product.images.map((image) => (
              <button
                key={image.id}
                type="button"
                className={`productThumbButton ${image.src === currentImage ? "productThumbButtonActive" : ""}`}
                onClick={() => setSelectedImage(image.src)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image.src} alt={image.alt || product.name} className="productThumbImage" />
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className="productBuyPanel card">
        <p className="productEyebrow">{product.categories?.[0]?.name || "Producto WooCommerce"}</p>
        <h1>{product.name}</h1>
        <p className="productPriceNow">{currentPrice ? `$${currentPrice}` : "Consultar precio"}</p>

        {product.stock_status ? (
          <p className={`productStockBadge ${product.stock_status === "instock" ? "productStockBadgeOk" : ""}`}>
            {product.stock_status === "instock" ? "En stock" : "Sin stock"}
          </p>
        ) : null}

        {isVariable ? (
          <div className="productOptions">
            <h2>Selecciona tu variante</h2>
            {attributeGroups.map((group) => (
              <label key={group.name} className="productOptionField">
                <span>{group.name}</span>
                <select
                  value={selectedOptions[group.name] || ""}
                  onChange={(event) =>
                    setSelectedOptions((prev) => ({
                      ...prev,
                      [group.name]: event.target.value
                    }))
                  }
                >
                  <option value="">Elegir {group.name.toLowerCase()}</option>
                  {group.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        ) : null}

        <div className="productCtas">
          <a
            href={canPurchase ? addToCartUrl : product.permalink || `${wpBaseUrl}/product/${product.slug}`}
            className={`button productPrimaryCta ${canPurchase ? "" : "productButtonDisabled"}`}
            target="_blank"
            rel="noreferrer"
          >
            Añadir al carrito
          </a>
          <a
            href={canPurchase ? checkoutUrl : product.permalink || `${wpBaseUrl}/product/${product.slug}`}
            className={`productSecondaryCta ${canPurchase ? "" : "productButtonDisabled"}`}
            target="_blank"
            rel="noreferrer"
          >
            Comprar ahora
          </a>
        </div>

        {!canPurchase ? (
          <p className="productHint">Selecciona todas las opciones para habilitar compra directa.</p>
        ) : null}
      </div>
    </section>
  );
}
