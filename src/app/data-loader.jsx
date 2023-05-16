import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { toDataSourceRequestString,toDataSourceRequest } from '@progress/kendo-data-query';
import api from './services/api';
import _ from 'lodash';

export const DataLoader = props => {
  const {method,url}=props;
  const lastSuccess = React.useRef(null);
  const pending = React.useRef(null);

  const requestDataIfNeeded = () => {
    if (pending.current!=null || _.isEqual(toDataSourceRequest(props.dataState),lastSuccess.current)) {
      return;
    }
    pending.current = toDataSourceRequest(props.dataState);
    if(method==='get'){
        api.get(url, {params:pending.current})
        .then(res => {
          const result=res.data;
          lastSuccess.current = pending.current;
          pending.current = null;
          if (_.isEqual(toDataSourceRequest(props.dataState),lastSuccess.current)) {
            props.onDataReceived.call(undefined, {
              data: result.data,
              total: result.total
            });
          } else {
            requestDataIfNeeded();
          }
        });
      };
    }
    requestDataIfNeeded();
    return pending.current ? <LoadingPanel /> : null;

};
const LoadingPanel = () => {
  const loadingPanel = <div className="k-loading-mask">
        <span className="k-loading-text">Loading</span>
        <div className="k-loading-image" />
        <div className="k-loading-color" />
      </div>;
  const gridContent = document && document.querySelector('.k-grid-content');
  return gridContent ? ReactDOM.createPortal(loadingPanel, gridContent) : loadingPanel;
};