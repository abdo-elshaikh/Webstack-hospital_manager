import { Modal, Button } from 'react-bootstrap';
import { Container, Row, Col } from 'react-bootstrap';

export const MyVerticallyCenteredModal = (props) => {
    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.children}
            </Modal.Body>
            {/* <Modal.Footer>
                <Button onClick={props.onSubmit}>Create</Button>
            </Modal.Footer> */}
        </Modal>
    );
}

export const MydModalWithGrid = (props) => {
    return (
        <Modal {...props} aria-labelledby="contained-modal-title-vcenter">
            <Modal.Header className="bg-dark text-white " style={{ border: 'none', justifyContent: 'space-between' }}>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.title}
                </Modal.Title>
                <Button className="text-white bg-dark" style={{ border: 'none', borderRadius: '50%', height: '40px', width: '40px' }} onClick={props.onHide}>X</Button>
            </Modal.Header>
            <Modal.Body className="grid-example border">
                <Container>
                    {props.children}
                </Container>
            </Modal.Body>
        </Modal>
    );
};
