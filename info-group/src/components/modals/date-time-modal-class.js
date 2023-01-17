import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export default class DateTimeModalClass extends Component {
    
    state = {
      validated: false,
      clearBtn: false,
    };

    setDefaultValue = () => {
      const { availableDateTime } = this.props;
      if ((availableDateTime != null) && (availableDateTime !== "") && (document.querySelector('#datetime') !== null) ) {
        document.querySelector('#datetime').defaultValue = availableDateTime;
        this.setState(() => {
          return { clearBtn: true };
        });
      }
      document.querySelector('#all-ctragts-switch').setAttribute('style', 'margin-top: -0.1rem');
      document.querySelector('#all-ctragts-switch').checked = false;
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
      const form = document.querySelector('#formdatetime');
        if ((form.checkValidity() === false) && (evt.target.value !== "")) {
            return;
        } 
      this.setState(() => {
        return { validated: true };
      });
    }

    onClearBtn = () => {
      document.querySelector('#datetime').defaultValue = "";
      document.querySelector('#datetime').value = "";
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

      const inp = document.querySelector('#datetime');
      if ((inp.value == "") && (!inp.classList.contains('is-invalid'))){
        inp.classList.add('is-invalid');
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
    const { docId, title, show, onHide } = this.props;

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
            id="formdatetime"
        >

        <Modal.Header closeButton>
          <Modal.Title id="date-time-modal" style={{"fontSize": "1.4rem"}} >
              { `${ title }, док-т № ${ docId }` }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>

          <InputGroup hasValidation>
            <InputGroup.Text>&#9200;</InputGroup.Text>
            <Form.Control required
                        onChange={ evt => this.onChangeDateTime(evt) }
                        id="datetime"
                        type='datetime-local'
                        placeholder=" Date / Time "
                        aria-label="datetime"
                        aria-describedby="datetime"
            />
          </InputGroup>

          <Form.Check 
            type="switch"
            id="all-ctragts-switch"
            label="Добавить время всем контрагентам"
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
