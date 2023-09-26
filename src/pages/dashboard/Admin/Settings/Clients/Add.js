// @flow
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { VerticalForm, FormInput } from '../../../../../components';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { addClients } from '../../../../../api/optimalimsapi';

const Add = () => {
    const navigate = useNavigate();

    const { t } = useTranslation();
    /*
     * handle form submission
     */
    const onSubmit = async (formData) => {
        await addClients(formData);
        navigate('/apps/settings/clients');
    };
    /*
     * form validation schema
     */
    const schemaResolver = yupResolver(
       
        yup.object().shape({
            organizationName: yup.string().required(t('Please enter organization Name')),
            clientName: yup.string().required(t('Please enter client Name')),
            contact: yup.number().required(t('Please enter contact')),
            clientEmail: yup.string().required(t('Please enter client Email')),
            country: yup.string().required(t('Please enter country')),
            state: yup.string().required(t('Please enter state')),
            city: yup.string().required(t('Please enter city')),
            postalCode: yup.number().required(t('Please enter postal code')),
            address: yup.string().required(t('Please enter address')),
            bankAccountName: yup.string().required(t('Please enter bank account name')),
            bankAccountType: yup.string().required(t('Please enter bank account type')),
            bankAccountNumber: yup.number().required(t('Please enter bank account number')),
            bankName: yup.string().required(t('Please enter bank name')),
            bankBranch: yup.string().required(t('Please enter bank branch')),
            gstNumber: yup.string().required(t('Please enter gst Number')),
            defaultCategories: yup.string().required(t('Please enter default categories')),
            restrictCategories: yup.string().required(t('Please enter restrict categories')),
            defaultDecimalMark: yup.string().required(t('Please enter default decimal mark')),
        })
        
    );
    return (
        <>
            {' '}
            <Row>
                <Col xs={12}>
                    <div className="page-title-box">
                        <h4 className="page-title">Add Client</h4>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Card.Body>
                            <VerticalForm onSubmit={onSubmit} resolver={schemaResolver}>
                                <FormInput
                                    label={t('Organization Name')}
                                    type="text"
                                    name="organizationName"
                                    placeholder={t('Enter your organization name')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Client Name')}
                                    type="text"
                                    name="clientName"
                                    placeholder={t('Enter client name')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Contact Number')}
                                    type="text"
                                    name="contact"
                                    placeholder={t('Enter contact number')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Client Email')}
                                    type="text"
                                    name="clientEmail"
                                    placeholder={t('Enter client email')}
                                    containerClass={'mb-3'}
                                />
                                {/* <FormInput
                                    label={t('Bulk Discount')}
                                    type="textarea"
                                    name="bulkDiscount"
                                    placeholder={t('Enter bulk discount')}
                                    containerClass={'mb-3'}
                                />
                                 <FormInput
                                    label={t('Fax')}
                                    type="text"
                                    name="fax"
                                    placeholder={t('Enter fax')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Member Discount')}
                                    type="textarea"
                                    name="memberDiscount"
                                    placeholder={t('Enter member discount')}
                                    containerClass={'mb-3'}
                                /> */}
                                <FormInput
                                    label={t('Address Line-1')}
                                    type="textarea"
                                    name="address"
                                    placeholder={t('Enter address')}
                                    containerClass={'mb-3'}
                                />
                                 <FormInput
                                    label={t('Postal Code')}
                                    type="text"
                                    name="postalCode"
                                    placeholder={t('Enter postal code')}
                                    containerClass={'mb-3'}
                                />
                                 <FormInput
                                    label={t('City')}
                                    type="text"
                                    name="city"
                                    placeholder={t('Enter city')}
                                    containerClass={'mb-3'}
                                />
                                 <FormInput
                                    label={t('State')}
                                    type="text"
                                    name="state"
                                    placeholder={t('Enter state')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Country')}
                                    type="text"
                                    name="country"
                                    placeholder={t('Enter country')}
                                    containerClass={'mb-3'}
                                />
                                 <FormInput
                                    label={t('Gst Number')}
                                    type="text"
                                    name="gstNumber"
                                    placeholder={t('Enter your Gst number')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Bank Account Type')}
                                    type="text"
                                    name="bankAccountType"
                                    placeholder={t('Enter bank account type')}
                                    containerClass={'mb-3'}
                                />
                                <FormInput
                                    label={t('Bank Account Name')}
                                    type="text"
                                    name="bankAccountName"
                                    placeholder={t('Enter bank account name')}
                                    containerClass={'mb-3'}
                                />

                                {/* <FormInput
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
                                </FormInput> */}

                                <FormInput
                                    label={t('Bank Account Number')}
                                    type="text"
                                    name="bankAccountNumber"
                                    placeholder={t('Enter bank account number')}
                                    containerClass={'mb-3'}
                                />

                                <FormInput
                                    label={t('Bank Name')}
                                    type="text"
                                    name="bankName"
                                    placeholder={t('Enter bank name')}
                                    containerClass={'mb-3'}
                                />

                                <FormInput
                                    label={t('Bank Branch')}
                                    type="text"
                                    name="bankBranch"
                                    placeholder={t('Enter bank branch')}
                                    containerClass={'mb-3'}
                                />

                                {/* <FormInput
                                    label={t('CC Emails')}
                                    type="text"
                                    name="ccEmails"
                                    placeholder={t('Enter cc emails')}
                                    containerClass={'mb-3'}
                                /> */}
                                <FormInput
                                    label={t('Default Categories')}
                                    type="text"
                                    name="defaultCategories"
                                    placeholder={t('Enter default categories')}
                                    containerClass={'mb-3'}
                                />

                                <FormInput
                                    label={t('Restrict Categories')}
                                    type="text"
                                    name="restrictCategories"
                                    placeholder={t('Enter restrict categories')}
                                    containerClass={'mb-3'}
                                />

                                <FormInput
                                    label={t('Decimal Mark')}
                                    type="text"
                                    name="defaultDecimalMark"
                                    placeholder={t('Enter decimal mark')}
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
