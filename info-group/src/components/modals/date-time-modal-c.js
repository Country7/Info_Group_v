import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';


export default class DateTimeModalC extends Component {

  state = {
    validated: false,
    clearBtn: false,
  };

  setDefaultValue = () => {
    const { availableDateTime, duration } = this.props;
    if ((availableDateTime != null) && (availableDateTime !== "") && (document.querySelector('#datetimeC') !== null) ) {
        document.querySelector('#datetimeC').defaultValue = availableDateTime;
        document.querySelector('#inp-duration').defaultValue = duration;
        this.setState(() => {
            return { clearBtn: true };
        });
    }
    document.querySelector('#clear-switch').setAttribute('style', 'margin-top: -0.1rem');
    document.querySelector('#clear-switch').checked = false;
  }

  onShow = () => {
    this.setState(() => {
        return { validated: false };
    });
    this.setDefaultValue();
  }

  onChangeDateTime = (evt) => {
    if ( ((evt.target.defaultValue != null) && (evt.target.defaultValue !== "")) || 
          ((evt.target.value != null) && (evt.target.value !== "")) ) {
      this.setState(() => {
          return { clearBtn: true };
      });
    }
    const form = document.querySelector('#formdatetimeC');
      if ((form.checkValidity() === false) && (evt.target.value !== "")) {
          return;
      } 
    this.setState(() => {
      return { validated: true };
    });
  }

  onClearBtn = () => {
    document.querySelector('#datetimeC').defaultValue = "";
    document.querySelector('#datetimeC').value = "";
    this.setState(() => {
        return { clearBtn: false };
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    const inp = document.querySelector('#datetimeC');
    if ((inp.value == "") && (!inp.classList.contains('is-invalid'))){
      inp.classList.add('is-invalid');
      event.stopPropagation();
    }

    this.setState(() => {
      return { validated: true }
    });

console.log(`handleSubmit - ${this.state.validated}`);
    if (this.state.validated) {
      this.setState(() => {
          return { clearBtn: true }
      });
      this.props.onHide(true);
    }
  };


  render () {
    const { title, show, onHide } = this.props;
  
    return (
      <>
        <Modal
          show={ show }
          onHide={ onHide }
          animation={true}
          aria-labelledby="date-time-modal"
          centered
          onShow={ this.onShow }
          size="lg"
        >
          <Form noValidate 
            validated={ this.validated } 
            onSubmit={ (evt) => this.handleSubmit(evt) } 
            id="formdatetimeC"
          >

            <Modal.Header closeButton>
              <Modal.Title id="date-time-modal" style={{"fontSize": "1.4rem"}} >
                { title }
              </Modal.Title>
            </Modal.Header>

            <Modal.Body>

              <FloatingLabel 
                label='Продолжительность УДС "сутки-часы:минуты"'
                style={{ "marginBottom": "1.5rem"}} 
              >
                <Form.Control 
                            id="inp-duration" 
                            type="search"
                            autoComplete="off" 
                            placeholder=" " 
                />
              </FloatingLabel>

              <InputGroup hasValidation>
                <InputGroup.Text>&#9200;</InputGroup.Text>
                <Form.Control 
                  required
                  onChange={ evt => this.onChangeDateTime(evt) }
                  id="datetimeC"
                  type='datetime-local'
                  placeholder=" Date / Time "
                  aria-label="datetime"
                  aria-describedby="datetime"
                />
              </InputGroup>

              <Form.Check 
                type="switch"
                id="clear-switch"
                label="Очистить введенные данные по документам"
                style={{ "marginTop": "1.5rem", "marginLeft": "1.5rem", "marginBottom": "-1rem"}} 
              />

            </Modal.Body>
            <Modal.Footer>
                { this.state.clearBtn && 
                    <Button variant="light" onClick={() => this.onClearBtn()}>
                        Очистить &#9200;
                    </Button>
                }
                &nbsp;&nbsp;&nbsp;
                <Button variant="secondary" onClick={() => onHide(false)}>
                    Отмена
                </Button>
                <Button type="submit" variant="primary" >
                    Сохранить изменения
                </Button>
            </Modal.Footer>
          </Form>    
        </Modal>
      </>
    )
  }
}
