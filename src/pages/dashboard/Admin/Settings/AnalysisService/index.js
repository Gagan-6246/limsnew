import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../../../components/Table';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { VerticalForm, FormInput } from '../../../../../components';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    getAllAnalysisService,
    updateAnalysisService,
    deleteAnalysisService,
    getAllDepartmentsData,
    getAllAnalysisCategory,
} from '../../../../../api/optimalimsapi';

const AnalysisService = () => {
    //
    // author Gagan
    //
    const navigate = useNavigate();
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
    const [departmentsData, setDepartmentsData] = useState([]);
    const [analysisCatData, setAnalysisCatData] = useState([]);

    useEffect(() => {
        getPaginationData();
        getAllAnalysisCat();
        getAllDepartments();
    }, []);

    const getPaginationData = async (limits, pages) => {
        let limitNumber = limits ? limits : limit;
        let pagesNumber = pages ? pages : pageNumber;
        let request = {
            limit: limitNumber,
            page: pagesNumber,
        };
        let response = await getAllAnalysisService(request);
        if (response && response.data ? response.data.length : 0 > 0) {
            let dataEditDelete = response.data.map((d) => {
                return {
                    _id: d._id,
                    serviceName: d.service_name,
                    chemicalFormula: d.chemical_formula,
                    scientificName: d.scientific_name,
                    exponentialFormatPrecision: d.exponential_format_precision,
                    lowerDetectionLimit: d.lower_detection_limit,
                    upperDetectionLimit: d.upper_detection_limit,
                    displayADetectionLimitSelector: d.display_a_detection_limit_selector,
                    allowManualDetectionLimitInput: d.allow_manual_detection_limit_input,
                    attachmentRequiredForVerification: d.attachment_required_for_verification,
                    analysisKeyword: d.analysis_keyword,
                    maximumTurnAroundTime: d.maximum_turn_around_time,
                    accredited: d.accredited,
                    pointOfCapture: d.point_of_capture,
                    analysisCategory: d.analysis_category,
                    duplicateVariation: d.duplicate_variation,
                    price: d.price,
                    bulkPrice: d.bulk_price,
                    vat: d.vat,
                    labDepartmentId: d.lab_department_id,
                    calculatePrecisionFromUncertainties: d.calculate_precision_from_uncertainties,
                    allowManualUncertaintyValueInput: d.allow_manual_uncertainty_value_input,
                    controlType: d.control_type,
                    hidden: d.hidden,
                    selfVerificationOfResults: d.self_verification_of_results,
                    stringResult: d.string_result,
                    numberOfRequiredVerifications: d.number_of_required_verifications,
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
        const rowData = await deleteAnalysisService(data);
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
            Header: 'Name',
            accessor: 'serviceName',
            sort: true,
        },
        {
            Header: 'Scientific Name',
            accessor: 'scientificName',
            sort: false,
        },
        {
            Header: 'Exponential Format Precision',
            accessor: 'exponentialFormatPrecision',
            sort: false,
        },
        {
            Header: 'Price',
            accessor: 'price',
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
        await updateAnalysisService(formData);
        getPaginationData();
        closeEditPopup();
    };
    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            serviceName: yup.string().required(t('Please enter first Name')),
            chemicalFormula: yup.string().required(t('Please enter last Name')),
            scientificName: yup.string().required(t('Please enter email')),
            exponentialFormatPrecision: yup.string().required(t('Please enter mobile number')),
            lowerDetectionLimit: yup.string().required(t('Please enter job title')),
            upperDetectionLimit: yup.string().required(t('Please enter departments')),
            displayADetectionLimitSelector: yup.string().required(t('Please enter display detection limit selector')),
            allowManualDetectionLimitInput: yup.string().required(t('Please enter allow manual detection limit input')),
            attachmentRequiredForVerification: yup
                .string()
                .required(t('Please enter attachment required ror verification')),
            analysisKeyword: yup.string().required(t('Please enter analysis keyword')),
            maximumTurnAroundTime: yup.string().required(t('Please enter maximum turn around time')),
            accredited: yup.string().required(t('Please enter accredited')),
            pointOfCapture: yup.string().required(t('Please enter point of capture')),
            analysisCategory: yup.string().required(t('Please enter analysis category')),
            duplicateVariation: yup.string().required(t('Please enter duplicate variation')),
            price: yup.string().required(t('Please enter price')),
            bulkPrice: yup.string().required(t('Please enter bulk price')),
            vat: yup.string().required(t('Please enter vat')),
            labDepartmentId: yup.string().required(t('Please enter lab department')),
            calculatePrecisionFromUncertainties: yup
                .string()
                .required(t('Please enter calculate precision from uncertainties')),
            allowManualUncertaintyValueInput: yup
                .string()
                .required(t('Please enter allow manual uncertainty value input')),
            controlType: yup.string().required(t('Please enter control type')),
            hidden: yup.string().required(t('Please enter hidden')),
            selfVerificationOfResults: yup.string().required(t('Please enter self verification of results')),
            stringResult: yup.string().required(t('Please enter string result')),
            numberOfRequiredVerifications: yup.string().required(t('Please enter number of required verifications')),
        })
    );
    const getAllDepartments = async () => {
        let result = await getAllDepartmentsData();
        if (result.length > 0) {
            setDepartmentsData(result);
        }
    };
    const getAllAnalysisCat = async () => {
        let result = await getAllAnalysisCategory();
        console.log(result, 'getAllAnalysisCat');
        if (result.data.length > 0) {
            setAnalysisCatData(result.data);
        }
    };
    return (
        <>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box">
                        <h4 className="page-title">Analysis Service</h4>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Button className="float-end" onClick={() => navigate('/apps/settings/addAnalysisService')}>
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
                                            name="serviceName"
                                            placeholder={t('Enter service name')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Chemical Formula')}
                                            type="text"
                                            name="chemicalFormula"
                                            placeholder={t('Enter chemical formula')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Scientific Name')}
                                            type="text"
                                            name="scientificName"
                                            placeholder={t('Enter your scientific name')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Exponential Format Precision')}
                                            type="text"
                                            name="exponentialFormatPrecision"
                                            placeholder={t('Enter exponential format precision')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Lower Detection Limit')}
                                            type="textarea"
                                            name="lowerDetectionLimit"
                                            placeholder={t('Enter lower detection limit')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Upper Detection Limit')}
                                            type="textarea"
                                            name="upperDetectionLimit"
                                            placeholder={t('Enter upper detection limit')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Display A Detection Limit Selector')}
                                            type="textarea"
                                            name="displayADetectionLimitSelector"
                                            placeholder={t('Enter display a detection limit selector')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Allow Manual Detection Limit Input')}
                                            type="textarea"
                                            name="allowManualDetectionLimitInput"
                                            placeholder={t('Enter lower detection limit input')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Attachment Required For Verification')}
                                            type="textarea"
                                            name="attachmentRequiredForVerification"
                                            placeholder={t('Enter attachment required for verification')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Analysis Keyword')}
                                            type="textarea"
                                            name="analysisKeyword"
                                            placeholder={t('Enter analysis keyword')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Maximum Turn Around Time')}
                                            type="textarea"
                                            name="maximumTurnAroundTime"
                                            placeholder={t('Enter maximum turn around time')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Duplicate Variation')}
                                            type="textarea"
                                            name="duplicateVariation"
                                            placeholder={t('Enter duplicate variation')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Accredited')}
                                            type="textarea"
                                            name="accredited"
                                            placeholder={t('Enter accredited')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Point Of Capture')}
                                            type="textarea"
                                            name="pointOfCapture"
                                            placeholder={t('Enter point of capture')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            type="select"
                                            label="Analysis Category"
                                            name="analysisCategory"
                                            containerClass={'mb-3'}
                                            placeholder={t('Enter analysis category')}
                                            // key="className"
                                        >
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
                                            label={t('Price')}
                                            type="textarea"
                                            name="price"
                                            placeholder={t('Enter price')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Bulk Price')}
                                            type="textarea"
                                            name="bulkPrice"
                                            placeholder={t('Enter bulk price')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Vat')}
                                            type="textarea"
                                            name="vat"
                                            placeholder={t('Enter vat')}
                                            containerClass={'mb-3'}
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
                                        <FormInput
                                            label={t('Calculate Precision From Uncertainties')}
                                            type="textarea"
                                            name="calculatePrecisionFromUncertainties"
                                            placeholder={t('Enter calculate precision from uncertainties')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Allow Manual Uncertainty Value Input')}
                                            type="textarea"
                                            name="allowManualUncertaintyValueInput"
                                            placeholder={t('Enter allow manual uncertainty value input')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Control Type')}
                                            type="textarea"
                                            name="controlType"
                                            placeholder={t('Enter control type')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Hidden')}
                                            type="textarea"
                                            name="hidden"
                                            placeholder={t('Enter hidden')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Self Verification Of Results')}
                                            type="textarea"
                                            name="selfVerificationOfResults"
                                            placeholder={t('Enter self verification of results')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('Number Of Required Verifications')}
                                            type="textarea"
                                            name="numberOfRequiredVerifications"
                                            placeholder={t('Enter number of required verifications')}
                                            containerClass={'mb-3'}
                                        />
                                        <FormInput
                                            label={t('String Result')}
                                            type="textarea"
                                            name="stringResult"
                                            placeholder={t('Enter string result')}
                                            containerClass={'mb-3'}
                                        />
                                        <Button variant="primary" type="submit">
                                            <i className="mdi mdi-login"></i> {t('Submit')}
                                        </Button>{' '}
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
                                    <h4>Are you sure you want to delete this analysis service?</h4>
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

export default AnalysisService;
