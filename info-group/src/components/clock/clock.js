import { Component } from 'react';
import './clock.css';

export default class Clock extends Component {

	state = {
        time: "00:00:00",
        amPm: "am"
    };
  
    componentDidMount () {
        this.timerId = setInterval(this.getTime, 1000);
    };
  
    componentWillUnmount() {
        clearInterval(this.timerId)
    };

    getTime = () => {
        const takeTwelve = n => n > 12 ?  n  - 12 : n,
              addZero = n => n < 10 ? "0" +  n : n;
        
            let d, h, m, s, t, amPm;
        
            d = new Date();
            h = addZero(/*takeTwelve(*/d.getHours()/*)*/); 
            m = addZero(d.getMinutes()); 
            s = addZero(d.getSeconds());
                t = `${h}:${m}:${s}`;
            
            amPm = d.getHours() >= 12 ? "pm" : "am";

            this.setState(() => {
                return { time: t, 
                         amPm: amPm };
            });
    }
  
	render () {
        return (
            <div id="clock" >
            <span className={this.state.time === "00:00:00" ? "time blink" : "time"}> 
                {this.state.time}
            </span>
           </div>             
        );
    }
};

