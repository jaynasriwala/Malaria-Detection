// ImagePreview.jsx
const ImagePreview = ({ imagePreview, onLoad, loaded, fadeOut }) => {
  return (
    <div className={`image-preview ${fadeOut ? 'fade-out' : ''}`}>
      {imagePreview ? (
        <img
          src={imagePreview}
          alt="Blood smear preview"
          onLoad={onLoad}
          className={loaded ? 'loaded' : ''}
        />
      ) : (
        <div className="placeholder">
          <p>📷 Image preview will appear here</p>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;