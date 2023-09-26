// @flow
import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// images
import LogoLight from '../../assets/images/logo.png';
import LogoDark from '../../assets/images/logo-dark.png';

const AccountLayout = ({ bottomLinks, children }) => {
    useEffect(() => {
        if (document.body) document.body.classList.add('authentication-bg');

        return () => {
            if (document.body) document.body.classList.remove('authentication-bg');
        };
    }, []);

    const { t } = useTranslation();

    return (
        <>
            <div className="auth-fluid">
                {/* Auth fluid left content */}
                <div className="auth-fluid-form-box">
                    <div className="align-items-center d-flex h-100">
                        <Card.Body>
                            {/* logo */}
                            <div className="auth-brand text-center text-lg-start">
                                <Link to="/" className="logo-dark">
                                    <span>
                                        <img src={LogoDark} alt="" height="18" />
                                    </span>
                                </Link>
                                <Link to="/" className="logo-light">
                                    <span>
                                        <img src={LogoLight} alt="" height="18" />
                                    </span>
                                </Link>
                            </div>

                            {children}

                            {/* footer links */}
                            {bottomLinks}
                        </Card.Body>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AccountLayout;
