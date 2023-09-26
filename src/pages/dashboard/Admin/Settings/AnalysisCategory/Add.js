import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { VerticalForm, FormInput } from '../../../../../components';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { addAnalysisCategory, getAllDepartmentsData } from '../../../../../api/optimalimsapi';

const Add = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [departmentsData, setDepartmentsData] = useState([]);
    const onSubmit = async (formData) => {
        await addAnalysisCategory(formData);
        navigate('/apps/settings/analysisCategory');
    };
    useEffect(() => {
        getAllDepartments();
    }, []);
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
        console.log(result, 'result departments data 123');
        if (result.length > 0) {
            setDepartmentsData(result);
        }
    };
    return (
        <>
            {console.log(departmentsData)}
            <Row>
                <Col xs={12}>
                    <div className="page-title-box">
                        <h4 className="page-title">Add Analysis Category</h4>
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
