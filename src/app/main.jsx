import * as React from 'react';
import ReactDOM from 'react-dom/client';
import { Grid, GridColumn as Column } from '@progress/kendo-react-grid';
import { DataLoader } from './data-loader';

const App = () => {
  const [key,setKey]=React.useState(1);
  const [columns,setColumns]=React.useState([]);
  const [data, setData] = React.useState({
    columns:[],
    data: [],
    total: 0
  });
  const [dataState, setDataState] = React.useState({
    take: 10,
    skip: 0
  });
  const dataStateChange = e => {
    setDataState(e.dataState);
  };
  const dataReceived = data => {
    
    setColumns(data.columns);
    setKey(Math.random());
    setData(data);
  };
  return <div>
        <Grid key={key} filterable={true} sortable={true} pageable={true} {...dataState} data={data} onDataStateChange={dataStateChange}>
          {
            columns.map(x=>(React.createElement(Column,{...x,key:x.field})))
          }
          {/* <Column field="ProductID" filter="numeric" title="Id" />
          <Column field="ProductName" title="Name" />
          <Column field="UnitPrice" filter="numeric" format="{0:c}" title="Price" />
          <Column field="UnitsInStock" filter="numeric" title="In stock" />
          <Column field="Discontinued" filter="boolean" title="In stock" />
          <Column
            field="FirstOrderedOn"
            filter="date"
            format="{0:d}"
          /> */}
        </Grid>

        <DataLoader dataState={dataState} onDataReceived={dataReceived} method="post" url="getData" />

      </div>;
};

ReactDOM.createRoot(document.querySelector('my-app')).render(<App/>);