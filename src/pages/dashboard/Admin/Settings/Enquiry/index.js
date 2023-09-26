import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../../../components/Table';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { VerticalForm, FormInput } from '../../../../../components';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { records as statusData } from '../data';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    getAllEnquiry,
    getAllDepartmentsData,
    getAllClients,
    getAllAnalysisService,
    getAllAnalysisCategory,
    deleteEnquiry,
    updateEnquiry,
    updateEnquiryFile,
    addEnquiryOrder,
    deleteEnquiryFile,
} from '../../../../../api/optimalimsapi';

const Enquiry = () => {
    //
    // author Gagan
    //
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [departmentsData, setDepartmentsData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewData, setViewData] = useState([]);
    const [showDeleteModalFile, setShowDeleteModalFile] = useState(false);
    const [showDeleteModalMain, setShowDeleteModalMain] = useState(false);
    const [data, setData] = useState([]);
    const [editPopupData, setEditPopupData] = useState([]);
    const [deletePopupData, setDeletePopupData] = useState([]);
    const [limit, setLimit] = useState(5);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [clientsData, setClientsData] = useState([]);
    const [addAnalysisServiceData, setAddAnalysisServiceData] = useState([]);
    const [attachmentData, setAttachmentData] = useState([]);
    const [selectedAnalysisCategoryValue, setSelectedAnalysisCategoryValue] = useState([]);
    const [analysisData, setAnalysisData] = useState([]);
    const [analysisCatData, setAnalysisCatData] = useState([]);
    const [editPopupDataTable, setEditPopupDataTable] = useState([]);
    const [showEditModalTable, setShowEditModalTable] = useState(false);
    const [deleteFileData, setDeleteFileData] = useState();
    const [filteredAnalysisData, setFilteredAnalysisData] = useState([]);

    useEffect(() => {
        getAllDepartments();
        getAllClientsData();
        getAllAnalysis();
        getAllAnalysisCat();
        getPaginationData();
    }, []);

    const getAllClientsData = async () => {
        let response = await getAllClients();
        console.log(response, 'getAllClientsData');
        if (response && response.data ? response.data.length : 0 > 0) {
            setClientsData(response.data);
        }
    };
    const getAllAnalysis = async () => {
        let response = await getAllAnalysisService();
        console.log(response, 'getAllAnalysis');
        if (response && response.data ? response.data.length : 0 > 0) {
            setAnalysisData(response.data);
        }
    };
    const getAllAnalysisCat = async () => {
        let response = await getAllAnalysisCategory();
        console.log(response, 'getAllAnalysisCat');
        if (response && response.data ? response.data.length : 0 > 0) {
            setAnalysisCatData(response.data);
        }
    };
    const getPaginationData = async (limits, pages) => {
        let limitNumber = limits ? limits : limit;
        let pagesNumber = pages ? pages : pageNumber;
        let request = {
            limit: limitNumber,
            page: pagesNumber,
        };
        let clientsData = await getAllClients();
        let response = await getAllEnquiry(request);
        if (response && response.data ? response.data.length : 0 > 0) {
            let dataEditDelete = response.data.map((d) => {
                let array = {};
                if (clientsData.data) {
                    clientsData.data.map((m) => {
                        if (d.client_id == m._id) {
                            array.clientName = m.client_name;
                        }
                    });
                }
                array._id = d._id;
                array.clientId = d.client_id;
                array.orderStatus = d.order_status;
                array.seq = d.seq;
                array.file = d.file ? d.file : '';
                array.createdAt = d.createdAt.slice(0, 10);
                array.enquiryList = d.enquiry_list;
                return array;
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
        getPaginationData();
        setShowModal(false);
    };

    async function openEditPopup(data, r) {
        const rowData = await filterData(data, r);
        console.log(rowData, 'hoiiiiiiiii');
        let tableData = rowData[0].enquiryList.map((t, index) => {
            return {
                actualPrice: t.actualPrice,
                analysisCategory: t.analysisCategory,
                analysisCategoryId: t.analysisCategoryId,
                analysisService: t.analysisService,
                analysisServiceId: t.analysisServiceId,
                frequency: t.frequency,
                frequencyId: t.frequencyId,
                numberOfSamples: t.numberOfSamples,
                numberOfServices: t.analysisService.length,
                file: t.file ? t.file : '',
                offerPrice: t.offerPrice,
                _id: index,
            };
        });
        let reqData = tableData.map((d) => {
            return {
                ...d,
                view: (
                    <span>
                        <i title="Edit" onClick={() => openEditPopupTable(d)} className="uil uil-pen "></i>
                        <i
                            title="Delete"
                            onClick={() => openDeleteConfirmTable(d, tableData)}
                            className="uil uil-trash-alt ms-2"></i>
                        <i title="View" onClick={() => openView(d, tableData)} className="mdi mdi-eye-outline ms-2"></i>
                    </span>
                ),
            };
        });
        let fileData = rowData[0].file.map((t) => {
            var today = new Date(t.date);
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();
            today = dd + '/' + mm + '/' + yyyy;

            let url = 'http://127.0.0.1:9000/';
            return {
                fileName: t.fileName,
                size: t.size + ' Kb',
                date: today,
                path: t.path,
                view: (
                    <span>
                        <a
                            style={{ color: 'grey' }}
                            className="mdi mdi-eye-outline"
                            href={url + t.path}
                            target="_blank"></a>
                        <i
                            title="Delete"
                            onClick={() => openDeleteConfirmFile(t, rowData[0])}
                            className="uil uil-trash-alt ms-2"></i>
                    </span>
                ),
            };
        });
        console.log(fileData, 'fileData');
        let removedFileEdit = rowData[0];
        removedFileEdit.file = [];

        setAttachmentData(fileData);
        setAddAnalysisServiceData(reqData);
        setEditPopupData(removedFileEdit);
        setShowModal(true);
    }

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
        closeEditPopupTable();
    };
    const schemaPopUpEditResolver = yupResolver(
        yup.object().shape({
            // enquiryNumber: yup.string().required(t('Please enter enquiry number')),
            numberOfSamples: yup.number().required(t('Please enter number of samples')),
            analysisServiceId: yup.array().required(t('Please select service')),
            analysisCategoryId: yup.string().required(t('Please select category')),
            frequencyId: yup.string().required(t('Please select frequency')),
        })
    );

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

    const closeDeleteConfirmMain = () => {
        setShowDeleteModalMain(false);
    };

    const openDeleteConfirm = async (data) => {
        console.log(data);
        setDeletePopupData(data);
        // const rowData = await deleteClients(data);

        // getPaginationData()
        setShowDeleteModalMain(true);
    };

    const closeDeleteConfirmFile = () => {
        setShowDeleteModalFile(false);
    };
    const openDeleteConfirmFile = (data1, rowData) => {
        let deleteData = {};
        deleteData = data1;
        deleteData._id = rowData._id;
        setDeleteFileData(deleteData);
        setShowDeleteModalFile(true);
    };
    const deleteFileConfirm = async () => {
        let result = await deleteEnquiryFile(deleteFileData);
        if (result) {
            let reqData = attachmentData.filter((t) => {
                return t.path !== deleteFileData.path;
            });
            setAttachmentData(reqData);
        }
        closeDeleteConfirmFile();
    };

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

    async function deleteData(data) {
        setAddAnalysisServiceData(data);

        // const rowData = await deleteAnalysisCategory(data);
        // getPaginationData();
        setShowDeleteModal(false);
    }
    async function deleteDataMain(data) {
        let result = await deleteEnquiry(data);
        console.log(result);
        // setAddAnalysisServiceData(data);

        // const rowData = await deleteAnalysisCategory(data);
        getPaginationData();
        setShowDeleteModalMain(false);
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
    const closeAddPopup = () => {
        setShowAddModal(false);
    };

    async function openAddPopup() {
        // const rowData = await filterData(data, r);
        // setEditPopupData(rowData[0]);
        setShowAddModal(true);
    }
    const columns = [
        {
            Header: 'Id',
            accessor: 'seq',
            sort: true,
        },
        {
            Header: 'Client',
            accessor: 'clientName',
            sort: true,
        },
        {
            Header: 'Date',
            accessor: 'createdAt',
            sort: true,
        },
        {
            Header: 'Status',
            accessor: 'orderStatus',
            sort: false,
        },
        {
            Header: 'View',
            accessor: 'view',
            sort: false,
        },
    ];
    const freq = [
        { id: 0, unit: 'Single' },
        { id: 1, unit: 'Multiple' },
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
        {
            text: '50',
            value: 50,
        },
    ];

    const columnsFile = [
        {
            Header: 'Date',
            accessor: 'date',
            sort: false,
        },
        {
            Header: 'File Name',
            accessor: 'fileName',
            sort: false,
        },
        {
            Header: 'Size',
            accessor: 'size',
            sort: false,
        },
        {
            Header: 'View',
            accessor: 'view',
            sort: false,
        },
    ];
    const columnsPopUp = [
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

    const closeEditPopupTable = () => {
        setShowEditModalTable(false);
    };

    const openEditPopupTable = async (data) => {
        // console.log(data, '1234');
        // const rowData = await filterData(data, r);
        // let rowData = await addAnalysisServiceData.filter((t) => {
        //     return t._id == data._id;
        // });
        console.log(data, 'hiiiiiiiiii');
        let filteredData = analysisData.filter((t) => {
            return t.analysis_category == data.analysisCategoryId;
        });
        setFilteredAnalysisData(filteredData);
        setEditPopupDataTable(data);
        setShowEditModalTable(true);
    };

    const onSubmit = async (formData) => {
        console.log(formData, 'hi');
        let reqEnquiryList = addAnalysisServiceData.map((t) => {
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
        formData.enquiryList = reqEnquiryList;
        formData.history = formData.history ? formData.history : [];
        console.log(formData.file.length);
        if (formData.file.length != 0) {
            let result = await updateEnquiryFile(formData);
            console.log(result);
        } else {
            let reqData = data.filter((t) => {
                return t._id == formData._id;
            });
            formData.file = reqData[0].file;
            let result = await updateEnquiry(formData);
            console.log(result);
        }
        if (formData.orderStatus == 'Approved') {
            let result = await addEnquiryOrder(formData);
            console.log(result, 'order created');
        }
        console.log(formData);
        getPaginationData();
        closeEditPopup();
    };
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
    };

    const openDeleteConfirmTable = async (data, data1) => {
        console.log(data);
        console.log(data1);
        let req = data1.filter((t) => {
            return t._id != data._id;
        });
        console.log(req);
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
        setDeletePopupData(reqData);
        setShowDeleteModal(true);
    };

    const schemaPopUpResolver = yupResolver(
        yup.object().shape({
            // enquiryNumber: yup.string().required(t('Please enter enquiry number')),
            numberOfSamples: yup.number().required(t('Please enter number of samples')),
            analysisServiceId: yup.array().required(t('Please select service')),
            analysisCategoryId: yup.string().required(t('Please select category')),
            frequencyId: yup.string().required(t('Please select frequency')),
        })
    );

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            // enquiryNumber: yup.string().required(t('Please enter enquiry number')),
            // startDate: yup.string().required(t('Please select start date')),
            clientId: yup.string().required(t('Please select client')),
            orderStatus: yup.string().required(t('Please select status')),
            file: yup.mixed(),
        })
    );
    const getAllDepartments = async () => {
        let result = await getAllDepartmentsData();
        if (result ? result.length : 0 > 0) {
            setDepartmentsData(result);
        }
    };
    return (
        <>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box">
                        <h4 className="page-title">Enquiries</h4>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Button className="float-end" onClick={() => navigate('/apps/settings/addEnquiry')}>
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
            <Modal show={showModal} dialogClassName="modal-dialog-centered" size="xl" onHide={closeEditPopup}>
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
                                        onSubmit={onSubmit}
                                        resolver={schemaResolver}
                                        defaultValues={editPopupData}>
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
                                            columns={columnsPopUp}
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
                                        <label>List of attachments</label>
                                        <Table
                                            columns={columnsFile}
                                            data={attachmentData}
                                            isSortable={true}
                                            pagination={false}
                                        />
                                        <Button variant="primary" type="submit">
                                            <i className="mdi mdi-login"></i> {t('Submit')}
                                        </Button>
                                        <Button className="ms-3" variant="primary" onClick={() => closeEditPopup()}>
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
            <Modal show={showAddModal} dialogClassName="modal-dialog-centered" size="lg" onHide={closeAddPopup}>
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
                                            type="text"
                                            label="Analysis Category"
                                            name="analysisCategory"
                                            containerClass={'mb-3'}
                                            key="className"
                                            readOnly
                                            // onClick={(e) => {
                                            //     setSelectedAnalysisCategoryValue(e.target.value);
                                            // }}
                                        >
                                            {/* {analysisCatData.map((item, index) => {
                                                return (
                                                    <option key={index} value={item._id}>
                                                        {item.category_name}
                                                    </option>
                                                );
                                            })} */}
                                        </FormInput>

                                        <FormInput
                                            type="select"
                                            label="Analysis Service"
                                            name="analysisServiceId"
                                            multiple
                                            containerClass={'mb-3'}
                                            key="className">
                                            {filteredAnalysisData.map((item, index) => {
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
            <Modal
                show={showDeleteModalMain}
                dialogClassName="modal-dialog-centered"
                size="md"
                onHide={closeDeleteConfirmMain}>
                <Modal.Header onHide={closeDeleteConfirmMain} closeButton className="modal-colored-header bg-primary">
                    <h4 className="modal-title text-light">Delete </h4>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <h4>Are you sure you want to delete this enquiry?</h4>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => {
                            deleteDataMain(deletePopupData);
                        }}>
                        Yes
                    </Button>
                    <Button variant="primary" onClick={closeDeleteConfirmMain}>
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
                                    <Table
                                        columns={columnsHistory}
                                        data={addAnalysisServiceData}
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
                show={showDeleteModalFile}
                dialogClassName="modal-dialog-centered"
                size="md"
                onHide={closeDeleteConfirmFile}>
                <Modal.Header onHide={closeDeleteConfirmFile} closeButton className="modal-colored-header bg-primary">
                    <h4 className="modal-title text-light">Delete </h4>
                </Modal.Header>
                <Modal.Body>
                    {' '}
                    <Row>
                        <Col>
                            <Card>
                                <Card.Body>
                                    <h4>Are you sure you want to delete this file permanently?</h4>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => {
                            deleteFileConfirm();
                        }}>
                        Yes
                    </Button>
                    <Button variant="primary" onClick={closeDeleteConfirmFile}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Enquiry;
