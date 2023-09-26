import axios from 'axios';
import config from '../config';

const baseUrl = config.LIMS_API_URLS;

export async function addLabContacts(values) {
    console.log(values, 'values coming to api ');
    return await axios
        .post(baseUrl + '/labContact/create', values)
        .then((response) => {
            let userResponse = response.data;
            console.log(userResponse, 'userResponse 12345');
            if (userResponse.isSucess === true) {
                return userResponse.response;
            } else {
                return userResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
export async function updateLabContact(values) {
    let id = values._id;
    return await axios
        .post(baseUrl + '/labContact/update/' + id, values)
        .then((response) => {
            let labContactResponse = response.data;
            console.log(labContactResponse, 'labContactResponse 12345');
            if (labContactResponse.isSucess === true) {
                return labContactResponse.response;
            } else {
                return labContactResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function deleteLabContact(values) {
    let id = values._id;
    return await axios
        .post(baseUrl + '/labContact/delete/' + id)
        .then((response) => {
            let labContactResponse = response.data;
            if (labContactResponse.isSucess === true) {
                return labContactResponse.response;
            } else {
                return labContactResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
export async function getAllLabContact(values) {
    return await axios
        .post(baseUrl + '/labContact/allLabContact', values)
        .then((response) => {
            let labContactResponse = response.data;
            if (labContactResponse.isSucess === true) {
                return labContactResponse.response;
            } else {
                return labContactResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function getAllManagerData() {
    return await axios.post(baseUrl + '/labContact/allLabContact').then((response) => {
        let managerResponse = response.data;
        if (managerResponse.isSucess === true) {
            return managerResponse.response;
        } else {
            return managerResponse.response;
        }
    });
}

export async function addLabDepartments(values) {
    console.log(values, 'values coming to api ');
    return await axios
        .post(baseUrl + '/labDepartment/create', values)
        .then((response) => {
            let LabDepartmentsResponse = response.data;
            console.log(LabDepartmentsResponse, 'LabDepartmentsResponse 12345');
            if (LabDepartmentsResponse.isSucess === true) {
                return LabDepartmentsResponse.response;
            } else {
                return LabDepartmentsResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
export async function updateLabDepartments(values) {
    let id = values._id;
    return await axios
        .post(baseUrl + '/labDepartment/update/' + id, values)
        .then((response) => {
            let labDepartmentsResponse = response.data;
            console.log(labDepartmentsResponse, 'labDepartmentsResponse 12345');
            if (labDepartmentsResponse.isSucess === true) {
                return labDepartmentsResponse.response;
            } else {
                return labDepartmentsResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
export async function getAllDepartmentsPagenationData(values) {
    return await axios
        .post(baseUrl + '/labDepartment/allLabDepartment', values)
        .then((response) => {
            let departmentsResponse = response.data;
            console.log(departmentsResponse, 'departmentsResponse 123456');
            if (departmentsResponse.isSucess === true) {
                return departmentsResponse.response;
            } else {
                return departmentsResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function getAllDepartmentsData(values) {
    return await axios
        .post(baseUrl + '/labDepartment/allLabDepartment', values)
        .then((response) => {
            let departmentsResponse = response.data;
            if (departmentsResponse.isSucess === true) {
                return departmentsResponse.response.data;
            } else {
                return departmentsResponse.response.data;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function deleteDepartments(values) {
    let id = values._id;
    return await axios
        .post(baseUrl + '/labDepartment/delete/' + id)
        .then((response) => {
            let labDepartmentsResponse = response.data;
            if (labDepartmentsResponse.isSucess === true) {
                return labDepartmentsResponse.response;
            } else {
                return labDepartmentsResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function addAnalysisCategory(values) {
    return await axios.post(baseUrl + '/analysisCategory/create', values).then((response) => {
        let analysisCategoryResponse = response.data;
        if (analysisCategoryResponse.isSucess === true) {
            return analysisCategoryResponse.response;
        } else {
            return analysisCategoryResponse.response;
        }
    });
}

export async function addAnalysisService(values) {
    return await axios
        .post(baseUrl + '/analysisService/create', values)
        .then((response) => {
            let analysisServiceResponse = response.data;
            if (analysisServiceResponse.isSucess === true) {
                return analysisServiceResponse.response;
            } else {
                return analysisServiceResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function addClients(values) {
    return await axios.post(baseUrl + '/clients/create', values).then((response) => {
        let clientsResponse = response.data;
        if (clientsResponse.isSucess === true) {
            return clientsResponse.response;
        } else {
            return clientsResponse.response;
        }
    });
}
export async function addOrder(values) {
    console.log(values);
    // values.testImage = values.file;
    const formData = new FormData();
    for (let i = 0; i < values.file.length; i++) {
        formData.append('files', values.file[i]);
    }
    // formData.append('files', values.file[0]);
    formData.append('clientId', values.clientId);
    formData.append('orderStatus', values.orderStatus);
    formData.append('orderList', JSON.stringify(values.orderList));
    formData.append('history', JSON.stringify(values.history ? values.history : []));

    return await axios.post(baseUrl + '/order/create', formData).then((response) => {
        let orderResponse = response.data;
        if (orderResponse.isSucess === true) {
            return orderResponse.response;
        } else {
            return orderResponse;
        }
    });
}
export async function addEnquiryOrder(values) {
    console.log(values);
    // values.testImage = values.file;
    // const formData = new FormData();
    // for (let i = 0; i < values.file.length; i++) {
    //     formData.append('files', values.file[i]);
    // }
    // formData.append('files', values.file[0]);
    // formData.append('clientId', values.clientId);
    // formData.append('orderStatus', values.orderStatus);
    // formData.append('orderList', JSON.stringify(values.orderList));
    // formData.append('history', JSON.stringify(values.history ? values.history : []));

    return await axios.post(baseUrl + '/enquiry/createOrder', values).then((response) => {
        let orderResponse = response.data;
        if (orderResponse.isSucess === true) {
            return orderResponse.response;
        } else {
            return orderResponse;
        }
    });
}
export async function updateOrder(values) {
    let id = values._id;

    // values.testImage = values.file;
    const formData = new FormData();
    // formData.append('file', values.file[0]);
    formData.append('clientId', values.clientId);
    formData.append('orderStatus', values.orderStatus);
    formData.append('orderList', JSON.stringify(values.orderList ? values.orderList : []));
    formData.append('history', JSON.stringify(values.history ? values.history : []));
    console.log(values);
    return await axios.post(baseUrl + '/order/update/' + id, values).then((response) => {
        let orderResponse = response.data;
        if (orderResponse.isSucess === true) {
            return orderResponse.response;
        } else {
            return orderResponse;
        }
    });
}

export async function updateOrderFile(values) {
    let id = values._id;
    // values.testImage = values.file;
    const formData = new FormData();
    for (let i = 0; i < values.file.length; i++) {
        formData.append('files', values.file[i]);
    }
    formData.append('clientId', values.clientId);
    formData.append('orderStatus', values.orderStatus);
    formData.append('orderList', JSON.stringify(values.orderList ? values.orderList : []));
    formData.append('history', JSON.stringify(values.history ? values.history : []));
    console.log(values);
    return await axios.post(baseUrl + '/order/updateFile/' + id, formData).then((response) => {
        let orderResponse = response.data;
        if (orderResponse.isSucess === true) {
            return orderResponse.response;
        } else {
            return orderResponse;
        }
    });
}
export async function deleteOrder(values) {
    let id = values._id;
    return await axios.post(baseUrl + '/order/delete/' + id).then((response) => {
        let orderResponse = response.data;
        if (orderResponse.isSucess === true) {
            return orderResponse.response;
        } else {
            return orderResponse;
        }
    });
}

export async function deleteOrderFile(values) {
    let id = values._id;
    return await axios.post(baseUrl + '/order/deleteFile/' + id, values).then((response) => {
        let orderResponse = response.data;
        if (orderResponse.isSucess === true) {
            return orderResponse.response;
        } else {
            return orderResponse;
        }
    });
}

export async function getAllOrder(values) {
    return await axios
        .post(baseUrl + '/order/allOrder', values)
        .then((response) => {
            let orderResponse = response.data;
            if (orderResponse.isSucess === true) {
                return orderResponse.response;
            } else {
                return orderResponse;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
export async function addEnquiry(values) {
    // values.testImage = values.file;
    const formData = new FormData();
    for (let i = 0; i < values.file.length; i++) {
        formData.append('files', values.file[i]);
    }
    formData.append('clientId', values.clientId);
    formData.append('orderStatus', values.orderStatus);
    formData.append('enquiryList', JSON.stringify(values.enquiryList));
    formData.append('history', JSON.stringify(values.history ? values.history : []));

    return await axios.post(baseUrl + '/enquiry/create', formData).then((response) => {
        let enquiryResponse = response.data;
        if (enquiryResponse.isSucess === true) {
            return enquiryResponse.response;
        } else {
            return enquiryResponse;
        }
    });
}
export async function updateEnquiry(values) {
    let id = values._id;
    // values.testImage = values.file;
    const formData = new FormData();
    // formData.append('file', values.file[0]);
    formData.append('clientId', values.clientId);
    formData.append('orderStatus', values.orderStatus);
    formData.append('enquiryList', JSON.stringify(values.enquiryList));
    formData.append('history', JSON.stringify(values.history ? values.history : []));

    return await axios.post(baseUrl + '/enquiry/update/' + id, values).then((response) => {
        let enquiryResponse = response.data;
        if (enquiryResponse.isSucess === true) {
            return enquiryResponse.response;
        } else {
            return enquiryResponse;
        }
    });
}

export async function updateEnquiryFile(values) {
    let id = values._id;
    // values.testImage = values.file;
    const formData = new FormData();
    for (let i = 0; i < values.file.length; i++) {
        formData.append('files', values.file[i]);
    }
    formData.append('clientId', values.clientId);
    formData.append('orderStatus', values.orderStatus);
    formData.append('enquiryList', JSON.stringify(values.enquiryList));
    formData.append('history', JSON.stringify(values.history ? values.history : []));

    return await axios.post(baseUrl + '/enquiry/updateFile/' + id, formData).then((response) => {
        let enquiryResponse = response.data;
        if (enquiryResponse.isSucess === true) {
            return enquiryResponse.response;
        } else {
            return enquiryResponse;
        }
    });
}
export async function deleteEnquiry(values) {
    let id = values._id;
    console.log(id);
    return await axios.post(baseUrl + '/enquiry/delete/' + id).then((response) => {
        let enquiryResponse = response.data;
        if (enquiryResponse.isSucess === true) {
            return enquiryResponse.response;
        } else {
            return enquiryResponse;
        }
    });
}
export async function deleteEnquiryFile(values) {
    let id = values._id;
    console.log(id);
    return await axios.post(baseUrl + '/enquiry/deleteFile/' + id, values).then((response) => {
        let enquiryResponse = response.data;
        if (enquiryResponse.isSucess === true) {
            return enquiryResponse.response;
        } else {
            return enquiryResponse;
        }
    });
}

export async function getAllEnquiry(values) {
    return await axios
        .post(baseUrl + '/enquiry/allEnquiry', values)
        .then((response) => {
            let enquiryResponse = response.data;
            if (enquiryResponse.isSucess === true) {
                return enquiryResponse.response;
            } else {
                return enquiryResponse;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function addSample(values) {
    console.log(values, 'values coming to api ');
    return await axios
        .post(baseUrl + '/sample/create', values)
        .then((response) => {
            let sampleResponse = response.data;
            console.log(sampleResponse, 'sampleResponse 12345');
            if (sampleResponse.isSucess === true) {
                return sampleResponse.response;
            } else {
                return sampleResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
export async function updateSample(values) {
    let id = values._id;
    return await axios
        .post(baseUrl + '/sample/update/' + id, values)
        .then((response) => {
            let sampleResponse = response.data;
            console.log(sampleResponse, 'sampleResponse 12345');
            if (sampleResponse.isSucess === true) {
                return sampleResponse.response;
            } else {
                return sampleResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
export async function getAllSample(values) {
    return await axios
        .post(baseUrl + '/sample/GetSample', values)
        .then((response) => {
            let sampleResponse = response.data;
            if (sampleResponse.isSucess === true) {
                return sampleResponse.response;
            } else {
                return sampleResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
export async function deleteSample(values) {
    let id = values._id;
    return await axios
        .post(baseUrl + '/sample/delete/' + id)
        .then((response) => {
            let sampleResponse = response.data;
            if (sampleResponse.isSucess === true) {
                return sampleResponse.response;
            } else {
                return sampleResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function getAllAnalysisCategory(values) {
    return await axios
        .post(baseUrl + '/analysisCategory/allAnalysisCategory', values)
        .then((response) => {
            let analysisCategoryResponse = response.data;
            if (analysisCategoryResponse.isSucess === true) {
                return analysisCategoryResponse.response;
            } else {
                return analysisCategoryResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function updateAnalysisCategory(values) {
    let id = values._id;
    return await axios
        .post(baseUrl + '/analysisCategory/update/' + id, values)
        .then((response) => {
            let analysisCategoryResponse = response.data;
            if (analysisCategoryResponse.isSucess === true) {
                return analysisCategoryResponse.response;
            } else {
                return analysisCategoryResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function deleteAnalysisCategory(values) {
    let id = values._id;
    return await axios
        .post(baseUrl + '/analysisCategory/delete/' + id)
        .then((response) => {
            let analysisCategoryResponse = response.data;
            if (analysisCategoryResponse.isSucess === true) {
                return analysisCategoryResponse.response;
            } else {
                return analysisCategoryResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function getAllAnalysisService(values) {
    return await axios
        .post(baseUrl + '/analysisService/allAnalysisService', values)
        .then((response) => {
            let analysisServiceResponse = response.data;
            if (analysisServiceResponse.isSucess === true) {
                return analysisServiceResponse.response;
            } else {
                return analysisServiceResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function updateAnalysisService(values) {
    let id = values._id;
    return await axios
        .post(baseUrl + '/analysisService/update/' + id, values)
        .then((response) => {
            let analysisServiceResponse = response.data;
            if (analysisServiceResponse.isSucess === true) {
                return analysisServiceResponse.response;
            } else {
                return analysisServiceResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function deleteAnalysisService(values) {
    let id = values._id;
    return await axios
        .post(baseUrl + '/analysisService/delete/' + id)
        .then((response) => {
            let analysisServiceResponse = response.data;
            if (analysisServiceResponse.isSucess === true) {
                return analysisServiceResponse.response;
            } else {
                return analysisServiceResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function getAllClients(values) {
    return await axios
        .post(baseUrl + '/clients/getClients', values)
        .then((response) => {
            let clientsResponse = response.data;
            if (clientsResponse.isSucess === true) {
                return clientsResponse.response;
            } else {
                return clientsResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function updateClients(values) {
    let id = values._id;
    return await axios
        .post(baseUrl + '/clients/update/' + id, values)
        .then((response) => {
            let clientsResponse = response.data;
            if (clientsResponse.isSucess === true) {
                return clientsResponse.response;
            } else {
                return clientsResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

export async function deleteClients(values) {
    let id = values._id;
    return await axios
        .post(baseUrl + '/clients/delete/' + id)
        .then((response) => {
            let clientsResponse = response.data;
            if (clientsResponse.isSucess === true) {
                return clientsResponse.response;
            } else {
                return clientsResponse.response;
            }
        })
        .catch((error) => {
            console.log(error);
        });
}
// export async function login(values) {
//   let user = values;
//   return await axios.post(baseUrl + "/login", user).then((response) => {
//     let userResponse = response.data;

//     if (userResponse.isSucess === true) {
//       return userResponse.response;
//     } else {
//       return userResponse.response;
//     }
//   });
// }

export async function getAllUser(values) {
    return await axios.post(baseUrl + '/user/alluser', values).then((response) => {
        let userResponse = response.data;
        if (userResponse.isSucess === true) {
            return userResponse.response;
        } else {
            return userResponse.response;
        }
    });
}

export async function addUser(values) {
    return await axios.post(baseUrl + '/user/create', values).then((response) => {
        let userResponse = response.data;

        if (userResponse.isSucess === true) {
            return userResponse.response;
        } else {
            return userResponse.response;
        }
    });
}

export async function updateUser(values) {
    let id = values._id;
    return await axios.post(baseUrl + '/user/update/' + id, values).then((response) => {
        let editUserResponse = response.data;
        if (editUserResponse.isSucess === true) {
            return editUserResponse;
        } else {
            return editUserResponse.isSucess;
        }
    });
}

export async function deleteUser(values) {
    let id = values._id;
    return await axios.post(baseUrl + '/user/delete/' + id).then((response) => {
        let deleteUserResponse = response.data;
        if (deleteUserResponse.isSucess === true) {
            return deleteUserResponse;
        } else {
            return deleteUserResponse.isSucess;
        }
    });
}

// export async function getAllSensor() {
//   return await axios.post(baseUrl + "/allsensor").then((response) => {
//     let sensorResponse = response.data;
//     if (sensorResponse.isSucess === true) {
//       return sensorResponse.response;
//     } else {
//       return sensorResponse.response;
//     }
//   });
// }
