import React, { useEffect, useState } from 'react'
import axios from 'axios'
import './Home.css'
import { baseURL } from './../../App';

function Home({ currentUser, cart, setCart }) {

  const [isGrid, setIsGrid] = useState(true)
  const [products, setProducts] = useState(null)
  const [currentCat, setCurrentCat] = useState('')
  const [currentPriceOrder, setCurrentPriceOrder] = useState('')
  const [currentDateOrder, setCurrentDateOrder] = useState('')
  const [loading, setLoading] = useState(true)


  async function getProducts({ category = '', orderPrice = 0, orderDate = 0 } = {}) {
    setCurrentCat(category)
    setCurrentPriceOrder(orderPrice)
    setCurrentDateOrder(orderDate)
    setLoading(true)


    let search = document.getElementById('search').value
    let pricegt = document.getElementById('pricegt').value
    let pricelt = document.getElementById('pricelt').value

    const result = await axios
      .get(`${baseURL}/products/all?category=${category}&search=${search}&orderPrice=${orderPrice}&orderDate=${orderDate}&pricegt=${pricegt}&pricelt=${pricelt}`)
      .catch((err) => {
        setProducts(null);
        setLoading(false);
        console.log(err);
      });
    if (result.data?.message === 'done') {
      setProducts(result?.data?.products)
      setLoading(false)
    }
  }


  function addToCart(product) {
    let tempCart = [], exists = false;
    for (let i = 0; i < cart.length; i++) {
      if (cart[i]._id == product._id) {
        exists = true
        break;
      }
    }
    product.cartNumber = 1

    if (!exists) {
      tempCart = [...cart, product]
      setCart(tempCart);
      localStorage.setItem('cart', JSON.stringify(tempCart));
    }
  }

  useEffect(() => {
    getProducts({ orderDate: 1 })

  }, [])


  function makeGrid() {
    setIsGrid(true)
  }
  function removeGrid() {
    setIsGrid(false)
  }

  return <>

    <div className="cat d-flex bg-cat text-white p-2 ">

      <ul className="navbar-nav w-100">
        <div className="categories d-flex justify-content-evenly w-100">
          <li className={currentCat === '' ? "nav-item cat-active" : "nav-item"}>
            <span onClick={() => { getProducts({ category: '', orderPrice: currentPriceOrder, orderDate: currentDateOrder }) }} className="nav-link cursor-pointer" >All Categories</span>
            <div className="selected"></div>
          </li>
          <li className={currentCat === 'Laptops' ? "nav-item cat-active" : "nav-item"}>
            <span onClick={() => { getProducts({ category: 'Laptops', orderPrice: currentPriceOrder, orderDate: currentDateOrder }) }} className="nav-link cursor-pointer" >Laptops</span>
            <div className="selected"></div>
          </li>
          <li className={currentCat === 'PCs' ? "nav-item cat-active" : "nav-item"}>
            <span onClick={() => { getProducts({ category: 'PCs', orderPrice: currentPriceOrder, orderDate: currentDateOrder }) }} className="nav-link cursor-pointer" >PCs</span>
            <div className="selected"></div>
          </li>
          <li className={currentCat === 'Mobiles' ? "nav-item cat-active" : "nav-item"}>
            <span onClick={() => { getProducts({ category: 'Mobiles', orderPrice: currentPriceOrder, orderDate: currentDateOrder }) }} className="nav-link cursor-pointer" >Mobiles</span>
            <div className="selected"></div>
          </li>
          <li className={currentCat === 'TVs' ? "nav-item cat-active" : "nav-item"}>
            <span onClick={() => { getProducts({ category: 'TVs', orderPrice: currentPriceOrder, orderDate: currentDateOrder }) }} className="nav-link cursor-pointer" >TVs</span>
            <div className="selected"></div>
          </li>
        </div>
      </ul>
    </div>


    <div className="cat bg-cat p-2 mb-4">

      <input className='form-control border-primary ' placeholder='Search...' id='search' type="text" onChange={() => { getProducts({ category: currentCat, orderPrice: currentPriceOrder, orderDate: currentDateOrder }) }} />

    </div>


    <div className="row gy-3">
      <div className="col-12 col-lg-2">
        <div className="d-flex d-lg-block mx-auto justify-content-evenly">
          <div className="d-flex ">
            <div className="order">
              <h3 className='text-secondary'>Order By:</h3>
              <hr className='m-0' />
              <div className="mt-3">
                <div className={currentDateOrder === 1 ? "filter-item cat-active mb-3 overflow-hidden " : "filter-item mb-3 overflow-hidden "}>
                  <p onClick={() => { getProducts({ category: currentCat, orderDate: 1 }) }} className='filters hovering cursor-pointer mb-0 p-1 '>Latest Products</p>
                  <div className="selected"></div>
                </div>

                <div className={currentDateOrder === -1 ? "filter-item cat-active mb-3 overflow-hidden " : "filter-item mb-3 overflow-hidden "}>
                  <p onClick={() => { getProducts({ category: currentCat, orderDate: -1 }) }} className='filters hovering cursor-pointer mb-0 p-1 '>Early Products</p>
                  <div className="selected"></div>
                </div>

                <div className={currentPriceOrder === -1 ? "filter-item cat-active mb-3 overflow-hidden " : "filter-item mb-3 overflow-hidden "}>
                  <p onClick={() => { getProducts({ category: currentCat, orderPrice: -1 }) }} className='filters hovering cursor-pointer mb-0 p-1 '>Highest Prices</p>
                  <div className="selected"></div>
                </div>

                <div className={currentPriceOrder === 1 ? "filter-item cat-active mb-3 overflow-hidden " : "filter-item mb-3 overflow-hidden "}>
                  <p onClick={() => { getProducts({ category: currentCat, orderPrice: 1 }) }} className='filters hovering cursor-pointer mb-0 p-1 '>Lowest Prices</p>
                  <div className="selected"></div>
                </div>

                <p onClick={() => { getProducts() }} className={currentDateOrder || currentPriceOrder ? 'btn btn-secondary cursor-pointer  text-center hovering' : 'btn btn-secondary  text-center disabled'}>Clear filters</p>


              </div>
            </div>
          </div>
          <div className="d-flex mb-4 ">
            <div className="order">
              <h3 className='text-secondary '>Price:</h3>
              <hr className='m-0' />
              <div className="mt-3">
                <input onChange={() => { getProducts({ category: currentCat, orderPrice: currentPriceOrder, orderDate: currentDateOrder }) }} type="number" id='pricelt' className='form-control' placeholder='Price less than' />
                <input onChange={() => { getProducts({ category: currentCat, orderPrice: currentPriceOrder, orderDate: currentDateOrder }) }} type="number" id='pricegt' className='form-control mt-3' placeholder='Price more than' />
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="col-lg-10">
        <main>
          <div className={isGrid ? "row gy-3" : "row gy-5"}>
            <div className="show-control d-flex justify-content-between d-none d-md-flex">
              <div className="left-control">
                <h3 className='text-secondary'>Display:</h3>
                <hr className='m-0' />
              </div>
              <div className="right-control ">
                <span className='text-muted me-3'>Display Option:</span>
                <button onClick={makeGrid} className=' hvr-float-shadow btn btn-secondary me-2'>
                  <div className={isGrid ? "" : 'text-white-50'}>
                    <i className="fa-solid fa-2x fa-table-cells-large"></i>
                  </div>
                </button>
                <button onClick={removeGrid} className=' hvr-float-shadow btn btn-secondary me-2'>
                  <div className={isGrid ? "text-white-50" : ''}>
                    <i className="fa-solid fa-2x fa-table-list"></i>
                  </div>
                </button>
              </div>
            </div>
            {loading ? "loading" : <>
              {products?.map((product) => {
                const date = new Date(product.createdAt)
                const month = date.getMonth() + 1
                const prodTime = date.getDate() + '/' + month + '/' + date.getFullYear()

                let idx;
                const tempCart = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
                if (tempCart?.length) {
                  for (let i = 0; i < tempCart?.length; i++) {
                    if (tempCart[i]._id == product._id) {
                      idx = i
                      break;
                    }
                  }
                }

                return <div key={product._id} className={isGrid ? "col-md-6 col-lg-3 " : " col-md-6 col-lg-6 offset-md-3 offset-lg-3"}>
                  <div className={isGrid ? 'card shadow position-relative' : "position-relative card shadow w-75 m-auto"}>
                    <span className="position-absolute badge bg-danger">
                      {product.category}
                      <span className="visually-hidden">Category</span>
                    </span>
                    <img src={product.imageURL} className="card-img-top w-100 mx-auto " alt="..." />
                    <div className="card-body border-top my-auto">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">Price: ${product.price}</p>
                    </div>
                    <div className="card-footer">
                      {currentUser ? currentUser?.role !== 'user' ? '' :
                        <button onClick={() => addToCart(product)}
                          className={tempCart[idx]?.cartNumber ? "btn btn-success disabled btn-flip w-100 rounded-pill" : " btn btn-primary w-100 rounded-pill"}
                          data-hover="Add this item" data-back="Add to cart" data-front="Added to cart" >
                          {tempCart[idx]?.cartNumber ? '' : 'Add to cart'}
                        </button> : ''}
                      <div className=" rounded-pill w-100 bg-secondary text-center show-desc cursor-pointer ">
                        <p className='text-white px-2 py-1 m-0 my-3'>Show Details</p>

                        <div className="layer position-absolute start-0 end-0 bottom-0  d-flex flex-column align-items-center justify-content-center">
                          <div className="card-desc p-3 pb-0 mb-1">
                            <h5 className='p-0 m-0 '>Description:</h5>
                            <hr className='p-0 my-2' />
                            <p className="card-text p-0 m-0 ">{product.description}</p>
                          </div>
                          <div className="seller-info d-flex justify-content-between flex-column">
                            <div className="seller-name">
                              <hr className='my-1 py-1' />
                              <p className='p-0 m-0'>Added By: {product.createdBy.firstName} {product.createdBy.lastName}</p>
                            </div>
                            <hr />
                            <div className="time">
                              <p className='p-0 m-0'>Added time: {prodTime}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              })}
              {products?.length ? '' :
                <div className="no-results p-2 display-6 d-flex justify-content-center align-items-center">
                  <p>No Results</p>
                </div>
              }
            </>}


          </div>
        </main>
      </div>
    </div >


  </>
}

export default Home