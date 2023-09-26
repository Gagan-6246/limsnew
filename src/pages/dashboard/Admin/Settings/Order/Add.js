import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Modal, ListGroup, Input } from 'react-bootstrap';
import { VerticalForm, FormInput } from '../../../../../components';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import Table from '../../../../../components/Table';
import { useNavigate } from 'react-router-dom';

import {
    addAnalysisCategory,
    getAllClients,
    getAllAnalysisService,
    getAllAnalysisCategory,
    addOrder,
} from '../../../../../api/optimalimsapi';

const Add = () => {
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();
    const { t } = useTranslation();
    const [showEditModalTable, setShowEditModalTable] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [analysisData, setAnalysisData] = useState([]);
    const [analysisCatData, setAnalysisCatData] = useState([]);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewData, setViewData] = useState([]);
    const [editPopupDataTable, setEditPopupDataTable] = useState([]);
    const [deletePopupData, setDeletePopupData] = useState([]);
    const [clientsData, setClientsData] = useState([]);
    const [addAnalysisServiceData, setAddAnalysisServiceData] = useState([]);
    const [selectedAnalysisCategoryValue, setSelectedAnalysisCategoryValue] = useState([]);
    const [formDataPopup, setFormDataPopup] = useState([]);
    const onSubmit = async (formData) => {
        let reqOrderList = addAnalysisServiceData.map((t) => {
            return {
                actualPrice: t.actualPrice,
                analysisCategory: t.analysisCategory,
                analysisCategoryId: t.analysisCategoryId,
                analysisService: t.analysisService,
                analysisServiceId: t.analysisServiceId,
                frequency: t.frequency,
                frequencyId: t.frequencyId,
                numberOfSamples: t.numberOfSamples,
                offerPrice: t.offerPrice,
            };
        });
        formData.orderList = reqOrderList;
        console.log(formData);
        // const formData = new FormData();

        // formData.append("testImage", logo);
        // formData.append("customerName", value.customerName);
        let result = await addOrder(formData);
        console.log(result);
        navigate('/apps/settings/orders');
    };
    const onEditSubmit = async (formData) => {
        let editedData = await addAnalysisServiceData.map((t) => {
            let serviceNameArray = [];
            let priceArray = [];
            let offerPriceArray = [];
            let array = {};
            let actualPrice = 0;
            let offerPrice = 0;
            if (t._id == formData._id) {
                array._id = formData._id;
                array.actualPrice = formData.actualPrice;
                array.offerPrice = formData.offerPrice;

                array.view = t.view;
                array.numberOfSamples = formData.numberOfSamples;
                analysisCatData.map((m) => {
                    if (formData.analysisCategoryId == m._id) {
                        array.analysisCategoryId = formData.analysisCategoryId;
                        array.analysisCategory = m.category_name;
                    }
                });
                array.analysisServiceId = formData.analysisServiceId;
                if (formData.analysisServiceId ? formData.analysisServiceId.length : 0 > 0) {
                    analysisData.map((g) => {
                        let data = {};
                        for (let i = 0; i < formData.analysisServiceId.length; i++) {
                            if (formData.analysisServiceId[i] == g._id) {
                                data.service_name = g.service_name;
                                data._id = g._id;
                                data.actualPrice = g.price;
                                data.offerPrice = g.offerPrice ? g.offerPrice : g.price;
                                serviceNameArray.push(data);
                                priceArray.push(g.price);
                                offerPriceArray.push(g.offerPrice ? g.offerPrice : g.price);
                            }
                        }
                    });

                    for (let i = 0; i < priceArray.length; i++) {
                        actualPrice = actualPrice + parseInt(priceArray[i]);
                        offerPrice = offerPrice + parseInt(offerPriceArray[i]);
                    }
                }
                array.analysisServiceId = formData.analysisServiceId ? formData.analysisServiceId : [];

                array.analysisService = serviceNameArray;
                array.numberOfServices = serviceNameArray.length;
                array.actualPrice = formData.actualPrice ? formData.actualPrice : actualPrice;
                array.offerPrice = formData.offerPrice ? formData.offerPrice : offerPrice;
                freq.map((y) => {
                    if (formData.frequencyId == y.id) {
                        array.frequencyId = y.id;
                        array.frequency = y.unit;
                    }
                });
                // units.map((y) => {
                //     if (t.units == y.id) {
                //         array.unitsId = y.id;
                //         array.units = y.unit;
                //     }
                // });
                return array;
            } else {
                return { ...t };
            }
        });

        let reqData = editedData.map((d) => {
            return {
                ...d,
                view: (
                    <span>
                        <i title="Edit" onClick={() => openEditPopupTable(d)} className="uil uil-pen "></i>
                        <i
                            title="Delete"
                            onClick={() => openDeleteConfirmTable(d, editedData)}
                            className="uil uil-trash-alt ms-2"></i>
                        <i
                            title="View"
                            onClick={() => openView(d, editedData)}
                            className="mdi mdi-eye-outline ms-2"></i>
                    </span>
                ),
            };
        });

        setAddAnalysisServiceData(reqData);
        // await updateAnalysisCategory(formData);
        closeEditPopupTable();
    };
    const units = [
        { id: 1, unit: 'kg' },
        { id: 2, unit: 'ml' },
        { id: 3, unit: 'each' },
    ];
    const freq = [
        { id: 0, unit: 'Single' },
        { id: 1, unit: 'Multiple' },
    ];
    const statusData = [
        {
            status: 'Active',
            _id: 1,
        },
        {
            status: 'Closed',
            _id: 2,
        },
        {
            status: 'Rejected',
            _id: 3,
        },
    ];

    useEffect(() => {
        getAllClientsData();
        getAllAnalysis();
        getAllAnalysisCat();
    }, []);

    const onSubmitPopup = async (data) => {
        let temp = addAnalysisServiceData;
        temp.push(data);
        const data1 = temp.map((t, index) => {
            let serviceNameArray = [];
            let priceArray = [];
            let offerPriceArray = [];
            let array = {};
            let actualPrice = 0;
            let offerPrice = 0;
            analysisCatData.map((m) => {
                if (t.analysisCategoryId == m._id) {
                    array.analysisCategoryId = t.analysisCategoryId;
                    array.analysisCategory = m.category_name;
                }
            });
            if (t.analysisServiceId ? t.analysisServiceId.length : 0 > 0) {
                analysisData.map((g) => {
                    let data = {};
                    for (let i = 0; i < t.analysisServiceId.length; i++) {
                        if (t.analysisServiceId[i] == g._id) {
                            data.service_name = g.service_name;
                            data._id = g._id;
                            data.actualPrice = g.price;
                            data.offerPrice = g.offerPrice ? g.offerPrice : g.price;
                            serviceNameArray.push(data);
                            priceArray.push(g.price);
                            offerPriceArray.push(g.offerPrice ? g.offerPrice : g.price);
                        }
                    }
                });

                for (let i = 0; i < priceArray.length; i++) {
                    actualPrice = actualPrice + parseInt(priceArray[i]);
                    offerPrice = offerPrice + parseInt(offerPriceArray[i]);
                }
            }
            array.analysisServiceId = t.analysisServiceId ? t.analysisServiceId : [];
            array.analysisService = serviceNameArray;
            array.numberOfServices = serviceNameArray.length;
            array.actualPrice = t.actualPrice ? t.actualPrice : actualPrice;
            array.offerPrice = t.offerPrice ? t.offerPrice : offerPrice;
            freq.map((y) => {
                if (t.frequencyId == y.id) {
                    array.frequencyId = y.id;
                    array.frequency = y.unit;
                }
            });
            // units.map((y) => {
            //     if (t.units == y.id) {
            //         array.unitsId = y.id;
            //         array.units = y.unit;
            //     }
            // });
            array.numberOfSamples = t.numberOfSamples;
            array._id = index;

            return array;
        });
        let reqData = data1.map((d) => {
            return {
                ...d,
                view: (
                    <span>
                        <i title="Edit" onClick={() => openEditPopupTable(d)} className="uil uil-pen "></i>
                        <i
                            title="Delete"
                            onClick={() => openDeleteConfirmTable(d, data1)}
                            className="uil uil-trash-alt ms-2"></i>
                        <i title="View" onClick={() => openView(d, data1)} className="mdi mdi-eye-outline ms-2"></i>
                    </span>
                ),
            };
        });

        setAddAnalysisServiceData(reqData);
        closeAddPopup();
        //     navigate('/apps/settings/analysisCategory');
    };

    function filterData(fulldata, r) {
        console.log(fulldata, r);

        return r.filter((d) => d._id == fulldata._id);
    }
    const closeEditPopupTable = () => {
        setShowEditModalTable(false);
    };

    const openEditPopupTable = async (data) => {
        console.log(data);
        // console.log(data, '1234');
        // const rowData = await filterData(data, r);
        // let rowData = await addAnalysisServiceData.filter((t) => {
        //     return t._id == data._id;
        // });
        setEditPopupDataTable(data);
        setShowEditModalTable(true);
    };
    const closeView = () => {
        setShowViewModal(false);
    };
    const openView = async (data) => {
        let service = data.analysisService;
        setViewData(service);
        setShowViewModal(true);
    };
    const closeDeleteConfirm = () => {
        setShowDeleteModal(false);
    };

    const openDeleteConfirmTable = async (data, data1) => {
        let req = data1.filter((t) => {
            return t._id != data._id;
        });
        // const rowData = await deleteClients(data);

        let reqData = req.map((d) => {
            return {
                ...d,
                view: (
                    <span>
                        <i title="Edit" onClick={() => openEditPopupTable(d)} className="uil uil-pen "></i>
                        <i
                            title="Delete"
                            onClick={() => openDeleteConfirmTable(d, req)}
                            className="uil uil-trash-alt ms-2"></i>
                        <i title="View" onClick={() => openView(d, req)} className="mdi mdi-eye-outline ms-2"></i>
                    </span>
                ),
            };
        });
        // getPaginationData()
        setDeletePopupData(reqData);
        setShowDeleteModal(true);
    };

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            // enquiryNumber: yup.string().required(t('Please enter enquiry number')),
            // startDate: yup.string().required(t('Please select start date')),
            clientId: yup.string().required(t('Please select client')),
            orderStatus: yup.string().required(t('Please select status')),
            file: yup.mixed().required(t('Please select file')),
        })
    );
    const schemaPopUpResolver = yupResolver(
        yup.object().shape({
            // enquiryNumber: yup.string().required(t('Please enter enquiry number')),
            numberOfSamples: yup.number().required(t('Please enter number of samples')),
            analysisServiceId: yup.array().required(t('Please select service')),
            analysisCategoryId: yup.string().required(t('Please select category')),
            frequencyId: yup.string().required(t('Please select frequency')),
        })
    );
    const schemaPopUpEditResolver = yupResolver(
        yup.object().shape({
            // enquiryNumber: yup.string().required(t('Please enter enquiry number')),
            numberOfSamples: yup.number().required(t('Please enter number of samples')),
            analysisServiceId: yup.array().required(t('Please select service')),
            analysisCategoryId: yup.string().required(t('Please select category')),
            frequencyId: yup.string().required(t('Please select frequency')),
        })
    );

    const getAllClientsData = async () => {
        let result = await getAllClients();
        console.log(result, 'getAllClientsData');
        if (result.data.length > 0) {
            setClientsData(result.data);
        }
    };
    const getAllAnalysis = async () => {
        let result = await getAllAnalysisService();
        console.log(result, 'getAllAnalysis');
        if (result.data.length > 0) {
            setAnalysisData(result.data);
        }
    };
    const getAllAnalysisCat = async () => {
        let result = await getAllAnalysisCategory();
        console.log(result, 'getAllAnalysisCat');
        if (result.data.length > 0) {
            setAnalysisCatData(result.data);
        }
    };
    const closeAddPopup = () => {
        setShowModal(false);
    };

    async function openAddPopup() {
        // const rowData = await filterData(data, r);
        // setEditPopupDataTable(rowData[0]);
        setShowModal(true);
    }

    async function deleteData(data) {
        setAddAnalysisServiceData(data);
        // const rowData = await deleteAnalysisCategory(data);
        setShowDeleteModal(false);
    }
    const columnsView = [
        {
            Header: 'Service Name',
            accessor: 'service_name',
            sort: false,
        },
        {
            Header: 'Actual Price',
            accessor: 'actualPrice',
            sort: false,
        },
    ];
    const columns = [
        {
            Header: 'Category',
            accessor: 'analysisCategory',
            sort: false,
        },
        {
            Header: 'Frequency',
            accessor: 'frequency',
            sort: false,
        },
        {
            Header: 'No Of Samples',
            accessor: 'numberOfSamples',
            sort: false,
        },
        {
            Header: 'No Analysis Service',
            accessor: 'numberOfServices',
            sort: true,
        },
        {
            Header: 'Actual Price',
            accessor: 'actualPrice',
            sort: false,
        },
        {
            Header: 'Offer Price',
            accessor: 'offerPrice',
            sort: false,
        },
        {
            Header: 'View',
            accessor: 'view',
            sort: false,
        },
    ];
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
    ];

    return (
        <>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box">
                        <h4 className="page-title">Add Order</h4>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
                                {/* <FormInput
                                    label={t('Enquiry Number')}
                                    type="text"
                                    name="enquiryNumber"
                                    placeholder={t('Enter enquiry number')}
                                    containerClass={'mb-3'}
                                /> */}
                                <FormInput
                                    type="select"
                                    label="Client"
                                    name="clientId"
                                    containerClass={'mb-3'}
                                    key="className">
                                    <option value="">Select Client</option>
                                    {clientsData.map((item, index) => {
                                        return (
                                            <option key={index} value={item._id}>
                                                {item.client_name}
                                            </option>
                                        );
                                    })}
                                </FormInput>
                                {/* <FormInput
                                    label={t('Start Date')}
                                    type="date"
                                    name="startDate"
                                    placeholder={t('Enter start Date')}
                                    containerClass={'mb-3'}
                                />{' '} */}
                                <FormInput
                                    type="select"
                                    label="Status"
                                    name="orderStatus"
                                    containerClass={'mb-3'}
                                    key="className">
                                    <option value="">Select Status</option>
                                    {statusData.map((item, index) => {
                                        return (
                                            <option key={index} value={item.status}>
                                                {item.status}
                                            </option>
                                        );
                                    })}
                                </FormInput>
                                <div className="mb-3">
                                    <label>Analysis Service</label>
                                    <Button
                                        onClick={() => {
                                            openAddPopup();
                                        }}
                                        className="ms-3">
                                        {' '}
                                        <i className="dripicons-plus"></i> Add
                                    </Button>
                                </div>
                                <label>List of selected services</label>
                                <Table
                                    columns={columns}
                                    data={addAnalysisServiceData}
                                    isSortable={true}
                                    pagination={false}
                                />
                                <FormInput
                                    label={t('Select Attachment')}
                                    type="file"
                                    name="file"
                                    multiple
                                    placeholder={t('Select File')}
                                    containerClass={'mb-3'}
                                />{' '}
                                <Button variant="primary" type="submit">
                                    <i className="mdi mdi-login"></i> {t('Submit')}
                                </Button>
                                <Button className="ms-3" variant="primary" onClick={() => navigate(-1)}>
                                    <i className="dripicons-cross"></i> {t('Cancel')}
                                </Button>
                            </VerticalForm>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal show={showModal} dialogClassName="modal-dialog-centered" size="lg" onHide={closeAddPopup}>
                <Modal.Header onHide={closeAddPopup} closeButton className="modal-colored-header bg-primary">
                    <h4 className="modal-title text-light">Add Service</h4>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <VerticalForm onSubmit={onSubmitPopup} resolver={schemaPopUpResolver}>
                                        <FormInput
                                            type="select"
                                            label="Analysis Category"
                                            name="analysisCategoryId"
                                            containerClass={'mb-3'}
                                            key="className"
                                            onClick={(e) => {
                                                setSelectedAnalysisCategoryValue(e.target.value);
                                            }}>
                                            <option value="">Select Analysis Category</option>
                                            {analysisCatData.map((item, index) => {
                                                return (
                                                    <option key={index} value={item._id}>
                                                        {item.category_name}
                                                    </option>
                                                );
                                            })}
                                        </FormInput>
                                        <FormInput
                                            type="select"
                                            label="Analysis Service"
                                            name="analysisServiceId"
                                            multiple
                                            containerClass={'mb-3'}
                                            key="className">
                                            {analysisData
                                                .filter((t) => {
                                                    return t.analysis_category == selectedAnalysisCategoryValue;
                                                })
                                                .map((item, index) => {
                                                    return (
                                                        <option key={index} value={item._id}>
                                                            {item.service_name}
                                                        </option>
                                                    );
                                                })}
                                        </FormInput>
                                        <FormInput
                                            type="select"
                                            label="Frequency"
                                            name="frequencyId"
                                            containerClass={'mb-3'}
                                            key="className">
                                            <option value="">Select Frequency</option>
                                            {freq.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.id}>
                                                        {item.unit}
                                                    </option>
                                                );
                                            })}
                                        </FormInput>
                                        <FormInput
                                            label={t('Number Of Samples')}
                                            type="text"
                                            name="numberOfSamples"
                                            placeholder={t('Enter number of samples')}
                                            containerClass={'mb-3'}
                                        />
                                        <Button variant="primary" type="submit">
                                            <i className="mdi mdi-login"></i> {t('Submit')}
                                        </Button>
                                        <Button className="ms-3" variant="primary" onClick={closeAddPopup}>
                                            <i className="dripicons-cross"></i> {t('Cancel')}
                                        </Button>
                                    </VerticalForm>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="primary" onClick={closeAddPopup}>
                        Submit
                    </Button>
                </Modal.Footer> */}
            </Modal>
            <Modal
                show={showEditModalTable}
                dialogClassName="modal-dialog-centered"
                size="lg"
                onHide={closeEditPopupTable}>
                <Modal.Header onHide={closeEditPopupTable} closeButton className="modal-colored-header bg-primary">
                    <h4 className="modal-title text-light">Edit </h4>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <VerticalForm
                                        defaultValues={editPopupDataTable}
                                        onSubmit={onEditSubmit}
                                        resolver={schemaPopUpEditResolver}>
                                        <FormInput
                                            type="select"
                                            label="Analysis Category"
                                            name="analysisCategoryId"
                                            containerClass={'mb-3'}
                                            key="className"
                                            onClick={(e) => {
                                                setSelectedAnalysisCategoryValue(e.target.value);

                                                console.log(e.target.value);
                                            }}>
                                            <option value="">Select Analysis Category</option>
                                            {analysisCatData.map((item, index) => {
                                                return (
                                                    <option key={index} value={item._id}>
                                                        {item.category_name}
                                                    </option>
                                                );
                                            })}
                                        </FormInput>
                                        <FormInput
                                            type="select"
                                            label="Analysis Service"
                                            name="analysisServiceId"
                                            containerClass={'mb-3'}
                                            multiple
                                            key="className">
                                            {analysisData
                                                .filter((t) => {
                                                    return t.analysis_category == selectedAnalysisCategoryValue;
                                                })
                                                .map((item, index) => {
                                                    return (
                                                        <option key={index} value={item._id}>
                                                            {item.service_name}
                                                        </option>
                                                    );
                                                })}
                                        </FormInput>
                                        <FormInput
                                            type="select"
                                            label="Frequency"
                                            name="frequencyId"
                                            containerClass={'mb-3'}
                                            key="className">
                                            <option value="">Select Frequency</option>
                                            {freq.map((item, index) => {
                                                return (
                                                    <option key={index} value={item.id}>
                                                        {item.unit}
                                                    </option>
                                                );
                                            })}
                                        </FormInput>
                                        <FormInput
                                            label={t('Number Of Samples')}
                                            type="text"
                                            name="numberOfSamples"
                                            placeholder={t('Enter number of samples')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Actual Price')}
                                            type="text"
                                            name="actualPrice"
                                            placeholder={t('Enter Price')}
                                            containerClass={'mb-3'}
                                            readOnly
                                        />
                                        <FormInput
                                            label={t('Offer Price')}
                                            type="text"
                                            name="offerPrice"
                                            placeholder={t('Enter price')}
                                            containerClass={'mb-3'}
                                        />
                                        <Button variant="primary" type="submit">
                                            <i className="mdi mdi-login"></i> {t('Submit')}
                                        </Button>
                                        <Button className="ms-3" variant="primary" onClick={closeEditPopupTable}>
                                            <i className="dripicons-cross"></i> {t('Cancel')}
                                        </Button>
                                    </VerticalForm>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="primary" onClick={closeEditPopupTable}>
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
                                    <h4>Are you sure you want to delete this service?</h4>
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
            <Modal show={showViewModal} dialogClassName="modal-dialog-centered" size="lg" onHide={closeView}>
                <Modal.Header onHide={closeView} closeButton className="modal-colored-header bg-primary">
                    <h4 className="modal-title text-light">List of services</h4>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <Table columns={columnsView} data={viewData} isSortable={true} pagination={false} />
                                    <Button className="ms-3 mt-3" variant="primary" onClick={closeView}>
                                        <i className="dripicons-cross"></i> {t('Close')}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
                {/* <Modal.Footer>
                    <Button variant="primary" onClick={closeView}>
                        No
                    </Button>
                </Modal.Footer> */}
            </Modal>
        </>
    );
};

export default Add;
