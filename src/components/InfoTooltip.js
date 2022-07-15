function InfoTooltip({isOpen, onClose, title}) {
  function handleClickOverlay(evt) {
    evt.target === evt.currentTarget && onClose();
  }

  return (
    <div 
      className={`popup tooltip-popup ${isOpen && 'popup_opened'}`}
      onClick={handleClickOverlay}>
      <div className="popup__container">
        <img className="tooltip-popup__image" alt="" src="" />
        <h2 className="tooltip-popup__form-title">{title}</h2>
        <button
          className="popup__close-button"
          type="button"
          aria-label="закрыть окно"
          onClick={onClose}>
        </button>        
      </div>
    </div>
  )
}

export default InfoTooltip;