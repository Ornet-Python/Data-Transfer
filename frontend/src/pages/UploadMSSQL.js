import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Select,
  Typography,
  TextField,
} from "@mui/material";
import FormInput from "../components/FormInput";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadDatabases = () => {
  const [mssqlDetails, setMssqlDetails] = useState({
    host: "",
    user: "",
    password: "",
  });

  const [postgresDetails, setPostgresDetails] = useState({
    host: "",
    user: "",
    password: "",
  });

  const [mssqlConnected, setMssqlConnected] = useState(false);
  const [postgresConnected, setPostgresConnected] = useState(false);

  const [mssqlDatabases, setMssqlDatabases] = useState([]);
  const [postgresDatabases, setPostgresDatabases] = useState([]);

  const [selectedMssqlDb, setSelectedMssqlDb] = useState("");
  const [selectedPostgresDb, setSelectedPostgresDb] = useState("");

  const [mssqlTables, setMssqlTables] = useState([]);
  const [postgresTables, setPostgresTables] = useState([]);

  const [selectedMssqlTable, setSelectedMssqlTable] = useState("");
  const [selectedPostgresTable, setSelectedPostgresTable] = useState("");

  const [mssqlConnString, setMssqlConnString] = useState(""); // Store MSSQL connection string
  const [postgresConnString, setPostgresConnString] = useState(""); // Store PostgreSQL connection string
  const [acno, setAcno] = useState(""); // Store acno input

  // Handle MSSQL connection and fetch databases
  const handleMssqlConnect = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/dbmanager/connect-mssql/",
        mssqlDetails
      );
      if (response.data.status === "success") {
        setMssqlDatabases(response.data.databases);
        setMssqlConnected(true);
        setMssqlConnString(
          `MSSQL Connection: ${mssqlDetails.user}@${mssqlDetails.host}`
        ); // Set MSSQL connection string
        toast.success("Connected to MSSQL successfully!");
      } else {
        toast.error("Failed to connect to MSSQL");
      }
    } catch (error) {
      console.error("Error connecting to MSSQL:", error);
      toast.error("Error connecting to MSSQL.");
    }
  };

  // Handle PostgreSQL connection and fetch databases
  const handlePostgresConnect = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/dbmanager/connect-postgres/",
        postgresDetails
      );
      if (response.data.status === "success") {
        setPostgresDatabases(response.data.databases);
        setPostgresConnected(true);
        setPostgresConnString(
          `PostgreSQL Connection: ${postgresDetails.user}@${postgresDetails.host}`
        ); // Set PostgreSQL connection string
        toast.success("Connected to PostgreSQL successfully!");
      } else {
        toast.error("Failed to connect to PostgreSQL");
      }
    } catch (error) {
      console.error("Error connecting to PostgreSQL:", error);
      toast.error("Error connecting to PostgreSQL.");
    }
  };

  // Handle fetching tables for selected MSSQL database
  const handleMssqlDbSelect = async (e) => {
    setSelectedMssqlDb(e.target.value);
    try {
      const response = await axios.post(
        "http://localhost:8000/dbmanager/fetch-tables-mssql/",
        { dbName: e.target.value, ...mssqlDetails }
      );
      setMssqlTables(response.data.tables);
      toast.success("MSSQL tables fetched successfully!");
    } catch (error) {
      console.error("Error fetching MSSQL tables:", error);
      toast.error("Error fetching MSSQL tables.");
    }
  };

  // Handle fetching tables for selected PostgreSQL database
  const handlePostgresDbSelect = async (e) => {
    setSelectedPostgresDb(e.target.value);
    try {
      const response = await axios.post(
        "http://localhost:8000/dbmanager/fetch-tables-postgres/",
        { dbName: e.target.value, ...postgresDetails }
      );
      setPostgresTables(response.data.tables);
      toast.success("PostgreSQL tables fetched successfully!");
    } catch (error) {
      console.error("Error fetching PostgreSQL tables:", error);
      toast.error("Error fetching PostgreSQL tables.");
    }
  };

  // Handle Transfer button click - Call the PostgresToMssql API
  const handleTransfer = async () => {
    if (!selectedMssqlTable || !selectedPostgresTable || !acno) {
      toast.error(
        "Please select both MSSQL and PostgreSQL tables and provide an ACNO to transfer data."
      );
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/dbmanager/mssql-to-postgres/",
        {
          postgres_host: postgresDetails.host,
          postgres_user: postgresDetails.user,
          postgres_password: postgresDetails.password,
          postgres_dbname: selectedPostgresDb,
          postgres_table: selectedPostgresTable,
          mssql_host: mssqlDetails.host,
          mssql_user: mssqlDetails.user,
          mssql_password: mssqlDetails.password,
          mssql_dbname: selectedMssqlDb,
          mssql_table: selectedMssqlTable,
          acno, // Pass acno input
        }
      );
      if (response.data.status === "success") {
        toast.success("Data transferred successfully!");
      } else {
        toast.error("Data transfer failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error transferring data:", error);
      toast.error("Error transferring data.");
    }
  };

  return (
    <Box
      sx={{
        padding: 4,
        minHeight: "100vh",
        backgroundColor: "#1e1e2f",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ToastContainer />
      <Grid
        container
        spacing={4}
        sx={{
          maxWidth: "1200px", // Limit the width of the content area
        }}
      >
        {/* MSSQL Section */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              padding: 3,
              backgroundColor: "#282c34",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            {!mssqlConnected ? (
              <>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "#d359ff",
                    textAlign: "center",
                    marginBottom: 3, // Add spacing below the title
                  }}
                >
                  MSSQL Connection
                </Typography>
                <FormInput
                  dbDetails={mssqlDetails}
                  setDbDetails={setMssqlDetails}
                  onConnect={handleMssqlConnect}
                />
              </>
            ) : (
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    MSSQL - Select Database
                  </Typography>
                  {/* MSSQL Connection String */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: "italic",
                      color: "#d359ff",
                      textAlign: "center",
                      marginBottom: 2,
                    }}
                  >
                    {mssqlConnString}
                  </Typography>
                  <Select
                    fullWidth
                    value={selectedMssqlDb}
                    onChange={handleMssqlDbSelect}
                    sx={{
                      marginTop: 2,
                      backgroundColor: "#3c4047",
                      color: "white",
                    }}
                  >
                    {mssqlDatabases.map((db, index) => (
                      <MenuItem key={index} value={db}>
                        {db}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                {selectedMssqlDb && (
                  <Grid item xs={12}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      MSSQL - Select Table
                    </Typography>
                    <Select
                      fullWidth
                      value={selectedMssqlTable}
                      onChange={(e) => setSelectedMssqlTable(e.target.value)}
                      sx={{
                        marginTop: 2,
                        backgroundColor: "#3c4047",
                        color: "white",
                      }}
                    >
                      {mssqlTables.map((table, index) => (
                        <MenuItem key={index} value={table}>
                          {table}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        </Grid>

        {/* PostgreSQL Section */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              padding: 3,
              backgroundColor: "#282c34",
              borderRadius: 2,
              boxShadow: 3,
            }}
          >
            {!postgresConnected ? (
              <>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "#d359ff",
                    textAlign: "center",
                    marginBottom: 3, // Add spacing below the title
                  }}
                >
                  PostgreSQL Connection
                </Typography>
                <FormInput
                  dbDetails={postgresDetails}
                  setDbDetails={setPostgresDetails}
                  onConnect={handlePostgresConnect}
                />
              </>
            ) : (
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: "bold",
                      color: "white",
                      textAlign: "center",
                    }}
                  >
                    PostgreSQL - Select Database
                  </Typography>
                  {/* PostgreSQL Connection String */}
                  <Typography
                    variant="body2"
                    sx={{
                      fontStyle: "italic",
                      color: "#d359ff",
                      textAlign: "center",
                      marginBottom: 2,
                    }}
                  >
                    {postgresConnString}
                  </Typography>
                  <Select
                    fullWidth
                    value={selectedPostgresDb}
                    onChange={handlePostgresDbSelect}
                    sx={{
                      marginTop: 2,
                      backgroundColor: "#3c4047",
                      color: "white",
                    }}
                  >
                    {postgresDatabases.map((db, index) => (
                      <MenuItem key={index} value={db}>
                        {db}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                {selectedPostgresDb && (
                  <Grid item xs={12}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: "bold",
                        color: "white",
                        textAlign: "center",
                      }}
                    >
                      PostgreSQL - Select Table
                    </Typography>
                    <Select
                      fullWidth
                      value={selectedPostgresTable}
                      onChange={(e) => setSelectedPostgresTable(e.target.value)}
                      sx={{
                        marginTop: 2,
                        backgroundColor: "#3c4047",
                        color: "white",
                      }}
                    >
                      {postgresTables.map((table, index) => (
                        <MenuItem key={index} value={table}>
                          {table}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>
                )}
              </Grid>
            )}
          </Box>
        </Grid>

        {/* Input for ACNO - Only visible after both tables are selected */}
        {selectedMssqlTable && selectedPostgresTable && (
          <Grid item xs={12}>
            <TextField
              label="ACNO"
              fullWidth
              value={acno}
              onChange={(e) => setAcno(e.target.value)}
              sx={{
                marginTop: 2,
                backgroundColor: "#3c4047",
                color: "white",
                "& .MuiInputBase-input": { color: "white" },
              }}
              InputLabelProps={{
                style: { color: "#d359ff" },
              }}
            />
          </Grid>
        )}

        {/* Transfer Button */}
        <Grid item xs={12}>
          <Box sx={{ textAlign: "center", marginTop: 4 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleTransfer}
              sx={{ backgroundColor: "#d359ff" }}
            >
              Transfer
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UploadDatabases;
