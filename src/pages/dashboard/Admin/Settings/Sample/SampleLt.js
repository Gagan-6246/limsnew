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
import { addSample, deleteSample, getAllOrder, getAllSample, updateSample } from '../../../../../api/optimalimsapi';

const SampleLt = () => {
    const { t } = useTranslation();
    const [addData, setAddData] = useState('no');
    const [data, setData] = useState([]);
    const [dataPopup, setDataPopup] = useState([]);
    const [limit, setLimit] = useState(5);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const navigate = useNavigate();
    const [editPopupData, setEditPopupData] = useState([]);
    const [deletePopupData, setDeletePopupData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [primarySample, setPrimarySample] = useState('');
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
                    primarySample: d.primary_sample,
                    contact: d.contact,
                    ccContacts: d.cc_contacts,
                    ccEmails: d.cc_emails,
                    batch: d.batch,
                    batchSubgroup: d.batch_subgroup,
                    sampleTemplate: d.sample_template,
                    analysisProfile: d.analysis_profile,
                    dateSampled: d.date_sampled,
                    sampleType: d.sample_type,
                    container: d.container,
                    preservation: d.preservation,
                    analysisSpecification: d.analysis_specification,
                    samplePoint: d.sample_point,
                    storingLocation: d.storing_location,
                    clientOrderNumber: d.client_order_number,
                    clientReference: d.client_reference,
                    clientSampleId: d.client_sample_id,
                    samplingDeviation: d.sampling_deviation,
                    sampleCondition: d.sample_condition,
                    priority: d.priority,
                    environmentalConditions: d.environmental_conditions,
                    composite: d.composite,
                    invoiceExclude: d.invoice_exclude,
                    attachment: d.attachment,
                    remarks: d.remarks,
                    internalUse: d.internal_use,
                    subtotal: d.subtotal,
                    vat: d.vat,
                    total: d.total,
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
        if (response && response.data ? response.data.length : 0 > 0) {
            orderId = response.data.map((d) => {
                let array = {};
                array._id = d._id;
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

        // getPaginationData()
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
            Header: 'Primary Sample',
            accessor: 'primarySample',
            sort: true,
        },
        {
            Header: 'Contact',
            accessor: 'contact',
            sort: false,
        },
        {
            Header: 'CC Contacts',
            accessor: 'ccContacts',
            sort: false,
        },
        {
            Header: 'CC Emails',
            accessor: 'ccEmails',
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
            sort: true,
        },
        {
            Header: 'Sample Template',
            accessor: 'sampleTemplate',
            sort: false,
        },
        {
            Header: 'Analysis Profile',
            accessor: 'analysisProfile',
            sort: false,
        },
        {
            Header: 'Date Sampled',
            accessor: 'dateSampled',
            sort: false,
        },
        {
            Header: 'Sample Type',
            accessor: 'sampleType',
            sort: false,
        },
        {
            Header: 'Container',
            accessor: 'container',
            sort: true,
        },
        {
            Header: 'Preservation',
            accessor: 'preservation',
            sort: false,
        },
        {
            Header: 'Analysis Specification',
            accessor: 'analysisSpecification',
            sort: false,
        },
        {
            Header: 'Sample Point',
            accessor: 'samplePoint',
            sort: false,
        },
        {
            Header: 'Storing Location',
            accessor: 'storingLocation',
            sort: false,
        },
        {
            Header: 'Client OrderNumber',
            accessor: 'clientOrderNumber',
            sort: true,
        },
        {
            Header: 'client Reference',
            accessor: 'clientReference',
            sort: false,
        },
        {
            Header: 'Client SampleId',
            accessor: 'clientSampleId',
            sort: false,
        },
        {
            Header: 'Sampling Deviation',
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
            Header: 'Invoice Exclude',
            accessor: 'invoiceExclude',
            sort: false,
        },
        {
            Header: 'Attachment',
            accessor: 'attachment',
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
            Header: 'Sub Total',
            accessor: 'subtotal',
            sort: false,
        },
        {
            Header: 'Vat',
            accessor: 'vat',
            sort: false,
        },
        {
            Header: 'Total',
            accessor: 'total',
            sort: false,
        },
        {
            Header: 'Status',
            accessor: 'status',
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
    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            primarySample: yup.string().required(t('Please enter primary Sample')),
            contact: yup.string().required(t('Please enter contact')),
            ccContacts: yup.string().required(t('Please enter ccContacts')),
            ccEmails: yup.string().required(t('Please enter ccEmails')),
            batch: yup.string().required(t('Please enter batch')),
            batchSubgroup: yup.string().required(t('Please enter batchSubgroup')),
            sampleTemplate: yup.string().required(t('Please enter sampleTemplate')),
            analysisProfile: yup.string().required(t('Please enter analysisProfile')),
            dateSampled: yup.string().required(t('Please enter dateSampled')),
            sampleType: yup.string().required(t('Please enter sampleType')),
            container: yup.string().required(t('Please enter container')),
            preservation: yup.string().required(t('Please enter preservation')),
            analysisSpecification: yup.string().required(t('Please enter analysisSpecification')),
            samplePoint: yup.string().required(t('Please enter samplePoint')),
            storingLocation: yup.string().required(t('Please enter storingLocation')),
            clientOrderNumber: yup.string().required(t('Please enter clientOrderNumber')),
            clientReference: yup.string().required(t('Please enter clientReference')),
            clientSampleId: yup.string().required(t('Please enter clientSampleId')),
            samplingDeviation: yup.string().required(t('Please enter samplingDeviation')),
            sampleCondition: yup.string().required(t('Please enter sampleCondition')),
            priority: yup.string().required(t('Please enter priority')),
            environmentalConditions: yup.string().required(t('Please enter environmentalConditions')),
            composite: yup.string().required(t('Please enter composite')),
            invoiceExclude: yup.string().required(t('Please enter invoiceExclude')),
            attachment: yup.string().required(t('Please enter attachment')),
            remarks: yup.string().required(t('Please enter remarks')),
            internalUse: yup.string().required(t('Please enter internalUse')),
            subtotal: yup.string().required(t('Please enter subtotal')),
            vat: yup.string().required(t('Please enter vat')),
            total: yup.string().required(t('Please enter total')),
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
                                    <i className="mdi mdi-plus"></i>Add Test Result
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

                                <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
                                    <FormInput
                                        type="select"
                                        label={t('Client Sample Id')}
                                        name="clientSampleId"
                                        containerClass={'mb-3'}
                                         key="className">
                                        <option value="">Select</option>
                                        {orderIdData.length > 0 ?
                                            orderIdData.map((item, index) => (
                                                <option key={index} value={item._id}>{item._id}</option>
                                            )) : ''}
                                    </FormInput>
                                    <FormInput
                                        label={t('Primary Sample')}
                                        type="text"
                                        name="primarySample"
                                        placeholder={t('Enter your primarySample')}
                                        containerClass={'mb-3'}
                                        onChange={(e) => {
                                            setPrimarySample(e.target.value);
                                        }}
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

                                    <FormInput
                                        label={t('Client Sample Id')}
                                        type="text"
                                        name="clientSampleId"
                                        placeholder={t('Enter your Client Sample Id')}
                                        containerClass={'mb-3'}
                                        onChange={(e) => {
                                            setClientSampleId(e.target.value);
                                        }}
                                    />
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
                                            onChange={(e) => {
                                                setPrimarySample(e.target.value);
                                            }}
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

                                        <FormInput
                                            label={t('Client Sample Id')}
                                            type="text"
                                            name="clientSampleId"
                                            placeholder={t('Enter your Client Sample Id')}
                                            containerClass={'mb-3'}
                                            onChange={(e) => {
                                                setClientSampleId(e.target.value);
                                            }}
                                        />
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

export default SampleLt;
