import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { VerticalForm, FormInput } from '../../../../../components';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { addSample, deleteSample, getAllClients, getAllOrder, getAllSample, updateSample } from '../../../../../api/optimalimsapi';

const Sample = () => {
    const { t } = useTranslation();
    const [addData, setAddData] = useState('no');
    const [inputData, setInputData] = useState([]);
    const [addAnalysisServiceData, setAddAnalysisServiceData] = useState([]);

    const [clientId1, setClientId1] = useState('');
    const [orderIdData, setOrderIdData] = useState([]);


    useEffect(() => {
        clientsDetails();
    }, []);

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
     const schemaResolver = yupResolver(
        yup.object().shape({
            organizationName: yup.string().required(t('Please enter organizationName')),
            clientName: yup.string().required(t('Please enter clientName')),
            clientEmail: yup.string().required(t('Please enter ccEmails')),
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
        </>
    );
};

export default Sample;
