// @flow
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { VerticalForm, FormInput } from '../../../components/';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    addAnalysisCategory,
    addLabContacts,
    addLabDepartments,
    getAllDepartmentsData,
    getAllManagerData,
} from '../../../api/optimalimsapi';

const EcommerceDashboard = () => {
    const { t } = useTranslation();

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [managerData, setManagerData] = useState([]);
    const [departmentsData, setDepartmentsData] = useState([]);

    const onDateChange = (date) => {
        if (date) {
            setSelectedDate(date);
        }
    };

    useEffect(() => {
        getAllManager();
        getAllDepartments();
    }, []);

    const getAllManager = async () => {
        let result = await getAllManagerData();
        console.log(result, 'result manager data 123');
        if (result.length > 0) {
            setManagerData(result);
        }
    };

    const getAllDepartments = async () => {
        let result = await getAllDepartmentsData();
        console.log(result, 'result departments data 123');
        if (result.length > 0) {
            setDepartmentsData(result);
        }
    };

    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            firstName: yup.string().required(t('Please enter first Name')),
            lastName: yup.string().required(t('Please enter last Name')),
            email: yup.string().required(t('Please enter email')),
            mobileNumber: yup.string().required(t('Please enter mobile number')),
            jobTitle: yup.string().required(t('Please enter job title')),
            departments: yup.string().required(t('Please enter departments')),

            // name: yup.string().required(t('Please enter Name')),
            // description: yup.string().required(t('Please enter descriptions')),
            // departments: yup.string().required(t('Please enter department name')),
            // managerId: yup.string().required(t('Please enter manager id')),

            // name: yup.string().required(t('Please enter Name')),
            // description: yup.string().required(t('Please enter descriptions')),
            // labDepartmentsId: yup.string().required(t('Please enter department')),
            // comments: yup.string().required(t('Please enter comments')),
        })
    );

    /*
     * handle form submission
     */
    const onSubmit = async (formData) => {
        console.log(formData, 'form value');
        // let result = await addLabContacts(formData);
        // console.log(result, 'result lab contacts 123');

        // let result = await addLabDepartments(formData);
        // console.log(result, 'result lab contacts 123');

        let result = await addAnalysisCategory(formData);
        console.log(result, 'result analysis category 123');
    };

    return (
        <>
            <Row>
                <Col xs={12}>
                    <div className="page-title-box">
                        <h4 className="page-title">Dashboard</h4>
                    </div>
                </Col>
            </Row>
            <Card>
                <Card.Body>Welcome</Card.Body>
            </Card>
            {/* <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <h6 className="header-title mb-3">Lab Contact</h6>

                            <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
                                <FormInput
                                    label={t('First Name')}
                                    type="text"
                                    name="firstName"
                                    placeholder={t('Enter your first name')}
                                    containerClass={'mb-3'}
                                />

                                <FormInput
                                    label={t('Last Name')}
                                    type="text"
                                    name="lastName"
                                    placeholder={t('Enter your last name')}
                                    containerClass={'mb-3'}
                                />

                                <FormInput
                                    label={t('Email')}
                                    type="email"
                                    name="email"
                                    placeholder={t('Enter your email id')}
                                    containerClass={'mb-3'}
                                />

                                <FormInput
                                    label={t('Mobile Number')}
                                    type="text"
                                    name="mobileNumber"
                                    placeholder={t('Enter your mobile number')}
                                    containerClass={'mb-3'}
                                />

                                <FormInput
                                    label={t('Job Title')}
                                    type="text"
                                    name="jobTitle"
                                    placeholder={t('Enter your job title')}
                                    containerClass={'mb-3'}
                                />

                                <FormInput
                                    type="select"
                                    label="Departments"
                                    name="departments"
                                    containerClass={'mb-3'}
                                    key="className">
                                    <option value="">Select Lab Department</option>
                                    {departmentsData.map((item, index) => {
                                        return (
                                            <option key={index} value={item.departments}>
                                                {item.departments}
                                            </option>
                                        );
                                    })}
                                </FormInput>

                                <Button variant="primary" type="submit">
                                    <i className="mdi mdi-login"></i> {t('Submit')}
                                </Button>
                            </VerticalForm>
                        </Card.Body>
                    </Card>
                </Col>
            </Row> */}

            {/* <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <h6 className="header-title mb-3">Lab Departments</h6>

                            <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
                                <FormInput
                                    label={t('Name')}
                                    type="text"
                                    name="name"
                                    placeholder={t('Enter your name')}
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
                                    label={t('Departments')}
                                    type="text"
                                    name="departments"
                                    placeholder={t('Enter your departments')}
                                    containerClass={'mb-3'}
                                />

                                <FormInput
                                    type="select"
                                    label="Manager"
                                    name="managerId"
                                    containerClass={'mb-3'}
                                    key="className">
                                    <option value="">Select Manager</option>
                                    {managerData.map((item, index) => {
                                        return (
                                            <option key={index} value={item._id}>
                                                {item.first_name + ' ' + item.last_name}
                                            </option>
                                        );
                                    })}
                                </FormInput>

                                <Button variant="primary" type="submit">
                                    <i className="mdi mdi-login"></i> {t('Submit')}
                                </Button>
                            </VerticalForm>
                        </Card.Body>
                    </Card>
                </Col>
            </Row> */}

            {/* <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <h6 className="header-title mb-3">Analysis Category</h6>

                            <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
                                <FormInput
                                    label={t('Name')}
                                    type="text"
                                    name="name"
                                    placeholder={t('Enter your name')}
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
                                    name="labDepartmentsId"
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
                            </VerticalForm>
                        </Card.Body>
                    </Card>
                </Col>
            </Row> */}

            {/* <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <h6 className="header-title mb-3">Analysis Services</h6>

                            <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
                                <FormInput
                                    label={t('Name')}
                                    type="text"
                                    name="name"
                                    placeholder={t('Enter your name')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Short Name')}
                                    type="text"
                                    name="shortName"
                                    placeholder={t('Enter your short name')}
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
                                    name="displayDetectionLimitSelector"
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
                                    label={t('Lab Department')}
                                    type="textarea"
                                    name="labDepartment"
                                    placeholder={t('Enter lab department')}
                                    containerClass={'mb-3'}
                                />

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
                                </Button>
                            </VerticalForm>
                        </Card.Body>
                    </Card>
                </Col>
            </Row> */}
        </>
    );
};

export default EcommerceDashboard;
