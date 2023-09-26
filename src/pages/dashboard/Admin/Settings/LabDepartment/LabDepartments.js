import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { VerticalForm, FormInput } from '../../../../../components';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import Table from '../../../../../components/Table';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    addLabContacts,
    addLabDepartments,
    deleteDepartments,
    getAllDepartmentsData,
    getAllDepartmentsPagenationData,
    updateLabDepartments,
} from '../../../../../api/optimalimsapi';
import { records as mockDataPopup } from '../dataPopUp';
import { records as mockData, expandableRecords } from '../data';

const LabDepartments = () => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [limit, setLimit] = useState(5);
    const [pageNumber, setPageNumber] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pageCount, setPageCount] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [editPopupData, setEditPopupData] = useState([]);
    const [deletePopupData, setDeletePopupData] = useState([]);
    const navigate = useNavigate();
    const [addData, setAddData] = useState('no');

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        getPaginationData();
    }, []);

    const getPaginationData = async (limits, pages) => {
        let limitNumber = limits ? limits : limit;
        let pagesNumber = pages ? pages : pageNumber;
        let request = {
            limit: limitNumber,
            page: pagesNumber,
        };
        let response = await getAllDepartmentsPagenationData(request);
        console.log(response, 'response getAllDepartmentsPagenationData');
        if (response && response ? response.data.length : 0 > 0) {
            let dataEditDelete = response.data.map((d) => {
                return {
                    _id: d._id,
                    name: d.name,
                    description: d.description,
                };
            });
            let reqData = dataEditDelete.map((d) => {
                return {
                    ...d,
                    view: (
                        <span>
                            <i
                                title="Edit"
                                onClick={() => openEditPopup(d, dataEditDelete)}
                                className="uil uil-pen "></i>
                            <i
                                title="Delete"
                                onClick={() => openDeleteConfirm(d)}
                                className="uil uil-trash-alt ms-2"></i>
                            <i title="History" onClick={() => openHistoryPopup(d)} className="mdi mdi-history ms-2"></i>
                        </span>
                    ),
                };
            });
            setPageNumber(response.currentPage);
            setPageCount(response.totalPages);
            setData(reqData);
            setTotalCount(response.totalCount);
        }
    };

    const closeEditPopup = () => {
        setShowModal(false);
    };

    async function openEditPopup(data, r) {
        const rowData = await filterData(data, r);
        setEditPopupData(rowData[0]);
        setShowModal(true);
    }
    function filterData(fulldata, r) {
        return r.filter((d) => d._id == fulldata._id);
    }

    const closeDeleteConfirm = () => {
        setShowDeleteModal(false);
    };

    const openDeleteConfirm = async (data) => {
        setDeletePopupData(data);
        // const rowData = await deleteClients(data);

        // getPaginationData()
        setShowDeleteModal(true);
    };

    async function deleteData(data) {
        const rowData = await deleteDepartments(data);
        getPaginationData();
        setShowDeleteModal(false);
    }

    //update data
    const onUpdateSubmit = async (formData) => {
        await updateLabDepartments(formData);
        getPaginationData();
        closeEditPopup();
    };

    /*
     * handle form submission
     */
    const onSubmit = async (formData) => {
        console.log(formData, 'form value');

        let result = await addLabDepartments(formData);
        console.log(result, 'result analysis category 123');
        setAddData('no');
        getPaginationData();
    };

    const columns = [
        {
            Header: 'Name',
            accessor: 'name',
            sort: true,
        },
        {
            Header: 'Description',
            accessor: 'description',
            sort: false,
        },
        {
            Header: 'View',
            accessor: 'view',
            sort: false,
        },
    ];

    const columnsHistory = [
        {
            Header: 'Date',
            accessor: 'date',
            sort: true,
        },
        {
            Header: 'User',
            accessor: 'userName',
            sort: false,
        },
        {
            Header: 'Changes',
            accessor: 'changes',
            sort: false,
        },
    ];
    const openHistoryPopup = async (data) => {
        // console.log(data);
        // setDeletePopupData(data);
        // const rowData = await deleteClients(data);

        // getPaginationData()
        setShowHistoryModal(true);
    };
    const closeHistoryPopup = async (data) => {
        // console.log(data);
        // setDeletePopupData(data);
        // const rowData = await deleteClients(data);

        // getPaginationData()
        setShowHistoryModal(false);
    };

    //pagination
    const handlePageChange = async (value) => {
        setPageNumber(1);
        setLimit(value);
        await getPaginationData(value, 1);
    };

    const handlePageClick = async (value) => {
        setPageNumber(value);
        await getPaginationData(limit, value);
    };

    const sizePerPageList = [
        {
            text: '5',
            value: 5,
        },
        {
            text: '10',
            value: 10,
        },
        {
            text: '25',
            value: 25,
        },
        {
            text: '50',
            value: 50,
        },
    ];

    const onAddData = () => {
        setAddData('yes');
    };
    const onGoBack = () => {
        setAddData('no');
    };

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            name: yup.string().required(t('Please enter Name')),
            description: yup.string().required(t('Please enter descriptions')),
        })
    );

    return (
        <>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box">
                        <h4 className="page-title">Lab Departments</h4>
                    </div>
                </Col>
            </Row>
            {addData === 'no' ? (
                <Row>
                    <Col>
                        <Card>
                            <Card.Body>
                                <Button
                                    className="float-end"
                                    onClick={() => {
                                        onAddData();
                                    }}>
                                    <i className="mdi mdi-plus"></i>Add
                                </Button>
                                <Table
                                    columns={columns}
                                    data={data}
                                    pageSize={limit}
                                    pageCount={pageCount}
                                    pageNumber={pageNumber}
                                    totalCount={totalCount}
                                    sizePerPageList={sizePerPageList}
                                    isSortable={true}
                                    pagination={true}
                                    isSearchable={true}
                                    onPageChange={handlePageChange}
                                    onPageClick={handlePageClick}
                                />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ) : addData === 'yes' ? (
                <Row>
                    <Col xs={12}>
                        <Card>
                            <Card.Body>
                                <h6 className="header-title mb-3">Lab Departments</h6>
                                <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
                                    <FormInput
                                        label={t('Name')}
                                        type="text"
                                        name="name"
                                        placeholder={t('Enter name')}
                                        containerClass={'mb-3'}
                                    />
                                    <FormInput
                                        label={t('Description')}
                                        type="text"
                                        name="description"
                                        placeholder={t('Enter description')}
                                        containerClass={'mb-3'}
                                    />
                                    <Button variant="primary" className="me-2" type="submit">
                                        <i className="mdi mdi-login"></i> {t('Submit')}
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            onGoBack();
                                        }}
                                        className="me-3"
                                        type="button">
                                        <i className="mdi-file-plus-outline"></i> {t('Back')}
                                    </Button>
                                </VerticalForm>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            ) : (
                ' '
            )}
            <Modal show={showModal} dialogClassName="modal-dialog-centered" size="lg" onHide={closeEditPopup}>
                <Modal.Header onHide={closeEditPopup} closeButton className="modal-colored-header bg-primary">
                    <h4 className="modal-title text-light">Edit </h4>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <VerticalForm
                                        defaultValues={editPopupData}
                                        onSubmit={onUpdateSubmit}
                                        resolver={schemaResolver}>
                                        <FormInput
                                            label={t('Name')}
                                            type="text"
                                            name="name"
                                            placeholder={t('Enter name')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Description')}
                                            type="text"
                                            name="description"
                                            placeholder={t('Enter description')}
                                            containerClass={'mb-3'}
                                        />
                                        <Button variant="primary" type="submit">
                                            <i className="mdi mdi-login"></i> {t('Submit')}
                                        </Button>
                                    </VerticalForm>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="primary" onClick={closeEditPopup}>
                        Submit
                    </Button>
                </Modal.Footer> */}
            </Modal>
            <Modal show={showDeleteModal} dialogClassName="modal-dialog-centered" size="md" onHide={closeDeleteConfirm}>
                <Modal.Header onHide={closeDeleteConfirm} closeButton className="modal-colored-header bg-primary">
                    <h4 className="modal-title text-light">Delete </h4>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <h4>Are you sure you want to delete this analysis category?</h4>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => {
                            deleteData(deletePopupData);
                        }}>
                        Yes
                    </Button>
                    <Button variant="primary" onClick={closeDeleteConfirm}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showHistoryModal} dialogClassName="modal-dialog-centered" size="xl" onHide={closeHistoryPopup}>
                <Modal.Header onHide={closeHistoryPopup} closeButton className="modal-colored-header bg-primary">
                    <h4 className="modal-title text-light">History </h4>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Table columns={columnsHistory} data={[{}]} isSortable={true} pagination={false} />

                                    <Button className="ms-3" variant="primary" onClick={() => closeHistoryPopup()}>
                                        <i className="dripicons-cross"></i> {t('Close')}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="primary" onClick={closeHistoryPopup}>
                        Submit
                    </Button>
                </Modal.Footer> */}
            </Modal>
        </>
    );
};

export default LabDepartments;
