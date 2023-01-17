import React from 'react';
import InfoServiceContext from '../service-context';

const WithService = () => (Wrapped) => {
    return (props) => {
        return (
            <InfoServiceContext.Consumer>
                {
                    (infoService) => {
                        return <Wrapped {...props} infoService={ infoService } />
                    }
                }
            </InfoServiceContext.Consumer>
        )
    };
};

export default WithService;