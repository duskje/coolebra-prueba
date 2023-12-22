import logo from './logo.svg';
import './App.css';
import {useEffect, useState} from "react";

const products_json = [
  {
    "0": [
      {
        "product_name": "tritito",
        "query_results": [
          [
            500,
            "abc",
            0,
            "tritito",
            "manta isabel"
          ]
        ],
        "markets": [
          "manta isabel"
        ],
        "price_range": "500-500"
      }
    ]
  },
  {
    "123": [
      {
        "product_name": "galletas mclay",
        "query_results": [
          [
            2200,
            "cba",
            123,
            "galletas mclay",
            "dumbo"
          ]
        ],
        "markets": [
          "dumbo"
        ],
        "price_range": "2200-2200"
      }
    ]
  },
  {
    "112233": [
      {
        "product_name": "lemma stone",
        "query_results": [
          [
            600,
            "rgb",
            112233,
            "lemma stone",
            "manta isabel"
          ],
          [
            750,
            "gar",
            112233,
            "lemma stone",
            "dumbo"
          ]
        ],
        "markets": [
          "manta isabel",
          "dumbo"
        ],
        "price_range": "750-600"
      }
    ]
  }
];

function ProductsList( {products} ) {
  const [lastProducts, setLastProducts] = useState([]);
  const [productsToClear, setProductsToClear] = useState([]);
  const [timeouts, setTimeouts] = useState([]);

  useEffect(() => {
    let newProducts = [...lastProducts];

    for(const product of products){
      if(!(newProducts.map((item) => item.product_name).includes(product.product_name))){
        newProducts.push(product);
      }

      if(productsToClear.includes(product.product_name)) {
        setProductsToClear((lastProductsToClear) =>
          lastProductsToClear.filter(([timeoutID, productName]) => productName !== product.product_name)
        );
      }

      if(timeouts.includes(product.product_name)) {
        timeouts.forEach(([timeoutID, productName]) => {
          if(productName === product.product_name){
            clearTimeout(timeoutID);
          }
        });

        setTimeouts((lastTimeouts) =>
          lastTimeouts.filter(([timeoutID, productName]) => productName !== product.product_name)
        );
      }
    }

    setLastProducts(() => newProducts);
  }, [products, productsToClear]);

  useEffect(() => {
    const lastProductNames = lastProducts.map((product) => product.product_name);

    for(const lastProductName of lastProductNames){
      const productNames = products.map((product) => product.product_name)

      if(!productNames.includes(lastProductName) && !productsToClear.includes(lastProductName)){
        setProductsToClear((lastValue) => [...lastValue, lastProductName]);
      }
    }
  }, [lastProducts]);

  useEffect(() => {
    if(productsToClear.length) {
      const productToClear = productsToClear.slice(-1)[0];

      const timeoutID = setTimeout(() => {
        setLastProducts((lastLastProducts) =>
          lastLastProducts.filter((product) => product.product_name !== productToClear)
        );
        setProductsToClear((lastProductsToClear) =>
          lastProductsToClear.filter((productName) => productName !== productToClear)
        );
        setTimeouts((lastTimeouts) =>
          lastTimeouts.filter(([timeoutID, productName]) => productName !== productToClear)
        );
      }, 1000)

      setTimeouts((timeouts) => [...timeouts, [timeoutID, productToClear]])
    }
    }, [productsToClear]
  );

  function productToListItem(product){
    return (
      <div style={{display: 'flex', flexDirection: 'column', marginBottom: 20}}>
        <span><b>Nombre del producto </b> {product.product_name}</span>
        <span><b>Rango de precios </b> {product.price_range}</span>
        <span><b>Número de mercados diferentes</b> {product.markets.length} ({product.markets.join(', ')})</span>
      </div>
    );
  }

  return <>{lastProducts.map(productToListItem)}</>;
}

function App() {
  const [currentProductName, setCurrentProductName] = useState('');

  function handleInputChange(event) {
    setCurrentProductName(event.target.value);
  }

  const [currentProducts, setCurrentProducts] = useState([]);

  useEffect(() => {
      let products = [];

      for(const product_by_ean of products_json){
        const ean = Object.keys(product_by_ean)[0];
        const content = product_by_ean[ean][0];

        if (content.product_name === currentProductName) {
          products.push(content);
        } else if ('' === currentProductName) {
          products.push(content);
        }
      }

      setCurrentProducts(() => products);
    },
    [currentProductName]
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1 for='productName'>Búsqueda por nombre</h1>
        <input style={{marginBottom: 20}}type='text' name='productName' onInput={handleInputChange}/>
        <ProductsList products={currentProducts} />
      </header>
    </div>
  );
}

export default App;
