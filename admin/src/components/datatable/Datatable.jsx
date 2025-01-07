import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const Datatable = ({ columns }) => {
  const location = useLocation();
  const path = location.pathname.split("/")[1];
  const [list, setList] = useState([]);
  const { data, loading, error } = useFetch(`/${path}`);

  useEffect(() => {
    if (data) {
      setList(data);
    }
  }, [data]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/${path}/${id}`);
      setList(prevList => prevList.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete item:', err);
      // Optionally, show an error message to the user
    }
  };

  const renderActions = (params) => (
    <div className="cellAction">
      <Link to={`/${path}/${params.row._id}`} style={{ textDecoration: "none" }}>
        <div className="viewButton">View</div>
      </Link>
      <div
        className="deleteButton"
        onClick={() => handleDelete(params.row._id)}
      >
        Delete
      </div>
    </div>
  );

  const actionColumn = {
    field: "action",
    headerName: "Action",
    width: 200,
    renderCell: renderActions,
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error fetching data</div>;

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {path}
        <Link to={`/${path}/new`} className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={list}
        columns={columns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
        getRowId={(row) => row._id}
      />
    </div>
  );
};

export default Datatable;
