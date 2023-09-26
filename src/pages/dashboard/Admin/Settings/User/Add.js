import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { VerticalForm, FormInput } from '../../../../../components';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { addUser, getAllDepartmentsData } from '../../../../../api/optimalimsapi';

const Add = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [departmentsData, setDepartmentsData] = useState([]);
    useEffect(() => {
        getAllDepartments();
    }, []);

    const onSubmit = async (formData) => {
        console.log(formData);
        formData.token =
            'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImlhdCI6MTU4NzM1NjY0OSwiZXhwIjoxOTAyODg5NDQ5LCJhdWQiOiJjb2RlcnRoZW1lcy5jb20iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVzdCIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJIeXBlciJ9.P27f7JNBF-vOaJFpkn-upfEh3zSprYfyhTOYhijykdI';
        let result = await addUser(formData);
        console.log(result);
        navigate('/apps/settings/users');
    };
    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
        yup.object().shape({
            firstName: yup.string().required(t('Please enter first name')),
            lastName: yup.string().required(t('Please enter last name')),
            email: yup.string().email().required(t('Please enter email')),
            mobileNumber: yup.number().required(t('Please enter mobile number')),
            role: yup.string().required(t('Please enter role')),
            location: yup.string().required(t('Please enter location')),
            password: yup.string().required(t('Please enter password')),
            confirmPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
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
                        <h4 className="page-title">Add User</h4>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
                                <FormInput
                                    label={t('First Name')}
                                    type="text"
                                    name="firstName"
                                    placeholder={t('Enter first name')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Last Name')}
                                    type="text"
                                    name="lastName"
                                    placeholder={t('Enter last name')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Email')}
                                    type="text"
                                    name="email"
                                    placeholder={t('Enter your email')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Mobile Number')}
                                    type="text"
                                    name="mobileNumber"
                                    placeholder={t('Enter your mobile number')}
                                    containerClass={'mb-3'}
                                />{' '}
                                <FormInput
                                    label={t('Role')}
                                    type="text"
                                    name="role"
                                    placeholder={t('Enter your role')}
                                    containerClass={'mb-3'}
                                />{' '}
                                <FormInput
                                    label={t('Location')}
                                    type="text"
                                    name="location"
                                    placeholder={t('Enter your location')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Password')}
                                    type="password"
                                    name="password"
                                    placeholder={t('Enter your password')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Confirm Password')}
                                    type="password"
                                    name="confirmPassword"
                                    placeholder={t('Enter your password')}
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
