import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { DataLoader } from './data-loader';
const App = () => {
  const [data, setData] = React.useState({
    data: [],
    total: 77
  });
  const [dataState, setDataState] = React.useState({
    take: 10,
    skip: 0
  });
  const dataStateChange = e => {
    setDataState(e.dataState);
  };
  const dataReceived = products => {
    setProducts(products);
  };
  return <div>
        <Grid filterable={false} sortable={true} pageable={true} {...dataState} data={data} onDataStateChange={dataStateChange}>
          <Column field="ProductID" filter="numeric" title="Id" />
          <Column field="ProductName" title="Name" />
          <Column field="UnitPrice" filter="numeric" format="{0:c}" title="Price" />
          <Column field="UnitsInStock" filter="numeric" title="In stock" />
        </Grid>

        <DataLoader dataState={dataState} onDataReceived={dataReceived} />
      </div>;
};
ReactDOM.render(<App />, document.querySelector('my-app'));