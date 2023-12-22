import json


def group_by_ean(results):
    grouped_by_ean = {}

    for discount_price, sku, ean, product_name, market_name in results:
        product = grouped_by_ean.get(ean)

        if product is not None:
            product["markets"].append(market_name)
            product["price_range"].append(discount_price)
            product["query_results"].append((discount_price, sku, ean, product_name, market_name))
        else:
            new_product = {
                "product_name": product_name,
                "query_results": [(discount_price, sku, ean, product_name, market_name)],
                "markets": [market_name],
                "price_range": [discount_price]
            }

            grouped_by_ean[ean] = new_product

    grouped_results = []

    for ean, product in grouped_by_ean.items():
        product["price_range"] = f'{max(product["price_range"])}-{min(product["price_range"])}'
        new_result = {ean: [product]}

        grouped_results.append(new_result)

    return grouped_results


if __name__ == '__main__':
    results = (("500","abc","0","tritito","manta isabel"),
               ("2200", "cba", "123", "galletas mclay", "dumbo"),
               ("600", "rgb", "112233", "lemma stone", "manta isabel"),
               ("750", "gar", "112233", "lemma stone", "dumbo"))  # Cambié a el nombre de esta tupla para que esté como dice en el ejemplo

    new_results = []

    for discount_price, sku, ean, product_name, market_name in results:
        new_results.append((int(discount_price), sku, int(ean), product_name, market_name))

    results = new_results

    with open('results.json', 'w') as file:
        json.dump(group_by_ean(results), file, indent=4)
