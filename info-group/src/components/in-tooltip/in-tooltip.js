import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const InTooltip = ({ value, strongTooltip, interval, normalTooltip, klass, placement="top" }) => {

  value = (!value) ? "" : value;
  strongTooltip = (!strongTooltip) ? "" : strongTooltip;
  interval = (!interval) ? "" : interval;
  normalTooltip = (!normalTooltip) ? "" : normalTooltip;

  return (
      <OverlayTrigger
        placement={ placement }
        delay={{ show: 50, hide: 50 }}
        overlay={
          <Tooltip id="tt-top" className={ klass } >
              <strong>{ strongTooltip }</strong>
              { interval }
              { normalTooltip }
          </Tooltip>
          }
        >
          <span>{ value }</span>
      </OverlayTrigger>
  )
}

export default InTooltip;