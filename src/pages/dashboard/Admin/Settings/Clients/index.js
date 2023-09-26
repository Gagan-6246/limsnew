import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../../../components/Table';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { VerticalForm, FormInput } from '../../../../../components';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { getAllClients, updateClients, deleteClients } from '../../../../../api/optimalimsapi';

const Clients = () => {
    //
    // author Gagan
    //
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [editPopupData, setEditPopupData] = useState([]);
    const [deletePopupData, setDeletePopupData] = useState([]);
    const [limit, setLimit] = useState(5);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

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
        let response = await getAllClients(request);
        if (response && response.data ? response.data.length : 0 > 0) {
            let dataEditDelete = response.data.map((d) => {
                return {
                    _id: d._id,
                    organizationName: d.organization_name,
                    clientName: d.client_name,
                    clientEmail: d.client_email,
                    contact: d.contact,
                    fax: d.fax,
                    clientEmail: d.client_email,
                    gstNumber: d.gst_number,
                    country: d.country,
                    state: d.state,
                    city: d.city,
                    postalCode: d.postal_code,
                    address: d.address,
                    bankAccountType: d.bank_account_type,
                    bankAccountNumber: d.bank_account_number,
                    bankAccountName: d.bank_account_name,
                    bankName: d.bank_name,
                    bankBranch: d.bank_branch,
                    defaultCategories: d.default_categories,
                    restrictCategories: d.restrict_categories,
                    defaultDecimalMark: d.default_decimal_mark,
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
            setTableData(reqData);
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
        const rowData = await deleteClients(data);
        console.log(rowData);
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
            Header: 'organization Name',
            accessor: 'organizationName',
            sort: true,
        },
        {
            Header: 'Contact',
            accessor: 'contact',
            sort: false,
        },
        {
            Header: 'Gst Number',
            accessor: 'gstNumber',
            sort: false,
        },
        {
            Header: 'Client Email',
            accessor: 'clientEmail',
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

    const { t } = useTranslation();
    /*
     * handle form submission
     */
    const onSubmit = async (formData) => {
        // console.log(formData);
        await updateClients(formData);
        getPaginationData();
        closeEditPopup();
    };

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            name: yup.string().required(t('Please enter Name')),
            taxId: yup.string().required(t('Please enter tax id')),
            contact: yup.number().required(t('Please enter contact')),
            fax: yup.string().required(t('Please enter fax')),
            email: yup.string().email().required(t('Please enter email')),
            bulkDiscount: yup.string().required(t('Please enter bulk discount')),
            memberDiscount: yup.string().required(t('Please enter member discount')),
            country: yup.string().required(t('Please enter country')),
            state: yup.string().required(t('Please enter state')),
            city: yup.string().required(t('Please enter city')),
            postalCode: yup.number().required(t('Please enter postal code')),
            address: yup.string().required(t('Please enter address')),
            bankAccountName: yup.string().required(t('Please enter bank account name')),
            bankAccountType: yup.string().required(t('Please enter bank account type')),
            bankAccountNumber: yup.number().required(t('Please enter bank account number')),
            bankName: yup.string().required(t('Please enter bank name')),
            bankBranch: yup.string().required(t('Please enter bank branch')),
            ccEmails: yup.string().required(t('Please enter cc-emails')),
            defaultCategories: yup.string().required(t('Please enter default categories')),
            restrictCategories: yup.string().required(t('Please enter restrict categories')),
            defaultDecimalMark: yup.string().required(t('Please enter default decimal mark')),
        })
    );
    return (
        <>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box">
                        <h4 className="page-title">Clients</h4>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Button className="float-end" onClick={() => navigate('/apps/settings/addClients')}>
                                <i className="mdi mdi-plus"></i>Add
                            </Button>
                            <Table
                                columns={columns}
                                data={tableData}
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
                                    label={t('Organization Name')}
                                    type="text"
                                    name="organizationName"
                                    placeholder={t('Enter your organization name')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Client Name')}
                                    type="text"
                                    name="clientName"
                                    placeholder={t('Enter client name')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Contact Number')}
                                    type="text"
                                    name="contact"
                                    placeholder={t('Enter contact number')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Client Email')}
                                    type="text"
                                    name="clientEmail"
                                    placeholder={t('Enter client email')}
                                    containerClass={'mb-3'}
                                />
                                {/* <FormInput
                                    label={t('Bulk Discount')}
                                    type="textarea"
                                    name="bulkDiscount"
                                    placeholder={t('Enter bulk discount')}
                                    containerClass={'mb-3'}
                                />
                                 <FormInput
                                    label={t('Fax')}
                                    type="text"
                                    name="fax"
                                    placeholder={t('Enter fax')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Member Discount')}
                                    type="textarea"
                                    name="memberDiscount"
                                    placeholder={t('Enter member discount')}
                                    containerClass={'mb-3'}
                                /> */}
                                <FormInput
                                    label={t('Address Line-1')}
                                    type="textarea"
                                    name="address"
                                    placeholder={t('Enter address')}
                                    containerClass={'mb-3'}
                                />
                                 <FormInput
                                    label={t('Postal Code')}
                                    type="text"
                                    name="postalCode"
                                    placeholder={t('Enter postal code')}
                                    containerClass={'mb-3'}
                                />
                                 <FormInput
                                    label={t('City')}
                                    type="text"
                                    name="city"
                                    placeholder={t('Enter city')}
                                    containerClass={'mb-3'}
                                />
                                 <FormInput
                                    label={t('State')}
                                    type="text"
                                    name="state"
                                    placeholder={t('Enter state')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Country')}
                                    type="text"
                                    name="country"
                                    placeholder={t('Enter country')}
                                    containerClass={'mb-3'}
                                />
                                 <FormInput
                                    label={t('Gst Number')}
                                    type="text"
                                    name="gstNumber"
                                    placeholder={t('Enter your Gst number')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Bank Account Type')}
                                    type="text"
                                    name="bankAccountType"
                                    placeholder={t('Enter bank account type')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Bank Account Name')}
                                    type="text"
                                    name="bankAccountName"
                                    placeholder={t('Enter bank account name')}
                                    containerClass={'mb-3'}
                                />

                                {/* <FormInput
                                    type="select"
                                    label="analysis Category"
                                    name="analysisCategory"
                                    containerClass={'mb-3'}
                                    key="className">
                                    <option value="">Select Analysis Category</option>
                                    {departmentsData.map((item, index) => {
                    return (
                        <option key={index} value={item._id}>
                            {item.name}
                        </option>
                    );
                })}
                                </FormInput> */}

                                <FormInput
                                    label={t('Bank Account Number')}
                                    type="text"
                                    name="bankAccountNumber"
                                    placeholder={t('Enter bank account number')}
                                    containerClass={'mb-3'}
                                />

                                <FormInput
                                    label={t('Bank Name')}
                                    type="text"
                                    name="bankName"
                                    placeholder={t('Enter bank name')}
                                    containerClass={'mb-3'}
                                />

                                <FormInput
                                    label={t('Bank Branch')}
                                    type="text"
                                    name="bankBranch"
                                    placeholder={t('Enter bank branch')}
                                    containerClass={'mb-3'}
                                />

                                {/* <FormInput
                                    label={t('CC Emails')}
                                    type="text"
                                    name="ccEmails"
                                    placeholder={t('Enter cc emails')}
                                    containerClass={'mb-3'}
                                /> */}
                                <FormInput
                                    label={t('Default Categories')}
                                    type="text"
                                    name="defaultCategories"
                                    placeholder={t('Enter default categories')}
                                    containerClass={'mb-3'}
                                />

                                <FormInput
                                    label={t('Restrict Categories')}
                                    type="text"
                                    name="restrictCategories"
                                    placeholder={t('Enter restrict categories')}
                                    containerClass={'mb-3'}
                                />

                                <FormInput
                                    label={t('Decimal Mark')}
                                    type="text"
                                    name="defaultDecimalMark"
                                    placeholder={t('Enter decimal mark')}
                                    containerClass={'mb-3'}
                                />

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
                <Modal.Header onHide={closeDeleteConfirm} closeButton className="modal-colored-header  bg-primary">
                    <h4 className="modal-title text-light">Delete </h4>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <h4>Are you sure you want to delete this client?</h4>
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

export default Clients;
