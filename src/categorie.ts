interface Product {
  id?: number;
  title: string;
  supermarket: string;
}

interface CategoryResult {
  category: string;
  count: number;
  products: Omit<Product, "id">[];
}

export function categorizeProducts(products: Product[]): CategoryResult[] {
  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[-]/g, " ")
      .replace(/(\d+)\s*litro(s)?/gi, "$1L")
      .replace(/(\d+)\s*quilo(s)?/gi, "$1kg")
      .trim();
  };

  const getProductKey = (title: string): string => {
    const normalized = normalizeText(title);

    const words = normalized.split(" ");

    let type = "";
    let brand = "";
    let size = "";

    const typeIndicators = [
      "integral",
      "desnatado",
      "semi",
      "branco",
      "carioca",
      "tipo",
    ];

    const knownBrands = [
      "piracanjuba",
      "italac",
      "parmalat",
      "tio joão",
      "camil",
    ];

    const sizePattern = /\d+[lkg]/i;

    for (const word of words) {
      if (typeIndicators.includes(word)) {
        type += " " + word;
      }

      if (sizePattern.test(word)) {
        size = word;
      }
    }

    for (const knownBrand of knownBrands) {
      if (normalized.includes(knownBrand)) {
        brand = knownBrand;
        break;
      }
    }

    return `${brand.trim()} ${type.trim()} ${size.trim()}`.trim();
  };

  const productGroups: Record<string, Product[]> = {};

  for (const product of products) {
    const key = getProductKey(product.title);
    if (!productGroups[key]) {
      productGroups[key] = [];
    }
    productGroups[key].push(product);
  }

  return Object.entries(productGroups).map(([_, groupProducts]) => {
    return {
      category: groupProducts[0].title,
      count: groupProducts.length,
      products: groupProducts.map((p) => ({
        title: p.title,
        supermarket: p.supermarket,
      })),
    };
  });
}
