import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../../../components/Table';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { VerticalForm, FormInput } from '../../../../../components';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    getAllAnalysisCategory,
    deleteAnalysisCategory,
    updateAnalysisCategory,
    getAllDepartmentsData,
} from '../../../../../api/optimalimsapi';

const AnalysisCategory = () => {
    //
    // author Gagan
    //
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [departmentsData, setDepartmentsData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [data, setData] = useState([]);
    const [editPopupData, setEditPopupData] = useState([]);
    const [deletePopupData, setDeletePopupData] = useState([]);
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
        let response = await getAllAnalysisCategory(request);
        if (response && response.data ? response.data.length : 0 > 0) {
            let dataEditDelete = response.data.map((d) => {
                return {
                    _id: d._id,
                    categoryName: d.category_name,
                    description: d.description,
                    labDepartmentId: d.lab_department_id,
                    comments: d.comments,
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
        const rowData = await deleteAnalysisCategory(data);
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
            Header: 'Name',
            accessor: 'categoryName',
            sort: true,
        },
        {
            Header: 'Description',
            accessor: 'description',
            sort: false,
        },
        {
            Header: 'Comments',
            accessor: 'comments',
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

    const onSubmit = async (formData) => {
        await updateAnalysisCategory(formData);
        getPaginationData();
        closeEditPopup();
    };

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            categoryName: yup.string().required(t('Please enter Name')),
            description: yup.string().required(t('Please enter descriptions')),
            labDepartmentId: yup.string().required(t('Please enter department')),
            comments: yup.string().required(t('Please enter comments')),
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
                        <h4 className="page-title">Analysis Category</h4>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Button
                                className="float-end"
                                onClick={() => navigate('/apps/settings/addAnalysisCategory')}>
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
                                            label={t('Name')}
                                            type="text"
                                            name="categoryName"
                                            placeholder={t('Enter category name')}
                                            containerClass={'mb-3'}
                                        />

                                        <FormInput
                                            label={t('Descriptions')}
                                            type="text"
                                            name="description"
                                            placeholder={t('Enter your descriptions')}
                                            containerClass={'mb-3'}
                                        />

                                        <FormInput
                                            label={t('Comments')}
                                            type="textarea"
                                            name="comments"
                                            placeholder={t('Enter your comments')}
                                            containerClass={'mb-3'}
                                            rows="4"
                                        />

                                        <FormInput
                                            type="select"
                                            label="Lab Departments"
                                            name="labDepartmentId"
                                            containerClass={'mb-3'}
                                            key="className">
                                            <option value="">Select Lab Departments</option>
                                            {departmentsData.map((item, index) => {
                                                return (
                                                    <option key={index} value={item._id}>
                                                        {item.name}
                                                    </option>
                                                );
                                            })}
                                        </FormInput>

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

export default AnalysisCategory;
