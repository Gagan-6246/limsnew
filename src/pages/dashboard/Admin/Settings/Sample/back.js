import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { VerticalForm, FormInput } from '../../../../../components';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import Table from '../../../../../components/Table';
import { useNavigate } from 'react-router-dom';
import { records as mockDataPopup } from '../dataPopUp';
import { records as mockData, expandableRecords } from '../data';
import { yupResolver } from '@hookform/resolvers/yup';
import { addSample, deleteSample, getAllClients, getAllOrder, getAllSample, updateSample } from '../../../../../api/optimalimsapi';

const Sample = () => {
    const { t } = useTranslation();
    const [addData, setAddData] = useState('no');
    const [data, setData] = useState([]);
    const [dataPopup, setDataPopup] = useState([]);
    const [limit, setLimit] = useState(5);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [orderIdValue, setOrderIdValue] = useState("");
    const navigate = useNavigate();
    const [editPopupData, setEditPopupData] = useState([]);
    const [inputData, setInputData] = useState([]);
    const [deletePopupData, setDeletePopupData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [addAnalysisServiceData, setAddAnalysisServiceData] = useState([]);

    const [orgName, setOrgName] = useState('');
    const [contact, setContact] = useState('');
    const [ccContacts, setCcContacts] = useState('');
    const [ccEmails, setCcEmails] = useState('');
    const [batch, setBatch] = useState('');
    const [batchSubgroup, setBatchSubgroup] = useState('');
    const [sampleTemplate, setSampleTemplate] = useState('');
    const [analysisProfile, setAnalysisProfile] = useState('');
    const [dateSampled, setDateSampled] = useState('');
    const [sampleType, setSampleType] = useState('');
    const [container, setContainer] = useState('');
    const [preservation, setPreservation] = useState('');
    const [analysisSpecification, setAnalysisSpecification] = useState('');
    const [samplePoint, setSamplePoint] = useState('');
    const [storingLocation, setStoringLocation] = useState('');
    const [clientOrderNumber, setClientOrderNumber] = useState('');
    const [clientReference, setClientReference] = useState('');
    const [clientSampleId, setClientSampleId] = useState('');
    const [samplingDeviation, setSamplingDeviation] = useState('');
    const [clientId1, setClientId1] = useState('');
    const [sampleCondition, setSampleCondition] = useState('');
    const [priority, setPriority] = useState('');
    const [environmentalConditions, setEnvironmentalConditions] = useState('');
    const [composite, setComposite] = useState('');
    const [invoiceExclude, setInvoiceExclude] = useState('');
    const [attachment, setAttachment] = useState('');
    const [remarks, setRemarks] = useState('');
    const [internalUse, setInternalUse] = useState('');
    const [subtotal, setSubtotal] = useState('');
    const [vat, setVat] = useState('');
    const [total, setTotal] = useState('');
    const [sampleData, setSampleData] = useState([]);
    const [orderIdData, setOrderIdData] = useState([]);


    useEffect(() => {
        getPaginationData();
        clientsDetails();
    }, []);

    const getPaginationData = async (limits, pages) => {
        let limitNumber = limits ? limits : limit;
        let pagesNumber = pages ? pages : pageNumber;
        let request = {
            limit: limitNumber,
            page: pagesNumber,
        };
        let response = await getAllSample(request);
        console.log(response, 'response getAllSample');
        if (response && response.data ? response.data.length : 0 > 0) {
            let dataEditDelete = response.data.map((d) => {
                return {
                    _id: d._id,
                    organizationName: d.organization_name,
                    clientName: d.client_name,
                    clientEmail: d.client_email,
                    gstNumber: d.gst_number,
                    statu: d.statu,
                    city: d.city,
                    postalcode: d.postal_code,
                    primarySample: d.primary_sample,
                    batch: d.batch,
                    batchSubgroup: d.batch_subgroup,
                    dateSampled: d.date_sampled,
                    sampleType: d.sample_type,
                    container: d.container,
                    preservation: d.preservation,
                    analysisSpecification: d.analysis_specification,
                    samplePoint: d.sample_point,
                    clientSampleId: d.client_sample_id,
                    storingLocation: d.storing_location,
                    samplingDeviation: d.sampling_deviation,
                    sampleCondition: d.sample_condition,
                    priority: d.priority,
                    environmentalConditions: d.environmental_conditions,
                    composite: d.composite,
                    remarks: d.remarks,
                    internalUse: d.internal_use
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

    const sampleOrderIdData = async (e) => {
        try {
            let response = await getAllOrder();
            console.log(response, "response order id 123456");
            let orderId = [];
            if (response && response.data ? response.data.length : 0 > 0) {
                orderId = response.data.filter((d) => d._id == e.target.value)
                let analysisArray = await orderId[0].order_list.map((t) => {
                    return {
                        ...t,
                        numberOfServices: t.analysisService.length,
                    };
                });
                setAddAnalysisServiceData(analysisArray);
            }
        } catch (error) {

        }
    }

    const getAllClientsAPI = async (e) => {

        let response = await getAllOrder();
        let orderId = [];

        if (response && response.data && response.data.length > 0) {
            orderId = response.data.filter((d) => d._id === e.target.value);

            if (orderId.length > 0) {
                setClientId1(orderId[0].client_id);
                console.log(orderId[0].client_id, "orderId orderId");
            } else {
                // Handle the case where no matching order was found
                console.log("No matching order found.");
            }
        }

        let allClientsResponse = await getAllClients();
        console.log(allClientsResponse, "allClientsResponse allClientsResponse");
        if (allClientsResponse && allClientsResponse.data && allClientsResponse.data.length > 0) {
            let clientname = allClientsResponse.data.filter((d) => d.client_name == clientId1).map((d) => {
                return {
                    organizationName: d.organization_name,
                    clientName: d.client_name,
                    city: d.city,
                    clientEmail: d.client_email,
                    contact: d.contact,
                    gstNumber: d.gst_number,
                    postalcode: d.postal_code,
                    state: d.state,
                    statu: d.status,
                    _id: d._id,
                };
            });
            setInputData(clientname);
            console.log(clientname, "clientname clientname clientname");
        }
    };

    const clientsDetails = async (limits, pages) => {
        let limitNumber = limits ? limits : limit;
        let pagesNumber = pages ? pages : pageNumber;
        let request = {
            limit: limitNumber,
            page: pagesNumber,
        };
        let response = await getAllOrder(request);
        console.log(response.data, "response order  id");
        let orderId = [];
        if (response && response.data && response.data.length > 0) {
            orderId = response.data.filter((d) => d.order_status === "In Progress" || d.order_status === "Approved" || d.order_status === "New")
                .map((d) => {
                    let array = {};
                    array._id = d._id;
                    array.seq = d.seq;
                    array.order_status = d.order_status;
                    console.log(array, "array 12345");
                    return array;
                });

            setOrderIdData(orderId);
        }
    }

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
        // getPaginationData();
        setShowDeleteModal(true);
    };

    async function deleteData(data) {
        const rowData = await deleteSample(data);
        getPaginationData();
        setShowDeleteModal(false);
    }

    //update data
    const onUpdateSubmit = async (formData) => {
        await updateSample(formData);
        getPaginationData();
        closeEditPopup();
    };

    const columns = [
        {
            Header: 'Organization Name',
            accessor: 'organizationName',
            sort: true,
        },
        {
            Header: 'Client Name',
            accessor: 'clientName',
            sort: false,
        },
        {
            Header: 'Client Email',
            accessor: 'clientEmail',
            sort: false,
        },
        {
            Header: 'Gst Number',
            accessor: 'gstNumber',
            sort: false,
        },
        {
            Header: 'Status',
            accessor: 'statu',
            sort: false,
        },
        {
            Header: 'City',
            accessor: 'city',
            sort: true,
        },
        {
            Header: 'Postal Code',
            accessor: 'postalcode',
            sort: false,
        },
        {
            Header: 'Primary Sample',
            accessor: 'primarySample',
            sort: false,
        },
        {
            Header: 'Batch',
            accessor: 'batch',
            sort: false,
        },
        {
            Header: 'Batch Subgroup',
            accessor: 'batchSubgroup',
            sort: false,
        },
        {
            Header: 'dateSampled',
            accessor: 'dateSampled',
            sort: true,
        },
        {
            Header: 'sampleType',
            accessor: 'sampleType',
            sort: false,
        },
        {
            Header: 'container',
            accessor: 'container',
            sort: false,
        },
        {
            Header: 'preservation',
            accessor: 'preservation',
            sort: false,
        },
        {
            Header: 'analysisSpecification',
            accessor: 'analysisSpecification',
            sort: false,
        },
        {
            Header: 'samplePoint',
            accessor: 'samplePoint',
            sort: true,
        },
        {
            Header: 'clientSampleId',
            accessor: 'clientSampleId',
            sort: false,
        },
        {
            Header: 'storingLocation',
            accessor: 'storingLocation',
            sort: false,
        },
        {
            Header: 'samplingDeviation',
            accessor: 'samplingDeviation',
            sort: false,
        },
        {
            Header: 'Sample Condition',
            accessor: 'sampleCondition',
            sort: false,
        },
        {
            Header: 'Priority',
            accessor: 'priority',
            sort: true,
        },
        {
            Header: 'Environmental Conditions',
            accessor: 'environmentalConditions',
            sort: false,
        },
        {
            Header: 'Composite',
            accessor: 'composite',
            sort: false,
        },
        {
            Header: 'Remarks',
            accessor: 'remarks',
            sort: true,
        },
        {
            Header: 'Internal Use',
            accessor: 'internalUse',
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
    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            organizationName: yup.string().required(t('Please enter organizationName')),
            clientName: yup.string().required(t('Please enter clientName')),
            clientEmail: yup.string().required(t('Please enter ccEmails')),
            contact: yup.string().required(t('Please enter contact')),
            gstNumber: yup.string().required(t('Please enter Gst Number')),
            statu: yup.string().required(t('Please enter status')),
            city: yup.string().required(t('Please enter city')),
            postalcode: yup.string().required(t('Please enter postalcode')),
            primarySample: yup.string().required(t('Please enter primary Sample')),
            batch: yup.string().required(t('Please enter batch')),
            batchSubgroup: yup.string().required(t('Please enter batchSubgroup')),
            dateSampled: yup.string().required(t('Please enter dateSampled')),
            sampleType: yup.string().required(t('Please enter sampleType')),
            container: yup.string().required(t('Please enter container')),
            preservation: yup.string().required(t('Please enter preservation')),
            analysisSpecification: yup.string().required(t('Please enter analysisSpecification')),
            samplePoint: yup.string().required(t('Please enter samplePoint')),
            clientSampleId: yup.string().required(t('Please enter clientSampleId')),
            storingLocation: yup.string().required(t('Please enter storingLocation')),
            samplingDeviation: yup.string().required(t('Please enter samplingDeviation')),
            sampleCondition: yup.string().required(t('Please enter sampleCondition')),
            priority: yup.string().required(t('Please enter priority')),
            environmentalConditions: yup.string().required(t('Please enter environmentalConditions')),
            composite: yup.string().required(t('Please enter composite')),
            remarks: yup.string().required(t('Please enter remarks')),
            internalUse: yup.string().required(t('Please enter internalUse')),
        })
    );

    /*
     * handle form submission
     */
    const onSubmit = async (formData) => {
        console.log(formData, 'form value');

        let result = await addSample(formData);
        console.log(result, 'result addSample 123');
        setAddData('no');
        getPaginationData();
    };

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
                        <h4 className="page-title">Sample</h4>
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
                                    <i className="mdi mdi-plus"></i> Add
                                </Button>
                                <Table
                                    columns={columns}
                                    data={data || []}
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

                                <h6 className="header-title mb-3">Sample</h6>
            
                                <VerticalForm
                                    onSubmit={onSubmit}
                                    resolver={schemaResolver}
                                 //   defaultValues={inputData[0]}
                                >
                                      <FormInput
                                        type="select"
                                        label={t('Order Id')}
                                        name="orderId"
                                        containerClass={'mb-3'}
                                        key="className"
                                        onClick={(e) => {
                                                sampleOrderIdData(e);
                                                getAllClientsAPI(e);
                                        }}
                                    >
                                        <option value="">Select</option>
                                        {orderIdData.map((item, index) => (
                                            <option key={index} value={item._id}>{item._id}</option>
                                        ))}
                                    </FormInput>
                                    <FormInput
                                        label={t('organization Name')}
                                        type="text"
                                        name="organizationName"
                                        placeholder={t('Enter your organization Name')}
                                        containerClass={'mb-3'}
                                        defaultValue={inputData && inputData[0] ? inputData[0].organizationName : ''}
                                    />
                                    <FormInput
                                        label={t('Status')}
                                        type="text"
                                        name="statu"
                                        placeholder={t('Enter your status')}
                                        containerClass={'mb-3'}
                                        defaultValue={inputData && inputData[0] ? inputData[0].statu : ''}
                                    />
                                    <FormInput
                                        label={t('Client Name')}
                                        type="text"
                                        name="clientName"
                                        placeholder={t('Enter your client Name')}
                                        containerClass={'mb-3'}
                                        defaultValue={inputData && inputData[0] ? inputData[0].clientName: ''}
                                    />
                                    <FormInput
                                        label={t('Client Email')}
                                        type="text"
                                        name="clientEmail"
                                        placeholder={t('Enter your client Email')}
                                        containerClass={'mb-3'}
                                        defaultValue={inputData && inputData[0] ? inputData[0].clientEmail: ''}
                                    />
                                    <FormInput
                                        label={t('Contact')}
                                        type="text"
                                        name="contact"
                                        placeholder={t('Enter your contact')}
                                        containerClass={'mb-3'}
                                        defaultValue={inputData && inputData[0] ? inputData[0].contact: ''}
                                    />
                                    <FormInput
                                        label={t('Gst Number')}
                                        type="text"
                                        name="gstNumber"
                                        placeholder={t('Enter your gst Number')}
                                        containerClass={'mb-3'}
                                        defaultValue={inputData && inputData[0] ? inputData[0].gstNumber: ''}
                                    />
                                    <FormInput
                                        label={t('City')}
                                        type="text"
                                        name="city"
                                        placeholder={t('Enter your city')}
                                        containerClass={'mb-3'}
                                        defaultValue={inputData && inputData[0] ? inputData[0].city: ''}
                                    />
                                    <FormInput
                                        label={t('Postal code')}
                                        type="text"
                                        name="postalcode"
                                        placeholder={t('Enter your postal code')}
                                        containerClass={'mb-3'}
                                        defaultValue={inputData && inputData[0] ? inputData[0].postalcode: ''}
                                    />
                                    <FormInput
                                        label={t('Primary Sample')}
                                        type="text"
                                        name="primarySample"
                                        placeholder={t('Enter your Primary Sample')}
                                        containerClass={'mb-3'}

                                    />
                                    <FormInput
                                        label={t('Batch')}
                                        type="text"
                                        name="batch"
                                        placeholder={t('Enter your Batch')}
                                        containerClass={'mb-3'}

                                    />
                                    <FormInput
                                        label={t('Batch Subgroup')}
                                        type="text"
                                        name="batchSubgroup"
                                        placeholder={t('Enter your Batch Subgroup')}
                                        containerClass={'mb-3'}

                                    />
                                    <FormInput
                                        label={t('Date Sampled')}
                                        type="date"
                                        name="dateSampled"
                                        placeholder={t('Enter your Date Sampled')}
                                        containerClass={'mb-3'}

                                    />
                                    <FormInput
                                        label={t('Sample Type')}
                                        type="text"
                                        name="sampleType"
                                        placeholder={t('Enter your Sample Type')}
                                        containerClass={'mb-3'}

                                    />
                                    <FormInput
                                        label={t('Container')}
                                        type="text"
                                        name="container"
                                        placeholder={t('Enter your Container')}
                                        containerClass={'mb-3'}

                                    />
                                    <FormInput
                                        label={t('Preservation')}
                                        type="text"
                                        name="preservation"
                                        placeholder={t('Enter your preservation')}
                                        containerClass={'mb-3'}

                                    />
                                    <FormInput
                                        label={t('Analysis Specification')}
                                        type="text"
                                        name="analysisSpecification"
                                        placeholder={t('Enter your Analysis Specification')}
                                        containerClass={'mb-3'}

                                    />
                                    <FormInput
                                        label={t('Sample Point')}
                                        type="text"
                                        name="samplePoint"
                                        placeholder={t('Enter your Sample Point')}
                                        containerClass={'mb-3'}

                                    />
                                    <FormInput
                                        label={t('Client Sample Id')}
                                        type="text"
                                        name="clientSampleId"
                                        placeholder={t('Enter your Client Sample Id')}
                                        containerClass={'mb-3'}

                                    />
                                    <FormInput
                                        label={t('Storing Location')}
                                        type="text"
                                        name="storingLocation"
                                        placeholder={t('Enter your Storing Location')}
                                        containerClass={'mb-3'}

                                    />
                                    <FormInput
                                        label={t('Sampling Deviation')}
                                        type="email"
                                        name="samplingDeviation"
                                        placeholder={t('Enter your Sampling Deviation')}
                                        containerClass={'mb-3'}

                                    />
                                    <FormInput
                                        label={t('Sample Condition')}
                                        type="text"
                                        name="sampleCondition"
                                        placeholder={t('Enter your Sample Condition')}
                                        containerClass={'mb-3'}

                                    />
                                    <FormInput
                                        label={t('Priority')}
                                        type="text"
                                        name="priority"
                                        placeholder={t('Enter your Priority')}
                                        containerClass={'mb-3'}

                                    />
                                    <FormInput
                                        label={t('Environmental Conditions')}
                                        type="text"
                                        name="environmentalConditions"
                                        placeholder={t('Enter your Environmental Conditions')}
                                        containerClass={'mb-3'}

                                    />
                                    <FormInput
                                        label={t('Composite')}
                                        type="text"
                                        name="composite"
                                        placeholder={t('Enter your Composite')}
                                        containerClass={'mb-3'}

                                    />

                                    <FormInput
                                        label={t('Remarks')}
                                        type="text"
                                        name="remarks"
                                        placeholder={t('Enter your Remarks')}
                                        containerClass={'mb-3'}

                                    />
                                    <FormInput
                                        label={t('InternalUse')}
                                        type="text"
                                        name="internalUse"
                                        placeholder={t('Enter your InternalUse')}
                                        containerClass={'mb-3'}

                                    />
                                    <div style={{ float: 'right' }}>
                                        <Button variant="primary" className="me-3" type="submit">
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
                                    </div>
                                </VerticalForm>
                            </Card.Body>
                        </Card>

                        <Card>
                            <Card.Body>
                                <label>List of selected services</label>
                                <Table
                                    columns={columnsPopUp}
                                    data={addAnalysisServiceData}
                                    isSortable={true}
                                    pagination={false}
                                />
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
                                            label={t('Primary Sample')}
                                            type="text"
                                            name="primarySample"
                                            placeholder={t('Enter your primarySample')}
                                            containerClass={'mb-3'}
                                            
                                        />
                                        <FormInput
                                            label={t('Contact')}
                                            type="text"
                                            name="contact"
                                            placeholder={t('Enter your contact')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setContact(e.target.value);
                                            }}
                                        />

                                        <FormInput
                                            label={t('CC Contacts')}
                                            type="text"
                                            name="ccContacts"
                                            placeholder={t('Enter your CC Contacts')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setCcContacts(e.target.value);
                                            }}
                                        />

                                        <FormInput
                                            label={t('CC Emails')}
                                            type="text"
                                            name="ccEmails"
                                            placeholder={t('Enter your CC Emails')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setCcEmails(e.target.value);
                                            }}
                                        />

                                        <FormInput
                                            label={t('Batch')}
                                            type="text"
                                            name="batch"
                                            placeholder={t('Enter your batch')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setBatch(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Batch Subgroup')}
                                            type="text"
                                            name="batchSubgroup"
                                            placeholder={t('Enter your Batch Subgroup')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setBatchSubgroup(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Sample Template')}
                                            type="email"
                                            name="sampleTemplate"
                                            placeholder={t('Enter your Sample Template')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setSampleTemplate(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Analysis Profile')}
                                            type="text"
                                            name="analysisProfile"
                                            placeholder={t('Enter your Analysis Profile')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setAnalysisProfile(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Date Sampled')}
                                            type="date"
                                            name="dateSampled"
                                            placeholder={t('Enter your Date Sampled')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setDateSampled(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Sample Type')}
                                            type="text"
                                            name="sampleType"
                                            placeholder={t('Enter your Sample Type')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setSampleType(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Container')}
                                            type="text"
                                            name="container"
                                            placeholder={t('Enter your Container')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setContainer(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('preservation')}
                                            type="text"
                                            name="preservation"
                                            placeholder={t('Enter your preservation')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setPreservation(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Analysis Specification')}
                                            type="text"
                                            name="analysisSpecification"
                                            placeholder={t('Enter your Analysis Specification')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setAnalysisSpecification(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Sample Point')}
                                            type="text"
                                            name="samplePoint"
                                            placeholder={t('Enter your Sample Point')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setSamplePoint(e.target.value);
                                            }}
                                        />

                                        <FormInput
                                            label={t('Storing Location')}
                                            type="text"
                                            name="storingLocation"
                                            placeholder={t('Enter your Storing Location')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setStoringLocation(e.target.value);
                                            }}
                                        />

                                        <FormInput
                                            label={t('Client Order Number')}
                                            type="text"
                                            name="clientOrderNumber"
                                            placeholder={t('Enter your Client Order Number')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setClientOrderNumber(e.target.value);
                                            }}
                                        />

                                        <FormInput
                                            label={t('Client Reference')}
                                            type="text"
                                            name="clientReference"
                                            placeholder={t('Enter your Client Reference')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setClientReference(e.target.value);
                                            }}
                                        />

                                        {/* <FormInput
                                            label={t('Client Sample Id')}
                                            type="text"
                                            name="clientSampleId"
                                            placeholder={t('Enter your Client Sample Id')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setClientSampleId(e.target.value);
                                            }}
                                        /> */}
                                        <FormInput
                                            label={t('Sampling Deviation')}
                                            type="email"
                                            name="samplingDeviation"
                                            placeholder={t('Enter your Sampling Deviation')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setSamplingDeviation(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Sample Condition')}
                                            type="text"
                                            name="sampleCondition"
                                            placeholder={t('Enter your Sample Condition')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setSampleCondition(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Priority')}
                                            type="text"
                                            name="priority"
                                            placeholder={t('Enter your Priority')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setPriority(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Environmental Conditions')}
                                            type="text"
                                            name="environmentalConditions"
                                            placeholder={t('Enter your Environmental Conditions')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setEnvironmentalConditions(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Composite')}
                                            type="text"
                                            name="composite"
                                            placeholder={t('Enter your Composite')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setComposite(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Invoice Exclude')}
                                            type="text"
                                            name="invoiceExclude"
                                            placeholder={t('Enter your Invoice Exclude')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setInvoiceExclude(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Attachment')}
                                            type="text"
                                            name="attachment"
                                            placeholder={t('Enter your Attachment')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setAttachment(e.target.value);
                                            }}
                                        />

                                        <FormInput
                                            label={t('Remarks')}
                                            type="text"
                                            name="remarks"
                                            placeholder={t('Enter your Remarks')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setRemarks(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('InternalUse')}
                                            type="text"
                                            name="internalUse"
                                            placeholder={t('Enter your InternalUse')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setInternalUse(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Subtotal')}
                                            type="text"
                                            name="subtotal"
                                            placeholder={t('Enter your Subtotal')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setSubtotal(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Vat')}
                                            type="text"
                                            name="vat"
                                            placeholder={t('Enter your Vat')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setVat(e.target.value);
                                            }}
                                        />
                                        <FormInput
                                            label={t('Total')}
                                            type="text"
                                            name="total"
                                            placeholder={t('Enter your Total')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setTotal(e.target.value);
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

export default Sample;
