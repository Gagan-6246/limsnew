// @flow
import React, { useState } from 'react';
import "./FormInput1.css";

const FormInput1 = (props) => {

    return (
        <>
        <div  style={{
               paddingBottom:"20px"
            }} >
            <label className='FormInput1-label' for={props.name}>{props.label}</label><br/>
            <input className='FormInput1-input' 
            style={{
                display:"block",
                width:"100%",
                padding:"7px",
                border: "1px solid #e5e8eb",
                color:"#6c757d",
                borderRadius: "4px"
            }}
            type={props.type}
             placeholder={props.placeholder}
             id={props.name}
              value={props.value}
               onChange={props.onChange}
               />
            </div>
        </>
    );
};

export default FormInput1;
