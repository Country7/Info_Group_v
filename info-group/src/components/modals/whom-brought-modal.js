import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown'

export default class WhomBroughtModal extends Component {
    
    state = {
        validated: false,
        clearBtn: false,
    };

    setDefaultValue = () => {
        document.querySelector('#dropdown-menu-titles').classList.remove('show');
        document.querySelector('#dropdown-menu-aliase').classList.remove('show');

        const { availableDateTime } = this.props;
        if ((availableDateTime != null) && (availableDateTime !== "") && (document.querySelector('#datetime') !== null) ) {
            document.querySelector('#datetime').defaultValue = availableDateTime;
            this.setState(() => {
                return { clearBtn: true };
            });
        }
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

    onClickDropItem = (evt) => {
        document.querySelector('#inp-whom-brought-title').value = evt.target.innerHTML;
        document.querySelector('#dropdown-menu-titles').classList.remove('show');
    }

    onClickInpWhomBroughtTitle = (evt) => {
        document.querySelector('#dropdown-menu-titles').classList.toggle('show');
    }
    
    onChangeInpWhomBroughtTitle = (evt) => {
        const dropdownMenuTitles = document.querySelector('#dropdown-menu-titles');
        if ( ( evt.target.value !== "") && (dropdownMenuTitles.classList.contains('show'))) {
            dropdownMenuTitles.classList.remove('show');
        }
    }


    onClickDropItemAl = (evt) => {
        document.querySelector('#inp-whom-brought-aliase').value = evt.target.innerHTML;
        document.querySelector('#dropdown-menu-aliase').classList.remove('show');
    }

    onClickInpWhomBroughtAliase = (evt) => {
        document.querySelector('#dropdown-menu-aliase').classList.toggle('show');
    }
    
    onChangeInpWhomBroughtAliase = (evt) => {
        const dropdownMenuAliase = document.querySelector('#dropdown-menu-aliase');
        if ( ( evt.target.value !== "") && (dropdownMenuAliase.classList.contains('show'))) {
            dropdownMenuAliase.classList.remove('show');
        }
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

        this.setState(() => {
            return { validated: true };
        });
        if (this.validated) {
            this.setState(() => {
                return { clearBtn: true };
            });
            this.props.onHide(false);
        }
    };


    render () {
        const {docId, lkey, title, availableDateTime, ctragtId, show, onHide} = this.props;
    
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
                    onSubmit={ this.handleSubmit } 
                    id="formdatetime"
                >

                <Modal.Header closeButton>
                    <Modal.Title id="date-time-modal" style={{"fontSize": "1.4rem"}} >
                        { `${ title }, док-т № ${ docId }` }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <FloatingLabel label="Кому доведен документ" 
                                    style={{ "marginBottom": "1.5rem"}}
                    >
                        <Form.Control required
                                    id="inp-whom-brought-title" 
                                    type="text"
                                    autoComplete="off" 
                                    onClick={ evt => this.onClickInpWhomBroughtTitle(evt) }
                                    onChange={ evt => this.onChangeInpWhomBroughtTitle(evt) }
                                    placeholder=" " 
                        />
                        <Dropdown.Menu show
                                id="dropdown-menu-titles" 
                                style={{"width": "100%", 
                                        "maxHeight": "232px", 
                                        "overflowY": "auto"}}
                        >
                            <Dropdown.Item onClick={ evt => this.onClickDropItem(evt) } >Action</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItem(evt) } >Another action</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItem(evt) } >Something else here</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItem(evt) } >Action</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItem(evt) } >Another action</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItem(evt) } >Something else here</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItem(evt) } >Action</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItem(evt) } >Another action</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItem(evt) } >Something else here</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItem(evt) } >Action</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItem(evt) } >Another action</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={ evt => this.onClickDropItem(evt) } >Separated link</Dropdown.Item>
                        </Dropdown.Menu>
                    </FloatingLabel>


                    <FloatingLabel label="Как коротко отобразить в таблице" 
                                    style={{ "marginBottom": "1.5rem"}}
                    >
                        <Form.Control required
                                    id="inp-whom-brought-aliase" 
                                    type="text"
                                    autoComplete="off" 
                                    onClick={ evt => this.onClickInpWhomBroughtAliase(evt) }
                                    onChange={ evt => this.onChangeInpWhomBroughtAliase(evt) }
                                    placeholder=" " 
                        />
                        <Dropdown.Menu show
                                id="dropdown-menu-aliase" 
                                style={{"width": "100%", 
                                        "maxHeight": "150px", 
                                        "overflowY": "auto"}}
                        >
                            <Dropdown.Item onClick={ evt => this.onClickDropItemAl(evt) } >Action</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItemAl(evt) } >Another action</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItemAl(evt) } >Something else here</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItemAl(evt) } >Action</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItemAl(evt) } >Another action</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItemAl(evt) } >Something else here</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItemAl(evt) } >Action</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItemAl(evt) } >Another action</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItemAl(evt) } >Something else here</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItemAl(evt) } >Action</Dropdown.Item>
                            <Dropdown.Item onClick={ evt => this.onClickDropItemAl(evt) } >Another action</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item onClick={ evt => this.onClickDropItemAl(evt) } >Separated link</Dropdown.Item>
                        </Dropdown.Menu>
                    </FloatingLabel>


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
