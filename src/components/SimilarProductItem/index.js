// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProductsList} = props
  const {title, brand, imageUrl, price, rating} = similarProductsList

  return (
    <li className="similar-products-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="image-product"
      />
      <div className="alignment">
        <div className="title-brand-container">
          <h1 className="similar-product-title">{title}</h1>
          <p className="similar-product-brand">by {brand}</p>
        </div>
        <div className="price-rating-container">
          <p className="similar-product-price">Rs {price}/- </p>
          <div className="rating-star-container">
            <p className="similar-product-rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              alt="star"
              className="star-icon1"
            />
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarProductItem
