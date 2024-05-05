import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { BEARERKEY, baseURL } from './../../App';

function ProductControl({ currentUser }) {
    const [products, setProducts] = useState(null)
    const [currentProdcut, setCurrentProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [values, setValues] = useState({
        name: '',
        price: '',
        category: '',
        description: '',
        imageURL: ''
    })

    function disableBtns() {
        const deleteBTNs = document.querySelectorAll('.del')
        const editBTNS = document.querySelectorAll('.ed')
        for (let i = 0; i < deleteBTNs.length; i++) {
            deleteBTNs[i].disabled = true
            editBTNS[i].disabled = true
        }
        document.getElementById('addBTN').disabled = true
        document.getElementById('updateBTN').disabled = false
    }
    function enableBTNS() {
        const deleteBTNs = document.querySelectorAll('.del')
        const editBTNS = document.querySelectorAll('.ed')
        for (let i = 0; i < deleteBTNs.length; i++) {
            deleteBTNs[i].disabled = false
            editBTNS[i].disabled = false
        }
        document.getElementById('addBTN').disabled = false
        document.getElementById('updateBTN').disabled = true
    }
    function clearInputs() {
        const inputs = document.querySelectorAll('.accordion input')
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = ''
        }
        document.getElementById('category-input').value = ""
    }
    function fillInputs(product) {

        const inputs = document.querySelectorAll('.accordion input')
        let edited = {
            name: '',
            price: '',
            category: product.category,
            description: '',
            imageURL: ''
        }
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].value = product[inputs[i].name]
            edited[inputs[i].name] = product[inputs[i].name]
        }
        document.getElementById('category-input').value = product.category
        setValues(edited)
        return edited
    }

    function handleTyping(e) {
        setValues({ ...values, [e.target.name]: e.target.value })
    }
    async function handleSumbit(e) {
        e.preventDefault()
        if (e.nativeEvent.submitter.id === 'updateBTN') {
            editProduct()
        } else {
            const config = {
                headers: {
                    authorization: BEARERKEY + localStorage.getItem("token"),
                }
            };
            let result = await axios.post(`${baseURL}/products/add`, values, config).catch(function (error) {
                if (error.response) {
                    console.log(error.response);
                }
            });
            if (result?.data?.message !== "done") {
                alert('Fields cannot be empty')
            } else {
                clearInputs()
                getProducts()
            }
            setValues({
                name: '',
                price: '',
                category: '',
                description: '',
                imageURL: ''
            })
        }

    }

    async function getProducts() {
        setLoading(true)
        const config = {
            headers: {
                authorization: BEARERKEY + localStorage.getItem("token"),
            }
        };
        const result = await axios
            .get(`${baseURL}/products/user`, config)
            .catch((err) => {
                setProducts(null);
                setLoading(false);
                console.log(err);
            });
        if (result.data?.message === 'done') {
            setProducts(result?.data?.products)
            setLoading(false)
        }
        console.log(result.data)
    }

    async function deleteProdcut() {
        const config = {
            headers: {
                authorization: BEARERKEY + localStorage.getItem("token"),
            }
        };
        const result = await axios
            .delete(`${baseURL}/products/${currentProdcut._id}/delete`, config)
            .catch((err) => {
                console.log(err);
                alert("Something went wrong")
            });
        if (result.data?.message === 'done') {
            getProducts()
        }
    }


    async function initEdit(product) {
        setCurrentProduct(product)
        disableBtns()
        fillInputs(product)

    }
    async function editProduct() {
        const config = {
            headers: {
                authorization: BEARERKEY + localStorage.getItem("token"),
            }
        };
        const result = await axios
            .put(`${baseURL}/products/${currentProdcut._id}/update`, values, config)
            .catch((err) => {
                console.log(err);
                alert("Something went wrong")
            });
        if (result.data?.message === 'done') {
            getProducts()
        }
        setCurrentProduct(null)
        setValues(null)
        enableBTNS()
        clearInputs()
    }


    useEffect(() => {
        getProducts()
    }, [])


    return <>

        <Link to='/cp' className=' back h4 mb-2 d-inline-flex text-warning'>← Control Panel</Link>

        <div className="accordion accordion-flush mb-3 text-white-50" id="accordionFlushExample">
            <div className="accordion-item">
                <h2 className="accordion-header" id="flush-headingOne">
                    <button className="accordion-button text-center text-bg-dark collapsed justify-content-center" type="button" data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                        Add Product
                    </button>
                </h2>
                <div id="flush-collapseOne" className="accordion-collapse collapse text-bg-dark p-3" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                    <h1 className="text-center mt-1">PRODUCT</h1>
                    <form onSubmit={handleSumbit}>
                        <label htmlFor="prodName">Product Name: </label>
                        <input onChange={handleTyping} name='name' type="text" className="form-control my-2" />
                        <label htmlFor="prodPrice">Product Price: </label>
                        <input onChange={handleTyping} name='price' type="number" className="form-control my-2" />

                        <label htmlFor="prodCat">Product Catergory: </label>
                        <select onChange={handleTyping} name="category" id="category-input" className="form-control my-2">
                            <option value="" selected disabled hidden>Choose here</option>
                            <option value="PCs">PCs</option>
                            <option value="Laptops">Laptops</option>
                            <option value="Mobiles">Mobiles</option>
                            <option value="TVs">TVs</option>
                        </select>


                        <label htmlFor="prodDesc">Product Description: </label>
                        <input onChange={handleTyping} name='description' type="text" className="form-control my-2" />
                        <label htmlFor="prodIMG">Product Image: </label>
                        <input onChange={handleTyping} name='imageURL' type="text" className="form-control my-2" />
                        <button name='addAction' className="btn btn-success my-2 me-2" id='addBTN'>Add Product</button>

                        <button name='updateAction' data-bs-toggle="modal" data-bs-target="#doneModal" aria-expanded="false" aria-controls="flush-collapseOne" className="btn btn-primary my-2" id='updateBTN' disabled>
                            <p className='p-0 m-0' data-bs-toggle="collapse" data-bs-target="#flush-collapseOne"> Update Product</p></button>
                    </form>
                </div>
            </div>
        </div>


        <div className='table-info d-flex align-items-center mb-2'>
            <div className="colored-box me-1"></div>
            <p className='p-0 m-0'>My items</p>
        </div>


        <table className="table table-striped table-hover table-bordered ">
            <thead>
                <tr>
                    <th>Merchant</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Catergory</th>
                    <th>Description</th>
                    <th>Delete</th>
                    <th>Edit</th>
                </tr>
            </thead>
            <tbody>
                {loading ? "Loading" :
                    products?.map((product) =>
                        <tr key={product._id} className={currentUser._id === product.createdBy._id ? 'table-success' : ''}>

                            <td>{product.createdBy.firstName} {product.createdBy.lastName}</td>
                            <td>{product.name}</td>
                            <td>{product.price}</td>
                            <td>{product.category}</td>
                            <td>{product.description}</td>

                            <td><button data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setCurrentProduct(product)} className="del btn btn-danger ">Delete</button></td>
                            {currentUser._id === product.createdBy._id && <td><button onClick={() => initEdit(product)} data-bs-toggle="collapse" data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne" className="ed btn btn-info">Edit</button></td>}
                        </tr>
                    )
                }



            </tbody>
        </table>

        <div className="modals">
            <div className="modal fade" id="doneModal" tabIndex="-1" aria-labelledby="doneModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-dark " id="doneModalLabel">Done</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="wrapper" >
                                <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52"> <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" /> <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                                </svg>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-success " data-bs-dismiss="modal">Ok</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title text-dark " id="deleteModalLabel">Delete</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <p className="lead text-dark">Are you Sure?</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={deleteProdcut} data-bs-toggle="modal" data-bs-target="#doneModal" type="button" data-bs-dismiss="modal" className="btn btn-danger" >Delete</button>
                            <button type="button" className="btn btn-info" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>



    </>

}

export default ProductControl