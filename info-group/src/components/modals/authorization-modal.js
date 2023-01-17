import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';


export default class AuthModal extends Component {
    
  state = {
    validated: false,
    clearBtn: false,
  };

  //-------------------------------------------------------------------------

  onShow = () => {
    document.querySelector('#inp-auth-name').defaultValue = "";
    document.querySelector('#inp-auth-password').defaultValue = "";
    document.querySelector('#inp-auth-name').value = "";
    document.querySelector('#inp-auth-password').value = "";
    this.setState(() => {
      return { validated: false };
    });
  }

  //-------------------------------------------------------------------------

  onChangeInp = (evt) => {
    if ( ((evt.target.defaultValue != null) && (evt.target.defaultValue !== "")) || 
          ((evt.target.value != null) && (evt.target.value !== "")) ) {
      this.setState(() => {
          return { clearBtn: true };
      });
    }
    const form = document.querySelector('#form-auth');
    if ((form.checkValidity() === false) && (evt.target.value !== "")) {
        return;
    } 
    this.setState(() => {
      return { validated: true };
    });
  }

  //-------------------------------------------------------------------------

  onClearBtn = () => { 
    document.querySelector('#inp-auth-name').defaultValue = "";
    document.querySelector('#inp-auth-password').defaultValue = "";
    document.querySelector('#inp-auth-name').value = "";
    document.querySelector('#inp-auth-password').value = "";
    this.setState(() => {
        return { clearBtn: false };
    });
  }

  //-------------------------------------------------------------------------

  handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    let valid = this.state.validated;
    
    if (form.checkValidity() === false) {
      event.stopPropagation();
    }

    const inpName = document.querySelector('#inp-auth-name');
    const inpPass = document.querySelector('#inp-auth-password');
    if ((inpName.value == "") && (!inpName.classList.contains('is-invalid'))){
      inpName.classList.add('is-invalid');
    }
    if ((inpPass.value == "") && (!inpPass.classList.contains('is-invalid'))){
      inpPass.classList.add('is-invalid');
    }
    
    this.setState(() => {
      return { validated: true }
    });
    if ((!inpName.classList.contains('is-invalid')) && (!inpPass.classList.contains('is-invalid')) ) {
      valid = true;
    }

    if (valid) {
      this.setState(() => {
          return { clearBtn: true }
      });
      this.props.onHide(true); 
    }
  };
  
  //-------------------------------------------------------------------------


  render () {
    const { show, onHide } = this.props;


    return (
      <>
        <Modal
          show={ show }
          onHide={ onHide }
          animation={true}
          aria-labelledby="authorization"
          centered
          onShow={ this.onShow }
          size="lg"
        >
          <Form noValidate 
              validated={ this.validated } 
              onSubmit={ (evt) => this.handleSubmit(evt) } 
              id="form-auth"
          >

          <Modal.Header closeButton>
            <Modal.Title style={{"fontSize": "1.4rem"}} >
                Авторизация
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

          <FloatingLabel 
                label='Введите логин:'
                style={{ "marginBottom": "1.5rem"}} 
              >
                <Form.Control 
                            required
                            id="inp-auth-name" 
                            type="search"
                            autoComplete="off" 
                            placeholder=" " 
                />
          </FloatingLabel>

          <FloatingLabel 
                label='Введите пароль:'
                style={{ "marginBottom": "1.5rem"}} 
              >
                <Form.Control
                            required
                            id="inp-auth-password" 
                            type="password"
                            autoComplete="off" 
                            placeholder=" " 
                />
          </FloatingLabel>

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
