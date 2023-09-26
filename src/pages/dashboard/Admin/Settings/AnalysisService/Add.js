// @flow
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { VerticalForm, FormInput } from '../../../../../components';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { addAnalysisService, getAllDepartmentsData, getAllAnalysisCategory } from '../../../../../api/optimalimsapi';

const Add = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [departmentsData, setDepartmentsData] = useState([]);
    const [analysisCatData, setAnalysisCatData] = useState([]);

    /*
     * handle form submission
     */
    const onSubmit = async (formData) => {
        await addAnalysisService(formData);
        navigate('/apps/settings/analysisService');
    };
    useEffect(() => {
        getAllAnalysisCat();
        getAllDepartments();
    }, []);
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
            {' '}
            <Row>
                <Col xs={12}>
                    <div className="page-title-box">
                        <h4 className="page-title">Add Analysis Services</h4>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
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
                                    key="className">
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
                                    label={t('GST')}
                                    type="textarea"
                                    name="vat"
                                    placeholder={t('Enter GST')}
                                    containerClass={'mb-3'}
                                />

                                <FormInput
                                    type="select"
                                    label="Lab Department"
                                    name="labDepartmentId"
                                    containerClass={'mb-3'}
                                    key="className">
                                    <option value="">Select Lab Department</option>
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
                                </Button>
                                <Button className="ms-3" variant="primary" onClick={() => navigate(-1)}>
                                    <i className="dripicons-cross"></i> {t('Cancel')}
                                </Button>
                            </VerticalForm>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Add;
