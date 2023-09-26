import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { VerticalForm, FormInput } from '../../../../../components';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import Table from '../../../../../components/Table';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { addLabContacts, deleteLabContact, getAllLabContact, updateLabContact } from '../../../../../api/optimalimsapi';

const LabContact = () => {
    const { t } = useTranslation();
    const [data, setData] = useState([]);
    const [dataPopup, setDataPopup] = useState([]);
    const [limit, setLimit] = useState(5);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate();
    const [salutation, setSalutation] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [email, setEmail] = useState('');
    const [signature, setSignature] = useState('');
    const [country, setCountry] = useState('');
    const [state, setState] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [address, setAddress] = useState('');
    const [addData, setAddData] = useState('no');
    const [editPopupData, setEditPopupData] = useState([]);
    const [deletePopupData, setDeletePopupData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
        let response = await getAllLabContact(request);
        console.log(response, 'response getAllLabContact');
        if (response && response.data ? response.data.length : 0 > 0) {
            let dataEditDelete = response.data.map((d) => {
                return {
                    _id: d._id,
                    salutation: d.salutation,
                    firstName: d.first_name,
                    lastName: d.last_name,
                    jobTitle: d.job_title,
                    departmentId: d.department_id,
                    mobileNumber: d.mobile_number,
                    email: d.email,
                    signature: d.signature,
                    country: d.country,
                    state: d.state,
                    city: d.city,
                    postalCode: d.postal_code,
                    address: d.address,
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
        const rowData = await deleteLabContact(data);
        getPaginationData();
        setShowDeleteModal(false);
    }

    //update data
    const onUpdateSubmit = async (formData) => {
        await updateLabContact(formData);
        getPaginationData();
        closeEditPopup();
    };

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            salutation: yup.string().required(t('Please enter salutation')),
            firstName: yup.string().required(t('Please enter firstName')),
            lastName: yup.string().required(t('Please enter last Name')),
            jobTitle: yup.string().required(t('Please enter job Title')),
            departmentId: yup.string().required(t('Please enter department Id')),
            mobileNumber: yup.string().required(t('Please enter mobile Number')),
            email: yup.string().required(t('Please enter email')),
            signature: yup.string().required(t('Please enter signature')),
            country: yup.string().required(t('Please enter country')),
            state: yup.string().required(t('Please enter state')),
            city: yup.string().required(t('Please enter city')),
            postalCode: yup.string().required(t('Please enter postalCode')),
            address: yup.string().required(t('Please enter address')),
        })
    );

    /*
     * handle form submission
     */
    const onSubmit = async (formData) => {
        console.log(formData, 'form value');

        let result = await addLabContacts(formData);
        console.log(result, 'result lab Contacts 123');
        setAddData('no');
        getPaginationData();
    };

    const columns = [
        {
            Header: 'salutation',
            accessor: 'salutation',
            sort: true,
        },
        {
            Header: 'First Name',
            accessor: 'firstName',
            sort: false,
        },
        {
            Header: 'Last Name',
            accessor: 'lastName',
            sort: false,
        },
        {
            Header: 'Job Title',
            accessor: 'jobTitle',
            sort: false,
        },
        {
            Header: 'Department Id',
            accessor: 'departmentId',
            sort: false,
        },
        {
            Header: 'Mobile Number',
            accessor: 'mobileNumber',
            sort: false,
        },
        {
            Header: 'Email',
            accessor: 'email',
            sort: false,
        },
        {
            Header: 'Signature',
            accessor: 'signature',
            sort: false,
        },
        {
            Header: 'Country',
            accessor: 'country',
            sort: false,
        },
        {
            Header: 'State',
            accessor: 'state',
            sort: false,
        },
        {
            Header: 'City',
            accessor: 'city',
            sort: false,
        },
        {
            Header: 'Postal Code',
            accessor: 'postalCode',
            sort: false,
        },
        {
            Header: 'Address',
            accessor: 'address',
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
    return (
        <>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box">
                        <h4 className="page-title">Lab Contact</h4>
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
                                <h6 className="header-title mb-3">Lab Contact</h6>

                                <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
                                    <FormInput
                                        label={t('Salutation')}
                                        type="text"
                                        name="salutation"
                                        placeholder={t('Enter your salutation')}
                                        containerClass={'mb-3'}
                                        onChange={(e) => {
                                            setSalutation(e.target.value);
                                        }}
                                    />
                                    <FormInput
                                        label={t('First Name')}
                                        type="text"
                                        name="firstName"
                                        placeholder={t('Enter your first name')}
                                        containerClass={'mb-3'}
                                        onChange={(e) => {
                                            setFirstName(e.target.value);
                                        }}
                                    />

                                    <FormInput
                                        label={t('Last Name')}
                                        type="text"
                                        name="lastName"
                                        placeholder={t('Enter your last name')}
                                        containerClass={'mb-3'}
                                        onChange={(e) => {
                                            setLastName(e.target.value);
                                        }}
                                    />

                                    <FormInput
                                        label={t('Job Title')}
                                        type="text"
                                        name="jobTitle"
                                        placeholder={t('Enter your Job Title')}
                                        containerClass={'mb-3'}
                                        onChange={(e) => {
                                            setJobTitle(e.target.value);
                                        }}
                                    />

                                    <FormInput
                                        label={t('Department Id')}
                                        type="text"
                                        name="departmentId"
                                        placeholder={t('Enter your Department Id')}
                                        containerClass={'mb-3'}
                                        onChange={(e) => {
                                            setDepartmentId(e.target.value);
                                        }}
                                    />

                                    <FormInput
                                        label={t('Mobile Number')}
                                        type="text"
                                        name="mobileNumber"
                                        placeholder={t('Enter your mobileNumber')}
                                        containerClass={'mb-3'}
                                        onChange={(e) => {
                                            setMobileNumber(e.target.value);
                                        }}
                                    />
                                    <FormInput
                                        label={t('Email')}
                                        type="email"
                                        name="email"
                                        placeholder={t('Enter your email')}
                                        containerClass={'mb-3'}
                                        onChange={(e) => {
                                            setEmail(e.target.value);
                                        }}
                                    />
                                    <FormInput
                                        label={t('Signature')}
                                        type="text"
                                        name="signature"
                                        placeholder={t('Enter your Signature')}
                                        containerClass={'mb-3'}
                                        onChange={(e) => {
                                            setSignature(e.target.value);
                                        }}
                                    />
                                    <FormInput
                                        label={t('Country')}
                                        type="text"
                                        name="country"
                                        placeholder={t('Enter your country')}
                                        containerClass={'mb-3'}
                                        onChange={(e) => {
                                            setCountry(e.target.value);
                                        }}
                                    />
                                    <FormInput
                                        label={t('State')}
                                        type="text"
                                        name="state"
                                        placeholder={t('Enter your State')}
                                        containerClass={'mb-3'}
                                        onChange={(e) => {
                                            setState(e.target.value);
                                        }}
                                    />
                                    <FormInput
                                        label={t('City')}
                                        type="text"
                                        name="city"
                                        placeholder={t('Enter your city')}
                                        containerClass={'mb-3'}
                                        onChange={(e) => {
                                            setCity(e.target.value);
                                        }}
                                    />
                                    <FormInput
                                        label={t('Postal Code')}
                                        type="text"
                                        name="postalCode"
                                        placeholder={t('Enter your Postal Code')}
                                        containerClass={'mb-3'}
                                        onChange={(e) => {
                                            setPostalCode(e.target.value);
                                        }}
                                    />
                                    <FormInput
                                        label={t('Address')}
                                        type="text"
                                        name="address"
                                        placeholder={t('Enter your Address')}
                                        containerClass={'mb-3'}
                                        onChange={(e) => {
                                            setAddress(e.target.value);
                                        }}
                                    />
                                    <div style={{ float: 'right' }}>
                                        <Button variant="primary" className="me-3" type="submit">
                                            <i className="mdi mdi-login"></i> {t('Submit')}
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="me-3"
                                            onClick={() => {
                                                onGoBack();
                                            }}
                                            type="button">
                                            <i className="mdi-file-plus-outline"></i> {t('Back')}
                                        </Button>
                                    </div>
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
                                            label={t('Salutation')}
                                            type="text"
                                            name="salutation"
                                            placeholder={t('Enter your salutation')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setSalutation(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('First Name')}
                                            type="text"
                                            name="firstName"
                                            placeholder={t('Enter your first name')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setFirstName(e.target.value);
                                            }}
                                        />

                                        <FormInput
                                            label={t('Last Name')}
                                            type="text"
                                            name="lastName"
                                            placeholder={t('Enter your last name')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setLastName(e.target.value);
                                            }}
                                        />

                                        <FormInput
                                            label={t('Job Title')}
                                            type="text"
                                            name="jobTitle"
                                            placeholder={t('Enter your Job Title')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setJobTitle(e.target.value);
                                            }}
                                        />

                                        <FormInput
                                            label={t('Department Id')}
                                            type="text"
                                            name="departmentId"
                                            placeholder={t('Enter your Department Id')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setDepartmentId(e.target.value);
                                            }}
                                        />

                                        <FormInput
                                            label={t('Mobile Number')}
                                            type="text"
                                            name="mobileNumber"
                                            placeholder={t('Enter your mobileNumber')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setMobileNumber(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Email')}
                                            type="email"
                                            name="email"
                                            placeholder={t('Enter your email')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setEmail(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Signature')}
                                            type="text"
                                            name="signature"
                                            placeholder={t('Enter your Signature')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setSignature(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Country')}
                                            type="text"
                                            name="country"
                                            placeholder={t('Enter your country')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setCountry(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('State')}
                                            type="text"
                                            name="state"
                                            placeholder={t('Enter your State')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setState(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('City')}
                                            type="text"
                                            name="city"
                                            placeholder={t('Enter your city')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setCity(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Postal Code')}
                                            type="text"
                                            name="postalCode"
                                            placeholder={t('Enter your Postal Code')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setPostalCode(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Address')}
                                            type="text"
                                            name="address"
                                            placeholder={t('Enter your Address')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setAddress(e.target.value);
                                            }}
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

export default LabContact;
