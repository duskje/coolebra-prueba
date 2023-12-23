# Respuestas
## Pregunta 1
### Respuesta
```postgresql
SELECT DISTINCT ON (product.product_id) price.discount_price, product.sku, product.ean, product.name, market.name
FROM price
JOIN product on price.product_id = product.product_id
Join market on product.market_id = market.market_id
WHERE price.active
ORDER By product.product_id, price.create_date DESC;
```

Asumí que podrían haber múltiples resultados con precios activos para un mismo producto, así que esta consulta cumpliría con este caso y sólo se obtenga el último precio activo.

### Tablas que usé para probar la consulta anterior
```postgresql
DROP table IF EXISTS price;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS market;

CREATE TABLE market (market_id SERIAL PRIMARY KEY, name VARCHAR(100));

INSERT INTO market (name) VALUES ('manta isabel'), ('dumbo');

CREATE TABLE product (
  product_id SERIAL PRIMARY KEY,
  NAME VARCHAR(100),
  sku VARCHAR(20),
  ean INTEGER,
  market_id INTEGER REFERENCES market(market_id)
);

INSERT INTO product (name, sku, ean, market_id) VALUES ('tritito', 'abc', 0, 1);
INSERT INTO product (name, sku, ean, market_id) VALUES ('galletas mclay', 'cba', 123, 2);
INSERT INTO product (name, sku, ean, market_id) VALUES ('lemma stone', 'rgb', 112233, 1);
INSERT into product (name, sku, ean, market_id) VALUES ('lemma stone2', 'gar', 112233, 2);

CREATE table price (
  price_id SERIAL PRIMARY KEY,
  normal_price INTEGER,
  discount_price INTEGER,
  active BOOLEAN,
  create_date TIMESTAMP,
  product_id INTEGER REFERENCES product(product_id)
);

INSERT INTO price (normal_price, discount_price, active, create_date, product_id) 
VALUES 
(800, 500, TRUE, now() + time '5:00', 1),
(800, 400, TRUE, now() + time '2:00', 1),
(800, 200, FALSE, now() + time '3:00', 1),
(3000, 2200, TRUE, now(), 2),
(3000, 3000, FALSE, now(), 2),
(1200, 600, TRUE, now(), 3);
```
### Salida de la consulta con la tabla anterior

discount_price sku ean product.name market.name

"500"	"abc"	"0"	"tritito"	"manta isabel"

"2200"	"cba"	"123"	"galletas mclay"	"dumbo"

"600"	"rgb"	"112233"	"lemma stone"	"manta isabel"

"750"	"gar"	"112233"	"lemma stone2"	"dumbo"

Usé estos valores para los ejemplos siguientes con la diferencia que cambié el nombre del producto `lemma stone2` a `lemma stone` para que los productos con el mismo ean también tengan el mismo nombre.

## Pregunta 2
Algo útil podría ser obtener los precios de descuento históricos para un producto, porque ahí se podría ver si es un descuento de verdad o no.

Si se hace la consulta periódicamente también esta tendría que sólo obtener los descuentos desde la última consulta para que no guardemos tuplas repetidas.

## Pregunta 3a
Disponible en `parte_python.py`, intenté apegarme lo máximo posible al formato del ejemplo. Asumí que el resultado de la consulta en la pregunta 1 vendría como una colección de tuplas y guardé el resultado a un JSON en `results.json` .

## Pregunta 4

Disponible en `\frontend` y usé create-react-app, así que sería solo ejecutar `npm start`.

