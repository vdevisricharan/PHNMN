import React, { useEffect, useState } from "react";
import { styled } from "styled-components";
import Product from "./Product";
import axios from "axios";

const Container = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;

    & > div {
    flex-basis: 20%; /* Set 25% width for each product to display 4 in one row */
    max-width: 20%; /* Set max-width to keep 4 products in one row */

    @media (max-width: 768px) {
    /* Wrap to multiple columns on smaller screens */
    & > div {
      flex-basis: 50%; /* Set 50% width to display 2 products in one row on smaller screens */
      max-width: 50%; /* Set max-width to keep 2 products in one row on smaller screens */
    }
  }

  @media (max-width: 480px) {
    /* Wrap to a single column on even smaller screens */
    & > div {
      flex-basis: 100%; /* Set 100% width to display 1 product in one row on even smaller screens */
      max-width: 100%; /* Set max-width to keep 1 product in one row on even smaller screens */
    }
  }
  }
`
const Products = ({ cat, filters, sort }) => {
  // console.log(cat,filters,sort);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(cat ? `http://localhost:5000/api/products?category=${cat}` : `http://localhost:5000/api/products`);
        setProducts(res.data);
      } catch (error) {

      }
    }
    getProducts();
  }, [cat])

  useEffect(() => {
    cat && setFilteredProducts(
      products.filter(item => Object.entries(filters).every(([key, value]) =>
        item[key].includes(value)))
    )
  }, [products, cat, filters])

  useEffect(() => {
    if (sort === "newest") {
      setFilteredProducts(prev => [...prev].sort((a, b) => a.createdAt - b.createdAt));
    }
    else if (sort === "asc") {
      setFilteredProducts(prev => [...prev].sort((a, b) => a.price - b.price));
    }
    else {
      setFilteredProducts(prev => [...prev].sort((a, b) => b.price - a.price));
    }
  }, [sort])

  return (
    <Container>
      {cat ? filteredProducts.map((item) => (
        <Product item={item} key={item.id} />
      )) : products.slice(0, 8).map((item) => (
        <Product item={item} key={item.id} />
      ))}
    </Container>
  )
}

export default Products;