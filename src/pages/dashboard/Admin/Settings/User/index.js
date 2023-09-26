import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../../../components/Table';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { VerticalForm, FormInput } from '../../../../../components';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { getAllUser, deleteUser, updateUser, getAllDepartmentsData } from '../../../../../api/optimalimsapi';

const User = () => {
    //
    // author Gagan
    //
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [departmentsData, setDepartmentsData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showHistoryChangeModal, setShowHistoryChangeModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [data, setData] = useState([]);
    const [editPopupData, setEditPopupData] = useState([]);
    const [deletePopupData, setDeletePopupData] = useState([]);
    const [historyPopupData, setHistoryPopupData] = useState([]);
    const [changesData, setChangesData] = useState([]);
    const [limit, setLimit] = useState(5);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        getAllDepartments();

        getPaginationData();
    }, []);

    const getPaginationData = async (limits, pages) => {
        let limitNumber = limits ? limits : limit;
        let pagesNumber = pages ? pages : pageNumber;
        let request = {
            limit: limitNumber,
            page: pagesNumber,
        };
        let response = await getAllUser(request);
        console.log(response);
        if (response && response.data ? response.data.length : 0 > 0) {
            let dataEditDelete = response.data.map((d) => {
                return {
                    _id: d._id,
                    firstName: d.first_name,
                    lastName: d.last_name,
                    location: d.location,
                    role: d.role,
                    email: d.email,
                    mobileNumber: d.mobile_number,
                    history: d.history,
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
            console.log(reqData);
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
        let result = await deleteUser(data);
        console.log(result);
        getPaginationData();
        setShowDeleteModal(false);
    }

    function filterData(fulldata, r) {
        return r.filter((d) => d._id == fulldata._id);
    }

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

    const columns = [
        {
            Header: 'First Name',
            accessor: 'firstName',
            sort: true,
        },
        {
            Header: 'Last Name',
            accessor: 'lastName',
            sort: false,
        },
        {
            Header: 'Location',
            accessor: 'location',
            sort: false,
        },
        {
            Header: 'Role',
            accessor: 'role',
            sort: false,
        },
        {
            Header: 'Email',
            accessor: 'email',
            sort: false,
        },
        {
            Header: 'Contact',
            accessor: 'mobileNumber',
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
            accessor: 'user',
            sort: false,
        },
        {
            Header: 'Change Type',
            accessor: 'change_type',
            sort: false,
        },
        {
            Header: 'Changes',
            accessor: 'changes',
            sort: false,
        },
    ];
    const columnsChanges = [
        {
            Header: 'Attribute',
            accessor: 'attribute',
            sort: false,
        },
        {
            Header: 'Old Value',
            accessor: 'old_value',
            sort: false,
        },
        {
            Header: 'New Value',
            accessor: 'new_value',
            sort: false,
        },
    ];
    const openHistoryPopup = async (data) => {
        console.log(data.history);
        let historyData = data.history;
        let reqData = historyData.map((t) => {
            var today = new Date(t.date);
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            var hh = today.getHours();

            var min = today.getMinutes();
            today = dd + '/' + mm + '/' + yyyy + ' ' + hh + ':' + min;
            return {
                date: today,
                user: t.user,
                change_type: t.change_type,
                changes: <i title="View" onClick={() => openChangePopup(t)} className="mdi mdi-eye-outline ms-2"></i>,
            };
        });

        setHistoryPopupData(reqData);
        // const rowData = await deleteClients(data);

        // getPaginationData()
        setShowHistoryModal(true);
    };
    const openChangePopup = (history) => {
        console.log(history.changes);
        setChangesData(history.changes);
        setShowHistoryChangeModal(true);
    };
    const closeHistoryChangePopup = () => {
        setShowHistoryChangeModal(false);
    };
    const closeHistoryPopup = async (data) => {
        // console.log(data);
        // setDeletePopupData(data);
        // const rowData = await deleteClients(data);

        // getPaginationData()
        setShowHistoryModal(false);
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

    const onSubmit = async (formData) => {
        let result = await updateUser(formData);
        console.log(result);
        getPaginationData();
        closeEditPopup();
    };

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            firstName: yup.string().required(t('Please enter first name')),
            lastName: yup.string().required(t('Please enter last name')),
            email: yup.string().email().required(t('Please enter email')),
            mobileNumber: yup.number().required(t('Please enter mobile number')),
            role: yup.string().required(t('Please enter role')),
            location: yup.string().required(t('Please enter location')),
            // password: yup.string().required(t('Please enter password')),
            // confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
        })
    );
    const getAllDepartments = async () => {
        let result = await getAllDepartmentsData();
        if (result.length > 0) {
            setDepartmentsData(result);
        }
    };
    return (
        <>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box">
                        <h4 className="page-title">Users</h4>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Button className="float-end" onClick={() => navigate('/apps/settings/addUsers')}>
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
                                        onSubmit={onSubmit}
                                        resolver={schemaResolver}>
                                        <FormInput
                                            label={t('First Name')}
                                            type="text"
                                            name="firstName"
                                            placeholder={t('Enter first name')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Last Name')}
                                            type="text"
                                            name="lastName"
                                            placeholder={t('Enter last name')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Email')}
                                            type="text"
                                            name="email"
                                            placeholder={t('Enter your email')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Mobile Number')}
                                            type="text"
                                            name="mobileNumber"
                                            placeholder={t('Enter your mobile number')}
                                            containerClass={'mb-3'}
                                        />{' '}
                                        <FormInput
                                            label={t('Role')}
                                            type="text"
                                            name="role"
                                            placeholder={t('Enter your role')}
                                            containerClass={'mb-3'}
                                        />{' '}
                                        <FormInput
                                            label={t('Location')}
                                            type="text"
                                            name="location"
                                            placeholder={t('Enter your location')}
                                            containerClass={'mb-3'}
                                        />
                                        {/* <FormInput
                                            label={t('Password')}
                                            type="password"
                                            name="password"
                                            placeholder={t('Enter your password')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Confirm Password')}
                                            type="password"
                                            name="confirmPassword"
                                            placeholder={t('Enter your password')}
                                            containerClass={'mb-3'}
                                        /> */}
                                        <Button variant="primary" type="submit">
                                            <i className="mdi mdi-login"></i> {t('Submit')}
                                        </Button>
                                        <Button className="ms-3" variant="primary" onClick={closeEditPopup}>
                                            <i className="dripicons-cross"></i> {t('Cancel')}
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
                                    <h4>Are you sure you want to delete this user?</h4>
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
                                    <Col md={6} lg={6} xl={6}>
                                        {' '}
                                    </Col>
                                    <Table
                                        columns={columnsHistory}
                                        data={historyPopupData}
                                        isSortable={true}
                                        pagination={false}
                                    />
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
            <Modal
                show={showHistoryChangeModal}
                dialogClassName="modal-dialog-centered"
                size="lg"
                onHide={closeHistoryChangePopup}>
                <Modal.Header onHide={closeHistoryChangePopup} closeButton className="modal-colored-header bg-primary">
                    <h4 className="modal-title text-light">Changes </h4>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Col md={6} lg={6} xl={6}>
                                        {' '}
                                    </Col>
                                    <Table
                                        columns={columnsChanges}
                                        data={changesData}
                                        isSortable={true}
                                        pagination={false}
                                    />
                                    <Button
                                        className="ms-3"
                                        variant="primary"
                                        onClick={() => closeHistoryChangePopup()}>
                                        <i className="dripicons-cross"></i> {t('Close')}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="primary" onClick={closeHistoryChangePopup}>
                        Submit
                    </Button>
                </Modal.Footer> */}
            </Modal>
        </>
    );
};

export default User;
