
const ProgressBar = ({propsData}) => {
    let { width, hours, mins } = propsData;
    if ((+width < 0) && (+width > 100)) {
        width = 5;
    }
    width += '%'
    const widthStyle = {width: width}
    return (
        <>
        <div> 
            <div className="progress d-print-none">
              <div className="progress-bar bg-success" style={widthStyle}></div>
            </div>
            <div className="d-flex justify-content-between text-small d-print-none">
              <div className="d-flex align-items-center">
                  <i className="material-icons">playlist_add_check</i>
                  <span>&nbsp; &nbsp;{width}</span>
              </div>
              <span>{`Всего ${hours} ${mins}`}</span>
            </div>
        </div>  
        </>
    )
}

export default ProgressBar;