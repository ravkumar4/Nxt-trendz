// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'

import Loader from 'react-loader-spinner'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productItemList: {},
    similarProductsList: [],
    count: 1,
  }

  componentDidMount() {
    this.getProductItems()
  }

  getProductItems = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const accessToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = {
        id: fetchedData.id,
        imageUrl: fetchedData.image_url,
        title: fetchedData.title,
        price: fetchedData.price,
        description: fetchedData.description,
        brand: fetchedData.brand,
        totalReviews: fetchedData.total_reviews,
        rating: fetchedData.rating,
        availability: fetchedData.availability,
        updatedSimilarProducts: fetchedData.similar_products.map(
          eachSimilarProduct => ({
            id: eachSimilarProduct.id,
            imageUrl: eachSimilarProduct.image_url,
            title: eachSimilarProduct.title,
            style: eachSimilarProduct.style,
            price: eachSimilarProduct.price,
            description: eachSimilarProduct.description,
            brand: eachSimilarProduct.brand,
            totalReviews: eachSimilarProduct.total_reviews,
            rating: eachSimilarProduct.rating,
            availability: eachSimilarProduct.availability,
          }),
        ),
      }
      this.setState({
        apiStatus: apiStatusConstants.success,
        productItemList: updatedData,
        similarProductsList: updatedData.updatedSimilarProducts,
      })
    } else if (response.status === 404 || response.status === 400) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onClickIncrement = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onClickDecrement = () => {
    const {count} = this.state
    if (count !== 1) {
      return this.setState(prevState => ({count: prevState.count - 1}))
    }
    return count
  }

  renderProductItemSuccessView = () => {
    const {productItemList, similarProductsList, count} = this.state
    console.log(similarProductsList)
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productItemList
    return (
      <>
        <Header />
        <div className="wrapper">
          <div className="products-item-list-container">
            <div>
              <img src={imageUrl} alt="product" className="product-image" />
            </div>
            <div className="product-text-container">
              <h1 className="product-title">{title}</h1>
              <p className="product-price">Rs {price}/-</p>
              <div className="rating-review-container">
                <div className="star-rating-container">
                  <p className="product-rating">{rating} </p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star-icon"
                  />
                </div>

                <p className="product-reviews">{totalReviews} Reviews</p>
              </div>
              <p className="product-desc">{description}</p>
              <div className="availability-container">
                <p className="availability-status">Availability:</p>
                <p className="span-availability-status">{availability}</p>
              </div>
              <div className="brand-container">
                <p className="product-brand">Brand:</p>
                <p className="span-brand"> {brand} </p>
              </div>

              <hr />
              <div className="count-container">
                <button
                  type="button"
                  testid="minus"
                  className="count-button"
                  onClick={this.onClickDecrement}
                >
                  <BsDashSquare />
                </button>
                <p className="count"> {count} </p>
                <button
                  type="button"
                  testid="plus"
                  className="count-button"
                  onClick={this.onClickIncrement}
                >
                  <BsPlusSquare />
                </button>
              </div>
              <button type="button" className="add-to-cart-btn">
                ADD TO CART
              </button>
            </div>
          </div>

          <div className="similar-containers">
            <h1>Similar Products</h1>
            <ul className="similar-ul-container">
              {similarProductsList.map(eachSimilar => (
                <SimilarProductItem
                  key={eachSimilar.id}
                  similarProductsList={eachSimilar}
                />
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  renderLoaderView = () => (
    <div className="product-details-loader-container" testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onClickShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => (
    <>
      <Header />
      <div className="failure-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="error-image"
        />
        <h1 className="product-not-found-heading">Product Not Found</h1>
        <button
          className="shopping-button"
          type="button"
          onClick={this.onClickShopping}
        >
          Continue Shopping
        </button>
      </div>
    </>
  )

  renderApiView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      case apiStatusConstants.inProgress:
        return this.renderLoaderView()

      default:
        return null
    }
  }

  render() {
    const {similarProductsList} = this.state
    console.log(similarProductsList.length)

    return (
      <div className="all-products-items-container">{this.renderApiView()}</div>
    )
  }
}
export default ProductItemDetails
